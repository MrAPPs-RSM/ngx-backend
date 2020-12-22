import {Component, Input, OnInit} from '@angular/core';
import {BaseInputComponent} from '../base-input/base-input.component';
import {FormFieldHotspotCanvas} from '../../interfaces/form-field-hotspot-canvas';
import {FormArray, FormGroup} from '@angular/forms';
import {FormGeneratorService} from '../../../../services/form-generator.service';
import {ApiService} from '../../../../../api/api.service';
import Konva from 'konva';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-hotspot-canvas',
  templateUrl: './hotspot-canvas.component.html',
  styleUrls: ['./hotspot-canvas.component.scss']
})
export class HotspotCanvasComponent extends BaseInputComponent implements OnInit {

  @Input() field: FormFieldHotspotCanvas;
  @Input() form: FormGroup;
  @Input() isEdit = false;

  public activeHotSpot: number = null;
  private savedForms: any = {};

  private stage: Konva.Stage;
  private hotspotsLayer: Konva.Layer;

  private _subscription: Subscription;

  constructor(private _formGenerator: FormGeneratorService, private _apiService: ApiService) {
    super();
  }

  ngOnInit() {
    this._subscription = this.getControl().valueChanges.subscribe((value) => {
      const currentValue: { image: string, hotSpots: [{ x: number, y: number }] } = value;

      if (currentValue.image != null) {
        this._subscription.unsubscribe();

        this.stage = new Konva.Stage({
          container: this.field.key,
          width: this.field.container.width,
          height: this.field.container.height
        });

        const backgroundLayer = new Konva.Layer();
        this.stage.add(backgroundLayer);

        Konva.Image.fromURL(currentValue.image, (backgroundImage) => {
          backgroundImage.setAttrs({
            x: 0,
            y: 0,
            width: this.field.container.width,
            height: this.field.container.height,
          });
          backgroundLayer.add(backgroundImage);
          backgroundLayer.on('click', (ev) => {
            const pos = this.stage.getPointerPosition();

            const halfWidth = this.field.hotspot.width / 2;
            const halfHeight = this.field.hotspot.height / 2;

            const x = pos.x - halfWidth < halfWidth ? halfWidth :
              (pos.x + halfWidth > this.field.container.width ? this.field.container.width - halfWidth : pos.x);
            const y = pos.y - halfHeight < halfHeight ? halfHeight :
              (pos.y + halfHeight > this.field.container.height ? this.field.container.height - halfHeight : pos.y);

            this.addHotspotToLayer(
              this.getFormArray().controls.length,
              x,
              y,
              this.field.hotspot,
              this.hotspotsLayer
            );
            this.add(x, y);
          });
          backgroundLayer.batchDraw();
        });

        this.hotspotsLayer = new Konva.Layer();
        this.stage.add(this.hotspotsLayer);

        let index = 0;
        for (const hotspot of currentValue.hotSpots) {
          this.addHotspotToLayer(index, hotspot.x, hotspot.y, this.field.hotspot, this.hotspotsLayer);
          index++;
        }
      }
    });

  }

  private dragLimits(pos) {
    if (pos.x < 0) {
      pos.x = 0;
    } else if (pos.x + this.field.hotspot.width > this.field.container.width) {
      pos.x = this.field.container.width - this.field.hotspot.width;
    }

    if (pos.y < 0) {
      pos.y = 0;
    } else if (pos.y + this.field.hotspot.height > this.field.container.height) {
      pos.y = this.field.container.height - this.field.hotspot.height;
    }

    return pos;
  }

  private addHotspotToLayer(
    index: number,
    x: number,
    y: number,
    hotspot: { width: number, height: number, previewImage: string },
    layer: Konva.Layer) {
    Konva.Image.fromURL(hotspot.previewImage,  (image) => {
      image.setAttrs({
        width: hotspot.width,
        height: hotspot.height
      });

      const group = new Konva.Group({
        x: x - (hotspot.width / 2),
        y: y - (hotspot.height / 2),
        draggable: true,
        name: index + '',
        dragBoundFunc: (pos) => {
          return this.dragLimits(pos);
        }
      });

      const deleteGroup = new Konva.Group({
        x: hotspot.width - 30,
        y: 30
      });

      const deleteButton = new Konva.Circle({
        radius: 10,
        fill: 'red'
      });

      const deleteText = new Konva.Text({
        text: 'X',
        fontSize: 10,
        fill: 'white'
      });

      deleteText.offsetX(deleteText.width() / 2);
      deleteText.offsetY(deleteText.height() / 2);

      deleteGroup.add(deleteButton);
      deleteGroup.add(deleteText);

      let onSameGroup = false;

      deleteGroup.on('mouseover touchstart', function () {
        document.body.style.cursor = 'pointer';
        onSameGroup = true;
      });

      deleteGroup.on('mouseout touchend', function () {
        onSameGroup = false;
      });

      deleteGroup.on('click', () => {
        const indexToDelete = parseInt(group.attrs.name, 10);
        this.onDelete(indexToDelete);
        group.remove();

        layer.getChildren().each((child: Konva.Group) => {
          if (child !== group && child.attrs.name != null) {
            const oldIndex = parseInt(child.attrs.name, 10);
            if (oldIndex > indexToDelete) {
              child.attrs.name = (oldIndex - 1) + '';
            }
          }
        });

      });

      group.on('mouseover touchstart', function () {
        setTimeout(() => {
        if (!onSameGroup) {
          group.add(deleteGroup);
          document.body.style.cursor = 'move';
          image.opacity(0.8);
          image.fill('#eee');
          layer.draw();
        }
        }, 5);
      });

      group.on('mouseout touchend', function () {
        setTimeout(() => {
          if (!onSameGroup) {
            deleteGroup.remove();
            document.body.style.cursor = 'default';
            image.opacity(1.0);
            image.fill('transparent');
            layer.draw();
          }
        }, 5);
      });

      group.on('dragend', (e) => {
        const realX = e.target.attrs.x + (this.field.hotspot.width / 2);
        const realY = e.target.attrs.y + (this.field.hotspot.height / 2);
        this.patchValueAt( {x: realX, y: realY}, index);
      });

      group.add(image);

      layer.add(group);
      layer.batchDraw();
    });
  }

  public getControl(): FormGroup {
    return this.form.get(this.field.key) as FormGroup;
  }

  public getFormArray(): FormArray {
    return this.getControl()['controls'].hotSpots as FormArray;
  }

  public getActiveForm(): FormGroup | any {
    return this.getFormArray().controls[this.activeHotSpot] as FormGroup;
  }

  public onDelete(index: number) {
    this.getFormArray().removeAt(index);
  }

  public add(x: number, y: number) {
    this.getFormArray().push(new FormGroup(this._formGenerator.generateFormFields(this.field.fields)));
    this.patchValueAt({x, y}, this.getFormArray().controls.length - 1);
  }

  private patchValueAt(value: {x: number, y: number}, index: number) {
    this.getFormArray().controls[index].patchValue(value);

    console.log(JSON.stringify(this.getFormArray().controls[index].value));
  }
}

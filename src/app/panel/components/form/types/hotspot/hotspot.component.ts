import {
    Component,
    ElementRef,
    Input,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {FormFieldHotspot} from '../../interfaces/form-field-hotspot';
import {FormArray, FormGroup} from '@angular/forms';
import {BaseInputComponent} from '../base-input/base-input.component';
import {FormGeneratorService} from '../../../../services/form-generator.service';
import {ApiService} from '../../../../../api/api.service';

@Component({
    selector: 'app-hotspot',
    templateUrl: './hotspot.component.html',
    styleUrls: ['./hotspot.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HotspotComponent extends BaseInputComponent implements OnInit {

    @Input() field: FormFieldHotspot;
    @Input() form: FormGroup;
    @Input() isEdit = false;

    public activeHotSpot: number = null;
    private savedForms: any = {};

    public hotspotRadius = 17;

    @ViewChild('imageWrapper') imageWrapper: ElementRef;
    @ViewChild('image') image: ElementRef;

    constructor(private _formGenerator: FormGeneratorService, private _apiService: ApiService) {
        super();
    }

    ngOnInit() {
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

    public add($event: any) {
        this.getFormArray().push(new FormGroup(this._formGenerator.generateFormFields(this.field.fields)));
        this.getFormArray().controls[this.getFormArray().controls.length - 1].patchValue({x: $event.offsetX, y: $event.offsetY});
    }

    public onDragStart($event: any, index: number) {
        $event.dataTransfer.setData('text/plain', $event.target.id);
    }

    public onDrag($event: any, index: number) {
        $event.target.style.opacity = '0';
        $event.target.style.visibility = 'hidden';
    }

    public onDragEnd($event: any, index: number) {
        $event.target.style.opacity = '1';
        $event.target.style.visibility = 'visible';
    }

    public onDragOver($event: any) {
        $event.preventDefault();
    }

    public onDrop($event: any) {
        console.log('ondrop');
        console.log($event);

        $event.preventDefault();
        const id = $event.dataTransfer.getData('text/plain');
        const index = parseInt(id.split('_')[1], 10);

        const posX = $event.layerX - this.hotspotRadius;
        const posY = $event.layerY - this.hotspotRadius;

        const hotSpot = this.getFormArray().controls[index];
        if (this.isInBounds(posX, posY)) {
            hotSpot.patchValue({x: $event.layerX, y: $event.layerY});
        }
    }

    private isInBounds(x, y) {
        return (x <= this.image.nativeElement.width && x >= 0) &&
            (y <= this.image.nativeElement.height && y >= 0);
    }

    public onEdit($event: any, index: number) {
        $event.preventDefault();
        this.activeHotSpot = index;
    }

    public onSave($event: any) {
      const currentHotSpot = this.getActiveForm();
      this.savedForms[this.activeHotSpot] = true;
      if (this.field.saveEndpoint) {
        // TODO: handle errors
        this._apiService.post(this.field.saveEndpoint, currentHotSpot.value)
          .then((data: any) => {
            currentHotSpot.patchValue(data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
      this.activeHotSpot = null;
    }

    public onClose($event: any) {
        if (this.savedForms[this.activeHotSpot] === false) {
            const keys = Object.keys(this.getActiveForm().controls);
            keys.forEach((key) => {
               if (key !== 'x' && key !== 'y') {
                   this.getActiveForm().controls[key].reset();
               }
            });
        }
        this.activeHotSpot = null;
    }

    public onDelete($event: any) {
        this.getFormArray().removeAt(this.activeHotSpot);
        this.activeHotSpot = null;
    }

  calculateStyles(value: any) {
    const top = (value.y - this.hotspotRadius) + 'px';
    const left = (value.x - this.hotspotRadius) + 'px';

    const style = {
      top,
      left
    };

    if ('hotspotColor' in value) {
      style['background'] = value['hotspotColor'];
    }

    return style;
  }
}

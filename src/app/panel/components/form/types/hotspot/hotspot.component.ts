import {
    Component,
    ElementRef,
    Input,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {UtilsService} from '../../../../../services/utils.service';
import {FormFieldHotspot} from '../../interfaces/form-field-hotspot';
import {FormArray, FormGroup} from '@angular/forms';
import {BaseInputComponent} from '../base-input/base-input.component';
import {FormGeneratorService} from "../../../../services/form-generator.service";

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

    public imageUrl: string;
    public activeHotSpot: number = null;

    @ViewChild('imageWrapper') imageWrapper: ElementRef;
    @ViewChild('image') image: ElementRef;

    constructor(private _formGenerator: FormGeneratorService) {
        super();
    }

    ngOnInit() {
        this.imageUrl = 'http://via.placeholder.com/1900x1800';
    }

    public getControl(): FormArray {
        return this.form.get(this.field.key) as FormArray;
    }

    public getActiveForm(): FormGroup {
        return this.getControl().controls[this.activeHotSpot] as FormGroup;
    }

    private add($event: any) {
        this.getControl().push(new FormGroup(this._formGenerator.generateFormFields(this.field.fields)));
        this.getControl().controls[this.getControl().controls.length - 1].patchValue({x: $event.offsetX, y: $event.offsetY});
    }

    private onDrag($event: any, index: number) {
        $event.target.style.opacity = '0';
        $event.target.style.visibility = 'hidden';
    }

    private onDragEnd($event: any, index: number) {
        $event.target.style.opacity = '1';
        $event.target.style.visibility = 'visible';
        const hotSpot = this.getControl().controls[index];
        if (this.isInBounds($event, hotSpot))  {
            const x = parseInt(hotSpot.value.x + $event.offsetX, 10);
            const y = parseInt(hotSpot.value.y + $event.offsetY, 10);
            hotSpot.patchValue({x: x, y: y});
        }
    }

    private isInBounds($event: any, hotSpot: any) {
        const x = parseInt($event.offsetX + hotSpot.value.x, 10);
        const y = parseInt($event.offsetY + hotSpot.value.y, 10);

        return (x <= this.image.nativeElement.width && x >= 0) &&
            (y <= this.image.nativeElement.height && y >= 0);
    }

    private onEdit($event: any, index: number) {
        $event.preventDefault();
        console.log('On edit');
        this.activeHotSpot = index;
    }

    private onSave($event: any) {
        this.activeHotSpot = null;
    }

    private onClose($event: any) {
        this.activeHotSpot = null;
    }

    private onDelete($event: any) {
        this.activeHotSpot = null;
        this.getControl().removeAt(this.activeHotSpot);
    }
}
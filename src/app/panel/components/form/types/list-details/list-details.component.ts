import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {BaseInputComponent} from '../base-input/base-input.component';
import {FormFieldListDetails} from '../../interfaces/form-field-list-details';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {FormGeneratorService} from '../../../../services/form-generator.service';
import {SelectComponent, SelectData} from '../select/select.component';

@Component({
    selector: 'app-list-details',
    templateUrl: './list-details.component.html',
    styleUrls: ['./list-details.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ListDetailsComponent extends BaseInputComponent implements OnInit {

    @Input() field: FormFieldListDetails;

    constructor(private _formGenerator: FormGeneratorService) {
        super();
    }

    ngOnInit() {

    }

    filterOptions(select: SelectComponent, options: SelectData[]): SelectData[] {

        const updatedOptions = [];
        console.log(select.selected);
        console.log(select.field.key);
        console.log(this.form.parent.getRawValue());

        const formArray = this.form.parent as FormArray;

        for (const group of formArray.controls) {
            const formGroup = group as FormGroup;

         //   formGroup.controls[select.field.key].value

        }

        for (const option of options) {

        }

        return options;
    }

    public getControl(): FormArray {
        return this.form.get(this.field.key) as FormArray;
    }

    addDetail() {
        // add new formgroup
        this.getControl().push(new FormGroup(this._formGenerator.generateFormFields(this.field.fields)));
    }

    deleteDetail(index: number) {
        // remove the chosen row
        this.getControl().removeAt(index);
    }
}

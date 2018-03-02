import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {BaseInputComponent} from '../base-input/base-input.component';
import {FormFieldListDetails} from '../../interfaces/form-field-list-details';
import {FormArray, FormGroup} from '@angular/forms';
import {FormGeneratorService} from '../../../../services/form-generator.service';
import {SelectData} from '../select/select.component';

@Component({
    selector: 'app-list-details',
    templateUrl: './list-details.component.html',
    styleUrls: ['./list-details.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ListDetailsComponent extends BaseInputComponent implements OnInit {

    @Input() field: FormFieldListDetails;
    @Input() unique = false;

    constructor(private _formGenerator: FormGeneratorService) {
        super();
    }

    ngOnInit() {

    }

    filterOptions(options: SelectData[]): SelectData[] {

        const updatedOptions = [];

        console.log(this.form.getRawValue());

        for (const option of options) {

        }

        return updatedOptions;
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

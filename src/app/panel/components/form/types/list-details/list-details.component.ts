import {Component, Input, OnInit} from '@angular/core';
import {BaseInputComponent} from '../base-input/base-input.component';
import {FormFieldListDetails} from '../../interfaces/form-field-list-details';
import {FormArray, FormGroup} from '@angular/forms';
import {FormGeneratorService} from '../../../../services/form-generator.service';

@Component({
  selector: 'app-list-details',
  templateUrl: './list-details.component.html',
  styleUrls: ['./list-details.component.scss']
})
export class ListDetailsComponent extends BaseInputComponent implements OnInit {

    @Input() field: FormFieldListDetails;

    private subForms: any[] = [];

    constructor(private _formGenerator: FormGeneratorService) {
      super();
    }

    ngOnInit() {
    }

    public getControl(): FormArray {
        return this.form.get(this.field.key) as FormArray;
    }

    addDetail() {
        this.subForms.push('item');
        // add new formgroup
        this.getControl().push(new FormGroup(this._formGenerator.generateFormFields(this.field.fields)));
    }

    deleteDetail(index: number) {
        // remove the chosen row
        this.subForms.splice(index, 1);
        this.getControl().removeAt(index);
    }
}

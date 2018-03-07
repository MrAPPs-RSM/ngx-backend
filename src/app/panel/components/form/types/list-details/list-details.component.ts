import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {BaseInputComponent} from '../base-input/base-input.component';
import {FormFieldListDetails} from '../../interfaces/form-field-list-details';
import {FormArray, FormGroup} from '@angular/forms';
import {FormGeneratorService} from '../../../../services/form-generator.service';
import {SelectComponent, SelectData} from '../select/select.component';
import {formConfig} from '../../form.config';
import { Subject } from 'rxjs/Subject';
import {DragulaService} from 'ng2-dragula';

@Component({
    selector: 'app-list-details',
    templateUrl: './list-details.component.html',
    styleUrls: ['./list-details.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ListDetailsComponent extends BaseInputComponent implements OnInit, OnDestroy {

    @Input() field: FormFieldListDetails;

    observer: Subject<any>;
    addEnabled: boolean;

    constructor(private _dragulaService: DragulaService,
                private _formGenerator: FormGeneratorService) {
        super();

        this.addEnabled = true;
    }

    ngOnInit() {

        let required = false;

        if ('validators' in this.field && 'required' in this.field.validators) {
            required = this.field.validators.required;
        }

        if (!required) {
            this.deleteDetail(0);
        }

        this._dragulaService.setOptions('bag', {
            moves: function (el, container, handle) {
                return handle.className === 'drag';
            }
        });

        this.filterOptions = this.filterOptions.bind(this);

        if (this.field.unique) {

             this.observer = new Subject();

            for (const subField of this.field.fields) {
                if (subField.type === formConfig.types.SELECT) {

                    if (!('dependsOn' in subField)) {
                        subField['dependsOn'] = [this.observer];
                    } else {
                        subField['dependsOn'].push(this.observer);
                    }
                    break;
                }
            }
        }
    }

    ngOnDestroy() {
        this._dragulaService.destroy('bag');
        this.observer.complete();
    }

    filterOptions(select: SelectComponent, options: SelectData[]): SelectData[] {

        const updatedOptions = [];

        const formArray = this.form.get(this.field.key) as FormArray;

        for (const option of options) {

            let found = false;

            let index = 0;

            for (const group of formArray.controls) {

                if (index !== select.index) {
                    const formGroup = group as FormGroup;

                    if (option.id === formGroup.get(select.field.key).value) {
                        found = true;
                        break;
                    }
                }

                index++;
            }

            if (!found) {
                updatedOptions.push(option);
            }
        }

        this.addEnabled = updatedOptions.length > 0 && formArray.controls.length < updatedOptions.length;

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
        if (this.observer != null) {
            this.observer.next();
        }
        // remove the chosen row
        this.getControl().removeAt(index);
    }
}

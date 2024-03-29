import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { formConfig } from '../components/form/form.config';
import { CustomValidators } from '../components/form/validators';
import { UtilsService } from '../../services/utils.service';
import {FormSettings} from '../components/form/interfaces/form-settings';
import ResponseProcessor from '../../strategies/form/ResponseProcessor';

@Injectable()
export class FormGeneratorService {

    constructor() {
    }

    private getValidators(validators: Object): Array<any> {
        const output = [];
        if (validators) {
            Object.keys(validators).forEach((key) => {
                switch (key) {
                    case formConfig.validators.REQUIRED: {
                        if (validators[key] === true) {
                            output.push(Validators.required);
                        }
                    }
                        break;
                    case formConfig.validators.MIN_LENGTH: {
                        output.push(Validators.minLength(validators[key]));
                    }
                        break;
                    case formConfig.validators.MAX_LENGTH: {
                        output.push(Validators.maxLength(validators[key]));
                    }
                        break;
                    case formConfig.validators.PATTERN: {
                        output.push(Validators.pattern(validators[key]));
                    }
                        break;
                    case formConfig.validators.MIN: {
                        output.push(CustomValidators.min(validators[key]));
                    }
                        break;
                    case formConfig.validators.MAX: {
                        output.push(CustomValidators.max(validators[key]));
                    }
                        break;
                    default: {
                    }
                        break;
                }
            });
        }
        return output;
    }

    public generateResponseProcessorFor(form: FormGroup, formSettings: FormSettings) {
      return new ResponseProcessor(form, formSettings, this);
    }

    public generateFormFields(fields: any[]): any | any {

        if (fields && fields.length > 0) {
            const group: any = {};

            for (const field of fields) {
                let validators = [];
                /**
                 * Adding validators if defined as field properties
                 */
                if (field.validators) {
                    validators = this.getValidators(field.validators);
                }

                /**
                 * Adding validators based on field type
                 */
                switch (field.type) {
                    case formConfig.types.EMAIL: {
                        validators.push(CustomValidators.email());
                    }
                        break;
                    case formConfig.types.URL: {
                        validators.push(CustomValidators.url());
                    }
                        break;
                    default: {
                    }
                        break;
                }
                /**
                 * Generating FormControls based on field type
                 */
                switch (field.type) {
                    case formConfig.types.LIST_DETAILS: {
                        group[field.key] = new FormArray(
                            [new FormGroup(this.generateFormFields(field.fields))],
                            validators.length > 0 ? Validators.compose(validators) : null
                        );
                    }
                        break;
                    case formConfig.types.HOTSPOT:
                    case formConfig.types.HOTSPOT_CANVAS: {
                        group[field.key] = new FormGroup({
                            image: new FormControl(null, null),
                            hotSpots: new FormArray(
                                [],
                                null
                            )
                        });
                    }
                        break;
                    case formConfig.types.CHECKBOX: {
                        group[field.key] = new FormControl({ value: null, disabled: field.disabled }, null);
                    }
                        break;
                    case formConfig.types.PASSWORD: {
                        if (field.hasOwnProperty('confirm')) {
                            // Create password standard control
                            group[field.key] = new FormControl(
                                null,
                                validators.length > 0 ? Validators.compose(validators) : null
                            );
                            // Create password confirm control
                            group[field['confirm'].key] = new FormControl(
                                null,
                                validators.length > 0 ? Validators.compose(validators) : null
                            );
                        } else {
                            group[field.key] = new FormControl(
                                field.value || null,
                                validators.length > 0 ? Validators.compose(validators) : null
                            );
                        }
                    }
                        break;
                    case formConfig.types.DATE_RANGE: {
                        group[field['fromKey']] = new FormControl(null);
                        group[field['toKey']] = new FormControl(null);
                        group[field.key] = new FormControl(
                            null,
                            validators.length > 0 ? Validators.compose(validators) : null
                        );
                    }
                        break;
                    case formConfig.types.MAP: {
                        const latValidators = this.getValidators(field['lat'].validators);
                        group[field['lat'].key] = new FormControl(
                            null,
                            latValidators ? Validators.compose(latValidators) : null
                        );
                        const lngValidators = this.getValidators(field['lng'].validators);
                        group[field['lng'].key] = new FormControl(
                            null,
                            lngValidators ? Validators.compose(lngValidators) : null
                        );
                    }
                        break;
                    default: {
                        if (!UtilsService.containsValue(formConfig.noInputTypes, field.type)) {
                            group[field.key] = new FormControl(
                                field.value || null,
                              {
                                validators: validators.length > 0 ? Validators.compose(validators) : null,
                              }
                            );
                        }
                    }
                        break;
                }
            }

            return group;
        }

        return null;
    }

    public generate(fields: any): FormGroup | any {
        if (fields instanceof Array && fields.length > 0) {
            return new FormGroup(this.generateFormFields(fields));
        } else if (fields instanceof Object) {

            const group = ('base' in fields) && fields['base'].length > 0 ? this.generateFormFields(fields['base']) : {};

            for (const key of Object.keys(fields)) {

                if (key !== 'base') {
                    const subFields = fields[key];
                    group[key] = new FormGroup(this.generateFormFields(subFields));
                }
            }

            return new FormGroup(group);
        } else {
            return new Error('Form structure cannot be empty');
        }
    }
}

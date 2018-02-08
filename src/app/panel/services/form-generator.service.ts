import {Injectable} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {formConfig} from '../components/form/form.config';
import {CustomValidators} from '../components/form/validators';
import {UtilsService} from '../../services/utils.service';

@Injectable()
export class FormGeneratorService {

    constructor() {
    }

    public generate(fields: any[]): FormGroup | any {
        const group: any = {};

        if (fields && fields.length > 0) {
            fields.forEach((field) => {
                const validators = [];
                /**
                 * Adding validators if defined as field properties
                 */
                if (field.validators) {
                    Object.keys(field.validators).forEach(key => {
                        switch (key) {
                            case formConfig.validators.REQUIRED: {
                                if (field.validators[key] === true) {
                                    validators.push(Validators.required);
                                }
                            }
                                break;
                            case formConfig.validators.MIN_LENGTH: {
                                validators.push(Validators.minLength(field.validators[key]));
                            }
                                break;
                            case formConfig.validators.MAX_LENGTH: {
                                validators.push(Validators.maxLength(field.validators[key]));
                            }
                                break;
                            case formConfig.validators.PATTERN: {
                                validators.push(Validators.pattern(field.validators[key]));
                            }
                                break;
                            case formConfig.validators.MIN: {
                                validators.push(CustomValidators.min(field.validators[key]));
                            }
                                break;
                            case formConfig.validators.MAX: {
                                validators.push(CustomValidators.max(field.validators[key]));
                            }
                                break;
                            default: {
                            }
                                break;
                        }
                    });
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

                    case formConfig.types.CHECKBOX: {
                        group[field.key] = new FormControl({value: null, disabled: field.disabled}, null);
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
                        group[field['startDate'].key] = new FormControl(
                            null,
                            validators.length > 0 ? Validators.compose(validators) : null
                        );
                        group[field['endDate'].key] = new FormControl(
                            null,
                            validators.length > 0 ? Validators.compose(validators) : null
                        );
                    }
                        break;
                    case formConfig.types.LAT_LNG: {
                        group[field['lat'].key] = new FormControl(
                            null,
                            validators.length > 0 ? Validators.compose(validators) : null
                        );
                        group[field['lng'].key] = new FormControl(
                            null,
                            validators.length > 0 ? Validators.compose(validators) : null
                        );
                    }
                        break;
                    default: {
                        if (!UtilsService.containsValue(formConfig.noInputTypes, field.type)) {
                            group[field.key] = new FormControl(
                                field.value || null,
                                validators.length > 0 ? Validators.compose(validators) : null
                            );
                        }
                    }
                        break;
                }
            });

            return new FormGroup(group);
        } else {
            return new Error('Form structure cannot be empty');
        }
    }
}

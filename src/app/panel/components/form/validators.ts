import {AbstractControl, ValidatorFn, Validators} from '@angular/forms';
import {isNullOrUndefined} from 'util';

export class CustomValidators {

    static max(max: number): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (isNullOrUndefined(max)) {
                return null;
            }
            if (!isNullOrUndefined(Validators.required(control))) {
                return null;
            }
            const v: number = +control.value;
            return v <= +max ? null : {actualValue: v, requiredValue: +max, max: true};
        };
    }

    static min(min: number): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (isNullOrUndefined(min)) {
                return null;
            }
            if (!isNullOrUndefined(Validators.required(control))) {
                return null;
            }

            const v: number = +control.value;
            return v >= +min ? null : {actualValue: v, requiredValue: +min, min: true};
        };
    }

    static email(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (!isNullOrUndefined(Validators.required(control))) {
                return null;
            }
            const v: string = control.value;
            return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) ? null : {'email': true};
        };
    }

    static url(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (!isNullOrUndefined(Validators.required(control))) {
                return null;
            }
            const v: string = control.value;
            return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(v) ? null : {'url': true};
        };
    }
}

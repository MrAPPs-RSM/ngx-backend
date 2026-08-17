import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {AbstractControl, UntypedFormGroup} from '@angular/forms';

@Component({
    selector: 'app-base-input',
    templateUrl: './base-input.component.html',
    styleUrls: ['./base-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class BaseInputComponent {

    @Input() index: number;
    @Input() groupName: string;
    @Input() form: UntypedFormGroup;
    @Input() field: any = {};
    @Input() isEdit = false;
    @Input() onlyView = false;
    @Input() isSubField: boolean;
    @Input() copyOnLanguages?: boolean;

    public getUniqueKey(): string {
        return this.groupName + '-' + this.field.key;
    }

    public checkDisabled(): void {
        if (this.field.disabled || this.onlyView) {
            this.getControl().disable();
        }
    }

    public isRequired(key?: string): boolean {
        if (key) {
            return this.field[key].validators && this.field[key].validators.required;
        } else {
            return this.field.validators && this.field.validators.required;
        }
    }

    public getMaxLength(key?: string): number {
        if (key) {
            return this.field[key].validators && this.field[key].validators.maxLength
              ? parseInt(this.field[key].validators.maxLength, 10)
              : null;
        } else {
            return this.field.validators && this.field.validators.maxLength
              ? parseInt(this.field.validators.maxLength, 10)
              : null;
        }
    }

    public getControl(key?: string): AbstractControl {
        if (key) {
            return this.form.get(key);
        } else {
            return this.form.get(this.field.key);
        }
    }

    public isValid(key?: string): boolean {
        if (this.getControl(key).touched) {
            return this.getControl(key).valid;
        } else {
            return true;
        }
    }
}

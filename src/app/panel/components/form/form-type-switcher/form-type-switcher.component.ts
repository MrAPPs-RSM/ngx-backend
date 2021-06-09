import {Component, Input} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {formConfig} from '../form.config';
import {Language} from '../../../services/language.service';
import {ConditionalValue} from '../../../../interfaces/ConditionalValue';
import {UtilsService} from '../../../../services/utils.service';

@Component({
    selector: 'app-form-type-switcher',
    templateUrl: './form-type-switcher.component.html',
    styleUrls: ['./form-type-switcher.component.scss']
})
export class FormTypeSwitcherComponent {

  @Input() index = 0;
  @Input() form: FormGroup;
  @Input() groupName: string;
  @Input() putFilesOnLanguages?: boolean;
  @Input() field: any;
  @Input() isEdit: boolean;
  @Input() onlyView: boolean;
  @Input() unique?: Function;
  @Input() currentLang?: Language;
  @Input() isSubField: boolean;

  public formConfig = formConfig;

  private getControlForKey(key: string): AbstractControl {
    if (key.indexOf('.') > -1) {
      return this.form.get(key.split('.')[1]);
    } else {
      return 'parent' in this.form && this.form.parent ? this.form.parent.get(key) : this.form.get(key);
    }
  }

  private checkFieldVisibility(conditionalValue: ConditionalValue): boolean {
    const control = this.getControlForKey(conditionalValue.property);
    return UtilsService.checkSingleConditionalValue(control.value, conditionalValue);
  }

  isVisible(): boolean {
    let isVisible = true;
    if (!!this.field.visibleOn) {
      if (Array.isArray(this.field.visibleOn)) {
        for (const conditionalValue of this.field.visibleOn) {
          isVisible = isVisible && this.checkFieldVisibility(conditionalValue);
        }
      } else {
        const conditionalKeys = Object.keys(this.field.visibleOn);

        for (const key of conditionalKeys) {
          const conditionalValue: ConditionalValue = {
            property: key,
            operator: 'eq',
            value: this.field.visibleOn[key],
          };

          isVisible = isVisible && this.checkFieldVisibility(conditionalValue);
        }
      }

      if (this.field.validators && this.field.validators.required) {
        if (isVisible) {
          this.form.get(this.field.key).enable();
        } else {
          this.form.get(this.field.key).disable();
        }
      }
    }

    return isVisible;
  }
}

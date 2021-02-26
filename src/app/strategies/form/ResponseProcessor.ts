import {FormArray, FormGroup} from '@angular/forms';
import {FormSettings} from '../../panel/components/form/interfaces/form-settings';
import {FormGeneratorService} from '../../panel/services/form-generator.service';
import {formConfig} from '../../panel/components/form/form.config';

export default class ResponseProcessor {
  constructor(private _form: FormGroup, private _settings: FormSettings, private _formGenerator: FormGeneratorService) {
  }

  syncResponse(response: any) {
    const listDetailsFields = {};
    const hotSpotKeys = [];
    let hotSpotFields = [];

    const responseKeys = Object.keys(response);

    this._settings.fields.base.forEach(field => {
      if (false === responseKeys.includes(field.key)) {
        return;
      }

      switch (field.type) {
        case formConfig.types.LIST_DETAILS:
          listDetailsFields[field.key] = field.fields;
          break;
        case formConfig.types.HOTSPOT:
        case formConfig.types.HOTSPOT_CANVAS:
          hotSpotKeys.push(field.key);
          hotSpotFields = field.fields;
          break;
      }
    });

    Object.keys(listDetailsFields)
      .forEach(key => {
        for (let i = 0; i < response[key].length; i++) {
          (this._form.controls[key] as FormArray).clear();
          (this._form.controls[key] as FormArray).push(
            new FormGroup(this._formGenerator.generateFormFields(listDetailsFields[key]))
          );
        }
    });

    hotSpotKeys.forEach((key) => {
      for (let i = 0; i < response[key]['hotSpots'].length; i++) {
        (this._form.controls[key] as FormGroup).removeControl('hotSpots');
        ((this._form.controls[key] as FormGroup).controls['hotSpots'] as FormArray).push(
          new FormGroup(this._formGenerator.generateFormFields(hotSpotFields))
        );
      }
    });
  }
}

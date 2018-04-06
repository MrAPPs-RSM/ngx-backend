import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormFieldMap} from '../../interfaces/form-field-map';
import {BaseInputComponent} from '../base-input/base-input.component';
import {Subscription} from 'rxjs/Subscription';
import {AbstractControl} from '@angular/forms';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MapComponent extends BaseInputComponent implements OnInit, OnDestroy {

    @Input() field: FormFieldMap;

    private defaults: {
        lat?: number,
        lng?: number
    };

    private _calcValueSubscription: any = {
        lat: Subscription.EMPTY,
        lng: Subscription.EMPTY,
    };

    ngOnInit() {
        this.defaults = this.field.defaults ? this.field.defaults : {
            lat: 43.986244, // Mr. Apps coordinates
            lng: 12.4961939
        };

        if (!this.isEdit) {
            this.setDefaults();
        }

        this.checkCalculatedValue('lat');
        this.checkCalculatedValue('lng');
    }

    ngOnDestroy() {
        if (this._calcValueSubscription.lat) {
            this._calcValueSubscription.lat.unsubscribe();
        }
        if (this._calcValueSubscription.lng) {
            this._calcValueSubscription.lng.unsubscribe();
        }
    }

    getFormControl(key: string): AbstractControl {
        return this.form.get(key);
    }

    isValidField(key: string): boolean {
        if (this.getFormControl(key).value === null || this.getFormControl(key).value === '') {
            return true;
        } else {
            return this.getFormControl(key).valid;
        }
    }

    onMarkerChanged(event: {coords: {lat: number, lng: number}}): void {
        this.updateFormValue(event.coords.lat, event.coords.lng);
    }

    private setDefaults(): void {
        this.updateFormValue(this.defaults.lat, this.defaults.lng);
    }

    private updateFormValue(lat: number, lng: number): void {
        this.getFormControl(this.field.lat.key).patchValue(lat);
        this.getFormControl(this.field.lng.key).patchValue(lng);
    }

    private checkCalculatedValue(key: string): void {
        if (this.field[key].calculatedValue) {
            if (this.field[key].calculatedValue.indexOf('.') > -1) {
                const baseKey = this.field[key].calculatedValue.split('.')[0];
                const subKey = this.field[key].calculatedValue.split('.')[1];
                if (this.getFormControl(baseKey)) {
                    this._calcValueSubscription[key] = this.getFormControl(baseKey).valueChanges.subscribe((value) => {
                        if (value && value[subKey]) {
                            this.getFormControl(key).patchValue(value[subKey]);
                        }
                    });
                }
            }
        }
    }
}

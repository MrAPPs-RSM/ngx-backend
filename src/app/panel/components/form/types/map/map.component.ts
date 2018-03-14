import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormFieldMap} from '../../interfaces/form-field-map';
import {BaseInputComponent} from '../base-input/base-input.component';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MapComponent extends BaseInputComponent implements OnInit,OnDestroy {

    @Input() field: FormFieldMap;

    options: any;

    lat: number;
    lng: number;

    private _subscriptionLat = Subscription.EMPTY;
    private _subscriptionLng = Subscription.EMPTY;

    ngOnInit() {
        this.options = this.field.options ? this.field.options : {
            defaults: {
                lat: 41.909986, // Center Italy coordinates
                lng: 12.3959118
            },
            marker: {
                draggable: true,
                label: null
            }
        };

        this.lat = this.options.defaults.lat;
        this.lng = this.options.defaults.lng;
        this.refreshFormValues();

       this._subscriptionLat = this.onFormChange('lat');
       this._subscriptionLng = this.onFormChange('lng');
    }

    ngOnDestroy() {
        this._subscriptionLat.unsubscribe();
        this._subscriptionLng.unsubscribe();
    }

    private onFormChange(key: string): Subscription {
      return this.form.controls[this.field[key].key].valueChanges
            .subscribe(
                value => {
                    this[key] = value;
                }
            );
    }

    isValidKey(key: string): boolean {
        if (this.form.controls[key].value === null || this.form.controls[key].value === '') {
            return true;
        } else {
            return this.form.controls[key].valid;
        }
    }

    onMarkerChanged(event: any): void {
        this.lat = event.coords.lat;
        this.lng = event.coords.lng;
        this.refreshFormValues();
    }

    private refreshFormValues(): void {
        this.form.controls[this.field.lat.key].patchValue(this.lat);
        this.form.controls[this.field.lng.key].patchValue(this.lng);
    }
}

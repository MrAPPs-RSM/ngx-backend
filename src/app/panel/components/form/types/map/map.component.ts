import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormFieldMap} from '../../interfaces/form-field-map';
import {BaseInputComponent} from '../base-input/base-input.component';
import {Subscription} from 'rxjs';
import {MapsService} from '../../../../../services/maps.service';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MapComponent extends BaseInputComponent implements OnInit, OnDestroy {

    constructor(public _mapsService: MapsService) {
      super();
    }

    @Input() field: FormFieldMap;

    private defaults: {
        lat?: number,
        lng?: number
    };

    private _calcValueSubscription: any = {
        lat: Subscription.EMPTY,
        lng: Subscription.EMPTY,
    };

    public options: google.maps.MapOptions = {
      zoom: 12,
      center: this.markerPosition(),
      scrollwheel: false,
      disableDefaultUI: true,
    };

    public markerOptions: google.maps.MarkerOptions = {
      draggable: true
    };

    public markerPosition(): google.maps.LatLngLiteral {
      return {
        lat: this.getControl(this.field.lat.key).value,
        lng: this.getControl(this.field.lng.key).value
      };
    }

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

  onMarkerChanged(event: google.maps.MapMouseEvent): void {
        this.updateFormValue(
          event.latLng.lat(),
          event.latLng.lng()
        );
    }

    private setDefaults(): void {
        this.updateFormValue(this.defaults.lat, this.defaults.lng);
    }

    private updateFormValue(lat: number, lng: number): void {
        this.getControl(this.field.lat.key).patchValue(lat);
        this.getControl(this.field.lng.key).patchValue(lng);
    }

    private checkCalculatedValue(key: string): void {
        if (this.field[key].calculatedValue) {
            if (this.field[key].calculatedValue.indexOf('.') > -1) {
                const baseKey = this.field[key].calculatedValue.split('.')[0];
                const subKey = this.field[key].calculatedValue.split('.')[1];
                if (this.getControl(baseKey)) {
                    this._calcValueSubscription[key] = this.getControl(baseKey).valueChanges.subscribe((value) => {
                        if (value && value[subKey]) {
                            this.getControl(this.field[key].key).patchValue(value[subKey]);
                        }
                    });
                }
            }
        }
    }
}

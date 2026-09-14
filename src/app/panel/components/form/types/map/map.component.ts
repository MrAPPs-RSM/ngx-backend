import {Component, Input, OnDestroy, OnInit, ViewEncapsulation, ChangeDetectionStrategy} from '@angular/core';
import {FormFieldMap} from '../../interfaces/form-field-map';
import {BaseInputComponent} from '../base-input/base-input.component';
import {Subscription} from 'rxjs';
import {environment} from '../../../../../../environments/environment';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MapComponent extends BaseInputComponent implements OnInit, OnDestroy {

    @Input() field: FormFieldMap;
    mapReady = false;

    private defaults: {
        lat?: number,
        lng?: number
    };

    private _calcValueSubscription: any = {
        lat: Subscription.EMPTY,
        lng: Subscription.EMPTY,
    };

    ngOnInit() {
        this.loadGoogleMaps().then(() => this.mapReady = true);
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

    get center(): {lat: number, lng: number} {
        return {
            lat: Number(this.getControl(this.field.lat.key).value),
            lng: Number(this.getControl(this.field.lng.key).value)
        };
    }

    onMarkerChanged(event: any): void {
        const position = event && event.latLng;
        if (position) {
            this.updateFormValue(position.lat(), position.lng());
        }
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

    private loadGoogleMaps(): Promise<void> {
        const browserWindow = window as any;
        if (browserWindow.google?.maps) {
            return Promise.resolve();
        }

        const existing = document.getElementById('google-maps-api') as HTMLScriptElement;
        if (existing) {
            return new Promise((resolve, reject) => {
                existing.addEventListener('load', () => resolve(), {once: true});
                existing.addEventListener('error', reject, {once: true});
            });
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.id = 'google-maps-api';
            script.async = true;
            script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(environment.googleMapsApiKey || '')}`;
            script.onload = () => resolve();
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
}

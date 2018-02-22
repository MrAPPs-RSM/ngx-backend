import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormFieldMap} from '../../interfaces/form-field-map';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MapComponent implements OnInit {

    @Input() form: FormGroup;
    @Input() field: FormFieldMap;

    options: any;

    lat: number;
    lng: number;

    constructor() {
    }

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

        this.onFormChange('lat');
        this.onFormChange('lng');
    }

    private onFormChange(key: string): void {
        this.form.controls[this.field[key].key].valueChanges
            .subscribe(
                value => {
                    this[key] = value;
                }
            );
    }

    private isValid(key: string): boolean {
        if (this.form.controls[key].value === null || this.form.controls[key].value === '') {
            return true;
        } else {
            return this.form.controls[key].valid;
        }
    }

    private onMarkerChanged(event: any): void {
        this.lat = event.coords.lat;
        this.lng = event.coords.lng;
        this.refreshFormValues();
    }

    private refreshFormValues(): void {
        this.form.controls[this.field.lat.key].patchValue(this.lat);
        this.form.controls[this.field.lng.key].patchValue(this.lng);
    }
}
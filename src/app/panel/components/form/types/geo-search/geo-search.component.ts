import {ChangeDetectorRef, Component, EventEmitter, OnInit} from '@angular/core';
import {BaseInputComponent} from '../base-input/base-input.component';
import {distinctUntilChanged, debounceTime, switchMap} from 'rxjs/operators';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {LanguageService} from '../../../../services/language.service';

@Component({
    selector: 'app-geo-search',
    templateUrl: './geo-search.component.html',
    styleUrls: ['./geo-search.component.scss']
})
export class GeoSearchComponent extends BaseInputComponent implements OnInit {

    private readonly GEOCODING: any = {
        url: 'https://maps.googleapis.com/maps/api/geocode/json',
        key: 'AIzaSyADFxDs_iwQ6RbgvOU51iFMJIVrhSCgS2o',
    };

    locations: any[] = [];
    typeAhead: EventEmitter<string> = new EventEmitter<string>();

    constructor(private _cd: ChangeDetectorRef,
                private _http: HttpClient,
                private _language: LanguageService) {
        super();
    }

    ngOnInit() {
        this.geoCoding();
    }

    private geoCoding(): void {
        this.typeAhead.pipe(
            distinctUntilChanged(),
            debounceTime(200),
            switchMap(address => this.getLocations(address))
        ).subscribe(data => {
            this._cd.markForCheck();
            this.locations = this.convertToOptions(data);
        }, (err) => {
            console.log(err);
            this.locations = [];
        });
    }

    private convertToOptions(data: GeoCodingResponse): any[] {
        const options = [];
        if (data.status === 'OK') {
            data.results.forEach((item) => {
                options.push({
                    name: item.formatted_address
                });
            });
        }

        return options;
    }

    private getLocations(address: string): Observable<any> {
        if (address && address !== '') {
            const params = {
                key: this.GEOCODING.key,
                address: address,
                language: this._language.getCurrentLang() ? this._language.getCurrentLang().isoCode : 'en'
            };
            return this._http.get<any[]>(this.GEOCODING.url, {params: params});
        } else {
            return Observable.of([]).delay(300);
        }
    }

    onChange($event: {name: string} | null) {
        if ($event && $event.name) {
            this.getLocations($event.name).subscribe(
                (data: GeoCodingResponse) => {
                    const value = {
                        name: $event.name,
                        address: null,
                        street_number: null,
                        postcode: null,
                        city: null,
                        country: null,
                        lat: data.results[0].geometry.location.lat,
                        lng: data.results[0].geometry.location.lng,
                    };

                    if (data.status === 'OK') {
                        data.results[0].address_components.forEach((component) => {
                            if (component.types.indexOf('route') > -1) {
                                value.address = component.long_name;
                            }

                            if (component.types.indexOf('street_number') > -1) {
                                value.street_number = component.long_name;
                            }

                            if (component.types.indexOf('postal_code') > -1) {
                                value.postcode = component.long_name;
                            }

                            if (component.types.indexOf('country') > -1) {
                                value.country = component.long_name;
                            }

                            if (component.types.indexOf('locality') > -1) {
                                value.city = component.long_name;
                            }
                        });
                    }

                    if (value.street_number) {
                        value.address += ', ' + value.street_number;
                        delete value.street_number;
                    }

                    this.getControl().setValue(value);
                },
                error => {
                    console.log(error);
                });
        }
    }
}

interface GeoCodingResponse {
    results: GeoCodingAddress[];
    status: string;
}

interface GeoCodingAddress {
    address_components: [{
        long_name: string;
        short_name: string;
        types: any[];
    }];
    geometry: {
        location: {
            lat: number;
            lng: number
        };
    };
    formatted_address: string;
}
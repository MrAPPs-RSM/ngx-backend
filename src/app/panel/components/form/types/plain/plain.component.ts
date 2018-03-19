import {Component, OnInit} from '@angular/core';
import {BaseInputComponent} from '../base-input/base-input.component';
import {ApiService} from '../../../../../api/api.service';

@Component({
    selector: 'app-plain',
    templateUrl: './plain.component.html',
    styleUrls: ['./plain.component.scss']
})
export class PlainComponent extends BaseInputComponent implements OnInit {

    constructor(private _apiService: ApiService) {
        super();
    }

    ngOnInit() {
        if (this.field.value) {
            this.loadOptions().then((array) => {
                console.log(array);
                array.forEach((item: { id: any, text: string }) => {
                    if (this.field.value === item.id) {
                        this.field.value = item.text;
                    }
                });
            });
        }
    }

    private loadOptions(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.field.options) {
                if (this.field.options instanceof Array) {
                    resolve(this.field.options);
                } else {
                    const endpoint = this.field.options;
                    this._apiService.get(endpoint)
                        .then((response) => {
                            resolve(response);
                        })
                        .catch((response) => {
                            // TODO: decide what to do if select options can't be loaded (back to prev page?, alert?, message?)
                            console.log(response.error);
                        });
                }
            } else {
                reject();
            }
        });
    }

}

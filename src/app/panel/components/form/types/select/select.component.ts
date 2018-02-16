import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ApiService} from '../../../../../api/api.service';
import {ActivatedRoute} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {FormFieldSelect} from '../../interfaces/form-field-select';

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SelectComponent implements OnInit {

    @Input() form: FormGroup;
    @Input() field: FormFieldSelect;
    @Input() isEdit: boolean;

    public options: SelectData[] = [];

    constructor(private _apiService: ApiService,
                private _route: ActivatedRoute) {
    }

    ngOnInit() {
        this.loadData();
    }

    get isValid() {
        if (this.field.validators && this.field.validators.required) {
            if (this.field.multiple) {
                if (this.form.controls[this.field.key].value instanceof Array) {
                    return this.form.controls[this.field.key].value.length > 0;
                } else {
                    return this.form.controls[this.field.key].value !== null;
                }
            } else {
                return this.form.controls[this.field.key].value !== null;
            }
        } else {
            return true;
        }
    }

    private loadData(): void {
        this.loadOptions()
            .then(() => {
                // TODO: If this.isEdit == true, load pre-selected data, changing this.form.controls[this.field.key].value
                console.log('LOAD DATA if edit');
            })
            .catch((error) => {
                console.log(error);
            });
    }

    private loadOptions(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.field.options instanceof Array) {
                this.options = this.field.options;
                resolve();
            } else {
                let endpoint = this.field.options;
                if (endpoint.indexOf(':id') !== -1) {
                    endpoint = endpoint.replace(':id', this._route.params['value'].id);
                }

                this._apiService.get(endpoint)
                    .then((response) => {
                        this.options = response;
                    })
                    .catch((response: HttpErrorResponse) => {
                        // TODO: decide what to do if select options can't be loaded (back to prev page?, alert?, message?)
                        console.log(response.error);
                    });
            }
        });
    }
}

export interface SelectData {
    id: string | number;
    text: string;
}

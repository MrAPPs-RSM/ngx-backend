import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {ApiService} from '../../../../../api/api.service';
import {ActivatedRoute} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {FormFieldSelect} from '../../interfaces/form-field-select';
import {BaseInputComponent} from '../base-input/base-input.component';

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SelectComponent extends BaseInputComponent implements OnInit {

    @Input() field: FormFieldSelect;
    @Input() isEdit: boolean;
    @Input() unique?: Function;

    public options: SelectData[] = [];

    public selected: any; // Array or object

    constructor(private _apiService: ApiService,
                private _route: ActivatedRoute) {
        super();
    }

    ngOnInit() {
        this.loadData();
        const params = {};
        this.selected = this.field.multiple === true ? [] : {};

        if (this.field.dependsOn) {
            this.field.dependsOn.forEach((key) => {
                if (this.form.controls[key]) {
                    this.form.controls[key].valueChanges.subscribe((value) => {
                        params[key] = value;
                        this.loadOptions(params)
                            .then(() => {
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    });
                }
            });
        }
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
        if (this.isEdit && this.field.multiple) {
            this.form.controls[this.field.key].valueChanges.first().subscribe((value) => {
                this.loadOptions().then(() => {
                    if (value instanceof Array) {
                        value.forEach((item) => {
                            this.selected.push({
                                id: item.id,
                                text: item.nome
                            });
                            this.selected = [...this.selected];
                        });
                    }
                    this.refreshFormValue();
                }).catch((err) => {
                    console.log(err);
                });
            });
        } else {
            this.loadOptions().catch((err) => console.log(err));
        }
    }

    private filterOptionsIfNeeded(options: SelectData[]): SelectData[] {
        if (this.unique) {
            return this.unique(options);
        }

        return options;
    }

    private loadOptions(params?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.field.options) {
                if (this.field.options instanceof Array) {
                    this.options = this.filterOptionsIfNeeded(this.field.options);
                    resolve();
                } else {
                    let endpoint = this.field.options;
                    if (endpoint.indexOf(':id') !== -1) {
                        endpoint = endpoint.replace(':id', this._route.params['value'].id);
                    }

                    this._apiService.get(endpoint, params)
                        .then((response) => {
                            this.options = this.filterOptionsIfNeeded(response);
                            resolve();
                        })
                        .catch((response: HttpErrorResponse) => {
                            // TODO: decide what to do if select options can't be loaded (back to prev page?, alert?, message?)
                            console.log(response.error);
                        });
                }
            } else {
                reject();
            }
        });
    }

    onChange($event): void {
        this.selected = $event;
        this.refreshFormValue();
    }

    private refreshFormValue(): void {
        if (this.selected) {
            if (this.selected instanceof Array) {
                const ids = [];
                this.selected.forEach((item) => {
                    ids.push(item.id);
                });
                this.form.controls[this.field.key].setValue(ids);
            }
        } else {
            this.form.controls[this.field.key].setValue(null);
        }
    }
}

export interface SelectData {
    id: string | number;
    text: string;
}

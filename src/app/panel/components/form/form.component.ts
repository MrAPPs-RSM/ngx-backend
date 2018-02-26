import {Component, Input, OnInit, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {formConfig} from './form.config';
import {FormGeneratorService} from '../../services/form-generator.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ModalService} from '../../services/modal.service';
import {ApiService} from '../../../api/api.service';
import {FormSettings} from './interfaces/form-settings';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FormComponent implements OnInit {

    @Input() settings: FormSettings;
    @Input() isLoginLoading: boolean;
    @Output() response: EventEmitter<any> = new EventEmitter<any>();

    public form: FormGroup;
    public formConfig = formConfig;
    public isLoading: boolean = false;

    constructor(private _formGenerator: FormGeneratorService,
                private _modal: ModalService,
                private _apiService: ApiService,
                private _route: ActivatedRoute) {
    }

    ngOnInit() {
        this.form = this._formGenerator.generate(this.settings.fields);
        this.form.valueChanges.subscribe(
            data => {
                console.log(data);
                // console.log(this.form);
            }
        );
        if (this.settings.isEdit) {
            this.loadData();
        }
    }

    loadData(entity?: any): void {
        let id = null;
        if (this._route.snapshot.params && this._route.snapshot.params['id']) {
            id = this._route.snapshot.params['id'];
        } else {
            id = entity ? entity.id : null;
        }

        if (id !== null) {
            this.isLoading = true;

            let params = {};
            if (this.settings.api.filter) {
                params = {
                    filter: this.settings.api.filter
                };
            }
            this._apiService.get(
                this.settings.api.endpoint + '/' + id, params)
                .then((response) => {
                    this.isLoading = false;
                    Object.keys(response).forEach((key) => {
                        if (this.form.controls[key]) {
                            this.form.controls[key].setValue(response[key]);
                        }
                    });
                })
                .catch((response: HttpErrorResponse) => {
                    this.isLoading = false;
                    this.response.emit((response));
                });
        }
    }

    onSubmit(): void {
        if (this.settings.isLoginForm) {
            /** If is login form, the login component will handle the request */
            this.response.emit(this.form.value);
        } else {
            if (this.form.valid) {
                if (this.settings.submit.confirm) {
                    this._modal.confirm()
                        .then(() => {
                            this.submit();
                        })
                        .catch(() => {
                        });
                } else {
                    this.submit();
                }
            }
        }
    }

    submit(): void {
        this.isLoading = true;
        if (this.settings.isEdit) {
            this._apiService.patch(this.settings.api.endpoint + '/' + this._route.snapshot.params['id'], this.form.value)
                .then((response) => {
                    this.isLoading = false;
                    this.response.emit(response);

                    if (this.settings.submit.refreshAfter === true) {
                        this.loadData(response);
                    }
                })
                .catch((response: HttpErrorResponse) => {
                    this.isLoading = false;
                    this.response.emit(response);
                });
        } else {
            this._apiService.put(this.settings.api.endpoint, this.form.value)
                .then((response) => {
                    this.isLoading = false;
                    this.response.emit(response);

                    if (this.settings.submit.refreshAfter) {
                        this.loadData(response);
                    }
                })
                .catch((response: HttpErrorResponse) => {
                    this.isLoading = false;
                    this.response.emit(response);
                });
        }
    }

    closeErrors(): void {
        this.settings.errors = [];
    }
}

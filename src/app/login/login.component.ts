import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {environment} from '../../environments/environment';
import {FormGroup} from '@angular/forms';
import {FormGeneratorService} from '../panel/services/form-generator.service';
import {ApiService} from '../api/api.service';
import {TokenService} from '../auth/token.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

    public title = environment.name;

    public form: FormGroup;
    public fields: any[] = environment.auth.login.form.fields;

    constructor(private _formGenerator: FormGeneratorService,
                private _apiService: ApiService,
                private _tokenService: TokenService,
                private _toastService: ToastrService,
                private _router: Router) {
    }

    ngOnInit() {
        this.form = this._formGenerator.generate(this.fields);
    }

    onSubmit(): void {
        if (this.form.valid) {
            this._apiService.post(environment.auth.login.endpoint, this.form.value, null, true)
                .then((response) => {
                    this._tokenService.storeToken(response.id);
                    this._router.navigate(['panel']);
                })
                .catch((error) => {
                    this._toastService.error('message', 'title');
                });
        }
    }
}

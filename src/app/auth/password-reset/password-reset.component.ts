import {Component, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {ApiService, ErrorResponse} from '../../api/api.service';
import {Router} from '@angular/router';
import {ToastsService} from '../../services/toasts.service';

@Component({
    selector: 'app-password-reset',
    templateUrl: './password-reset.component.html',
    styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {

    public environment = environment;
    public isLoading: boolean = false;

    constructor(private _apiService: ApiService,
                private _toastsService: ToastsService,
                private _router: Router) {
    }

    ngOnInit() {
    }

    onSubmit(data): void {
        this.isLoading = true;
        this._apiService.post(this.environment.auth.passwordReset.endpoint, data, null, true)
            .then((response) => {
                this.isLoading = false;
                // TODO: show message: an email has been sent to your account ...
                this._toastsService.success(null, null, {disableTimeOut: true});
                this._router.navigate(['login']);
            })
            .catch((response: ErrorResponse) => {
                this.isLoading = false;
                this._toastsService.error(response.error);
            });
    }

}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {ApiService, ErrorResponse} from '../../api/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastsService} from '../../services/toasts.service';
import {Subscription} from 'rxjs/Subscription';
import {TOKEN_KEY} from '../services/user.service';

@Component({
    selector: 'app-password-change',
    templateUrl: './password-change.component.html',
    styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent implements OnInit, OnDestroy {

    public environment = environment;
    public isLoading = false;

    private _subscription: Subscription = Subscription.EMPTY;
    private _accessToken: string;

    constructor(private _apiService: ApiService,
                private _toastsService: ToastsService,
                private _route: ActivatedRoute,
                private _router: Router) {
    }

    ngOnInit() {
        this._subscription = this._route.queryParams.subscribe(params => {
            if ('access_token' in params) {
                this._accessToken = params['access_token'];
                this._subscription.unsubscribe();
            }
        });
    }

    ngOnDestroy() {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }

    onSubmit(data): void {
        this.isLoading = true;
        const endpoint = this.environment.auth.passwordChange.endpoint + '?' + TOKEN_KEY + '=' + this._accessToken;
        this._apiService.post(endpoint, data, null, true)
            .then((response) => {
                this.isLoading = false;
                this._toastsService.success('Success', 'Password changed successfully', {timeOut: 5000});
                this._router.navigate(['login']);
            })
            .catch((response: ErrorResponse) => {
                this.isLoading = false;
                this._toastsService.error(response.error);
            });
    }

}

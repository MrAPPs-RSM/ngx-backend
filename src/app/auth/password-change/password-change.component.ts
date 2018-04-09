import {Component, OnDestroy, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {ApiService, ErrorResponse} from '../../api/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastsService} from '../../services/toasts.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-password-change',
    templateUrl: './password-change.component.html',
    styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent implements OnInit, OnDestroy {

    public environment = environment;
    public isLoading = false;

    private _subscription: Subscription = Subscription.EMPTY;
    private _authToken: string;

    constructor(private _apiService: ApiService,
                private _toastsService: ToastsService,
                private _route: ActivatedRoute,
                private _router: Router) {
    }

    ngOnInit() {
        this._subscription = this._route.queryParams.subscribe(params => {
            console.log(params);
        });
    }

    ngOnDestroy() {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }

    onSubmit(data): void {
        // TODO: mandare richiesta con access_token
        console.log(data);
        this.isLoading = true;
        /*this._apiService.post(this.environment.auth.passwordChange.endpoint, data, null, true)
            .then((response) => {
                this.isLoading = false;
                this._toastsService.success(
                    'Password reset requested',
                    'Check your email for further instructions',
                    {disableTimeOut: true}
                );
                this._router.navigate(['login']);
            })
            .catch((response: ErrorResponse) => {
                this.isLoading = false;
                this._toastsService.error(response.error);
            });*/
    }

}

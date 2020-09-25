import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ToastsService } from '../../services/toasts.service';
import { SetupService } from '../../panel/services/setup.service';
import { StorageService } from '../../services/storage.service';
import { ApiService, ErrorResponse } from '../../api/api.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

    public environment = environment;
    public isLoading = false;

    constructor(private _toastsService: ToastsService,
        private _route: ActivatedRoute,
        private _storageService: StorageService,
        private _setupService: SetupService,
        private _apiService: ApiService,
        private _userService: UserService,
        private _router: Router) {
    }

    ngOnInit() {
        this._setupService._lastRouteLoading = null;
    }

    onSubmit(data: any): void {
        this.isLoading = true;

        if (environment.domains) {
            const currentDomain = this._storageService.getValue('domain');
            if (environment.auth.credentials.hasOwnProperty('domain')) {
                data[environment.auth.credentials['domain']] = currentDomain;
            } else {
                data.domain = currentDomain;
            }
        }

        this._apiService.login(data)
            .then((response) => {
                this.isLoading = false;

                if (!('user' in response)) {
                    response.user = {};
                }

                response.user['password'] = data.password;
                response.user.remember = !!data['remember'];

                this._userService.storeUser(response.user);
                this._userService.storeToken(response.id);

                if (environment.auth.refreshToken && response.refresh_token && typeof response.refresh_token === 'string') {
                    // Set refresh token
                    this._userService.storeRefreshToken(response.refresh_token);
                }

                this._router.navigate(['../panel'], { relativeTo: this._route });
            })
            .catch((response: ErrorResponse) => {
                this.isLoading = false;
                this._toastsService.error(response.error);
            });
    }
}

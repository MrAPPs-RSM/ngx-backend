import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {environment} from '../../../environments/environment';
import {ApiService, ErrorResponse} from '../../api/api.service';
import {Router} from '@angular/router';
import {UserService} from '../services/user.service';
import {ToastsService} from '../../services/toasts.service';
import {SetupService} from '../../panel/services/setup.service';

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
                private _setupService: SetupService,
                private _apiService: ApiService,
                private _userService: UserService,
                private _router: Router) {
    }

    ngOnInit() {
        this._setupService._lastRouteLoading = null;
    }

    onSubmit(data): void {
        this.isLoading = true;

        this._apiService.login(data)
            .then((response) => {
                this.isLoading = false;

                response.user['password'] = data.password;
                response.user.remember = !!data['remember'];

                this._userService.storeUser(response.user);
                this._userService.storeToken(response.id);

                console.log('START NAVIGATION TO PANEL');
                this._router.navigate(['panel']);
            })
            .catch((response: ErrorResponse) => {
                this.isLoading = false;
                this._toastsService.error(response.error);
            });
    }
}

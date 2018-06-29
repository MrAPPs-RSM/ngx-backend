import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {environment} from '../../../environments/environment';
import {ApiService, ErrorResponse} from '../../api/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../services/user.service';
import {ToastsService} from '../../services/toasts.service';
import {SetupService} from '../../panel/services/setup.service';
import {StorageService} from "../../services/storage.service";

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

        if (environment.domains) {
            this._storageService.setValue('domain', this._route.snapshot.params['domain']);
        }
    }

    onSubmit(data: any): void {
        this.isLoading = true;

        if (environment.domains) {
            data.domain = this._storageService.getValue('domain');
        }

        this._apiService.login(data)
            .then((response) => {
                this.isLoading = false;

                response.user['password'] = data.password;
                response.user.remember = !!data['remember'];

                this._userService.storeUser(response.user);
                this._userService.storeToken(response.id);

                this._router.navigate(['../panel'], {relativeTo: this._route});
            })
            .catch((response: ErrorResponse) => {
                this.isLoading = false;
                this._toastsService.error(response.error);
            });
    }
}

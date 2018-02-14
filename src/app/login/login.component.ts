import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {environment} from '../../environments/environment';
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

    public environment = environment;
    public isLoading: boolean = false;

    constructor(private _apiService: ApiService,
                private _tokenService: TokenService,
                private _toastService: ToastrService,
                private _router: Router) {
    }

    ngOnInit() {
    }

    onSubmit(data): void {
        this.isLoading = true;
        this._apiService.post(this.environment.auth.login.endpoint, data, null, true)
            .then((response) => {
                this.isLoading = false;
                this._tokenService.storeToken(response.id);
                this._router.navigate(['panel']);
            })
            .catch((error) => {
                this.isLoading = false;
                // TODO:
                this._toastService.error('message', 'title');
            });
    }
}

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserService, ACCESS_TOKEN_KEY, LOGIN_ENDPOINT } from '../auth/services/user.service';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { RefreshToken } from '../interfaces';
import * as localSetupFile from '../panel/services/local-setup-file';
import {Observable, throwError} from 'rxjs';

const API_URL = environment.api.baseUrl;

@Injectable()
export class ApiService {

    private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    private readonly headerParametersKey: string = 'ngxBackend-Parameters';
    private readonly domainKey = environment.auth.credentials?.domain || 'domain';

    public isRedirecting = false;
    public unauthorized = false;

    constructor(private _http: HttpClient,
        private _userService: UserService,
        private _storageService: StorageService,
        private _router: Router) {
    }

    /**
     * Return composed url based on ENV
     * @param endpoint
     * @param addAuth
     * @param params
     * @returns {string}
     */
    public composeUrl(endpoint: string, addAuth?: boolean, extraParams?: Object): string {
        this.isRedirecting = false;

        let url = endpoint.startsWith('http') ? endpoint : API_URL + endpoint;
        if (addAuth) {
            const authorization = ACCESS_TOKEN_KEY + '=' + this._userService.getToken();
            if (url.indexOf('?') !== -1) {
                url += '&' + authorization;
            } else {
                url += '?' + authorization;
            }
        }

        if (extraParams) {
            url += '&filter=' + extraParams['filter'];
        }

        return url;
    }

    /**
     * Returns the url with the current token
     * @param endpoint
     */
    public updateToken(endpoint: string): string {
      console.log(endpoint);
      let [url, qs] = endpoint.split('?');
      url = url.replace(API_URL, '');

      if (qs) {
        qs = qs.split('&')
          .reduce((acc, param) => param.indexOf(`${ACCESS_TOKEN_KEY}=`) === -1 ? [...acc, param] : acc, [])
          .join('&');

        url = !!qs
          ? `${url}?${qs}`
          : url;
      }

      const retval = this.composeUrl(url, true);
      return retval;
    }

    /**
     * GET
     * @param endpoint
     * @param params
     * @param fromLogin
     * @returns {Promise<any>}
     */
    public get(endpoint: string, params?: Object, fromLogin?: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            this._http.get(this.composeUrl(endpoint), this.setOptions(params))
                .subscribe(resolve, reject);
        });
    }


    /**
     * POST
     * @param endpoint
     * @param body
     * @param params
     * @param isLogin
     * @returns {Promise<T>}
     */
    public post(endpoint: string, body: any, params?: Object | null, isLogin: boolean = false): Promise<any> {
        // console.log('[API SERVICE] - POST ' + endpoint);
        return new Promise((resolve, reject) => {
            this._http.post(this.composeUrl(endpoint), body, this.setOptions(params))
                .subscribe(resolve, reject);
        });
    }

    /**
     * PUT
     * @param endpoint
     * @param body
     * @param params
     * @param fromLogin
     * @returns {Promise<T>}
     */
    public put(endpoint: string, body: any, params?: Object, fromLogin?: boolean): Promise<any> {
        // console.log('[API SERVICE] - PUT ' + endpoint);
        return new Promise((resolve, reject) => {
            this._http.put(this.composeUrl(endpoint), body, this.setOptions(params))
                .subscribe(resolve, reject);
        });
    }

    /**
     * PATCH
     * @param endpoint
     * @param body
     * @param params
     * @param fromLogin
     * @returns {Promise<T>}
     */
    public patch(endpoint: string, body: any, params?: Object, fromLogin?: boolean): Promise<any> {
        // console.log('[API SERVICE] - PATCH ' + endpoint);
        return new Promise((resolve, reject) => {
            this._http.patch(this.composeUrl(endpoint), body, this.setOptions(params))
                .subscribe(resolve, reject);
        });
    }

    /**
     * DELETE
     * @param endpoint
     * @param params
     * @param fromLogin
     * @returns {Promise<T>}
     */
    public delete(endpoint: string, params?: Object, fromLogin?: boolean): Promise<any> {
        // console.log('[API SERVICE] - DELETE ' + endpoint);
        return new Promise((resolve, reject) => {
            this._http.delete(this.composeUrl(endpoint), this.setOptions(params))
                .subscribe(resolve, reject);
        });
    }

    public redirectToLogin(): void {
        this.unauthorized = true;
        this._userService.removeUser();
        this._userService.removeToken();

        if (environment.domains) {
            const domain = this._storageService.getValue('domain');
            this._router.navigate(['/' + domain + '/login']).then(() => {
                this.unauthorized = false;
            });
        } else {
            this._router.navigate(['login']).then(() => {
                this.unauthorized = false;
            });
        }
    }



    /**
     * Creates standard request options
     * @param params
     * @param withoutHeaders
     * @returns {RequestOptions}
     */
    private setOptions(params: Object | null, withoutHeaders?: boolean): RequestOptions {
        const requestOptions: RequestOptions = {
            params: this.setAuth(params)
        };

        if (!withoutHeaders) {
            if (environment.domains) {
                const value = {};
                value[this.domainKey] = this._storageService.getValue('domain');
                if (!this.headers.has(this.headerParametersKey)) {
                    this.headers = this.headers.append(this.headerParametersKey, JSON.stringify(value));
                } else {
                    this.headers = this.headers.set(this.headerParametersKey, JSON.stringify(value));
                }
            }
            requestOptions.headers = this.headers;
        }

        return requestOptions;
    }

    /**
     * Set auth token if present
     * @param params
     * @returns {HttpParams}
     */
    private setAuth(params: Object | null): HttpParams {
        if (this._userService.getToken() !== null) {
            const obj = {};
            if (params) {
                Object.keys(params).forEach((key) => {
                    if (params[key]) {
                        obj[key] = params[key];
                    }
                });
            }
            obj[ACCESS_TOKEN_KEY] = this._userService.getToken();
            return new HttpParams({
                fromObject: obj
            });
        }
    }



    public async refreshToken(): Promise<RefreshToken> {
        // Check if there is refresh token stored
        // on local storage
        const refreshToken: string = this._userService.getRefreshToken();
        if (refreshToken.length === 0) {
            // Go to login, invalid refresh token
            return {
                success: false,
                message: 'Invalid stored refresh token',
                token: null,
                refreshToken: null
            };
        }

        // Call refresh token API
        const data = await this.post(environment.auth.refreshToken.endpoint, {
            refresh_token: refreshToken
        }, null, false);

        // Check if correct data
        if (!data.refresh_token || !data.id) {
            return {
                success: false,
                message: 'Invalid token',
                token: null,
                refreshToken: null
            };
        }

        return {
            success: true,
            message: null,
            token: data.id,
            refreshToken: data.refresh_token
        };
    }

    public refreshAndStoreToken() {
      return new Promise((resolve, reject) => {
        this.refreshToken()
          .then(response => {
            if (!response.success) {
              this.redirectToLogin();
              reject(response.message);
            }

            // Store
            this._userService.storeToken(response.token);
            this._userService.storeRefreshToken(response.refreshToken);
            resolve(response);
          })
          .catch(err => {
            this.redirectToLogin();
            reject(err);
          });
      })
    }

    public login(data: any): Promise<any> {
        return this.post(LOGIN_ENDPOINT, data, null, true);
    }

    public setup(): Promise<any> {
        if (!!environment.api['localSetupFile']) {
            return new Promise(resolve => {
                resolve(localSetupFile.setup);
            });
        } else {
            return this.get(environment.api.setupEndpoint);
        }
    }
}

interface RequestOptions {
    headers?: HttpHeaders | { [header: string]: string | string[] };
    params?: HttpParams | { [param: string]: string | string[]; };
}

export interface ErrorResponse {
    error: {
        code: string;
        message: string;
        name: string;
        stack: string;
        statusCode: number;
    };
}

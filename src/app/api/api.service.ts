import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {UserService, TOKEN_KEY, LOGIN_ENDPOINT} from '../auth/services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {StorageService} from '../services/storage.service';

const API_URL = environment.api.baseUrl;

@Injectable()
export class ApiService {

    private headers = new HttpHeaders({'Content-Type': 'application/json'});
    private readonly headerParametersKey: string = 'ngxBackend-Parameters';
    private readonly domainKey = environment.auth.credentials.domain ? environment.auth.credentials.domain : 'domain';

    public isRedirecting = false;

    constructor(private _http: HttpClient,
                private _userService: UserService,
                private _storageService: StorageService,
                private _route: ActivatedRoute,
                private _router: Router) {
    }

    /**
     * Return composed url based on ENV
     * @param endpoint
     * @param addAuth
     * @returns {string}
     */
    public composeUrl(endpoint: string, addAuth?: boolean): string {
        this.isRedirecting = false;

        let url = API_URL + endpoint;
        if (addAuth) {
            const authorization = TOKEN_KEY + '=' + this._userService.getToken();
            if (url.indexOf('?') !== -1) {
                url += '&' + authorization;
            } else {
                url += '?' + authorization;
            }
        }
        return url;
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
                .subscribe(
                    data => {
                        resolve(data);
                    },
                    error => {
                        this.handleError(endpoint, error, fromLogin !== null ? fromLogin : false)
                            .then(() => {

                                if (error.status === 401) {
                                    this.get(endpoint, params, true)
                                        .then((data) => {
                                            resolve(data);
                                        })
                                        .catch((response: HttpErrorResponse) => {
                                            reject(this.manageErrorObject(response.error));
                                        });
                                } else {
                                    resolve(null);
                                }

                            })
                            .catch((response: HttpErrorResponse) => {
                                reject(this.manageErrorObject(response.error));
                            });
                    }
                );
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
                .subscribe(
                    data => {
                        resolve(data);
                    },
                    error => {

                        this.handleError(endpoint, error, isLogin)
                            .then(() => {

                                if (error.status === 401) {
                                    this.post(endpoint, body, params, true)
                                        .then((data) => {
                                            resolve(data);
                                        })
                                        .catch((response: HttpErrorResponse) => {
                                            reject(this.manageErrorObject(response.error));
                                        });
                                } else {
                                    resolve(null);
                                }

                            })
                            .catch((response: HttpErrorResponse) => {
                                reject(this.manageErrorObject(response.error));
                            });
                    }
                );
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
                .subscribe(
                    data => {
                        resolve(data);
                    },
                    error => {
                        this.handleError(endpoint, error, fromLogin !== null ? fromLogin : false)
                            .then(() => {
                                if (error.status === 401) {
                                    this.put(endpoint, body, params, true)
                                        .then((data) => {
                                            resolve(data);
                                        })
                                        .catch((response: HttpErrorResponse) => {
                                            reject(this.manageErrorObject(response.error));
                                        });
                                } else {
                                    resolve(null);
                                }
                            })
                            .catch((response: HttpErrorResponse) => {
                                reject(this.manageErrorObject(response.error));
                            });
                    }
                );
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
                .subscribe(
                    data => {
                        resolve(data);
                    },
                    error => {
                        this.handleError(endpoint, error, fromLogin !== null ? fromLogin : false)
                            .then(() => {
                                if (error.status === 401) {
                                    this.patch(endpoint, body, params, true)
                                        .then((data) => {
                                            resolve(data);
                                        })
                                        .catch((response: HttpErrorResponse) => {
                                            reject(this.manageErrorObject(response.error));
                                        });
                                } else {
                                    resolve(null);
                                }
                            })
                            .catch((response: HttpErrorResponse) => {
                                reject(this.manageErrorObject(response.error));
                            });
                    }
                );
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
                .subscribe(
                    data => {
                        resolve(data);
                    },
                    error => {
                        this.handleError(endpoint, error, fromLogin !== null ? fromLogin : false)
                            .then(() => {
                                if (error.status === 401) {
                                    this.delete(endpoint, params, true)
                                        .then((data) => {
                                            resolve(data);
                                        })
                                        .catch((response: HttpErrorResponse) => {
                                            reject(this.manageErrorObject(response.error));
                                        });
                                } else {
                                    resolve(null);
                                }
                            })
                            .catch((response: HttpErrorResponse) => {
                                reject(this.manageErrorObject(response.error));
                            });
                    }
                );
        });
    }

    private redirectToLogin(): void {
        this._userService.removeUser();
        this._userService.removeToken();
        this._router.navigate(['../login'], {relativeTo: this._route});
    }

    /**
     * Handle error status (if 401 logout)
     * @param endpoint
     * @param errorResponse
     * @param fromLogin
     */
    private handleError(endpoint: string, errorResponse: HttpErrorResponse, fromLogin: boolean): Promise<any> {
        return new Promise((resolve, reject) => {

            switch (errorResponse.status) {
                case 401: {

                    if (fromLogin) {
                        this.redirectToLogin();
                        reject(errorResponse);
                    } else {

                        // Only if remember me enabled
                        if (this._userService.getUser().remember) {
                            this.login(null)
                                .then((response) => {
                                    // console.log("TOKEN CHANGED");
                                    this._userService.storeToken(response.id);
                                    resolve();
                                })
                                .catch((err) => {
                                    this.redirectToLogin();
                                    reject(err);
                                });
                        } else {
                            this.redirectToLogin();
                            reject(errorResponse);
                        }
                    }
                }
                    break;
                case 301:
                case 302:
                {
                    this.isRedirecting = true;

                    resolve();
                    if ('redirectAfter' in errorResponse.error) {
                        setTimeout(() => {
                            this._router.navigateByUrl(errorResponse.error['redirectAfter']);
                        }, 200);
                    }
                }
                    break;
                default: {
                    reject(errorResponse);
                }
                    break;
            }
        });
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
                    obj[key] = params[key];
                });
            }
            obj[TOKEN_KEY] = this._userService.getToken();
            return new HttpParams({
                fromObject: obj
            });
        }
    }

    private manageErrorObject(input: any): any {
        if (input.error) {
            return input;
        } else {
            return {
                error: {
                    code: input.code,
                    message: input.message,
                }
            };
        }
    }


    public login(data: any): Promise<any> {
        if (data == null) {
            const user = this._userService.getUser();

            if (user != null) {
                data = {};
                if (environment.auth.credentials) {
                    data[environment.auth.credentials.username] = user.username;
                    data[environment.auth.credentials.password] = user.password;
                } else {
                    data['username'] = user.username;
                    data['password'] = user.password;
                }
            }
        }

        return this.post(LOGIN_ENDPOINT, data, null, true);
    }
}

interface RequestOptions {
    headers?: HttpHeaders | { [header: string]: string | string [] };
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

import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {UserService, TOKEN_KEY, LOGIN_ENDPOINT} from '../auth/services/user.service';
import {Router} from '@angular/router';

const API_URL = environment.api.baseUrl;

@Injectable()
export class ApiService {

    private headers = new HttpHeaders({'Content-Type': 'application/json'});

    constructor(private _http: HttpClient,
                private _userService: UserService,
                private _router: Router) {
    }

    /**
     * Return composed url based on ENV
     * @param endpoint
     * @param addAuth
     * @returns {string}
     */
    public composeUrl(endpoint: string, addAuth?: boolean): string {
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
     * @returns {Promise<any>}
     */
    public get(endpoint: string, params?: Object): Promise<any> {
        console.log('[API SERVICE] - GET ' + endpoint);
        /*if (params) {
         console.log(params);
         }*/
        return new Promise((resolve, reject) => {
            this._http.get(this.composeUrl(endpoint), this.setOptions(params))
                .subscribe(
                    data => {
                        resolve(data);
                    },
                    error => {
                        this.handleError(error, false)
                            .then(() => {
                                this.get(endpoint, params)
                                    .then((data) => {
                                        resolve(data);
                                    })
                                    .catch((error) => {
                                        reject(error);
                                    });
                            })
                            .catch((error) => {
                                reject(error);
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
        console.log('[API SERVICE] - POST ' + endpoint);
        console.log(body);
        return new Promise((resolve, reject) => {
            this._http.post(this.composeUrl(endpoint), body, this.setOptions(params))
                .subscribe(
                    data => {
                        resolve(data);
                    },
                    error => {

                        this.handleError(error, isLogin)
                            .then(() => {
                                this.post(endpoint, body, params, false)
                                    .then((data) => {
                                        resolve(data);
                                    })
                                    .catch((error) => {
                                        reject(error);
                                    });
                            })
                            .catch((error) => {
                                reject(error);
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
     * @returns {Promise<T>}
     */
    public put(endpoint: string, body: any, params?: Object): Promise<any> {
        console.log('[API SERVICE] - PUT ' + endpoint);
        console.log(body);
        return new Promise((resolve, reject) => {
            this._http.put(this.composeUrl(endpoint), body, this.setOptions(params))
                .subscribe(
                    data => {
                        resolve(data);
                    },
                    error => {
                        this.handleError(error, false)
                            .then(() => {
                                this.put(endpoint, body, params)
                                    .then((data) => {
                                        resolve(data);
                                    })
                                    .catch((error) => {
                                        reject(error);
                                    });
                            })
                            .catch((error) => {
                                reject(error);
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
     * @returns {Promise<T>}
     */
    public patch(endpoint: string, body: any, params?: Object): Promise<any> {
        console.log('[API SERVICE] - PATCH ' + endpoint);
        console.log(body);
        return new Promise((resolve, reject) => {
            this._http.patch(this.composeUrl(endpoint), body, this.setOptions(params))
                .subscribe(
                    data => {
                        resolve(data);
                    },
                    error => {
                        this.handleError(error, false)
                            .then(() => {
                                this.patch(endpoint, body, params)
                                    .then((data) => {
                                        resolve(data);
                                    })
                                    .catch((error) => {
                                        reject(error);
                                    });
                            })
                            .catch((error) => {
                                reject(error);
                            });
                    }
                );
        });
    }

    /**
     * DELETE
     * @param endpoint
     * @param params
     * @returns {Promise<T>}
     */
    public delete(endpoint: string, params?: Object): Promise<any> {
        console.log('[API SERVICE] - DELETE ' + endpoint);
        return new Promise((resolve, reject) => {
            this._http.delete(this.composeUrl(endpoint), this.setOptions(params))
                .subscribe(
                    data => {
                        resolve(data);
                    },
                    error => {
                        this.handleError(error, false)
                            .then(() => {
                                this.delete(endpoint, params)
                                    .then((data) => {
                                        resolve(data);
                                    })
                                    .catch((error) => {
                                        reject(error);
                                    });
                            })
                            .catch((error) => {
                                reject(error);
                            });
                    }
                );
        });
    }

    private redirectToLogin(): void {
        this._userService.removeUser();
        this._userService.removeToken();
        this._router.navigate(['login']);
    }

    /**
     * Handle error status (if 401 logout)
     * @param error
     */
    private handleError(error: HttpErrorResponse, fromLogin: boolean): Promise<any> {
        return new Promise((resolve, reject) => {

            switch (error.status) {
                case 401: {

                    if (fromLogin) {
                        this.redirectToLogin();
                        reject();
                    } else {

                        this.login(null)
                            .then((response) => {
                                //console.log("TOKEN CHANGED");
                                this._userService.storeToken(response.id);
                                resolve();
                            })
                            .catch((error) => {
                                this.redirectToLogin();
                                reject(error);
                            });
                    }
                }
                    break;
                default: {

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
            params: this.setAuth(params),
            headers: this.headers
        };
        if (!withoutHeaders) {
            return requestOptions;
        } else {
            delete requestOptions.headers;
            return requestOptions;
        }
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


    public login(data: any): Promise<any> {
        if (data == null) {
            const user = this._userService.getUser();

            if (user != null) {
                data = {
                    'username': user.username,
                    'password': user.password,
                };
            }
        }

        return this.post(LOGIN_ENDPOINT, data, null, true);
    }
}

interface RequestOptions {
    headers?: HttpHeaders | { [header: string]: string | string [] };
    params?: HttpParams | { [param: string]: string | string[]; };
}

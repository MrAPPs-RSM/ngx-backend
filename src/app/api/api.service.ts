import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {TokenService} from '../auth/token.service';

const API_URL = environment.api.baseUrl;

@Injectable()
export class ApiService {

    private headers = new HttpHeaders({'Content-Type': 'application/json'});

    /**
     * Return composed url based on ENV
     * @param endpoint
     * @returns {string}
     */
    public static composeUrl(endpoint: string): string {
        return API_URL + endpoint;
    }

    constructor(private _http: HttpClient, private _tokenService: TokenService) {
    }

    /**
     * GET
     * @param endpoint
     * @param params
     * @returns {Promise<any>}
     */
    public get(endpoint: string, params?: Object): Promise<any> {
        return new Promise((resolve, reject) => {
            this._http.get(ApiService.composeUrl(endpoint), this.setOptions(params))
                .subscribe(
                    data => {
                        resolve(data);
                    },
                    error => {
                        this.handleError(error);
                        reject(error);
                    }
                );
        });
    }


    /**
     * POST
     * @param endpoint
     * @param body
     * @param params
     * @returns {Promise<T>}
     */
    public post(endpoint: string, body: any, params?: Object): Promise<any> {
        return new Promise((resolve, reject) => {
            this._http.post(ApiService.composeUrl(endpoint), body, this.setOptions(params))
                .subscribe(
                    data => {
                        resolve(data);
                    },
                    error => {
                        this.handleError(error);
                        reject(error);
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
        return new Promise((resolve, reject) => {
            this._http.put(ApiService.composeUrl(endpoint), body, this.setOptions(params))
                .subscribe(
                    data => {
                        resolve(data);
                    },
                    error => {
                        this.handleError(error);
                        reject(error);
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
        return new Promise((resolve, reject) => {
            this._http.patch(ApiService.composeUrl(endpoint), body, this.setOptions(params))
                .subscribe(
                    data => {
                        resolve(data);
                    },
                    error => {
                        this.handleError(error);
                        reject(error);
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
        return new Promise((resolve, reject) => {
            this._http.delete(ApiService.composeUrl(endpoint), this.setOptions(params))
                .subscribe(
                    data => {
                        resolve(data);
                    },
                    error => {
                        this.handleError(error);
                        reject(error);
                    }
                );
        });
    }

    /**
     * Handle error status (if 401 logout)
     * @param error
     */
    private handleError(error: HttpErrorResponse): void {
        // TODO:
        switch (error.status) {
            default: {

            }
        }
    }

    /**
     * Creates standard request options
     * @param params
     * @param withoutHeaders
     * @returns {RequestOptions}
     */
    private setOptions(params: Object, withoutHeaders?: boolean): RequestOptions {
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
    private setAuth(params: Object): HttpParams {
        if (this._tokenService.getToken() !== null) {
            const obj = {};
            Object.keys(params).forEach((key) => {
                obj[key] = params[key];
            });
            obj[this._tokenService.key] = this._tokenService.getToken();
            return new HttpParams({
                fromObject: obj
            });
        }
    }
}

interface RequestOptions {
    headers?: HttpHeaders | { [header: string]: string | string [] };
    params?: HttpParams | { [param: string]: string | string[]; };
}

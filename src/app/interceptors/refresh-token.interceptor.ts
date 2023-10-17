import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse, HttpResponse
} from '@angular/common/http';
import {Observable, BehaviorSubject, throwError, AsyncSubject, of} from 'rxjs';
import {catchError, filter, take, switchMap} from 'rxjs/operators';

import {UserService, LOGIN_ENDPOINT} from '../auth/services/user.service';
import {ApiService} from '../api/api.service';
import {environment} from '../../environments/environment';
const API_URL     = environment.api.baseUrl;
import {RefreshToken} from '../interfaces';
import {Router} from '@angular/router';
import * as _ from 'lodash';
declare const $: any;
@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  private refreshingToken = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private _userService: UserService,
    private _api: ApiService,
    private _router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(catchError((error: HttpErrorResponse) => {
        switch(error.status) {
          case 401:
          case 403:
            return this.manageTokenRefreshing(request, next, error);
          case 301:
          case 302:
            if (error.error.redirectAfter) {
              setTimeout(() => {
                this._router.navigateByUrl(error.error.redirectAfter);
              }, 200);
            }
            return of(new HttpResponse);
            break;
          default:
            return throwError(this.manageErrorObject(error.error));
        }
      }));
  }

  /**
   * Manages the token refreshing if needed
   * @param request
   * @param next
   * @param error
   * @private
   */
  private manageTokenRefreshing(request: HttpRequest<unknown>, next: HttpHandler, error: HttpErrorResponse): Observable<HttpEvent<unknown>> {

    if (this.isWhitelisted(request) || this.checkTokenInLocalStorage()) {
      $('.modal').modal('hide');
      this._api.redirectToLogin();
      return throwError(this.manageErrorObject(error.error));
    }

    if (this.refreshingToken) {
      return this.refreshTokenSubject.pipe(
        filter(result => result !== null),
        take(1),
        switchMap(() => next.handle(this.replaceTokenOn(request)))
      );
    } else {
      this.refreshingToken = true;

      // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
      this.refreshTokenSubject.next(null);

      const sub = new AsyncSubject();
      const source$ = sub.asObservable();

      this.refreshToken()
        .then((token: string) => {
          this.refreshTokenSubject.next(this._userService.getToken());
          sub.next(this._userService.getToken());
          sub.complete();
        })
        .catch(error => sub.error(error))
        .finally(() => this.refreshingToken = false);

      return source$.pipe(
        switchMap((token: RefreshToken) => next.handle(this.replaceTokenOn(request)))
      );
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

  private async refreshToken(): Promise<string> {
    if (environment.auth.refreshToken) {
      const token: RefreshToken = await this._api.refreshToken();
      if (!token.success) {
        throw token;
      }
      this._userService.storeToken(token.token);
      this._userService.storeRefreshToken(token.refreshToken);
      return token.token;
    } else {
      throw 'Impossibile refreshare il token';
    }
  }

  /**
   * Return the request with the new current token
   * @param request
   */
  replaceTokenOn(request: HttpRequest<unknown>): HttpRequest<unknown> {
    const url = this._api.updateToken(request.urlWithParams);
    const retval = request.clone({
      setParams: {
        access_token: this._userService.getToken()
      }
    });
    return retval;
  }

  /**
   * Checks if the endpoint is inside the refresh whitelist
   * @param request
   */
  isWhitelisted(request: HttpRequest<unknown>): boolean {
    // those endpoints won't trigger the token refresh on 401
    const whitelist = [LOGIN_ENDPOINT];
    if(environment.auth.refreshToken?.endpoint) {
      whitelist.push(environment.auth.refreshToken.endpoint)
    }
    const path = request.url.replace(API_URL, '');

    return whitelist.includes(path);
  }

  checkTokenInLocalStorage() {
    return _.isNil(localStorage.getItem('refresh_token'))
  }
}

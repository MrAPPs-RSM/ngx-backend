import {Component, HostListener, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PageTitleService} from '../../services/page-title.service';
import {PageRefreshService} from '../../../services/page-refresh.service';
import {FormSettings} from '../../components/form/interfaces/form-settings';
import {ModalService} from '../../services/modal.service';
import {UtilsService} from '../../../services/utils.service';
import {ToastsService} from '../../../services/toasts.service';
import {ErrorResponse} from '../../../api/api.service';
import {MenuService} from '../../services/menu.service';
import {Subscription} from 'rxjs/Subscription';
import {FormComponent} from '../../components/form/form.component';
import {ComponentCanDeactivate} from '../../../auth/guards/pending-changes.guard';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'app-form-page',
    templateUrl: './form-page.component.html',
    styleUrls: ['./form-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FormPageComponent implements OnInit, OnDestroy, ComponentCanDeactivate {

    params: {
        forms?: FormSettings[]
    };

    private _subscription = Subscription.EMPTY;
    @ViewChild(FormComponent) child: FormComponent;

    constructor(private _router: Router,
                private _route: ActivatedRoute,
                private _pageTitle: PageTitleService,
                private _pageRefresh: PageRefreshService,
                private _toastsService: ToastsService,
                private _modalService: ModalService,
                private _menuService: MenuService) {
    }

    ngOnInit() {
        this._subscription = this._route.queryParams.subscribe(params => {
            this.params = this._route.snapshot.data;
            //  console.log(this.params);
        });
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    @HostListener('window:beforeunload')
    canDeactivate(): Observable<boolean> | boolean {
        return this.child && this.child.canDeactivate();
    }

    private redirectIfNeeded(form: FormSettings) {
        if (form.submit && form.submit.redirectAfter) {
            if (!this._menuService.goBack()) {
                this._router.navigate(['panel/' + form.submit.redirectAfter]);
            }
        }
    }

    onResponse(form: FormSettings, response: any | ErrorResponse): void {
        // console.log('ON RESPONSE');
        // console.log(response);
        switch (form.responseType) {
            case 'terminal': {
                /** In this case, response is almost always custom,
                 * so don't need to check if error o success, just display it in a terminal like div
                 */
                this._modalService.alert(
                    'Response',
                    '<pre>' + response + '</pre>',
                    'terminal'
                );
            }
                break;
            case 'toast': {
                if (response && response.hasOwnProperty('error')) {
                    this._toastsService.error(response['error']);
                } else {
                    this._toastsService.success();
                    this.redirectIfNeeded(form);
                }
            }
                break;
            case 'alert': {
                // TODO: future support
            }
                break;
            default: {
                if (response && response.hasOwnProperty('error')) {
                    if (response['error']['statusCode'] !== 500) {
                        const index = UtilsService.containsObject(form, this.params.forms);
                        if (index !== -1) {
                            // Multiple errors
                            if (response['error']['message'].indexOf('~') !== -1) {
                                this.params.forms[index].errors = response['error']['message'].split('~');
                            } else { // Single error
                                this.params.forms[index].errors = [response['error']['message']];
                            }
                        }
                    } else {
                        this._toastsService.error(response['error']);
                    }
                } else {
                    this._toastsService.success();
                    this.redirectIfNeeded(form);
                }
            }
                break;
        }
    }
}

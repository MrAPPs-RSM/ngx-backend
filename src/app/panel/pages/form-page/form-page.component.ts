import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PageTitleService} from '../../services/page-title.service';
import {PageRefreshService} from '../../../services/page-refresh.service';
import {FormSettings} from '../../components/form/interfaces/form-settings';
import {ModalService} from '../../services/modal.service';
import {UtilsService} from '../../../services/utils.service';
import {ToastsService} from '../../../services/toasts.service';
import {ErrorResponse} from '../../../api/api.service';

@Component({
    selector: 'app-form-page',
    templateUrl: './form-page.component.html',
    styleUrls: ['./form-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FormPageComponent implements OnInit {

    private params: {
        forms?: FormSettings[]
    };

    constructor(private _router: Router,
                private _route: ActivatedRoute,
                private _pageTitle: PageTitleService,
                private _pageRefresh: PageRefreshService,
                private _toastsService: ToastsService,
                private _modalService: ModalService) {
    }

    ngOnInit() {
        this._route.queryParams.subscribe(params => {
            this.params = this._route.snapshot.data;
        });
    }

    onResponse(form: FormSettings, response: any | ErrorResponse): void {
        console.log('ON RESPONSE');
        console.log(response);
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
            case 'inline': {
                if (response.hasOwnProperty('error')) {
                    const index = UtilsService.containsObject(form, this.params.forms);
                    if (index !== -1) {
                        this.params.forms[index].errors = ['An error occurred'];
                    }
                } else {
                    this._toastsService.success();
                    if (form.submit.redirectAfter) {
                        this._router.navigate(['panel/' + form.submit.redirectAfter]);
                    }
                }
            }
                break;
            case 'alert': {
                // TODO: future support
            }
                break;
            default: {
                console.log(response);
                if (response.hasOwnProperty('error')) {
                    this._toastsService.error(response['error']);
                } else {
                    this._toastsService.success();
                    if (form.submit.redirectAfter) {
                        this._router.navigate(['panel/' + form.submit.redirectAfter]);
                    }
                }
            }
                break;
        }
    }
}

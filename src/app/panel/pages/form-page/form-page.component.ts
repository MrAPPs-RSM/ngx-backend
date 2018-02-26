import {Component, OnInit, ViewEncapsulation, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PageTitleService} from '../../services/page-title.service';
import {PageRefreshService} from '../../../services/page-refresh.service';
import {ToastrService} from 'ngx-toastr';
import {HttpErrorResponse} from '@angular/common/http';
import {FormSettings} from '../../components/form/interfaces/form-settings';
import {ModalService} from '../../services/modal.service';
import {UtilsService} from "../../../services/utils.service";

@Component({
    selector: 'app-form-page',
    templateUrl: './form-page.component.html',
    styleUrls: ['./form-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FormPageComponent implements OnInit, OnDestroy {

    private params: {
        forms?: FormSettings[]
    };

    constructor(private _router: Router,
                private _route: ActivatedRoute,
                private _pageTitle: PageTitleService,
                private _pageRefresh: PageRefreshService,
                private _toastService: ToastrService,
                private _modalService: ModalService) {
    }

    ngOnInit() {
        this.params = this._route.snapshot.data;
        this._pageTitle.set(this._route);
    }

    ngOnDestroy() {
        this._pageRefresh.setLastPath(this._router.url);
    }

    onResponse(form: FormSettings, response: any | HttpErrorResponse): void {
        switch (form.responseType) {
            case 'terminal': {

            }
                break;
            case 'inline': {
                if (response instanceof HttpErrorResponse) {
                    const index = UtilsService.containsObject(form, this.params.forms);
                    if (index !== -1) {
                        this.params.forms[index].errors = ['An error occurred'];
                    }
                } else {
                    this._toastService.success('Operation completed', 'Success');
                    if (form.submit.redirectAfter) {
                        this._router.navigate(['panel/' + form.submit.redirectAfter]);
                    }
                }
            }
                break;
            case 'alert': {
                if (response instanceof HttpErrorResponse) {
                    // TODO: create HTML structure of errors
                    this._modalService.alert();
                } else {
                    this._modalService.alert();
                }
            }
                break;
            default: {
                if (response instanceof HttpErrorResponse) {
                    this._toastService.error(response.error.message, 'Error');
                } else {
                    this._toastService.success('Operation completed', 'Success');
                    if (form.submit.redirectAfter) {
                        this._router.navigate(['panel/' + form.submit.redirectAfter]);
                    }
                }
            }
                break;
        }
    }
}

import {Component, OnInit, ViewEncapsulation, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PageTitleService} from '../../services/page-title.service';
import {PageRefreshService} from '../../../services/page-refresh.service';
import {ToastrService} from 'ngx-toastr';
import {FormConfiguration} from '../../components/form/form.component';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
    selector: 'app-form-page',
    templateUrl: './form-page.component.html',
    styleUrls: ['./form-page.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FormPageComponent implements OnInit, OnDestroy {

    private params: any; // Setup params

    constructor(private _router: Router,
                private _route: ActivatedRoute,
                private _pageTitle: PageTitleService,
                private _pageRefresh: PageRefreshService,
                private _toastService: ToastrService) {
    }

    ngOnInit() {
        this.params = this._route.snapshot.data;
        this._pageTitle.set(this._route);
    }

    ngOnDestroy() {
        this._pageRefresh.setLastPath(this._router.url);
    }

    onResponse(form: FormConfiguration, response: any | HttpErrorResponse): void {
        if (response instanceof HttpErrorResponse) {
            this._toastService.error(response.error.message, 'Error');
        } else {
            this._toastService.success('Operation completed', 'Success');
        }
    }
}

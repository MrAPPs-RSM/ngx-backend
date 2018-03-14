import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {GlobalState} from '../../../global.state';
import 'rxjs/add/operator/filter';
import {Router} from '@angular/router';
import {MenuService} from '../../services/menu.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-content-top',
    templateUrl: './content-top.component.html',
    styleUrls: ['./content-top.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ContentTopComponent implements OnInit,OnDestroy {

    private activePage: string;
    private _activePageSub = Subscription.EMPTY;

    constructor(private _state: GlobalState,
                private _router: Router,
                private _menuService: MenuService) {
    }

    ngOnInit() {
      this._activePageSub = this._state._activePageSubject.subscribe( (activeLink) => {

            // console.log("ACTIVE LINK: "+JSON.stringify(activeLink));
            if (activeLink) {
                  this.activePage = activeLink.url;
            }
        });
    }

    ngOnDestroy() {
        this._activePageSub.unsubscribe();
    }

    getBreadcrumbs() {
        return this._menuService.breadcrumbs;
    }


    navigateTo(activeLink: any) {
        this._router.navigateByUrl(activeLink.url);
    }
}

import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {GlobalState} from '../../../global.state';
import 'rxjs/add/operator/filter';
import {Router} from '@angular/router';
import {MenuService} from '../../services/menu.service';

@Component({
    selector: 'app-content-top',
    templateUrl: './content-top.component.html',
    styleUrls: ['./content-top.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ContentTopComponent implements OnInit {

    private activePage: string;

    constructor(private _state: GlobalState,
                private _router: Router,
                private _menuService: MenuService) {
    }

    ngOnInit() {

        this._state.subscribe('activePage', (activeLink) => {
             // console.log("ACTIVE LINK: "+JSON.stringify(activeLink));
            if (activeLink) {
                this.activePage = activeLink.url;
                if (this.isResetNeeded(activeLink)) {
                    this._menuService.breadcrumbs = [activeLink];
                } else {
                    let found = false;

                    for (let i = this._menuService.breadcrumbs.length; i--;) {
                        const breadcrumb = this._menuService.breadcrumbs[i];

                        if (breadcrumb.route === activeLink.route && breadcrumb.params === activeLink.params) {
                            found = true;
                            this._menuService.breadcrumbs.splice(i + 1);
                            return;
                        }
                    }

                    if (!found) {
                        this._menuService.breadcrumbs.push(activeLink);
                    }
                }
            }
        });
    }

    getBreadcrumbs() {
        return this._menuService.breadcrumbs;
    }

    private hasSameParentPath(activeLink: any): boolean {

        if (this._menuService.breadcrumbs.length === 0) {
            return false;
        }

        const currentParent = this._menuService.breadcrumbs[0].route.split('/')[2];
        const newParent = activeLink.route.split('/')[2];

        return currentParent === newParent;
    }

    private breadcrumbAlreadyIn(activeLink: any): boolean {

        for (const breadcrumb of this._menuService.breadcrumbs) {
            if (breadcrumb.route === activeLink.route) {
               // console.log(breadcrumb.route);
               // console.log(activeLink.route);
                return true;
            }
        }

        return false;
    }


    private isResetNeeded(activeLink: any): boolean {

        return (activeLink.breadcrumbLevel === 1
            && !(this.breadcrumbAlreadyIn(activeLink))
            && this.hasSameParentPath(activeLink))
            || !this.hasSameParentPath(activeLink);
    }

    navigateTo(activeLink: any) {
        this._router.navigateByUrl(activeLink.url);
    }
}

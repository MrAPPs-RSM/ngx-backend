import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {GlobalState} from '../../../global.state';
import 'rxjs/add/operator/filter';
import {Router} from '@angular/router';

@Component({
    selector: 'app-content-top',
    templateUrl: './content-top.component.html',
    styleUrls: ['./content-top.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ContentTopComponent implements OnInit {

    private activePage: string;
    breadcrumbs: any[] = [];

    constructor(private _state: GlobalState,
                private _router: Router) {
    }

    ngOnInit() {

        this._state.subscribe('activePage', (activeLink) => {
            // console.log(JSON.stringify(activeLink));
            if (activeLink) {
                this.activePage = activeLink.title;
                if (this.isResetNeeded(activeLink)) {
                    this.breadcrumbs = [activeLink];
                } else {
                    let found = false;

                    for (let i = this.breadcrumbs.length; i--;) {
                        const breadcrumb = this.breadcrumbs[i];

                        if (breadcrumb.route === activeLink.route && breadcrumb.params === activeLink.params) {
                            found = true;
                            this.breadcrumbs.splice(i + 1);
                            return;
                        }
                    }

                    if (!found) {
                        this.breadcrumbs.push(activeLink);
                    }
                }
            }
        });
    }

    private hasSameParentPath(activeLink: any): boolean {

        if (this.breadcrumbs.length === 0) {
            return false;
        }

        const currentParent = this.breadcrumbs[0].route.split('/')[2];
        const newParent = activeLink.route.split('/')[2];

        return currentParent === newParent;
    }

    private breadcrumbAlreadyIn(activeLink: any): boolean {

        for (const breadcrumb of this.breadcrumbs) {
            if (breadcrumb.route === activeLink.route && breadcrumb.params === activeLink.params) {
                return true;
            }
        }

        return false;
    }

    private isResetNeeded(activeLink: any): boolean {
        return (activeLink.breadcrumbLevel === 1 && !this.breadcrumbAlreadyIn(activeLink)) || !this.hasSameParentPath(activeLink);
    }

    navigateTo(activeLink: any) {
        this._router.navigate([activeLink.route.split('?')[0]], { queryParams: JSON.parse(activeLink.params) });
    }
}

import {Component, ViewEncapsulation, ChangeDetectionStrategy} from '@angular/core';

import {Router} from '@angular/router';
import {MenuService} from '../../services/menu.service';

@Component({
    selector: 'app-content-top',
    templateUrl: './content-top.component.html',
    styleUrls: ['./content-top.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ContentTopComponent {

    constructor(private _router: Router,
                private _menuService: MenuService) {
    }

    getBreadcrumbs() {
        return this._menuService.breadcrumbs;
    }

    isActive(item: any): boolean {
        const normalize = (url: string): string => {
            const path = decodeURIComponent((url || '').split('?')[0]);
            return path.length > 1 ? path.replace(/\/$/, '') : path;
        };

        return normalize(item.url) === normalize(this._router.url);
    }


    navigateTo(activeLink: any) {
        this._router.navigateByUrl(activeLink.url);
    }
}

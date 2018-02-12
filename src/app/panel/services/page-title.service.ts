import {Injectable} from '@angular/core';
import {GlobalState} from '../../global.state';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable()
export class PageTitleService {

    constructor(protected _state: GlobalState,
                protected _router: Router) {
    }

    public set(route?: ActivatedRoute | string): void {
        if (route instanceof ActivatedRoute) {
            const urlParams = route.snapshot.params;
            let title = route.snapshot.data['menu'].title;
            if (urlParams) {
                if (urlParams['title']) {
                    title += ' ' + urlParams['title'];
                } else if (urlParams['id']) {
                    title += ' ' + urlParams['id'];
                }
            }
            const activeLink = {
                title: title,
                route: this._router.url,
                breadcrumbLevel: route.snapshot.data['menu'].breadcrumbLevel
            };
            this._state.notifyDataChanged('activePage', activeLink);
        } else {
            this._state.notifyDataChanged('activePage', {title: route});
        }
    }
}

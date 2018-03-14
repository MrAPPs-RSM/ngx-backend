import {Injectable} from '@angular/core';
import {GlobalState} from '../../global.state';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable()
export class PageTitleService {

    constructor(protected _state: GlobalState,
                protected _router: Router) {
    }

    public set(route?: ActivatedRoute | string): void {

        console.log(route);

        if (route instanceof ActivatedRoute) {

            if ('menu' in route.snapshot.data) {
                let title = 'title' in route.snapshot.data['menu'] ? route.snapshot.data['menu'].title : '';
                const urlParams = route.snapshot.params;

                if (urlParams) {
                    if (urlParams['title']) {
                        title += ' ' + urlParams['title'];
                    } else if (urlParams['id']) {
                        title += ' ' + urlParams['id'];
                    }
                }

                const activeLink = {
                    title: decodeURIComponent(title),
                    route: this._router.url.split('?')[0],
                    url: this._router.url,
                    params: JSON.stringify(route.snapshot.queryParams),
                    breadcrumbLevel: route.snapshot.data['menu'].breadcrumbLevel
                };
                this._state._activePageSubject.next(activeLink);
            }
        } else {
            this._state._activePageSubject.next({
                title: route,
                route: this._router.url.split('?')[0],
                url: this._router.url,
                params: '',
                breadcrumbLevel: 1
            });
        }
    }
}

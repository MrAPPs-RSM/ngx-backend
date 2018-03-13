import {Injectable} from '@angular/core';
import {UtilsService} from '../../services/utils.service';
import {Router} from '@angular/router';

@Injectable()
export class MenuService {

    private menu = [];
    breadcrumbs: any[] = [];

    constructor(private _router: Router) {
    }


    private remapMenu(data: any): any[] {
        let menu = [];

        for (const item of ('pages' in data) ? data.pages : data) {
            if ('type' in item) {
                // Is a component
                if (item.type === 'group') {
                    if (item.params.menu.sidebar) {
                        if ('children' in item) {
                            if (item.params.menu) {
                                item.params.menu['children'] = this.remapMenu(item.children);
                                menu.push(item.params.menu);
                            }
                        }
                    }
                } else {
                    if (item.params.menu) {
                        if (item.params.menu.sidebar === true) {
                            item.params.menu.path = item.path;
                            menu.push(item.params.menu);
                        }
                    }
                }
            } else if ('children' in item) {
                menu = menu.concat(this.remapMenu(item.children));
            }
        }

        return menu;
    }

    public prepareMenu(data: any): void {
        const menu = this.remapMenu(data);
        this.menu = UtilsService.sortByKey(menu, 'order');
    }

    public getMenu(): any[] {
        return this.menu;
    }

    public canGoBack(): boolean{
        return this.breadcrumbs.length > 1;
    }

    public goBack(): boolean {
        if (this.canGoBack()) {
            this._router.navigateByUrl(this.breadcrumbs[this.breadcrumbs.length - 2].url);
            return true;
        } else {
           return false;
        }
    }
}

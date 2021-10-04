import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import * as _ from 'lodash';
import { MenuService } from '../panel/services/menu.service';

@Injectable()
export class PageRefreshService {

    private key = 'last_path';
    private breadCrumbKey = 'breadcrumb'

    constructor(protected _router: Router, private _menuService: MenuService) {
    }

    public setLastPath(path: string): void {
        localStorage.setItem(this.key, path);
    }

    public getLastPath(): string {
        return localStorage.getItem(this.key);
    }

    public renavigate(): void {
        this._router.navigateByUrl(localStorage.getItem(this.key));
    }

    public reset(): void {
        localStorage.removeItem(this.key);
    }

    public setBreadcrumb() : void {
        let breadcrumb = this.loadBreadcrumbfromLocalStorage();
        if (!_.isNil(breadcrumb) && breadcrumb.length !==0) {
            this._menuService.breadcrumbs = breadcrumb
        } 
    }

    loadBreadcrumbfromLocalStorage() : any[]{
        let data = localStorage.getItem(this.breadCrumbKey);
        return JSON.parse(data);
      }
}

import { from as observableFrom, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { Route } from '@angular/router';
import { DashboardPageComponent } from '../pages/dashboard-page/dashboard-page.component';
import { TablePageComponent } from '../pages/table-page/table-page.component';
import { FormPageComponent } from '../pages/form-page/form-page.component';
import { ProfilePageComponent } from '../pages/profile-page/profile-page.component';
import { LanguageService } from './language.service';
import { MenuService } from './menu.service';
import { NotfoundPageComponent } from '../pages/notfound-page/notfound-page.component';
import {CalendarPageComponent} from '../pages/calendar-page/calendar-page.component';
import { PendingChangesGuard } from '../../auth/guards/pending-changes.guard';
import { TicketDetailPageComponent } from '../pages/ticket-detail-page/ticket-detail-page.component';
import { PanelSetupStateService } from '../../services/panel-setup-state.service';


const TYPES = {
  profile: ProfilePageComponent,
  dashboard: DashboardPageComponent,
  ticketDetail: TicketDetailPageComponent,
  table: TablePageComponent,
  form: FormPageComponent,
  calendar: CalendarPageComponent
};

@Injectable()
export class SetupService {

  constructor(private _menuService: MenuService,
    private _apiService: ApiService,
    private _languageService: LanguageService,
    private _setupState: PanelSetupStateService) {
  }

  public setup(panelRoute: Route): Observable<any> {
    const promise = new Promise<void>((resolve, reject) => {

      if (this._setupState.lastRouteLoading == null || Date.now() - this._setupState.lastRouteLoading.getTime() > 10000) {
        this._apiService.setup()
          .then((data) => {
            this._setupState.lastRouteLoading = new Date();

            if ('contentLanguages' in data) {
              this._languageService.setContentLanguages(data['contentLanguages']);
            }

            this.loadRoutes(data, panelRoute);
            this._menuService.prepareMenu(data);
            resolve();
         })
          .catch((error) => {
            this._setupState.reset();
            reject();
          });
      } else {
        // console.log("SALTO CARICAMENTO ROTTE...");
        resolve();
      }
    });

    return observableFrom(promise);
  }

  private remapRoutesData(data: any): Array<any> {
    let routes = [];

    if ('pages' in data) {
      routes = routes.concat(this.remapRoutesData(data.pages));
    } else {
      for (const item of data) {
        if ('children' in item) {
          routes = routes.concat(this.remapRoutesData(item.children));
        } else {
          routes.push(item);
        }
      }
    }
    return routes;
  }

  private loadRoutes(data: any, panelRoute: Route): void {
    const routes = [{ path: '404', component: NotfoundPageComponent }];
    this._setupState.defaultRoute = null;

    for (const item of this.remapRoutesData(data)) {
      if (item.type in TYPES) {
        const route = {
          path: item.path,
          component: TYPES[item.type],
          data: item.params
        };

        if (item.type === 'form') {
          route['canDeactivate'] = [PendingChangesGuard];
        }

        if (this._setupState.defaultRoute == null && item.params && item.params.isHomePage) {
          this._setupState.defaultRoute = item.path;
        }

        routes.push(route);
      }
    }

    panelRoute.children = routes;
  }

}

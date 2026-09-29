import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class PanelSetupStateService {
  lastRouteLoading: Date;
  defaultRoute: string;

  reset(): void {
    this.lastRouteLoading = null;
    this.defaultRoute = null;
  }
}

import { TestBed, inject } from '@angular/core/testing';

import { SetupService } from './setup.service';
import { firstValueFrom } from 'rxjs';

describe('SetupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SetupService]
    });
  });

  it('should be created', inject([SetupService], (service: SetupService) => {
    expect(service).toBeTruthy();
  }));

  it('should install backend routes on the lazy panel route', async () => {
    const menuService = jasmine.createSpyObj('MenuService', ['prepareMenu']);
    const apiService = jasmine.createSpyObj('ApiService', ['setup']);
    const languageService = jasmine.createSpyObj('LanguageService', ['setContentLanguages']);
    const setupState: any = {
      lastRouteLoading: null,
      defaultRoute: null,
      reset: () => {
        setupState.lastRouteLoading = null;
        setupState.defaultRoute = null;
      }
    };
    const data = {
      pages: [
        {type: 'dashboard', path: 'dashboard', params: {isHomePage: true}},
        {type: 'form', path: 'articles/:id', params: {}}
      ]
    };
    const panelRoute: any = {path: '', children: [{path: '**'}]};

    apiService.setup.and.returnValue(Promise.resolve(data));

    const service = new SetupService(menuService, apiService, languageService, setupState);
    await firstValueFrom(service.setup(panelRoute));

    expect(panelRoute.children.map(route => route.path)).toEqual(['404', 'dashboard', 'articles/:id']);
    expect(panelRoute.children[2].canDeactivate).toBeDefined();
    expect(setupState.defaultRoute).toBe('dashboard');
    expect(menuService.prepareMenu).toHaveBeenCalledWith(data);
  });
});

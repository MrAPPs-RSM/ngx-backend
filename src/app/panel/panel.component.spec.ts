import { TestBed, waitForAsync } from '@angular/core/testing';

import { PanelComponent } from './panel.component';
import { NEVER } from 'rxjs';

describe('PanelComponent', () => {
  let component: PanelComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [PanelComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(PanelComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect a direct panel visit to the configured home page', () => {
    const router: any = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);
    const userService: any = jasmine.createSpyObj('UserService', ['getUser']);
    const storageService: any = jasmine.createSpyObj('StorageService', ['getValue']);
    const languageService: any = jasmine.createSpyObj(
      'LanguageService',
      ['getCurrentLang', 'setCurrentLang', 'setDatePickerLocale']
    );
    const pageRefresh: any = jasmine.createSpyObj('PageRefreshService', ['reset']);
    const menuService: any = jasmine.createSpyObj('MenuService', ['getMenu']);
    const route: any = {routeConfig: {children: []}};
    const setupState: any = {defaultRoute: 'products'};

    router.url = '/panel';
    router.events = NEVER;
    router.navigate.and.returnValue(Promise.resolve(true));
    languageService.getCurrentLang.and.returnValue({isoCode: 'it'});
    menuService.getMenu.and.returnValue([]);

    const directVisitComponent = new PanelComponent(
      router,
      userService,
      route,
      storageService,
      languageService,
      pageRefresh,
      menuService,
      setupState
    );

    directVisitComponent.ngOnInit();

    expect(router.navigate).toHaveBeenCalledWith(['products'], {relativeTo: route});
  });
});

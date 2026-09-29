import { TestBed, waitForAsync } from '@angular/core/testing';

import { FormComponent } from './form.component';

describe('FormComponent', () => {
  let component: FormComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [FormComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(FormComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should replace every redirect placeholder with the encoded response value', () => {
    component.settings = {
      submit: {redirectAfter: 'items/:id/details/:title'},
      fields: {}
    } as any;

    const path = (component as any).buildRedirectPath({id: 42, title: 'Titolo con spazi'});

    expect(path).toBe('items/42/details/Titolo%20con%20spazi');
  });

  it('should use a safe fallback for missing redirect values', () => {
    component.settings = {
      submit: {redirectAfter: 'items/:id/details/:title'},
      fields: {}
    } as any;

    const path = (component as any).buildRedirectPath({id: 42});

    expect(path).toBe('items/42/details/---');
  });

  it('should append an encoded list filter to a redirect', () => {
    component.settings = {
      submit: {
        redirectAfter: 'items/:id?tab=children',
        redirectAfterFilterKey: 'parent_id'
      },
      fields: {}
    } as any;

    const path = (component as any).buildRedirectPath({id: 42, parent_id: 7});
    const encodedFilter = encodeURIComponent(JSON.stringify({where: {parent_id: 7}}));

    expect(path).toBe(`items/42?tab=children&listParams=${encodedFilter}`);
  });

  it('should keep the redirect guard active while emitting the create response', () => {
    component.settings = {
      submit: {redirectAfter: 'items/:id'},
      fields: {}
    } as any;
    const apiService = (component as any)._apiService;
    const router = (component as any)._router;
    let redirectingWhileEmitting = false;
    component.response.subscribe(() => redirectingWhileEmitting = apiService.isRedirecting);
    spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve(true));

    component.postCreateResponse({id: 42});

    expect(redirectingWhileEmitting).toBe(true);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/panel/items/42');
    expect(apiService.isRedirecting).toBe(false);
  });
});

import { TestBed, waitForAsync } from '@angular/core/testing';

import { SelectComponent } from './select.component';
import {UntypedFormControl, UntypedFormGroup} from '@angular/forms';

describe('SelectComponent', () => {
  let component: SelectComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [SelectComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(SelectComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should normalize object dependency values to their id', () => {
    expect((component as any).normalizeDependencyValue({id: 12, text: 'Twelve'})).toBe(12);
    expect((component as any).normalizeDependencyValue([{id: 1}, {id: 2}])).toEqual([1, 2]);
  });

  it('should update a dependency condition without creating duplicates', () => {
    (component as any).params = {where: {and: []}};

    (component as any).updateDependencyCondition('parent_id', {id: 3});
    (component as any).updateDependencyCondition('parent_id', {id: 4});

    expect((component as any).params.where.and).toEqual([{parent_id: 4}]);
  });

  it('should preserve zero and remove empty dependency values', () => {
    (component as any).params = {where: {and: []}};

    (component as any).updateDependencyCondition('level', 0);
    expect((component as any).params.where.and).toEqual([{level: 0}]);

    (component as any).updateDependencyCondition('level', '');
    expect((component as any).params.where.and).toEqual([]);
  });

  it('should listen to each configured dependency', () => {
    component.field = {key: 'child_id', dependsOn: ['parent_id', 'type_id']} as any;
    component.form = new UntypedFormGroup({
      child_id: new UntypedFormControl(null),
      parent_id: new UntypedFormControl(1),
      type_id: new UntypedFormControl(2)
    });
    (component as any).params = {where: {and: []}};
    spyOn<any>(component, 'reloadDependentOptions');

    (component as any).setupDependencies();
    component.form.get('parent_id').setValue(10);
    component.form.get('type_id').setValue(20);

    expect((component as any).params.where.and).toEqual([{parent_id: 10}, {type_id: 20}]);
    expect((component as any).reloadDependentOptions).toHaveBeenCalledTimes(2);
    component.ngOnDestroy();
  });
});

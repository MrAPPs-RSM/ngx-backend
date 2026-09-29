import { TestBed, waitForAsync } from '@angular/core/testing';

import {Select2Component} from './select-2.component';

describe('Select2Component', () => {
    let component: Select2Component;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({ providers: [Select2Component] })
            .compileComponents();
    }));

    beforeEach(() => {
        component = TestBed.inject(Select2Component);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should replace selected values instead of accumulating duplicates', () => {
        component.options = [{id: 1, text: 'One'}, {id: 2, text: 'Two'}];

        (component as any).updateSelectedOptions([{id: 1}]);
        (component as any).updateSelectedOptions([{id: 2}]);

        expect(component.selected).toEqual([{id: 2, text: 'Two'}]);
    });

    it('should normalize dependency objects and arrays to ids', () => {
        expect((component as any).normalizeDependencyValue({id: 7, text: 'Seven'})).toBe(7);
        expect((component as any).normalizeDependencyValue([{id: 7}, {id: 8}])).toEqual([7, 8]);
    });
});

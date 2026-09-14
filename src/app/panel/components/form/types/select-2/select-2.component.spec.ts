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
});

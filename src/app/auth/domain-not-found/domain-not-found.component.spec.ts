import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DomainNotFoundComponent } from './domain-not-found.component';

describe('LoginComponent', () => {
  let component: DomainNotFoundComponent;
  let fixture: ComponentFixture<DomainNotFoundComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DomainNotFoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

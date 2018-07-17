import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainNotFoundComponent } from './domain-not-found.component';

describe('LoginComponent', () => {
  let component: DomainNotFoundComponent;
  let fixture: ComponentFixture<DomainNotFoundComponent>;

  beforeEach(async(() => {
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

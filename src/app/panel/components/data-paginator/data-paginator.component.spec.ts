import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPaginatorComponent } from './data-paginator.component';

describe('DataPaginatorComponent', () => {
  let component: DataPaginatorComponent;
  let fixture: ComponentFixture<DataPaginatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataPaginatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

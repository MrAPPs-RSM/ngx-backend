import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloudinaryLibraryComponent } from './cloudinary-library.component';

describe('CloudinaryLibraryComponent', () => {
  let component: CloudinaryLibraryComponent;
  let fixture: ComponentFixture<CloudinaryLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloudinaryLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloudinaryLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

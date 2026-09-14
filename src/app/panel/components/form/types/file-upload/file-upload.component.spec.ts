import { TestBed, waitForAsync } from '@angular/core/testing';

import { FileUploadComponent } from './file-upload.component';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [FileUploadComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(FileUploadComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

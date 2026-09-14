import { TestBed, waitForAsync } from '@angular/core/testing';

import { FileUploaderComponent } from './file-uploader.component';

describe('FileUploaderComponent', () => {
  let component: FileUploaderComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ providers: [FileUploaderComponent] })
    .compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.inject(FileUploaderComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

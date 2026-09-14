// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { AppModule } from './app/app.module';
import { ChangeDetectorRef, Renderer2 } from '@angular/core';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(), {
    teardown: { destroyAfterEach: false }
}
);

// Most legacy specs are shallow creation tests. Load the real application
// module before each one so Angular resolves the same providers, directives,
// pipes and child components used at runtime.
beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [AppModule],
    providers: [
      {
        provide: ChangeDetectorRef,
        useValue: {
          detectChanges: () => undefined,
          markForCheck: () => undefined
        }
      },
      {
        provide: Renderer2,
        useValue: {}
      }
    ]
  });
});

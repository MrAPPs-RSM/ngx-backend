import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from './modules/ng2-smart-table/ng2-smart-table.module';
import { PipesModule } from '../pipes/pipes.module';

import { PanelComponent } from './panel.component';
import { FormPageComponent } from './pages/form-page/form-page.component';
import { TablePageComponent } from './pages/table-page/table-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { NotfoundPageComponent } from './pages/notfound-page/notfound-page.component';

import { AuthGuard } from '../auth/guards/auth.guard';
import { SetupService } from './services/setup.service';
import { PanelResolver } from './resolvers/panel.resolver';
import { TranslatePipe } from '../pipes/translate/translate.pipe';


import { TableComponent } from './components/table/table.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { ContentTopComponent } from './components/content-top/content-top.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TicketDetailPageComponent } from './pages/ticket-detail-page/ticket-detail-page.component';
import { FileUploaderComponent } from './pages/ticket-detail-page/components/file-uploader/file-uploader.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { OwlDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import moment from 'moment';

import { CalendarPageComponent } from './pages/calendar-page/calendar-page.component';
import { BaseLongPollingComponent } from './components/base-long-polling/base-long-polling.component';
import { ModernUploaderDirective } from './directives/modern-uploader.directive';
import { SortableDirective } from './directives/sortable.directive';
import { DynamicFormModule } from './components/form/dynamic-form.module';

export function momentAdapterFactory() {
  return adapterFactory(moment);
};

const COMPONENTS = [
  PanelComponent,
  TableComponent,
  DashboardPageComponent,
  TicketDetailPageComponent,
  FormPageComponent,
  TablePageComponent,
  ContentTopComponent,
  FileUploaderComponent,
  ProfilePageComponent,
  NotfoundPageComponent
];

const PROVIDERS = [
  AuthGuard,
  SetupService,
  PanelResolver,
  TranslatePipe
];


const routes: Routes = [
  {
    path: '',
    canActivate: [
      AuthGuard
    ],
    resolve: {
      params: PanelResolver
    },
    children: [
      {
        path: '**',
        canActivate: [
          AuthGuard
        ],
        resolve: {
          params: PanelResolver
        },
        component: PanelComponent,
        pathMatch: 'full'
      }
    ],
    component: PanelComponent,
    pathMatch: 'prefix'
  }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        FormsModule,
        ScrollingModule,
        MatInputModule,
        MatFormFieldModule,
        OwlDateTimeModule,
        ModernUploaderDirective,
        SortableDirective,
        Ng2SmartTableModule,
        PipesModule,
        CalendarModule.forRoot({ provide: DateAdapter, useFactory: momentAdapterFactory }),
        DynamicFormModule
    ],
    declarations: [
        ...COMPONENTS,
        CalendarPageComponent,
        BaseLongPollingComponent
    ],
    providers: [
        ...PROVIDERS
    ]
})
export class PanelModule {

}

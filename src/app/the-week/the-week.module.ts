import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';

import { TheWeekComponent } from './the-week.component';
import { TheWeekRoutingModule } from './the-week-routing.module';
import { WeekBlankComponent } from './week-blank/week-blank.component';
import { WeekFormComponent } from './week-form/week-form.component';
import { WeekDropdownComponent } from './week-dropdown/week-dropdown.component';
import { WeekDetailComponent } from './week-detail/week-detail.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TheWeekComponent,
    WeekBlankComponent,
    WeekFormComponent,
    WeekDropdownComponent,
    WeekDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TheWeekRoutingModule,
    SharedModule
  ]
})
export class TheWeekModule { }

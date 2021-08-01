import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TheWeekComponent } from './the-week.component';
import { TheWeekGuard } from './the-week.guard';
import { WeekBlankComponent } from './week-blank/week-blank.component';
import { WeekDetailComponent } from './week-detail/week-detail.component';
import { WeekFormComponent } from './week-form/week-form.component';

const theWeekRoutes: Routes = [
  {
    path: '',
    component: TheWeekComponent,
    canActivate: [TheWeekGuard],
    canActivateChild: [TheWeekGuard],
    children: [
      { path: '', pathMatch: 'full', component: WeekBlankComponent },
      { path: 'edit/:id', component: WeekFormComponent },
      { path: ':id', component: WeekDetailComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(theWeekRoutes)],
  exports: [RouterModule]
})
export class TheWeekRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './auth.component';
import { AuthGuard } from './auth.guard';

const authRoutes: Routes = [
  { path: '', pathMatch: 'exact', component: AuthComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}

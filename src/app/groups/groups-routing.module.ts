import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GroupsComponent } from './groups.component';
import { GroupsGuard } from './groups.guard';

const groupRoutes: Routes = [
  { path: '', pathMatch: 'full', canActivate: [GroupsGuard], component: GroupsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(groupRoutes)],
  exports: [RouterModule]
})
export class GroupsRoutingModule {}

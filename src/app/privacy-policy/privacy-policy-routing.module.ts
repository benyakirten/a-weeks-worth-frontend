import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PrivacyPolicyComponent } from './privacy-policy.component';

const privacyPolicyRoutes: Routes = [
  { path: '', pathMatch: 'full', component: PrivacyPolicyComponent}
];

@NgModule({
  imports: [RouterModule.forChild(privacyPolicyRoutes)],
  exports: [RouterModule]
})
export class PrivacyPolicyRoutingModule {}

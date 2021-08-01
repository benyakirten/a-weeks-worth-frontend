import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountComponent } from './account.component';
import { AccountRoutingModule } from './account-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AccountComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AccountRoutingModule,
    SharedModule
  ]
})
export class AccountModule { }

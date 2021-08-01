import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardComponent } from './components/card/card.component';
import { ButtonComponent } from './components/button/button.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ModalComponent } from './components/modal/modal.component';
import { PhotoCardComponent } from './components/photo-card/photo-card.component';
import { DefaultModalComponent } from './components/default-modal/default-modal.component';
import { HoverToolbarComponent } from './components/hover-toolbar/hover-toolbar.component';
import { DefaultHoverToolbarComponent } from './components/default-hover-toolbar/default-hover-toolbar.component';
import { ErrorDisplayComponent } from './components/error-display/error-display.component';
import { DisplayBoxComponent } from './components/display-box/display-box.component';
import { DefaultDisplayBoxComponent } from './components/default-display-box/default-display-box.component';
import { FingerCheckboxComponent } from './components/finger-checkbox/finger-checkbox.component';

@NgModule({
  declarations: [
    ButtonComponent,
    CardComponent,
    LoadingComponent,
    ModalComponent,
    PhotoCardComponent,
    DefaultModalComponent,
    HoverToolbarComponent,
    DefaultHoverToolbarComponent,
    ErrorDisplayComponent,
    DisplayBoxComponent,
    DefaultDisplayBoxComponent,
    FingerCheckboxComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ButtonComponent,
    CardComponent,
    LoadingComponent,
    ModalComponent,
    PhotoCardComponent,
    DefaultModalComponent,
    HoverToolbarComponent,
    DefaultHoverToolbarComponent,
    ErrorDisplayComponent,
    DisplayBoxComponent,
    DefaultDisplayBoxComponent,
    FingerCheckboxComponent
  ]
})
export class SharedModule { }

import { Injectable } from '@angular/core';

import { ModalComponent } from 'src/app/shared/components/modal/modal.component';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modals: Array<ModalComponent> = [];

  add(modal: ModalComponent) {
    this.modals.push(modal);
  }

  remove(id: string) {
    this.modals = this.modals.filter(m => m.id !== id);
  }

  open(id: string) {
    const modal = this.modals.find(m => m.id === id);
    modal?.open();
  }

  close(id: string) {
    const modal = this.modals.find(m => m.id === id);
    modal?.close();
  }
}

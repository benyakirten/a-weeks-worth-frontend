import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import { ModalService } from 'src/app/shared/services/modal/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() id!: string;
  @Input() top: number = 0;

  private element: HTMLElement;

  constructor(private modalService: ModalService, private el: ElementRef<HTMLDivElement>) {
    this.element = this.el.nativeElement;
  }

  ngOnInit(): void {
    if (!this.id) {
      console.error('Modal must have an ID');
      return;
    }

    // I would like animations, but using them makes the element
    // no longer function. I think the reason why is that it's being
    // added directly to the DOM and so doesn't have access to
    // the BrowserAnimationsModule module.
    document.body.appendChild(this.element);
    this.modalService.add(this);
  }

  open() {
    document.body.classList.add('modal-open');
    this.element.style.display = 'block';
  }

  close() {
    document.body.classList.remove('modal-open');
    this.element.style.display = 'none';
  }

  ngOnDestroy(): void {
    this.modalService.remove(this.id);
    this.element.remove();
  }
}

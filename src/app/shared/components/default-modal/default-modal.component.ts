import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-default-modal',
  templateUrl: './default-modal.component.html',
  styleUrls: ['./default-modal.component.scss']
})
export class DefaultModalComponent implements OnInit {
  @Output() close = new EventEmitter();

  @Input() top: number = 0;
  @Input() id!: string;

  @Input() title: string = 'An error occurred';
  @Input() text: string = `
    Who knows what wrent wrong?
    It could be something simple or complicated.
    But the easiest thing to do probably is to contact Ben.
    Or just like, I don't know, reload the page? Or don't
    hack things? It's the most likely reason that you're seeing
    this popup.
  `;
  @Input() buttonCaption: string = 'OK';

  ngOnInit(): void {
    if (!this.id) {
      console.error('Modal must have an ID');
      return;
    }
  }

}

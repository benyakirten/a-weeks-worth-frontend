import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hover-toolbar',
  templateUrl: './hover-toolbar.component.html',
  styleUrls: ['./hover-toolbar.component.scss']
})
export class HoverToolbarComponent {
  @Input() fontSize: string = "1.8rem";
  @Input() width: string = "15rem";
}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-default-hover-toolbar',
  templateUrl: './default-hover-toolbar.component.html',
  styleUrls: ['./default-hover-toolbar.component.scss']
})
export class DefaultHoverToolbarComponent {
  @Input() fontSize: string = "1.8rem";
  @Input() width: string = "15rem";
}

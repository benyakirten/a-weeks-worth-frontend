import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-default-display-box',
  templateUrl: './default-display-box.component.html',
  styleUrls: ['./default-display-box.component.scss']
})
export class DefaultDisplayBoxComponent {
  @Input() rules?: Array<string>;
  @Input() headline?: string;
}

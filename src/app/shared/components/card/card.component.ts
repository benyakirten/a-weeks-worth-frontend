import { Component, Input } from '@angular/core';

import { slideUpFade } from 'src/app/shared/animations/state-animations';

@Component({
  selector: 'app-card',
  animations: [slideUpFade('card', 'shown', 'hidden')],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() background: string = '';
  @Input() showCard: boolean = true;
}

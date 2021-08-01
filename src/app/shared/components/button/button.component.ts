import { Component, Input, OnInit } from '@angular/core';

import { ButtonType, ComponentProps } from 'src/app/types/general';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() warn: boolean = false;
  @Input() disabled: boolean = false;
  @Input() width?: string;
  @Input() height?: string;
  @Input() margin?: string;
  @Input() padding?: string;
  @Input() type: ButtonType = 'button';

  styles: ComponentProps = {}

  ngOnInit() {
    this.styles = {
      width: this.width,
      height: this.height,
      margin: this.margin,
      padding: this.padding
    }
  }
}

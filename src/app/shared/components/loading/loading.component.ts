import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  @Input() size: string = '2rem';
  circleSize: string = '8px';

  ngOnInit(): void {
    const matched = this.size.match(/(\d+\.?\d?)(\w+)/);
    if (!matched || matched.length < 3) {
      console.error('Size must be able to be parsed by the regex /(\d+\.?\d?)(\w+)/');
      return;
    }
    // matched = [size, quantity, unit]
    const quantity = +matched![1] * 0.2;
    this.circleSize = quantity.toString() + matched[2];
  }
}

import {
  Component,
  OnInit,
  Input
} from '@angular/core';

@Component({
  selector: 'finger-checkbox',
  templateUrl: './finger-checkbox.component.html',
  styleUrls: ['./finger-checkbox.component.scss']
})
export class FingerCheckboxComponent implements OnInit {
  @Input() id?: string;
  @Input() checked?: boolean;

  ngOnInit(): void {
    if (!this.id) {
      console.error("ID is a required parameter for the checkbox")
    }
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-week-blank',
  template: `
    <h3>
      No group has been selected yet.
      Please select one from the dropdown menu
      or look at your own week's plans.
    </h3>
  `,
  styles: ['h3 { width: 60%; margin: 0 auto }']
})
export class WeekBlankComponent {}

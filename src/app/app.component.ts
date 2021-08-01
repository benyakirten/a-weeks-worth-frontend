import { Component, OnDestroy, OnInit } from '@angular/core';

import { AuthService } from './shared/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    const refreshToken = localStorage.getItem('AWW_refresh');
    if (refreshToken) this.authService.refreshToken(refreshToken);
  }

  ngOnDestroy(): void {
    // Why not?
    this.authService.cancelTimeout();
  }
}

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromApp from 'src/app/store/app.reducer';

import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  authSub?: Subscription;
  storeSub?: Subscription;

  loading: boolean = false;
  loggedIn: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.authSub = this.authService.isLoggedIn
      .subscribe(loggedIn => this.loggedIn = loggedIn);
    this.storeSub = this.store.select('auth')
      .pipe(map(authState => authState.loading))
      .subscribe(loading => this.loading = loading);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
    this.storeSub?.unsubscribe();
  }
}

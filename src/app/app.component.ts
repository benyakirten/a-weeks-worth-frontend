import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import * as fromApp from 'src/app/store/app.reducer';
import * as AuthActions from 'src/app/store/auth/auth.actions';

import { AuthService } from './shared/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.store.dispatch(AuthActions.setLoading({ loading: true }));
    const refreshToken = localStorage.getItem('AWW_refresh');
    if (refreshToken) this.authService.refreshToken(refreshToken);
    else this.store.dispatch(AuthActions.setLoading({ loading: false }));
  }

  ngOnDestroy(): void {
    // Why not?
    this.authService.cancelTimeout();
  }
}

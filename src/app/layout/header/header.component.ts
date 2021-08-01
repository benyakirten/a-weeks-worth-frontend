import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import * as fromApp from 'src/app/store/app.reducer';

import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  storeSub?: Subscription;
  loggedIn: boolean = false;

  constructor(
    private store: Store<fromApp.AppState>,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.storeSub = this.store.select('auth')
      .pipe(map(authState => !!authState.user))
      .subscribe(loggedIn => this.loggedIn = loggedIn)
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  ngOnDestroy(): void {
    this.storeSub?.unsubscribe();
  }
}

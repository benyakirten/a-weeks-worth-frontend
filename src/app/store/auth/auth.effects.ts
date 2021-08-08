import { Injectable } from "@angular/core";

import { Actions, createEffect, ofType } from "@ngrx/effects";
import { tap } from 'rxjs/operators';

import * as AuthActions from './auth.actions';
import { AuthService } from "src/app/shared/services/auth/auth.service";

import { User } from "src/app/shared/classes/user/user";

import { twoHoursFromNow } from "src/app/utils/date";
import { MILLISECONDS_IN_A_MINUTE, MILLISECONDS_IN_TWO_HOURS } from "src/app/utils/constants";

const setStorageAndTimeout = (user: User, authService: AuthService) => {
  localStorage.setItem('AWW_email', user.email);
  localStorage.setItem('AWW_username', user.username);
  localStorage.setItem('AWW_token', user.token);
  localStorage.setItem('AWW_refresh', user.refreshToken);
  localStorage.setItem('AWW_expiration', JSON.stringify(twoHoursFromNow()));
  localStorage.setItem('AWW_verified', JSON.stringify(user.verified));
  authService.timeout = setTimeout(() => {
    authService.refreshToken(user.refreshToken);
  }, MILLISECONDS_IN_TWO_HOURS - MILLISECONDS_IN_A_MINUTE );
}

const removeStorage = (authService: AuthService) => {
  localStorage.removeItem('AWW_email');
  localStorage.removeItem('AWW_username');
  localStorage.removeItem('AWW_token');
  localStorage.removeItem('AWW_refresh');
  localStorage.removeItem('AWW_expiration');
  localStorage.removeItem('AWW_verified');
  authService.cancelTimeout();
}

@Injectable()
export class AuthEffects {
  authLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      tap(user => setStorageAndTimeout(user.user, this.authService))
    ), { dispatch: false }
  );

  authLogout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => removeStorage(this.authService))
    ), { dispatch: false }
  );

  authVerifyEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.verifyEmail),
      tap(() => localStorage.setItem('AWW_verified', JSON.stringify(true)))
    ), { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService
  ) {}
}

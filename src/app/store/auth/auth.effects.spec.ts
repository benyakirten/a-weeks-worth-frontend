import { TestBed } from '@angular/core/testing';

import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';

import { AuthEffects } from './auth.effects';
import { User } from 'src/app/shared/classes/user/user';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { twoHoursFromNow } from 'src/app/utils/date';
import { State } from './auth.reducer';

describe('AuthEffects', () => {
  const user = new User('test@test.com', 'testymctestface', 'testtoken', 'testrefreshtoken', true);
  let authService: AuthService;
  let actions$ = new Observable<Action>();
  let metadata: EffectsMetadata<AuthEffects>;
  let effects: AuthEffects;

  const initialState: State = {
    user,
    error: undefined,
    loading: false
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        AuthService,
        provideMockActions(() => actions$),
        provideMockStore({ initialState }),
      ],
    });
    authService = TestBed.inject(AuthService);
    effects = TestBed.inject(AuthEffects);
    metadata = getEffectsMetadata(effects);
  });

  afterEach(() => {
    localStorage.removeItem('AWW_email');
    localStorage.removeItem('AWW_username');
    localStorage.removeItem('AWW_token');
    localStorage.removeItem('AWW_refresh');
    localStorage.removeItem('AWW_expiration');
    localStorage.removeItem('AWW_verified');
  })

  describe('Effect of AuthActions.Login', () => {
    it('should not dispatch', () => {
      expect(metadata.authLogin$?.dispatch).toEqual(false);
    });

    it('sets the AWW_ local storage items and sets the timeout on the AuthService', () => {
      actions$ = of({ type: '[Auth] Login', user });

      expect(authService.timeout).toBeUndefined();
      effects.authLogin$.subscribe();
      expect(authService.timeout).toBeDefined();

      expect(localStorage.getItem('AWW_email')).toEqual(user.email);
      expect(localStorage.getItem('AWW_username')).toEqual(user.username);
      expect(localStorage.getItem('AWW_token')).toEqual(user.token);
      expect(localStorage.getItem('AWW_refresh')).toEqual(user.refreshToken);
      expect(+localStorage.getItem('AWW_expiration')!).toBeLessThanOrEqual((twoHoursFromNow()));
      expect(+localStorage.getItem('AWW_expiration')!).toBeGreaterThanOrEqual((twoHoursFromNow() - 100));
      expect(localStorage.getItem('AWW_verified')).toEqual(JSON.stringify(user.verified));
    })
  });

  describe('Effect of AuthActions.Logout', () => {
    it('should not dispatch', () => {
      expect(metadata.authLogout$?.dispatch).toEqual(false);
    })

    it('clears out the AWW_ local storage items and cancels the timeout on the AuthService', () => {
      authService.timeout = 53;
      actions$ = of({ type: '[Auth] Logout'});
      localStorage.setItem('AWW_email', 'test@test.com');
      localStorage.setItem('AWW_username', 'testymctestface');
      localStorage.setItem('AWW_token', 'testtoken');
      localStorage.setItem('AWW_refresh', 'testrefreshtoken');
      localStorage.setItem('AWW_expiration', JSON.stringify(twoHoursFromNow()));
      localStorage.setItem('AWW_verified', JSON.stringify(true));

      spyOn(authService, 'cancelTimeout');

      effects.authLogout$.subscribe();

      expect(authService.cancelTimeout).toHaveBeenCalled();
      expect(localStorage.getItem('AWW_email')).toEqual(null);
      expect(localStorage.getItem('AWW_username')).toEqual(null);
      expect(localStorage.getItem('AWW_token')).toEqual(null);
      expect(localStorage.getItem('AWW_refresh')).toEqual(null);
      expect(localStorage.getItem('AWW_expiration')).toEqual(null);
      expect(localStorage.getItem('AWW_verified')).toEqual(null);
    });
  });

  describe('Effect of AuthActions.verifyEmail', () => {
    it('should not dispatch', () => {
      expect(metadata.authVerifyEmail$?.dispatch).toEqual(false);
    });

    it('should set the AWW_verify local storage item', () => {
      actions$ = of({ type: '[Auth] Verify Email' });
      effects.authVerifyEmail$.subscribe();

      expect(localStorage.getItem('AWW_verified')).toEqual(JSON.stringify(true));
    })
  });
});

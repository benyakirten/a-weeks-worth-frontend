import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { MockStore } from '@ngrx/store/testing';
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';
import { Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromAuth from 'src/app/store/auth/auth.reducer';
import * as AuthActions from 'src/app/store/auth/auth.actions';
import { State } from 'src/app/store/auth/auth.reducer';

import { AuthService } from './auth.service';

import {
  PASSWORD_RESET,
  REFRESH_TOKEN,
  REGISTER,
  RESEND_ACTIVATION_EMAIL,
  SEND_PASSWORD_RESET_EMAIL,
  TOKEN_AUTH,
  UPDATE_DETAILS,
  VERIFY_ACCOUNT
} from 'src/app/shared/graphql/mutations/auth';
import { User } from 'src/app/shared/classes/user/user';
import { MESSAGE_ME } from 'src/app/shared/graphql/mutations/other';

describe('AuthService', () => {
  let service: AuthService;
  let store: MockStore<fromAuth.State>;
  let controller: ApolloTestingController;
  const initialState: State = {
    user: undefined,
    error: undefined,
    loading: false
  }

  const fakeData = {
    token: 'faketoken',
    message: 'test message',
    refreshToken: 'fakerefreshtoken',
    user: {
      email: 'test@test.com',
      username: 'testymctestface',
      password: 'testpassword',
      password2: 'testpassword',
      verified: true
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ApolloTestingModule,
        StoreModule.forRoot({ auth: fromAuth.authReducer})
      ],
      providers: [
        AuthService
      ]
    });
    service = TestBed.inject(AuthService);
    store = TestBed.inject(Store) as MockStore<fromAuth.State>;
    controller = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => {
    controller.verify();
    localStorage.removeItem('AWW_email');
    localStorage.removeItem('AWW_username');
    localStorage.removeItem('AWW_token');
    localStorage.removeItem('AWW_refresh');
    localStorage.removeItem('AWW_expiration');
    localStorage.removeItem('AWW_verified');
  });

  it('the login method should provide an observable with the data property that has email, username, token, refreshtoken and user properties', () => {
    service.login(fakeData.user.email, fakeData.user.password).subscribe(({ data }) => {
      expect(data?.tokenAuth.user.email).toEqual(fakeData.user.email);
      expect(data?.tokenAuth.user.username).toEqual(fakeData.user.username);
      expect(data?.tokenAuth.user.verified).toEqual(fakeData.user.verified);
      expect(data?.tokenAuth.refreshToken).toEqual(fakeData.refreshToken);
      expect(data?.tokenAuth.token).toEqual(fakeData.token);
    });

    const op = controller.expectOne(TOKEN_AUTH);

    expect(op.operation.variables['email']).toEqual(fakeData.user.email);
    expect(op.operation.variables['password']).toEqual(fakeData.user.password);

    op.flush({
      data: {
        tokenAuth: {
          ...fakeData
        }
      }
    });
  });

  it('the register method should provide an observable with the data property that has email, username, token, refreshtoken and user properties', () => {
    service.register(
      fakeData.user.email,
      fakeData.user.username,
      fakeData.user.password,
      fakeData.user.password2
    ).subscribe(({ data }) => {
      expect(data?.register.refreshToken).toEqual(fakeData.refreshToken);
      expect(data?.register.token).toEqual(fakeData.token);
    });

    const op = controller.expectOne(REGISTER);

    expect(op.operation.variables['email']).toEqual(fakeData.user.email);
    expect(op.operation.variables['username']).toEqual(fakeData.user.username);
    expect(op.operation.variables['password1']).toEqual(fakeData.user.password);
    expect(op.operation.variables['password2']).toEqual(fakeData.user.password2);

    op.flush({
      data: {
        register: {
          token: fakeData.token,
          refreshToken: fakeData.refreshToken
        }
      }
    });
  });

  // The nature of the following tests makes jasmine go haywire. I wish I knew why, but it involves how
  // the subscription is handled within the function and an inability to test the function because
  // they're asyncronous calls.

  it('calls logout and dispatches the setError action with the handled error if the refresh token is erroneous', fakeAsync(() => {
    spyOn(store, 'dispatch');
    spyOn(service, 'logout');

    service.refreshToken(fakeData.refreshToken);

    const op = controller.expectOne(REFRESH_TOKEN);
    expect(op.operation.variables['token']).toEqual(fakeData.refreshToken);

    op.flush({
      data: {
        refreshToken: {
          errors: {
            nonFieldErrors: [
              {
                "message": "Invalid token.",
                "code": "invalid_token"
              }
            ]
          }
        }
      }
    });
    tick(100);

    expect(service.logout).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(AuthActions.setError({ error: 'Invalid token.' }));
  }));

  it('dispatches the login action if the data is successful and the items are present in local storage', fakeAsync(() => {
    spyOn(store, 'dispatch');
    localStorage.setItem('AWW_email', fakeData.user.email);
    localStorage.setItem('AWW_username', fakeData.user.username);
    localStorage.setItem('AWW_verified', JSON.stringify(fakeData.user.verified));

    service.refreshToken(fakeData.refreshToken);

    const op = controller.expectOne(REFRESH_TOKEN);
    expect(op.operation.variables['token']).toEqual(fakeData.refreshToken);

    op.flush({
      data: {
        refreshToken: {
          token: fakeData.token,
          refreshToken: fakeData.refreshToken
        }
      }
    });
    tick(100);
    expect(store.dispatch).toHaveBeenCalledWith(AuthActions.login({
      user: new User(
        fakeData.user.email,
        fakeData.user.username,
        fakeData.token,
        fakeData.refreshToken,
        fakeData.user.verified
      )
    }));
  }));

  it('dispatches the logout action if the data is successful but the items are not present in local storage', fakeAsync(() => {
    spyOn(store, 'dispatch');
    spyOn(service, 'logout');

    service.refreshToken(fakeData.refreshToken);

    const op = controller.expectOne(REFRESH_TOKEN);
    expect(op.operation.variables['token']).toEqual(fakeData.refreshToken);

    op.flush({
      data: {
        refreshToken: {
          token: fakeData.token,
          refreshToken: fakeData.refreshToken
        }
      }
    });
    tick(100);
    expect(service.logout).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(AuthActions.setError({ error: 'Unable to use refresh token. Logging out' }));
  }));

  it('\'s verifyAccount method should provide an observable with the data property that has a success property if successful', () => {
    service.verifyAccount(fakeData.token).subscribe(({ data }) => {
      expect(data?.verifyAccount.success).toEqual(true);
    });

    const op = controller.expectOne(VERIFY_ACCOUNT);

    expect(op.operation.variables['token']).toEqual(fakeData.token);

    op.flush({
      data: {
        verifyAccount: {
          success: true,
          errors: {}
        }
      }
    });
  });

  it('\'s sendPasswordResetEmail method should provide an observable with the data property that has a success property if successful', () => {
    service.sendPasswordResetEmail(fakeData.user.email).subscribe(({ data }) => {
      expect(data?.sendPasswordResetEmail.success).toEqual(true);
    });

    const op = controller.expectOne(SEND_PASSWORD_RESET_EMAIL);

    expect(op.operation.variables['email']).toEqual(fakeData.user.email);

    op.flush({
      data: {
        sendPasswordResetEmail: {
          success: true,
          errors: {}
        }
      }
    });
  });

  it('\'s passwordReset method should provide an observable with the data property that has a success property if successful', () => {
    service.passwordReset(
      fakeData.token,
      fakeData.user.password,
      fakeData.user.password2
    ).subscribe(({ data }) => {
      expect(data?.passwordReset.success).toEqual(true);
    });

    const op = controller.expectOne(PASSWORD_RESET);

    expect(op.operation.variables['token']).toEqual(fakeData.token);
    expect(op.operation.variables['newPassword1']).toEqual(fakeData.user.password);
    expect(op.operation.variables['newPassword2']).toEqual(fakeData.user.password2);

    op.flush({
      data: {
        passwordReset: {
          success: true,
          errors: {}
        }
      }
    });
  });

  it('\'s resendActivationEmail method should provide an observable with the data property that has a success property if successful', () => {
    service.resendActivationEmail(fakeData.user.email).subscribe(({ data }) => {
      expect(data?.resendActivationEmail.success).toEqual(true);
    });

    const op = controller.expectOne(RESEND_ACTIVATION_EMAIL);

    expect(op.operation.variables['email']).toEqual(fakeData.user.email);

    op.flush({
      data: {
        resendActivationEmail: {
          success: true,
          errors: {}
        }
      }
    });
  });

  it('\'s updateDetails method should provide an observable with the data property that has a success property if successful', () => {
    service.updateDetails(fakeData.user.email, fakeData.user.username).subscribe(({ data }) => {
      expect(data?.updateDetails.user.email).toEqual(fakeData.user.email);
      expect(data?.updateDetails.user.username).toEqual(fakeData.user.username);
    });

    const op = controller.expectOne(UPDATE_DETAILS);

    expect(op.operation.variables['email']).toEqual(fakeData.user.email);
    expect(op.operation.variables['username']).toEqual(fakeData.user.username);

    op.flush({
      data: {
        updateDetails: {
          user: {
            email: fakeData.user.email,
            username: fakeData.user.username
          }
        }
      }
    });
  });

  it('\'s messageMe method should provide an observable with the data property that has a success property if successful', () => {
    service.messageMe(fakeData.message).subscribe(({ data }) => {
      expect(data?.messageMe.success).toEqual(true);
    });

    const op = controller.expectOne(MESSAGE_ME);

    expect(op.operation.variables['message']).toEqual(fakeData.message);

    op.flush({
      data: {
        messageMe: {
          success: true
        }
      }
    });
  });

  it('\'s loggedIn getter should return an observable that yields false if no user is logged in', done => {
    expect(service.isLoggedIn).toBeInstanceOf(Observable);
    store.dispatch(AuthActions.logout());
    service.isLoggedIn.subscribe(loggedIn => {
      expect(loggedIn).toBeFalse();
      done();
    });
  });

  it('\'s loggedIn getter should return an observable that yields true if a user is logged in', done => {
    expect(service.isLoggedIn).toBeInstanceOf(Observable);

    const user = new User('test@test.com', 'testymctestface', 'testtoken', 'testrefreshtoken', true);
    store.dispatch(AuthActions.login({ user }));
    service.isLoggedIn.subscribe(loggedIn => {
      expect(loggedIn).toBeTrue();
      done();
    });
  });

  it('\'s logout method should dispatch the logout action and call the cancelTimeout method', () => {
    spyOn(store, 'dispatch');
    spyOn(service, 'cancelTimeout');

    service.logout();

    expect(store.dispatch).toHaveBeenCalledWith(AuthActions.logout());
    expect(service.cancelTimeout).toHaveBeenCalled();
  });

  it('\'s handleError method should return a string depending on the error and code it receives', () => {
    let errors: Array<ExpectedError & { result: string }> = [
      {
        nonFieldErrors: [
          {
            code: 'invalid_credentials',
            message: 'Test Message'
          }
        ],
        result: 'Username and/or password incorrect'
      },
      {
        password2: [
          {
            code: 'password_mismatch',
            message: 'Test Message'
          }
        ],
        result: 'Provided passwords do not match'
      },
      {
        newPassword2: [
          {
            code: 'password_mismatch',
            message: 'Test Message'
          }
        ],
        result: 'Provided passwords do not match'
      },
      {
        nonFieldErrors: [
          {
            code: 'any_other_code',
            message: 'Test Message'
          }
        ],
        result: 'Test Message'
      },
    ];
    for (let error of errors) {
      expect(service.handleError(error)).toEqual(error.result);
    }
  });

  it('\'s cancelTimeout calls clearTimeout if the service has a timeout running and sets its value to undefined', () => {
    service.timeout = 53;
    spyOn(window, 'clearTimeout');

    service.cancelTimeout();

    expect(window.clearTimeout).toHaveBeenCalled();
    expect(service.timeout).toBeUndefined();
  });
});

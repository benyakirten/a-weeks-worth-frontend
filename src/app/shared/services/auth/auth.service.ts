import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Apollo } from 'apollo-angular';

import * as fromApp from 'src/app/store/app.reducer';
import * as AuthActions from 'src/app/store/auth/auth.actions';
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
import { MESSAGE_ME } from '../../graphql/mutations/other';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // We can store the timeout here because there will
  // only be one user per client at a time
  private _timeout?: any;
  set timeout(value) {
    this._timeout = value;
  }
  get timeout() {
    return this._timeout;
  }

  constructor(
    private apollo: Apollo,
    private store: Store<fromApp.AppState>
  ) { }

  login(email: string, password: string) {
    return this.apollo.mutate<TokenAuth>({
      mutation: TOKEN_AUTH,
      variables: {
        email,
        password
      }
    });
  }

  register(email: string, username: string, password1: string, password2: string) {
    return this.apollo.mutate<Register>({
      mutation: REGISTER,
      variables: {
        email,
        username,
        password1,
        password2
      }
    });
  }

  refreshToken(token: string) {
    return this.apollo.mutate<RefreshToken>({
      mutation: REFRESH_TOKEN,
      variables: { token }
    }).subscribe(({ data }) => {
      this.store.dispatch(AuthActions.setLoading({ loading: false }));
      if (data) {
        if (data.refreshToken.errors) {
          this.logout();
          this.store.dispatch(AuthActions.setError({ error: this.handleError(data.refreshToken.errors) }));
          return;
        }
        const userEmail = localStorage.getItem('AWW_email');
        const userUsername = localStorage.getItem('AWW_username');
        const userVerified = localStorage.getItem('AWW_verified');

        if (userEmail && userUsername && userVerified !== null) {
          this.store.dispatch(AuthActions.login({
            user: new User(
              userEmail,
              userUsername,
              data.refreshToken.token,
              data.refreshToken.refreshToken,
              userVerified === 'true'
            )
          }));
        } else {
          this.store.dispatch(AuthActions.setError({ error: 'Unable to use refresh token. Logging out' }));
          this.logout();
        }
      }
    });
  }

  verifyAccount(token: string) {
    return this.apollo.mutate<VerifyAccount>({
      mutation: VERIFY_ACCOUNT,
      variables: { token }
    });
  }

  sendPasswordResetEmail(email: string) {
    return this.apollo.mutate<SendPasswordResetEmail>({
      mutation: SEND_PASSWORD_RESET_EMAIL,
      variables: { email }
    });
  }

  passwordReset(token: string, newPassword1: string, newPassword2: string) {
    return this.apollo.mutate<PasswordReset>({
      mutation: PASSWORD_RESET,
      variables: {
        token,
        newPassword1,
        newPassword2
      }
    });
  }

  resendActivationEmail(email: string) {
    return this.apollo.mutate<ResendActivationEmail>({
      mutation: RESEND_ACTIVATION_EMAIL,
      variables: { email }
    });
  }

  updateDetails(email: string, username: string) {
    return this.apollo.mutate<UpdateDetails>({
      mutation: UPDATE_DETAILS,
      variables: { email, username }
    });
  }

  messageMe(message: string) {
    return this.apollo.mutate<MessageMe>({
      mutation: MESSAGE_ME,
      variables: { message }
    });
  }

  get isLoggedIn(): Observable<boolean> {
    return this.store.select('auth')
      .pipe(map(authState => !!authState.user));
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
    this.cancelTimeout();
    this.apollo.client.clearStore();
  }

  handleError(errors: ExpectedError): string {
    if (errors['nonFieldErrors']) {
      const { code } = errors['nonFieldErrors'][0];
      switch (code) {
        case 'invalid_credentials':
          return 'Username and/or password incorrect';
        default:
          return errors['nonFieldErrors'][0].message;
      }
    }
    if (errors['password2']) {
      const { code } = errors['password2'][0];
      switch (code) {
        case "password_mismatch":
          return 'Provided passwords do not match';
        default:
          return errors['password2'][0].message;
      }
    }
    if (errors['newPassword2']) {
      const { code } = errors['newPassword2'][0];
      switch (code) {
        case "password_mismatch":
          return 'Provided passwords do not match';
        default:
          return errors['newPassword2'][0].message;
      }
    }
    if (errors['email']) {
      const { code } = errors['email'][0];
      switch (code) {
        default:
          return errors['email'][0].message;
      }
    }
    if (errors['username']) {
      const { code } = errors['username'][0];
      switch (code) {
        default:
          return errors['username'][0].message;
      }
    }
    return 'Something went wrong. Please try again.';
  }

  cancelTimeout() {
    if (this.timeout) {
      window.clearTimeout(this.timeout);
      this.timeout = undefined;
    }
  }
}

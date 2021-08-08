import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { moveLeftFade } from 'src/app/shared/animations/void-animations';

import * as fromApp from 'src/app/store/app.reducer';
import * as AuthActions from 'src/app/store/auth/auth.actions';

import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-account',
  animations: [moveLeftFade('input')],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  storeSub?: Subscription;
  mutationSub?: Subscription;

  passwordMode: boolean = false;
  verified?: boolean = false;
  error?: string;
  email?: string;
  passwordResetToken?: string;
  username?: string;
  loading: boolean = false;

  accountDetailsRules: Array<string> = [
    'Email and username must be at least 6 characters',
    'Username must be no longer than 150 letters',
    'Username must only be letters, numbers or the following symbols: _@+-. ',
    'Email must be an email address',
    'Email and username must be unique',
    'User will be signed out and need to reauthenticate upon successful account update'
  ];

  changePasswordRules: Array<string> = [
    `A token must be used to change your password.
    You can obtain this by requesting an email be sent
    containing the token as well as a link to automatically fill it in`,
    'Password must be at least 8 characters long',
    'Password must contain letters',
    'Passwords must match',
    'Password must not be too common (easy to guess)'
  ];

  constructor(
    private store: Store<fromApp.AppState>,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.storeSub = this.store.select('auth')
      .subscribe(authState => {
        this.verified = authState.user?.verified;
        this.username = authState.user?.username;
        this.email = authState.user?.email;
      }
    );
    this.route.queryParams
      .subscribe(p => {
        if (p['passwordReset']) {
          this.passwordMode = true;
          this.passwordResetToken = p['passwordReset'];
        }
        if (p['verifyAccount']) {
          this.handleVerifyForm(p['verifyAccount']);
        }
      })
  }

  sendPasswordResetEmail() {
    this.error = undefined;
    this.loading = true;
    if (!this.email) {
      this.error = 'Email could not be found for user.';
      return;
    }
    this.authService
      .sendPasswordResetEmail(this.email)
      .subscribe(({ data }) => {
        this.loading = false;
        if (data?.sendPasswordResetEmail.errors) {
          this.error = this.authService
            .handleError(data.sendPasswordResetEmail.errors);
          return;
        }
      });
  }

  onSubmit(form: NgForm) {
    if (!form.valid || form.pristine) {
      this.error = 'Form invalid. Please make sure the data is valid';
      return;
    }
    this.loading = true;
    this.error = undefined;
    if (this.verified) {
      this.passwordMode
        ? this.handlePasswordChange(form)
        : this.handleAccountDetailsChange(form);
    } else {
      this.handleVerifyForm(form.value['token']);
    }
  }

  private handlePasswordChange(form: NgForm) {
    if (form.value['password'] !== form.value['password2']) {
      this.loading = false;
      this.error = 'Passwords do not match';
      return;
    }
    this.authService
      .passwordReset(
        form.value['token'],
        form.value['password'],
        form.value['password2']
      ).subscribe(({ data }) => {
        this.loading = false;
        if (data?.passwordReset.errors) {
          this.error = this.authService.handleError(data.passwordReset.errors);
          return;
        }
        if (data?.passwordReset.success) {
          this.authService.logout();
          this.router.navigate(['/auth']);
          return;
        } else {
          this.error = 'An error occurred. Please try again.';
          return;
        }
      })
    this.loading = false;
  }

  private handleAccountDetailsChange(form: NgForm) {
    this.mutationSub = this.authService
      .updateDetails(form.value['email'], form.value['username'])
      .subscribe(({ errors }) => {
        if (errors) {
          this.error = errors[0].message;
          return;
        }
        // We need a new auth token,
        // and the only way to get it is
        // by running the tokenAuth mutation again.
        this.authService.logout();
        this.router.navigate(['/auth']);
      });
    this.loading = false;
  }

  private handleVerifyForm(token: string) {
    this.mutationSub = this.authService
      .verifyAccount(token)
      .subscribe(({ data }) => {
        this.loading = false;
        if (data?.verifyAccount.errors) {
          this.error = this.authService.handleError(data.verifyAccount.errors);
          return;
        }
        if (!data?.verifyAccount.success) {
          this.error = 'Unable to verify account. Please try again.';
          return;
        } else {
          this.store.dispatch(AuthActions.verifyEmail());
        }
      })
  }

  resendActivationEmail() {
    this.loading = true;
    if (!this.email) {
      this.error = 'Email could not be found for user.';
      return;
    }
    this.mutationSub = this.authService
      .resendActivationEmail(this.email)
      .subscribe(({ data }) => {
        this.loading = false;
        if (data?.resendActivationEmail.errors) {
          this.error = this.authService.handleError(data?.resendActivationEmail.errors);
          return;
        }
      })
  }

  togglePasswordMode() {
    this.passwordMode = !this.passwordMode;
  }

  ngOnDestroy(): void {
    this.storeSub?.unsubscribe();
    this.mutationSub?.unsubscribe();
  }
}

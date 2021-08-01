import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';

import { moveLeftFade } from 'src/app/shared/animations/void-animations';

import * as fromApp from 'src/app/store/app.reducer';
import * as AuthActions from 'src/app/store/auth/auth.actions';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

import { User } from 'src/app/shared/classes/user/user';

@Component({
  selector: 'app-auth',
  animations: [moveLeftFade('input')],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  error?: string;
  loading: boolean = false;
  loginMode: boolean = true;
  returnRoute?: string;
  mutationSubscription?: Subscription;
  rules: Array<string> = [
    'All fields must be filled out',
    'Email and username must be at least 6 characters',
    'Username must be no longer than 150 letters',
    'Username must only be letters, numbers or the following symbols: _@+-. ',
    'Email must be an email address',
    'Email and username must be unique',
    'Password must be at least 8 characters long',
    'Password must contain letters',
    'Passwords must match',
    'Password must not be too common (easy to guess)'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(p => this.returnRoute = p['returnUrl']);
  }

  alternateMode(): void {
    this.loginMode = !this.loginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      this.error = "Form is invalid";
      return;
    }
    if (!this.loginMode && form.form.value['password'] !== form.form.value['password2']) {
      this.error = "Passwords do not match";
      return;
    }
    this.error = undefined;
    this.loading = true;
    if (!this.loginMode) {
      this.mutationSubscription = this.authService.register(
        form.form.value['email'],
        form.form.value['username'],
        form.form.value['password'],
        form.form.value['password2']
      ).subscribe(({ data, errors }) => {
        if (errors) {
          this.error = errors[0].message;
          return;
        }
        if (data) {
          this.handleSubscriptionData({
            ...data?.register,
            user: {
              username: form.form.value['username'],
              email: form.form.value['email'],
              verified: false
            }
          });
        }
      })
    } else {
      this.mutationSubscription = this.authService.login(
        form.form.value['email'],
        form.form.value['password']
      ).subscribe(({ data }) => {
        this.handleSubscriptionData(data?.tokenAuth);
      })
    }
  }

  private handleSubscriptionData(response?: AuthResponse) {
    if (!response) {
      this.error = "Something went wrong. Please try again.";
      this.loading = false;
      return;
    }
    this.loading = false;
    if (response.errors) {
      this.error = this.authService.handleError(response.errors);
    }
    if (response.success) {
      this.store.dispatch(AuthActions.login({
        user: new User(
          response.user.email,
          response.user.username,
          response.token,
          response.refreshToken,
          response.user.verified
        )
      }));
      this.returnRoute
        ? this.router.navigateByUrl(this.returnRoute)
        : this.router.navigate(['/the-week']);
    }
  }

  ngOnDestroy(): void {
    this.mutationSubscription?.unsubscribe();
  }

}

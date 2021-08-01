import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, OnDestroy {
  authSub?: Subscription;
  mutationSub?: Subscription;

  loading: boolean = false;
  loggedIn: boolean = false;
  result?: string;
  messageGood: boolean = true;

  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authSub = this.authService.isLoggedIn
      .subscribe(isLoggedIn => this.loggedIn = isLoggedIn);
  }

  onSubmit(form: NgForm) {
    this.result = undefined;
    if (!form.valid || !this.loggedIn) {
      this.result = 'Form isn\'t valid and/or user isn\'t logged in.';
      this.messageGood = false;
      return;
    }
    this.loading = true;
    this.mutationSub = this.authService
      .messageMe(form.value['message'])
      .subscribe(({ data, errors }) => {
        console.log(data);
        console.log(errors);
        this.loading = false;
        if (errors) {
          this.messageGood = false;
          this.result = errors[0].message;
          return;
        }
        if (data && data.messageMe.success) {
          this.messageGood = true;
          this.result = 'Message sent. Thank you for your feedback.';
          return;
        }
        this.messageGood = false;
        this.result = 'Something went wrong. Please try again.';
      })
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
    this.mutationSub?.unsubscribe();
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit, OnDestroy {
  loggedIn: boolean = false;

  private authSub?: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authSub = this.authService
      .isLoggedIn
      .subscribe(loggedIn => this.loggedIn = loggedIn);
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }
}

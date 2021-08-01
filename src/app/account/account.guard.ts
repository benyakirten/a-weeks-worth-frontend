import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';

import { tap } from 'rxjs/operators';

import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AccountGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.isLoggedIn.pipe(
      tap(isLoggedIn => {
        if (!isLoggedIn) {
          this.router.navigate(['/auth'], {
            queryParams: { returnUrl: state.url }
          })
        }
      })
    );
  }
}

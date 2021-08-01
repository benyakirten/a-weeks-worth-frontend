import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { tap } from 'rxjs/operators';

import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GroupsGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
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
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
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

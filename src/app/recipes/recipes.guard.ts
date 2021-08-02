import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RecipesGuard implements CanActivateChild {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (
      childRoute.routeConfig!.path === ':id' ||
      childRoute.routeConfig!.path === '' ||
      localStorage.getItem('AWW_token')
    ) {
      return true;
    }
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

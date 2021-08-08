import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  canActivate() {
    // This is the only check because it isn't that vital if an already-signed-in user logs in again
    // The action would just override currently saved data and get a new token/refresh token
    const expiration = localStorage.getItem('AWW_expiration');
    return !expiration || Date.now() > +expiration;
  }
}

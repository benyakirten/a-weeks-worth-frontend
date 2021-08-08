import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AuthComponent } from 'src/app/auth/auth.component';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

import { User } from 'src/app/shared/classes/user/user';

import * as fromApp from 'src/app/store/app.reducer';
import * as AuthActions from 'src/app/store/auth/auth.actions';

import { TheWeekGuard } from './the-week.guard';

describe('TheWeekGuard', () => {
  let guard: TheWeekGuard;
  let router: Router;
  let service: AuthService;
  let store: Store<fromApp.AppState>

  const dummyRoute = {
    routeConfig: {
      path: 'notavalidpath'
    }
  } as ActivatedRouteSnapshot;

  const dummySnapshot = {
    url: 'dummyUrl'
  } as RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthComponent],
      imports: [
        RouterTestingModule.withRoutes([{ path: 'auth', component: AuthComponent }]),
        StoreModule.forRoot(fromApp.appReducer)
      ],
      providers: [AuthService]
    });
    guard = TestBed.inject(TheWeekGuard);
    service = TestBed.inject(AuthService)
    router = TestBed.inject(Router);
    store = TestBed.inject(Store);
  });

  it('canActivate should return true if the user is logged in', done => {
    store.dispatch(AuthActions.login({
      user: new User('test@test.com', 'testymctestface', 'testtoken', 'testrefreshtoken', true)
    }));
    (guard.canActivate(dummyRoute, dummySnapshot) as Observable<boolean>).subscribe(canProceed => {
      expect(canProceed).toBeTrue();
      done();
    });
  });

  it('canActivate should redirect with determined params and return false if the user is not logged it', done => {
    spyOn(router, 'navigate');
    (guard.canActivate(dummyRoute, dummySnapshot) as Observable<boolean>).subscribe(canProceed => {
      expect(router.navigate).toHaveBeenCalledWith(['/auth'], { queryParams: { returnUrl: dummySnapshot.url } });
      expect(canProceed).toBeFalse();
      done();
    });
  });

  it('canActivateChild should return true if the user is logged in', done => {
    store.dispatch(AuthActions.login({
      user: new User('test@test.com', 'testymctestface', 'testtoken', 'testrefreshtoken', true)
    }));
    (guard.canActivateChild(dummyRoute, dummySnapshot) as Observable<boolean>).subscribe(canProceed => {
      expect(canProceed).toBeTrue();
      done();
    });
  });

  it('canActivateChild should redirect with determined params and return false if the user is not logged it', done => {
    spyOn(router, 'navigate');
    (guard.canActivateChild(dummyRoute, dummySnapshot) as Observable<boolean>).subscribe(canProceed => {
      expect(router.navigate).toHaveBeenCalledWith(['/auth'], { queryParams: { returnUrl: dummySnapshot.url } });
      expect(canProceed).toBeFalse();
      done();
    });
  });
});

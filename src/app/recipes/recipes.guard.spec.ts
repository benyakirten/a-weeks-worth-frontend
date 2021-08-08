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

import { RecipesGuard } from './recipes.guard';

describe('RecipesGuard', () => {
  let guard: RecipesGuard;
  let router: Router;
  let service: AuthService;
  let store: Store<fromApp.AppState>

  const dummyChildRoute = {
    routeConfig: {
      path: 'notavalidpath'
    }
  } as ActivatedRouteSnapshot;

  const dummyChildRouteID = {
    routeConfig: {
      path: ':id'
    }
  } as ActivatedRouteSnapshot;

  const dummyChildRouteEmpty = {
    routeConfig: {
      path: ''
    }
  }  as ActivatedRouteSnapshot;

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
    guard = TestBed.inject(RecipesGuard);
    service = TestBed.inject(AuthService)
    router = TestBed.inject(Router);
    store = TestBed.inject(Store);
  });

  it('should return true if the child route\'s path is :id', () => {
    // (guard.canActivateChild(dummyChildRouteID, dummySnapshot) as any as Observable<boolean>)
    expect(guard.canActivateChild(dummyChildRouteID, dummySnapshot)).toBeTrue();
  });

  it('should return true if the child route\'s path is blank', () => {
    expect(guard.canActivateChild(dummyChildRouteEmpty, dummySnapshot)).toBeTrue();
  });

  it('should return an observable that resolves to true if the user is logged in if the route requires authentication', done => {
    spyOn(router, 'navigate');
    store.dispatch(AuthActions.login({
      user: new User('test@test.com', 'testymctestface', 'testtoken', 'testrefreshtoken', true)
    }));
    const result = guard.canActivateChild(dummyChildRoute, dummySnapshot);
   (guard.canActivateChild(dummyChildRoute, dummySnapshot) as Observable<boolean>).subscribe(canProceed => {
      expect(canProceed).toBeTrue();
      done();
    });
  });

  it('should redirect and return false if the child route\'s is not valid and there is no user logged in', done => {
    spyOn(router, 'navigate');
    (guard.canActivateChild(dummyChildRoute, dummySnapshot) as Observable<boolean>).subscribe(canProceed => {
      expect(canProceed).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/auth'], { queryParams: { returnUrl: dummySnapshot.url } })
      done();
    });
  });
});

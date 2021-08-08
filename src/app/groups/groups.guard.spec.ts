import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Store, StoreModule } from '@ngrx/store';

import { AuthComponent } from 'src/app/auth/auth.component';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

import { User } from 'src/app/shared/classes/user/user';

import * as fromApp from 'src/app/store/app.reducer';
import * as AuthActions from 'src/app/store/auth/auth.actions';

import { GroupsGuard } from './groups.guard';

describe('GroupsGuard', () => {
  let guard: GroupsGuard;
  let router: Router;
  let service: AuthService;
  let store: Store<fromApp.AppState>

  const dummyRoute = {} as ActivatedRouteSnapshot;
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
    guard = TestBed.inject(GroupsGuard);
    service = TestBed.inject(AuthService)
    router = TestBed.inject(Router);
    store = TestBed.inject(Store);
  });

  it('canActivate should return true if the user is logged in', done => {
    store.dispatch(AuthActions.login({
      user: new User('test@test.com', 'testymctestface', 'testtoken', 'testrefreshtoken', true)
    }));
    guard.canActivate(dummyRoute, dummySnapshot).subscribe(canProceed => {
      expect(canProceed).toBeTrue();
      done();
    });
  });

  it('canActivate should redirect with determined params and return false if the user is not logged it', done => {
    spyOn(router, 'navigate');
    guard.canActivate(dummyRoute, dummySnapshot).subscribe(canProceed => {
      expect(router.navigate).toHaveBeenCalledWith(['/auth'], { queryParams: { returnUrl: dummySnapshot.url } });
      expect(canProceed).toBeFalse();
      done();
    });
  });
});

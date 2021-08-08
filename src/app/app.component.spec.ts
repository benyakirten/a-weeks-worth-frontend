import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Store, StoreModule } from '@ngrx/store';

import * as fromApp from 'src/app/store/app.reducer';
import * as AuthActions from 'src/app/store/auth/auth.actions';

import { AppComponent } from './app.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { AuthService } from './shared/services/auth/auth.service';
import { SharedModule } from './shared/shared.module';

describe('AppComponent', () => {
  let authService: AuthService;
  let store: Store
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        StoreModule.forRoot(fromApp.appReducer),
        SharedModule
      ],
      declarations: [
        AppComponent,
        FooterComponent,
        HeaderComponent
      ],
      providers: [
        AuthService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.removeItem('AWW_refresh');
  });

  it('should dispatch the setLoading action on init and then the auth service\'s refreshToken with the local storage value if it is found', () => {
    spyOn(store, 'dispatch');
    spyOn(authService, 'refreshToken');

    localStorage.setItem('AWW_refresh', 'testtoken');
    component.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledOnceWith(AuthActions.setLoading({ loading: true }));
    expect(authService.refreshToken).toHaveBeenCalledOnceWith('testtoken');
  });

  it('should dispatch the setLoading action with a value of true when starting up then false if there is no local storage value for AWW_refresh', () => {
    spyOn(store, 'dispatch');

    component.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledTimes(2);
    expect(store.dispatch).toHaveBeenCalledWith(AuthActions.setLoading({ loading: true }));
    expect(store.dispatch).toHaveBeenCalledWith(AuthActions.setLoading({ loading: false }));
  })
});

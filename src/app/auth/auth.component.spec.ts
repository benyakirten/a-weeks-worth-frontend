import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import { AuthService } from 'src/app/shared/services/auth/auth.service';

import * as fromApp from 'src/app/store/app.reducer';
import * as AuthActions from 'src/app/store/auth/auth.actions';
import { User } from 'src/app/shared/classes/user/user';

import { AuthComponent } from './auth.component';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  let debugEl: DebugElement;
  let form: DebugElement;

  let service: AuthService;
  let store: Store<fromApp.AppState>;
  let router: Router;

  const exampleError: ExpectedError = {
    nonFieldErrors: [
      {
        message: 'test error',
        code: 'invalid_credentials'
      }
    ]
  };

  const fakeUser = new User(
    'test@test.com',
    'testusername',
    'testtoken',
    'testrefresh',
    false
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthComponent],
      imports: [
        RouterTestingModule,
        FormsModule,
        BrowserAnimationsModule,
        StoreModule.forRoot(fromApp.appReducer)
      ],
      providers: [
        AuthService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    component.returnRoute = undefined;
    debugEl = fixture.debugElement;
    fixture.detectChanges();

    store = TestBed.inject(Store);
    service = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    form = debugEl.query(By.css('form'));
  });

  it('should toggle login mode if the mode button\'s active button is clicked, and the other should not do anything and not have the active class', () => {
    const buttons = debugEl.query(By.css('.mode-buttons')).queryAll(By.css('button'));
    const loginButton = buttons[0];
    const registerButton = buttons[1];

    expect(component.loginMode).toEqual(true);
    expect(loginButton.nativeElement).toHaveClass('active');
    expect(registerButton.nativeElement).not.toHaveClass('active');

    // Password mode doesn't change if we click the button that's active
    loginButton.nativeElement.click();
    fixture.detectChanges();
    expect(component.loginMode).toEqual(true);

    registerButton.nativeElement.click();
    fixture.detectChanges();
    expect(component.loginMode).toEqual(false);
    expect(loginButton.nativeElement).not.toHaveClass('active');
    expect(registerButton.nativeElement).toHaveClass('active');

    // Password mode stays true because it's already true
    registerButton.nativeElement.click();
    fixture.detectChanges();
    expect(component.loginMode).toEqual(false);

    // Change back
    loginButton.nativeElement.click();
    fixture.detectChanges();
    expect(component.loginMode).toEqual(true);
    expect(loginButton.nativeElement).toHaveClass('active');
    expect(registerButton.nativeElement).not.toHaveClass('active');
  });

  it('should redirect back to the returnUrl link if it exists and the login happened successfully', () => {
    spyOn(router, 'navigateByUrl');
    spyOn(service, 'login').and.returnValue(of({
      data: {
        tokenAuth: {
          user: {
            email: 'test@test.com',
            username: 'testusername',
            verified: false
          },
          token: 'testtoken',
          refreshToken: 'testrefresh',
          success: true
        }
      }
    } as any));

    component.returnRoute = 'testreturnroute';
    const ngForm = {
      valid: true,
      value: {
        email: 'test@test.com',
        password: 'testpassword'
      }
    } as NgForm;

    component.loginMode = true;
    fixture.detectChanges();

    component.onSubmit(ngForm);

    expect(router.navigateByUrl).toHaveBeenCalledWith('testreturnroute')
  });

  describe('with loginMode true', () => {
    const ngForm = {
      valid: true,
      value: {
        email: 'test@test.com',
        password: 'testpassword'
      }
    } as NgForm;

    beforeEach(() => {
      component.loginMode = true;
      fixture.detectChanges();
    });

    it('should display a form with two inputs with ids email, password and two buttons that say Submit and I need to register instead', () => {
      const inputs = form.queryAll(By.css('input'));
      const buttons = form.queryAll(By.css('app-button'));

      expect(inputs[0].nativeElement.id).toEqual('email');
      expect(inputs[1].nativeElement.id).toEqual('password');

      expect(buttons.length).toEqual(2);
      expect(buttons[0].nativeElement.innerText.trim()).toEqual('Submit');
      expect(buttons[1].nativeElement.innerText.trim()).toEqual('I need to register instead');
    });

    it('should set the error to Form is Invalid if the onSubmit method is called on an invalid form', () => {
      const invalidForm = {
        valid: false,
        value: {
          email: 'test@test.com',
          password: 'testpassword'
        }
      } as NgForm;
      component.onSubmit(invalidForm);
      expect(component.error).toEqual('Form is invalid');
    });

    it('should set the error to the error\'s message if there is a graphQL error then return', () => {
      spyOn<any>(component, 'handleSubscriptionData');
      spyOn(service, 'login').and.returnValue(of({
        data: null,
        errors: [{ message: 'testerror' }]
      } as any));

      component.onSubmit(ngForm);

      expect(component.error).toEqual('testerror');
      expect(component['handleSubscriptionData']).not.toHaveBeenCalled();
    });

    it('should use the authService\'s handleError method to output the error if there\'s a tokenAuth or register error and for the login action not to be dispatched', () => {
      spyOn(store, 'dispatch');
      spyOn(service, 'login').and.returnValue(of({
        data: {
          tokenAuth: {
            errors: exampleError
          }
        }
      } as any));

      component.onSubmit(ngForm);

      expect(component.error).toEqual(service.handleError(exampleError));
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should set the component error to "Something went wrong. Please try again." if there is no data', () => {
      spyOn(store, 'dispatch');
      spyOn(service, 'login').and.returnValue(of({
        data: null
      } as any));

      component.onSubmit(ngForm);

      expect(component.error).toEqual('Something went wrong. Please try again.');
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should call the authService\'s login method if the form is valid, log the user in then navigate away', () => {
      spyOn(service, 'login').and.returnValue(of({
        data: {
          tokenAuth: {
            user: {
              email: 'test@test.com',
              username: 'testusername',
              verified: false
            },
            token: 'testtoken',
            refreshToken: 'testrefresh',
            success: true
          }
        }
      } as any));

      spyOn(store, 'dispatch');
      spyOn(router, 'navigate');

      component.onSubmit(ngForm);
      expect(service.login).toHaveBeenCalledWith('test@test.com', 'testpassword');
      expect(store.dispatch).toHaveBeenCalledWith(AuthActions.login({ user: fakeUser }));
      expect(router.navigate).toHaveBeenCalledWith(['/the-week']);
    });
  });

  describe('with loginMode false', () => {
    const ngForm = {
      valid: true,
      value: {
        email: 'test@test.com',
        username: 'testusername',
        password: 'testpassword',
        password2: 'testpassword'
      }
    } as NgForm;

    beforeEach(() => {
      component.loginMode = false;
      fixture.detectChanges();
    });

    it('should display a form with four inputs with ids email, username, password, password2 and two buttons that say Submit and I need to login instead', () => {
      const inputs = form.queryAll(By.css('input'));
      const buttons = form.queryAll(By.css('app-button'));

      expect(inputs[0].nativeElement.id).toEqual('email');
      expect(inputs[1].nativeElement.id).toEqual('username');
      expect(inputs[2].nativeElement.id).toEqual('password');
      expect(inputs[3].nativeElement.id).toEqual('password2');

      expect(buttons.length).toEqual(2);
      expect(buttons[0].nativeElement.innerText.trim()).toEqual('Submit');
      expect(buttons[1].nativeElement.innerText.trim()).toEqual('I need to login instead');
    });

    it('should set the error to the error\'s message if there is a graphQL error then return', () => {
      spyOn<any>(component, 'handleSubscriptionData');
      spyOn(service, 'register').and.returnValue(of({
        data: null,
        errors: [{ message: 'testerror' }]
      } as any));

      component.onSubmit(ngForm);

      expect(component.error).toEqual('testerror');
      expect(component['handleSubscriptionData']).not.toHaveBeenCalled();
    });

    it('should use the authService\'s handleError method to output the error if there\'s a tokenAuth or register error and for the login action not to be dispatched', () => {
      spyOn(store, 'dispatch');
      spyOn(service, 'register').and.returnValue(of({
        data: {
          register: {
            errors: exampleError
          }
        }
      } as any));

      component.onSubmit(ngForm);

      expect(component.error).toEqual(service.handleError(exampleError));
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should call the authService\'s login method if the form is valid, log the user in then navigate', () => {
      spyOn(service, 'register').and.returnValue(of({
        data: {
          register: {
            token: 'testtoken',
            refreshToken: 'testrefresh',
            success: true
          }
        }
      } as any));

      spyOn(store, 'dispatch');
      spyOn(router, 'navigate');

      component.onSubmit(ngForm);
      expect(service.register).toHaveBeenCalledWith('test@test.com', 'testusername', 'testpassword', 'testpassword');
      expect(store.dispatch).toHaveBeenCalledWith(AuthActions.login({ user: fakeUser }));
      expect(router.navigate).toHaveBeenCalledWith(['/the-week']);
    });
  });
});

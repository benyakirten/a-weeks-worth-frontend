import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { DebugElement } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import { AuthService } from 'src/app/shared/services/auth/auth.service';

import * as fromApp from 'src/app/store/app.reducer';
import * as AuthActions from 'src/app/store/auth/auth.actions';

import { AccountComponent } from './account.component';

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;
  let service: AuthService;
  let store: Store<fromApp.AppState>;
  let router: Router;

  let debugEl: DebugElement;

  const exampleError: ExpectedError =  {
    nonFieldErrors: [
      {
        message: 'test error',
        code: 'invalid_credentials'
      }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountComponent ],
      imports: [
        RouterTestingModule,
        FormsModule,
        BrowserAnimationsModule,
        StoreModule.forRoot(fromApp.appReducer)
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;

    fixture.detectChanges();

    store = TestBed.inject(Store);
    service = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should toggle the password mode if the mode button\'s active button is clicked, and the other should not do anything and not have the active class', () => {
    component.verified = true;
    fixture.detectChanges()

    const buttons = debugEl.query(By.css('.mode-buttons')).queryAll(By.css('button'));
    const account = buttons[0];
    const password = buttons[1];

    expect(component.passwordMode).toEqual(false);
    expect(account.nativeElement).toHaveClass('active');
    expect(password.nativeElement).not.toHaveClass('active');

    // Password mode doesn't change if we click the button that's active
    account.nativeElement.click();
    fixture.detectChanges();
    expect(component.passwordMode).toEqual(false);

    password.nativeElement.click();
    fixture.detectChanges();
    expect(component.passwordMode).toEqual(true);
    expect(account.nativeElement).not.toHaveClass('active');
    expect(password.nativeElement).toHaveClass('active');

    // Password mode stays true because it's already true
    password.nativeElement.click();
    fixture.detectChanges();
    expect(component.passwordMode).toEqual(true);

    // Change back
    account.nativeElement.click();
    fixture.detectChanges();
    expect(component.passwordMode).toEqual(false);
    expect(account.nativeElement).toHaveClass('active');
    expect(password.nativeElement).not.toHaveClass('active');
  });

  it('should show the error display if there\'s an error', () => {
    expect(debugEl.query(By.css('app-error-display'))).toBeFalsy();

    component.error = 'An error';
    fixture.detectChanges();

    const errorDisplay = debugEl.query(By.css('app-error-display'));
    expect(errorDisplay).toBeTruthy();
    expect(errorDisplay.nativeElement.innerText).toEqual('An error');
  });

  describe('when not verified', () => {
    let form: DebugElement;
    let buttons: Array<DebugElement>
    const ngForm = {
      valid: true,
      value: {
        token: 'testtoken'
      }
    } as NgForm;

    beforeEach(() => {
      component.verified = false;
      fixture.detectChanges();
      form = debugEl.query(By.css('form'));
      buttons = form.queryAll(By.css('.button'));
    });

    it('should show a form input with an input and two buttons, one to resend an the activation email and one to verify the mail', () => {
      const input = form.query(By.css('input'));
      const submit = buttons[0].query(By.css('app-button'));
      const resend = buttons[1].query(By.css('app-button'));

      expect(input).toBeTruthy();
      expect(submit).toBeTruthy();
      expect(resend).toBeTruthy();
    });

    it('should resend the activation email if the resend activation email button is clicked and set the error property to a generic message if one occurs', () => {
      component.email = "test@test.com"
      spyOn(service, 'resendActivationEmail').and.returnValue(of({ data: { resendActivationEmail: { errors: [{ message: 'test error' }] }} } as any));

      const resend = buttons[1].query(By.css('app-button'));
      resend.nativeElement.click();

      expect(service.resendActivationEmail).toHaveBeenCalledWith('test@test.com');
      expect(component.error).toEqual('Something went wrong. Please try again.');
    });

    it('should pass the token information to the handleVerifyForm method if the onSubmit form is called while the accoutn isn\'t verified', () => {
      spyOn<any>(component, 'handleVerifyForm');

      component.onSubmit(ngForm);
      expect(component['handleVerifyForm']).toHaveBeenCalledWith('testtoken');
    });

    it('should set the component error to the handled error if handleVerify results in an error', () => {
      spyOn(service, 'verifyAccount').and.returnValue(of({ data: { verifyAccount: { errors: exampleError }} } as any));
      component.onSubmit(ngForm);

      expect(component.error).toEqual(service.handleError(exampleError));
    });

    it('should set the error message to a generic error if verifyAccount didn\'t result in success', () => {
      spyOn(service, 'verifyAccount').and.returnValue(of({ data: { verifyAccount: { success: false }} }));
      component.onSubmit(ngForm);

      expect(component.error).toEqual('Unable to verify account. Please try again.');
    });

    it('should set dispatch the AuthActions.verifyEmail action if it was successful', () => {
      spyOn(service, 'verifyAccount').and.returnValue(of({ data: { verifyAccount: { success: true }} }));
      spyOn(store, 'dispatch');
      component.onSubmit(ngForm);

      expect(store.dispatch).toHaveBeenCalledWith(AuthActions.verifyEmail());
    });
  });

  describe('when verified', () => {
    let form: DebugElement;
    beforeEach(() => {
      component.verified = true;
      fixture.detectChanges();
      form = debugEl.query(By.css('form'));
    });

    describe('in passwordMode', () => {
      let ngForm = {
        valid: true,
        value: {
          token: 'testtoken',
          password: 'testpassword',
          password2: 'testpassword'
        }
      } as NgForm;

      beforeEach(() => {
        component.passwordMode = true;
        fixture.detectChanges();
      });

      it('should render a form with three inputs with ids token, password and password2, and three buttons with texts Send Token Email, Submit and Switch to Account Details', () => {
        const controlGroups = form.queryAll(By.css('.control-group'));

        const tokenInput = controlGroups[0].query(By.css('input'));
        const passwordInput = controlGroups[1].query(By.css('input'));
        const password2Input = controlGroups[2].query(By.css('input'));
        const buttons = form.queryAll(By.css('app-button'));

        expect(tokenInput.nativeElement.id).toEqual('token');
        expect(passwordInput.nativeElement.id).toEqual('password');
        expect(password2Input.nativeElement.id).toEqual('password2');

        expect(buttons.length).toEqual(3);
        expect(buttons[0].nativeElement.innerText.trim()).toEqual('Send Token Email');
        expect(buttons[1].nativeElement.innerText.trim()).toEqual('Submit');
        expect(buttons[2].nativeElement.innerText.trim()).toEqual('Switch to Account Details');
      });

      it('should give an error of Passwords do not match and not call passwordReset if the password fields don\'t match', () => {
        spyOn(service, 'passwordReset').and.returnValue(of());
        ngForm.value['password2'] = 'nomatch'
        component.onSubmit(ngForm);

        expect(component.error).toEqual('Passwords do not match');
        expect(service.passwordReset).not.toHaveBeenCalled();

        ngForm.value['password2'] = 'testpassword';
      });

      it('should call the password reset function with the values of the token and the two passwords if the passwords match', () => {
        spyOn(service, 'passwordReset').and.returnValue(of());
        component.onSubmit(ngForm);

        expect(service.passwordReset).toHaveBeenCalledWith('testtoken', 'testpassword', 'testpassword');
      });

      it('should set the component error to the handled error if handlePasswordChange results in an error', () => {
        spyOn(service, 'passwordReset').and.returnValue(of({ data: { passwordReset: { errors: exampleError }} } as any));
        component.onSubmit(ngForm);

        expect(component.error).toEqual(service.handleError(exampleError));
      });

      it('should set the error message to a generic error if passwordReset didn\'t result in success', () => {
        spyOn(service, 'passwordReset').and.returnValue(of({ data: { passwordReset: { success: false }} }));
        component.onSubmit(ngForm);

        expect(component.error).toEqual('An error occurred. Please try again.');
      });

      it('should call the authService logout method and navigate to /auth if successful', () => {
        spyOn(service, 'passwordReset').and.returnValue(of({ data: { passwordReset: { success: true }} }));
        spyOn(service, 'logout');
        spyOn(router, 'navigate');
        component.onSubmit(ngForm);

        expect(service.logout).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/auth']);
      });
    });

    describe('not in passwordMode', () => {
      const ngForm = {
        valid: true,
        value: {
          email: 'testemail',
          username: 'testusername'
        }
      } as NgForm;

      beforeEach(() => {
        component.passwordMode = false;
        fixture.detectChanges();
      });

      it('should render a form with two inputs with ids email and username, and three buttons with texts Submit and Switch to Account Details', () => {
        const controlGroups = form.queryAll(By.css('.control-group'));

        const emailInput = controlGroups[0].query(By.css('input'));
        const usernameInput = controlGroups[1].query(By.css('input'));

        const buttons = form.queryAll(By.css('app-button'));

        expect(emailInput.nativeElement.id).toEqual('email');
        expect(usernameInput.nativeElement.id).toEqual('username');

        expect(buttons.length).toEqual(2);
        expect(buttons[0].nativeElement.innerText.trim()).toEqual('Submit');
        expect(buttons[1].nativeElement.innerText.trim()).toEqual('Switch to Change Password');
      });

      it('should call the handleAccountDetailsChange method when the form is submitted', () => {
        spyOn<any>(component, 'handleAccountDetailsChange');
        component.onSubmit(ngForm);
        expect(component['handleAccountDetailsChange']).toHaveBeenCalledWith(ngForm);
      })

      it('should set the component error property to the error and return from the method if there is an error', () => {
        spyOn(service, 'updateDetails').and.returnValue(of({ data: null, errors: [{ message: 'testerror' }] } as any));
        spyOn(service, 'logout');
        spyOn(router, 'navigate');

        component.onSubmit(ngForm);

        expect(component.error).toEqual('testerror');
        expect(service.logout).not.toHaveBeenCalled();
        expect(router.navigate).not.toHaveBeenCalled();
      });

      it('should call the authService logout method and navigate to /auth if there is no error', () => {
        spyOn(service, 'updateDetails').and.returnValue(of({ data: { updateDetails: { errors: null }} } as any));
        spyOn(service, 'logout');
        spyOn(router, 'navigate');
        component.onSubmit(ngForm);

        expect(service.logout).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/auth']);
      });
    });
  });
});

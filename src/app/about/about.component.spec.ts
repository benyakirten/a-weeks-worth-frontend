import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { StoreModule } from '@ngrx/store';

import { SharedModule } from 'src/app/shared/shared.module';
import * as fromApp from 'src/app/store/app.reducer';

import { AuthService } from 'src/app/shared/services/auth/auth.service';

import { AboutComponent } from './about.component';
import { of } from 'rxjs';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;
  let debugEl: DebugElement;
  let service: AuthService;

  const fakeForm = {
    valid: true,
    value: {
      message: 'Test message'
    }
  } as NgForm;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutComponent ],
      imports: [
        SharedModule,
        FormsModule,
        StoreModule.forRoot(fromApp.appReducer)
      ]
    })
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    fixture.detectChanges();

    service = TestBed.inject(AuthService);
  });

  it('should not show the form if the user is not logged in', () => {
    component.loggedIn = false;
    const form = debugEl.query(By.css('form'));
    expect(form).not.toBeTruthy();
  });

  it('should send out the messageMe method of the auth service when onSubmit is called then sets the messageGood property to false and the result to a generic message if there is no data and errors and for the app-error-display to display the result', () => {
    spyOn(service, 'messageMe').and.returnValue(of({ data: null, errors: null } as any));
    component.loggedIn = true;
    component.onSubmit(fakeForm);

    expect(service.messageMe).toHaveBeenCalledWith('Test message');
    expect(component.messageGood).toBeFalse();
    expect(component.result).toEqual('Something went wrong. Please try again.');

    fixture.detectChanges()

    const errorDisplay = debugEl.query(By.css('app-error-display'));
    expect(errorDisplay).toBeTruthy();
    expect((errorDisplay.nativeElement as HTMLElement).innerText.trim()).toEqual(component.result!);
  });

  it('should send out the messageMe method of the auth service when onSubmit is called then sets the messageGood property to false and the result to the error if there is an error and for the app-error-display to display the result', () => {
    spyOn(service, 'messageMe').and.returnValue(of({ data: null, errors: [{ message: 'Test error' }] } as any));
    component.loggedIn = true;
    component.onSubmit(fakeForm);

    expect(service.messageMe).toHaveBeenCalledWith('Test message');
    expect(component.messageGood).toBeFalse();
    expect(component.result).toEqual('Test error');

    fixture.detectChanges()

    const errorDisplay = debugEl.query(By.css('app-error-display'));
    expect(errorDisplay).toBeTruthy();
    expect((errorDisplay.nativeElement as HTMLElement).innerText.trim()).toEqual(component.result!);
  });

  it('should send out the messageMe method of the auth service when onSubmit is called then sets the messageGood property to true and result to a generic success message if there is success and for the app-error-display to display the result', () => {
    spyOn(service, 'messageMe').and.returnValue(of({ data: { messageMe:  {success: true } }, errors: null } as any));
    component.loggedIn = true;
    component.onSubmit(fakeForm);

    expect(service.messageMe).toHaveBeenCalledWith('Test message');
    expect(component.messageGood).toBeTrue();
    expect(component.result).toEqual('Message sent. Thank you for your feedback.');

    fixture.detectChanges()

    const errorDisplay = debugEl.query(By.css('app-error-display'));
    expect(errorDisplay).toBeTruthy();
    expect((errorDisplay.nativeElement as HTMLElement).innerText.trim()).toEqual(component.result!);
  });

  it('should call the scrollIntoView method on the element passed into the scroll method', () => {
    const spy = jasmine.createSpyObj('el', ['scrollIntoView']);
    component.scroll(spy);
    expect(spy['scrollIntoView']).toHaveBeenCalled();
  });

  it('should call the scroll method with the appropriate article if the list item in the display box is clicked', () => {
    spyOn(component, 'scroll');
    component.loggedIn = true;
    fixture.detectChanges();

    const liList = debugEl.queryAll(By.css('li'));
    for (let li of liList) {
      const span = li.query(By.css('span'));
      span.nativeElement.click();
    }
    expect(component.scroll).toHaveBeenCalledTimes(5);

    const articles = debugEl.queryAll(By.css('article'));
    for (let article of articles) {
      expect(component.scroll).toHaveBeenCalledWith(article.nativeElement);
    }
  });

  it('should render a app-loading spinner on the button if the loading property on the component is true', () => {
    component.loggedIn = true;
    component.loading = true;

    fixture.detectChanges()

    const button = debugEl.query(By.css('app-button'));
    expect(button.componentInstance.disabled).toBeTrue();
    expect(button.query(By.css('app-loading'))).toBeTruthy();
  });

});

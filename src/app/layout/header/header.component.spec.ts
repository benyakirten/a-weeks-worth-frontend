import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { StoreModule } from '@ngrx/store';

import { HeaderComponent } from './header.component';

import * as fromApp from 'src/app/store/app.reducer';

import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { SharedModule } from 'src/app/shared/shared.module';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  let authService: AuthService;
  let router: Router;

  let debugEl: DebugElement;
  let nativeEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      imports: [
        StoreModule.forRoot(fromApp.appReducer),
        RouterTestingModule,
        SharedModule
      ],
      providers: [
        AuthService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);

    fixture.detectChanges();

    debugEl = fixture.debugElement;
    nativeEl = fixture.nativeElement;
  });

  it('should have link to / when clicking on the logo', () => {
    const a = debugEl.query(By.css('.left')).query(By.css('a'));
    const href = a.nativeElement.getAttribute('href');
    expect(href).toEqual('/');
  });

  it('should not render a link to /the-week, /groups, /account or show a logout span if the user is not logged in, instead a link to /auth', () => {
    component.loggedIn = false;
    fixture.detectChanges();

    const centerLinks = debugEl.query(By.css('.center')).queryAll(By.css('a'));
    expect(centerLinks.length).toEqual(1);
    expect(centerLinks[0].nativeElement.getAttribute('href')).toEqual('/recipes');

    const rightLinks = debugEl.query(By.css('.right')).queryAll(By.css('a'));
    expect(rightLinks.length).toEqual(1);
    expect(rightLinks[0].nativeElement.getAttribute('href')).toEqual('/auth');

    const rightSpan = debugEl.query(By.css('.right')).query(By.css('span'));
    expect(rightSpan).not.toBeTruthy();
  });

  it('should render links to /the-week, /groups, /account and a span to logout if the user is logged in, instead of a link to /auth', () => {
    component.loggedIn = true;
    fixture.detectChanges();

    const centerLinks = debugEl.query(By.css('.center')).queryAll(By.css('a'));
    expect(centerLinks.length).toEqual(3);
    expect(centerLinks[0].nativeElement.getAttribute('href')).toEqual('/recipes');
    expect(centerLinks[1].nativeElement.getAttribute('href')).toEqual('/the-week');
    expect(centerLinks[2].nativeElement.getAttribute('href')).toEqual('/groups');

    const right = debugEl.query(By.css('.right'));
    const rightLinks = right.queryAll(By.css('a'));
    expect(rightLinks.length).toEqual(1);
    expect(rightLinks[0].nativeElement.getAttribute('href')).toEqual('/account');

    const rightSpan = right.query(By.css('span'));
    expect(rightSpan).toBeTruthy();
  });

  it('should not render the links on the right hand side but a loading spinner if the loading property is true', () => {
    component.loading = true;
    fixture.detectChanges();

    const right = debugEl.query(By.css('.right'));
    const loadingSpinner = right.query(By.css('app-loading'));
    expect(loadingSpinner).toBeTruthy();

    const a = right.queryAll(By.css('a'));
    expect(a.length).toEqual(0);

    const span = right.query(By.css('span'));
    expect(span).not.toBeTruthy();
  })

  it('should call the auth service logout and navigate to the /auth page when the logout method is triggered', () => {
    spyOn(authService, 'logout');
    spyOn(router, 'navigate');

    component.logout();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalled();
  })
});

import { TestBed } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthGuard);
  });

  afterEach(() => {
    localStorage.removeItem('AWW_expiration');
  });

  it('should return true if local storage cannot find AWW_expiration', () => {
    expect(guard.canActivate()).toBeTrue();
  });

  it('should return true if local storage can find AWW_expiration but it is in the past', () => {
    localStorage.setItem('AWW_expiration', JSON.stringify(Date.now() - 1000));
    expect(guard.canActivate()).toBeTrue();
  });

  it('should return false if local storage can find AWW_expiration and it is in the future', () => {
    localStorage.setItem('AWW_expiration', JSON.stringify(Date.now() + 1000));
    expect(guard.canActivate()).toBeFalse();
  });
});

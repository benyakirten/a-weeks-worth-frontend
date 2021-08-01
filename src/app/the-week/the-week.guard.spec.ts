import { TestBed } from '@angular/core/testing';

import { TheWeekGuard } from './the-week.guard';

describe('TheWeekGuard', () => {
  let guard: TheWeekGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(TheWeekGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { RecipesGuard } from './recipes.guard';

describe('RecipesGuard', () => {
  let guard: RecipesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RecipesGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

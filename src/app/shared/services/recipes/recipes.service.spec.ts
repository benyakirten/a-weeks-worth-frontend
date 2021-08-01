import { TestBed } from '@angular/core/testing';

import { RecipesGraphqlService } from './recipes.service';

describe('RecipesGraphqlService', () => {
  let service: RecipesGraphqlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipesGraphqlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

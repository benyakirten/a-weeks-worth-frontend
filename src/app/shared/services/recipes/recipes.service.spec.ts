import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';

import { RecipesService } from './recipes.service';

import { TranslatedRecipe } from 'src/app/types/general';
import { Recipe } from 'src/app/shared/classes/recipe/recipe';
import { Step } from 'src/app/shared/classes/step/step';
import { Ingredient } from 'src/app/shared/classes/ingredient/ingredient';

describe('RecipesService', () => {
  let service: RecipesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipesService);
  });

  it('should fetch data from an external API when the translate recipe method is called', () => {
    spyOn(window, 'fetch')
    service.translateRecipe('test-recipe', false);
    expect(window.fetch).toHaveBeenCalledWith(environment.translationUrl, { method: 'POST', body: JSON.stringify({ url: 'test-recipe', convertUnits: false }) });
  });

  it('should convert a response of type TranslatedRecipe to a Recipe when the prepareRecipe method is called', () => {
    const translatedRecipe: TranslatedRecipe = {
      name: 'Test Recipe',
      image: 'https://www.google.com',
      ingredients: [
        ['Test Ingredient 1', 1, 'tbsp'],
        ['Test Ingredient 2', 2, 'tsp'],
      ],
      preparation: [
        'Test prep 1',
        'Test prep 2'
      ],
      error: undefined
    }

    const recipe: Recipe = new Recipe(
      '',
      'Test Recipe',
      [new Ingredient('Test Ingredient 1', '1', 'tbsp'), new Ingredient('Test Ingredient 2', '2', 'tsp')],
      [new Step('Test prep 1', 1), new Step('Test prep 2', 2)],
      'https://www.google.com',
      'https://recipeurl.com'
    );

    const newRecipe = service.prepareRecipe(translatedRecipe, 'https://recipeurl.com');
    expect(newRecipe).toEqual(recipe);
  })
});

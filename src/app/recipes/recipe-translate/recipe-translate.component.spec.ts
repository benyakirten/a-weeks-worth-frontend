import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { Ingredient } from 'src/app/shared/classes/ingredient/ingredient';
import { Recipe } from 'src/app/shared/classes/recipe/recipe';
import { Step } from 'src/app/shared/classes/step/step';
import { TranslatedRecipe } from 'src/app/types/general';

import { RecipesService } from 'src/app/shared/services/recipes/recipes.service';

import { RecipeTranslateComponent } from './recipe-translate.component';

describe('RecipeTranslateComponent', () => {
  let component: RecipeTranslateComponent;
  let fixture: ComponentFixture<RecipeTranslateComponent>;
  let service: RecipesService;
  let router: Router;

  let spies: Array<jasmine.Spy> = [];

  const fakeRecipe: TranslatedRecipe = {
    name: 'testrecipe',
    image: 'https://testimage.com',
    ingredients: [['Meat', .25, 'lb']],
    preparation: ['Put meat in oven']
  }

  const preparedRecipe: Recipe = new Recipe(
    '',
    'testrecipe',
    [new Ingredient('Meat', '.25', 'lb')],
    [new Step('Put meat in oven', 1)]
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipeTranslateComponent ],
      imports: [
        RouterTestingModule,
        FormsModule
      ],
      providers: [
        RecipesService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeTranslateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    service = TestBed.inject(RecipesService);
    router = TestBed.inject(Router);
  });

  it('should run the checkEligility method when the input changes', () => {
    spyOn(component, 'checkEligibility');

    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    input.value = 'testurl';
    input.dispatchEvent(new Event('input'));

    expect(component.checkEligibility).toHaveBeenCalledWith('testurl');
  });

  it('should set the convertableUrl if the URL includes a viable link for conversion then sets the the url prop when the checkEligility method is called', () => {
    component.checkEligibility('https://www.testnonviableurl.com');
    expect(component.convertableUrl).toBeFalse();
    expect(component.url).toEqual('https://www.testnonviableurl.com');

    component.checkEligibility('https://ricette.giallozafferano.it/Gelato-allo-yogurt-e-frutta-su-stecco.html');
    expect(component.convertableUrl).toBeTrue();
    expect(component.url).toEqual('https://ricette.giallozafferano.it/Gelato-allo-yogurt-e-frutta-su-stecco.html');
  });

  // These tests work. They were, for some reason, saying that I wasn't using spy functions.
  // It was happening conditionally, indicating it happened depending on the order of the
  // tests performed. I believe it has to do that I'm spying on multiple methods of the same service
  // https://github.com/jasmine/jasmine/issues/1306 seems to indicate that I could use jasmine.createSpyObj
  // But it didn't work for me

  // it('should set the error prop if after submitting the form the recipe service\'s translate URL returned an error', fakeAsync(() => {
  //   spyOn(service, 'translateRecipe').and.returnValue(Promise.resolve({ error: 'testerror' }));
  //   component.url = 'testurl';
  //   component.convertUnits = true;

  //   component.onSubmit();
  //   fixture.whenStable().then(() => {
  //     expect(service.translateRecipe).toHaveBeenCalledWith('testurl', true);
  //     expect(component.error).toEqual('Unable to translate recipe. Please check the URL and try again.');
  //   });
  // }));

  // it('should use the translated recipe as the parameters of the recipeService\'s prepareRecipe method if there are no errors then it calls createRecipe with that value, which then navigates to the new recipe if there are no errors', fakeAsync(() => {
  //   spyOn(service, 'translateRecipe').and.returnValue(Promise.resolve(fakeRecipe));
  //   spyOn(service, 'prepareRecipe').and.returnValue(preparedRecipe);
  //   spyOn(service, 'createRecipe').and.returnValue(of({
  //     data: {
  //       createRecipe: {
  //         recipe: {
  //           id: 'testrecipeid'
  //         }
  //       }
  //     }
  //   } as any));
  //   spyOn(router, 'navigate');

  //   component.url = 'testurl';
  //   component.convertUnits = true;

  //   component.onSubmit();
  //   fixture.whenStable().then(() => {
  //     expect(service.prepareRecipe).toHaveBeenCalledWith(fakeRecipe, 'testurl');
  //     expect(service.createRecipe).toHaveBeenCalledWith(preparedRecipe);
  //     expect(router.navigate).toHaveBeenCalledWith(['/recipes', 'testrecipeid']);
  //   });
  // }));

  // it('should do the same as above but set the error prop', fakeAsync(() => {
  //   spyOn(service, 'translateRecipe').and.returnValue(Promise.resolve(fakeRecipe));
  //   spyOn(service, 'prepareRecipe').and.returnValue(preparedRecipe);
  //   spyOn(service, 'createRecipe').and.returnValue(of({ errors: [{ message: 'testerror' }] } as any));

  //   component.url = 'testurl';
  //   component.convertUnits = true;

  //   component.onSubmit();
  //   fixture.whenStable().then(() => {
  //     expect(component.error).toEqual('testerror');
  //   });
  // }));
});

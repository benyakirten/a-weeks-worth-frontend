import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { Ingredient } from 'src/app/shared/classes/ingredient/ingredient';
import { Recipe } from 'src/app/shared/classes/recipe/recipe';
import { Step } from 'src/app/shared/classes/step/step';

import { RecipesService } from 'src/app/shared/services/recipes/recipes.service';

import { RecipeFormComponent } from './recipe-form.component';

describe('RecipeFormComponent', () => {
  let component: RecipeFormComponent;
  let fixture: ComponentFixture<RecipeFormComponent>;
  let router: Router;

  let recipesService: RecipesService;

  const exampleRecipe = new Recipe(
    'testid',
    'test name',
    [
      new Ingredient('test ingredient 1', 'test quantity 1', 'test unit 1'),
      new Ingredient('test ingredient 2', 'test quantity 2', 'test unit 2'),
    ],
    [
      new Step('test step 1', 1),
      new Step('test step 2', 2),
    ],
    'https://www.testphotoimage.url',
    'https://www.testurl.com'
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecipeFormComponent],
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        RecipesService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    router = TestBed.inject(Router);
    recipesService = TestBed.inject(RecipesService);
  });

  it('should navigate away when the cancel button is clicked', () => {
    spyOn(router, 'navigate');

    // No recipe - navigate to all recipes
    const buttons = fixture.debugElement.query(By.css('.form__buttons')).queryAll(By.css('app-button'));
    buttons[1].nativeElement.click();
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['/recipes']);

    // With recipe - navigate to details screen
    component.recipe = exampleRecipe;
    fixture.detectChanges();
    const newButtons = fixture.debugElement.query(By.css('.form__buttons')).queryAll(By.css('app-button'));
    newButtons[2].nativeElement.click();
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['/recipes', exampleRecipe.id]);
  });

  describe('creating a recipe', () => {
    it('should create an empty recipe form with one blank ingredient and one blank step', () => {
      expect(component.recipeForm.value['name']).toEqual('');
      expect(component.recipeForm.value['ingredients']).toEqual([{ name: null, quantity: null, unit: null }]);
      expect(component.recipeForm.value['steps']).toEqual([{ step: null }]);
      expect(component.recipeForm.value['photo']).toEqual('');
      expect(component.recipeForm.value['url']).toEqual('');
    });

    it('should call the recipesService createRecipe method then show a modal with the error if the onSubmit method is called and an error is returned', () => {
      spyOn(recipesService, 'createRecipe').and.returnValue(of({ errors: [{ message: 'testerror' }] } as any));
      spyOn(component, 'showModal');

      const inputs = fixture.debugElement.queryAll(By.css('input'));
      inputs[0].nativeElement.value = 'test create name';
      inputs[1].nativeElement.value = 'test create url';
      inputs[2].nativeElement.value = 'test create photo';
      inputs[3].nativeElement.value = 'test create ingredient name';
      inputs[4].nativeElement.value = 'test create ingredient quantity';
      inputs[5].nativeElement.value = 'test create ingredient unit';

      inputs[0].nativeElement.dispatchEvent(new Event('input'));
      inputs[1].nativeElement.dispatchEvent(new Event('input'));
      inputs[2].nativeElement.dispatchEvent(new Event('input'));
      inputs[3].nativeElement.dispatchEvent(new Event('input'));
      inputs[4].nativeElement.dispatchEvent(new Event('input'));
      inputs[5].nativeElement.dispatchEvent(new Event('input'));

      const textArea = fixture.debugElement.query(By.css('textarea'));
      (textArea.nativeElement as HTMLTextAreaElement).value = 'test create step';
      textArea.nativeElement.dispatchEvent(new Event('input'));

      component.onSubmit();

      expect(recipesService.createRecipe).toHaveBeenCalledWith(new Recipe(
        '',
        'test create name',
        [new Ingredient('test create ingredient name', 'test create ingredient quantity', 'test create ingredient unit')],
        [new Step('test create step', 1)],
        'test create photo',
        'test create url',
      ));
      expect(component.modalTitle).toEqual('An Error Occurred While Creating the Recipe');
      // expect(component.modalText).toEqual(`
      //   testerror -- Please check the recipe and try again. If the
      //   problem persists, it may be an error with the database. Please try to
      //   contact Ben and tell him about the problem.
      // `);
      expect(component.showModal).toHaveBeenCalled();
    });

    it('should call the recipesService updateRecipe method then show a modal with the error if the onSubmit method is called and an error is returned', () => {
      spyOn(recipesService, 'createRecipe').and.returnValue(of({
        data: {
          createRecipe: {
            recipe: {
              id: 'testnavigation'
            }
          }
        }
       } as any));
      spyOn(router, 'navigate');

      const inputs = fixture.debugElement.queryAll(By.css('input'));
      inputs[0].nativeElement.value = 'test create name';
      inputs[1].nativeElement.value = 'test create url';
      inputs[2].nativeElement.value = 'test create photo';
      inputs[3].nativeElement.value = 'test create ingredient name';
      inputs[4].nativeElement.value = 'test create ingredient quantity';
      inputs[5].nativeElement.value = 'test create ingredient unit';

      inputs[0].nativeElement.dispatchEvent(new Event('input'));
      inputs[1].nativeElement.dispatchEvent(new Event('input'));
      inputs[2].nativeElement.dispatchEvent(new Event('input'));
      inputs[3].nativeElement.dispatchEvent(new Event('input'));
      inputs[4].nativeElement.dispatchEvent(new Event('input'));
      inputs[5].nativeElement.dispatchEvent(new Event('input'));

      const textArea = fixture.debugElement.query(By.css('textarea'));
      (textArea.nativeElement as HTMLTextAreaElement).value = 'test create step';
      textArea.nativeElement.dispatchEvent(new Event('input'));

      component.onSubmit();

      expect(recipesService.createRecipe).toHaveBeenCalledWith(new Recipe(
        '',
        'test create name',
        [new Ingredient('test create ingredient name', 'test create ingredient quantity', 'test create ingredient unit')],
        [new Step('test create step', 1)],
        'test create photo',
        'test create url',
      ));
      expect(router.navigate).toHaveBeenCalledWith(['/recipes', 'testnavigation']);
    });
  });

  describe('editing a recipe', () => {
    beforeEach(() => {
      component.recipe = exampleRecipe;
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should create a form with appropriate controls', () => {
      expect(component.recipeForm.value['name']).toEqual(exampleRecipe.name);
      expect(component.recipeForm.value['ingredients']).toEqual(
        exampleRecipe.ingredients.map(i => ({ name: i.name, quantity: i.quantity, unit: i.unit }))
      );
      expect(component.recipeForm.value['steps']).toEqual(exampleRecipe.steps.map(s => ({ step: s.step })));
      expect(component.recipeForm.value['photo']).toEqual(exampleRecipe.photo);
      expect(component.recipeForm.value['url']).toEqual(exampleRecipe.url);
    });

    it('should return FormControls with length and properties equal to how many ingredients there are in the form when calling get ingredientControls', () => {
      const controls = component.ingredientControls;
      expect(controls).toEqual((<FormArray>component.recipeForm.get('ingredients')).controls)
      expect(controls.length).toEqual(component.recipeForm.value['ingredients'].length);

      for (let i = 0; i < controls.length; i++) {
        const ing = exampleRecipe.ingredients[i];
        expect(controls[i].value).toEqual({ name: ing.name, quantity: ing.quantity, unit: ing.unit });
      }
    });

    it('should return FormControls with length and properties equal to how many steps there are in the form when calling get stepControls', () => {
      const controls = component.stepControls;
      expect(controls).toEqual((<FormArray>component.recipeForm.get('steps')).controls)
      expect(controls.length).toEqual(component.recipeForm.value['steps'].length);

      for (let i = 0; i < controls.length; i++) {
        const step = exampleRecipe.steps[i];
        expect(controls[i].value).toEqual({ step: step.step });
      }
    });

    it('should add a blank row of ingredient controls when the onAddIngredient method is called', () => {
      component.onAddIngredient();
      const controls = component.ingredientControls;
      expect(controls[controls.length - 1].value).toEqual({ name: null, quantity: null, unit: null });
    });

    it('should add a blank row of step controls when the onAddIngredient method is called', () => {
      component.onAddStep();
      const controls = component.stepControls;
      expect(controls[controls.length - 1].value).toEqual({ step: null });
    });

    it('should remove the FormArray for the ingredient at the specified index when the onSubtractIngredient method is called', () => {
      component.onSubtractIngredient(0);
      const controls = component.ingredientControls;
      expect(controls[0].value).toEqual({ name: 'test ingredient 2', quantity: 'test quantity 2', unit: 'test unit 2' });
    });

    it('should remove the FormArray for the step at the specified index when the onSubtractStep method is called', () => {
      component.onSubtractStep(0);
      const controls = component.stepControls;
      expect(controls[0].value).toEqual({ step: 'test step 2' });
    });

    it('should call onDelete when clicking on the delete button', () => {
      spyOn(component, 'onDelete');

      const buttons = fixture.debugElement.query(By.css('.form__buttons')).queryAll(By.css('app-button'));
      buttons[1].nativeElement.click();
      fixture.detectChanges();

      expect(component.onDelete).toHaveBeenCalled();
    });

    it('should set the error to the error if the recipesService deleteRecipe method returns an error and not call navigateAway', () => {
      spyOn(recipesService, 'deleteRecipe').and.returnValue(of({ errors: [{ message: 'testerror' }] } as any));
      spyOn(component, 'navigateAway');

      component.onDelete();
      expect(recipesService.deleteRecipe).toHaveBeenCalledWith(exampleRecipe.id);
      expect(component.error).toEqual('testerror');
      expect(component.navigateAway).not.toHaveBeenCalled();
    });

    it('should set the error to the error if the recipesService deleteRecipe method returns an error', () => {
      spyOn(recipesService, 'deleteRecipe').and.returnValue(of({ data: null } as any));
      spyOn(component, 'navigateAway');

      component.onDelete();
      expect(recipesService.deleteRecipe).toHaveBeenCalledWith(exampleRecipe.id);
      expect(component.navigateAway).toHaveBeenCalled();
    });

    it('should set the modal text and show the modal if the form isn\'t valid or is pristine and the onSubmit method is called', () => {
      spyOn(component, 'showModal')

      component.onSubmit();
      expect(component.modalTitle).toEqual('An Error Occurred While Creating The Recipe')
      expect(component.modalText).toEqual(`
        Something went wrong. Either the recipe isn't valid or is unchanged.
        Please check out all your responses and fill out all boxes marked
        as required or. Also remember to change at least some detail if you're updating a recipe, even
        if it doesn't make sense, for example you can put 'N/A' for a unit.
      `);
      expect(component.showModal).toHaveBeenCalled();
    });

    it('should call the recipesService updateRecipe method then show a modal with the error if the onSubmit method is called and an error is returned', () => {
      spyOn(recipesService, 'updateRecipe').and.returnValue(of({ errors: [{ message: 'testerror' }] } as any));
      spyOn(component, 'showModal');

      const input = fixture.debugElement.query(By.css('input'));
      input.nativeElement.value = 'test name 2';
      input.nativeElement.dispatchEvent(new Event('input'));
      input.nativeElement.value = 'test name';
      input.nativeElement.dispatchEvent(new Event('input'));

      component.onSubmit();

      expect(recipesService.updateRecipe).toHaveBeenCalledWith(exampleRecipe);
      expect(component.modalTitle).toEqual('An Error Occurred While Updating the Recipe');
      // expect(component.modalText).toEqual(`
      //   testerror -- Please check the recipe and try again. If the
      //   problem persists, it may be an error with the database. Please try to
      //   contact Ben and tell him about the problem.
      // `);
      expect(component.showModal).toHaveBeenCalled();
    });

    it('should call the recipesService updateRecipe method then show a modal with the error if the onSubmit method is called and an error is returned', () => {
      spyOn(recipesService, 'updateRecipe').and.returnValue(of({
        data: {
          updateRecipe: {
            recipe: {
              id: 'testnavigation'
            }
          }
        }
       } as any));
      spyOn(router, 'navigate');

      const input = fixture.debugElement.query(By.css('input'));
      input.nativeElement.value = 'test name 2';
      input.nativeElement.dispatchEvent(new Event('input'));
      input.nativeElement.value = 'test name';
      input.nativeElement.dispatchEvent(new Event('input'));

      component.onSubmit();

      expect(recipesService.updateRecipe).toHaveBeenCalledWith(exampleRecipe);
      expect(router.navigate).toHaveBeenCalledWith(['/recipes', 'testnavigation']);
    });
  });
});

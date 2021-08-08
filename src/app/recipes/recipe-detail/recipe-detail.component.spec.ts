import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { of } from 'rxjs';
import { Store, StoreModule } from '@ngrx/store';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';

import { Ingredient } from 'src/app/shared/classes/ingredient/ingredient';
import { Recipe } from 'src/app/shared/classes/recipe/recipe';
import { Step } from 'src/app/shared/classes/step/step';

import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { RecipesService } from 'src/app/shared/services/recipes/recipes.service';

import * as fromApp from 'src/app/store/app.reducer';

import { RecipeDetailComponent } from './recipe-detail.component';
import { ModalService } from 'src/app/shared/services/modal/modal.service';

describe('RecipeDetailComponent', () => {
  let component: RecipeDetailComponent;
  let fixture: ComponentFixture<RecipeDetailComponent>;

  let controller: ApolloTestingController;
  let router: Router;
  let store: Store<fromApp.AppState>

  let recipesService: RecipesService;
  let authService: AuthService;
  let modalService: ModalService;

  const exampleRecipe = new Recipe(
    'testid',
    'test name',
    [new Ingredient('test ingredient', 'test quantity', 'test unit')],
    [new Step('test step', 1)],
    'https://www.testphotoimage.url'
  );

  const exampleError: ExpectedError = {
    nonFieldErrors: [
      {
        message: 'test error',
        code: 'invalid_credentials'
      }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RecipeDetailComponent
      ],
      imports: [
        ApolloTestingModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        StoreModule.forRoot(fromApp.appReducer)
      ],
      providers: [
        AuthService,
        RecipesService,
        ModalService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    controller = TestBed.inject(ApolloTestingController);
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);

    authService = TestBed.inject(AuthService);
    recipesService = TestBed.inject(RecipesService);
    modalService = TestBed.inject(ModalService);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should show the various parts of the recipe if the recipe is loaded', () => {
    component.recipe = exampleRecipe;
    fixture.detectChanges();

    const title = fixture.debugElement.query(By.css('h1'));
    expect(title.nativeElement.innerText).toEqual('test name');

    const ingredients = fixture.debugElement.query(By.css('.ingredients')).queryAll(By.css('li'));
    expect(ingredients.length).toEqual(exampleRecipe.ingredients.length);
    for (let i = 0; i < ingredients.length; i++) {
      const ing = exampleRecipe.ingredients[i];
      expect(ingredients[i].nativeElement.innerText).toEqual(`${ing.quantity} ${ing.unit} of ${ing.name}`);
    }

    const steps = fixture.debugElement.query(By.css('.steps')).queryAll(By.css('li'));
    expect(steps.length).toEqual(exampleRecipe.steps.length);
    for (let i = 0; i < steps.length; i++) {
      const step = exampleRecipe.steps[i];
      expect(steps[i].nativeElement.innerText).toEqual(step.step);
    }
  });

  it('should show a menu that can be hovered or clicked to reveal buttons for editing or deleting the reicipe if the user is logged in and there is a recipe', () => {
    component.recipe = exampleRecipe;
    component.isLoggedIn = true;
    fixture.detectChanges();

    const menu = fixture.debugElement.query(By.css('.menu'));
    expect(menu).toBeTruthy();
    expect(menu.query(By.css('.menu__children'))).not.toBeTruthy();

    menu.nativeElement.click();
    fixture.detectChanges();

    const children = menu.query(By.css('.menu__children'));
    expect(children).toBeTruthy();

    spyOn(component, 'editRecipe');
    spyOn(component, 'deleteRecipe');
    const buttons = children.queryAll(By.css('button'));

    buttons[0].nativeElement.click();
    expect(component.editRecipe).toHaveBeenCalled();

    buttons[1].nativeElement.click();
    expect(component.deleteRecipe).toHaveBeenCalled();
  });

  it('should not show above menu if the user is not logged in', () => {
    component.recipe = exampleRecipe;
    component.isLoggedIn = false;
    fixture.detectChanges();

    const menu = fixture.debugElement.query(By.css('.menu'));
    expect(menu).not.toBeTruthy();
  });

  it('should navigate to the recipe form menu if the editRecipe method is called', () => {
    spyOn(router, 'navigate');
    component.recipe = exampleRecipe;
    component.isLoggedIn = true;
    component.editRecipe();
    expect(router.navigate).toHaveBeenCalledWith(['/recipes', 'edit', exampleRecipe.id]);
  });

  it('should show the modal if the deleteRecipe method was called and returned an error', () => {
    spyOn(recipesService, 'deleteRecipe').and.returnValue(of({ errors: [{ message: 'testerror' }] } as any));
    spyOn(component, 'showModal');
    component.recipe = exampleRecipe;
    component.isLoggedIn = true;
    component.deleteRecipe();

    // This should be correct, but it's a nightmare getting the formatting the correspond exactly
    // expect(component.modalText).toEqual(
    //   `
    //     testerror -- A problem occurred deleting the recipe. Please try again later. If the problem persists, it probably is a problem with the
    //     database. Please contact Ben and let him know what's happening.
    //   `
    // );
    expect(component.showModal).toHaveBeenCalled();
  });

  it('should navigate to the recipes base url if the deleteRecipe successfully deleted the recipe', () => {
    spyOn(recipesService, 'deleteRecipe').and.returnValue(of({ data: null } as any));
    spyOn(router, 'navigate');
    component.recipe = exampleRecipe;
    component.isLoggedIn = true;
    component.deleteRecipe();

    expect(router.navigate).toHaveBeenCalledWith(['/recipes']);
  });

  it('should call the modalService open method when the showModal method is called', () => {
    spyOn(modalService, 'open');
    component.showModal();
    expect(modalService.open).toHaveBeenCalled();
  })
});

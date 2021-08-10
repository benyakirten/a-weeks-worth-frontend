import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { of } from 'rxjs';

import { Ingredient } from 'src/app/shared/classes/ingredient/ingredient';
import { Recipe } from 'src/app/shared/classes/recipe/recipe';
import { Meal } from 'src/app/shared/classes/meal/meal';

import { LimitedMealGroup } from 'src/app/types/graphql/groups';
import { MealInputType } from 'src/app/types/general';

import { Day } from 'src/app/shared/enums/day.enum';
import { Time } from 'src/app/shared/enums/time.enum';

import { GET_ALL_RECIPES } from 'src/app/shared/graphql/queries';

import { RecipesService } from 'src/app/shared/services/recipes/recipes.service';
import { WeekService } from 'src/app/shared/services/week/week.service';

import { WeekFormComponent } from './week-form.component';
import { DayKey } from 'src/app/types/graphql/individual';

describe('WeekFormComponent', () => {
  let component: WeekFormComponent;
  let fixture: ComponentFixture<WeekFormComponent>;
  let controller: ApolloTestingController;
  let router: Router;
  let weekService: WeekService;
  let recipesService: RecipesService;

  const recipes: Array<Recipe> = [
    new Recipe('testrecipeid1', 'test recipe 1', [new Ingredient('Meat', '1/4', 'lb')], []),
    new Recipe('testrecipeid2', 'test recipe 2', [new Ingredient('Meat', '1/2', 'lb')], []),
    new Recipe('testrecipeid3', 'test recipe 3', [new Ingredient('Bread', '10', 'loaves')], []),
  ];

  const group: LimitedMealGroup = {
    id: 'test group id',
    name: 'test group name',
    members: ['test user 1', 'test user 2'],
    shoppingList: [
      new Ingredient('Bread', '2', 'loaves'),
      new Ingredient('Bread', '3', 'loaves'),
      new Ingredient('Meat', '3/4', 'lb'),
    ],
    meals: [
      {
        day: 'MON',
        time: 'B',
        text: 'test meal 1',
        recipe: {
          id: 'testrecipeid1',
          name: 'test recipe 1'
        }
      },
      {
        day: 'TUE',
        time: 'B',
        text: 'test meal 2'
      },
      {
        day: 'WED',
        time: 'B',
        recipe: {
          id: 'testrecipeid3',
          name: 'test recipe 3'
        }
      }
    ]
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        WeekFormComponent
      ],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        ApolloTestingModule
      ],
      providers: [
        WeekService,
        RecipesService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    router = TestBed.inject(Router);
    weekService = TestBed.inject(WeekService);
    recipesService = TestBed.inject(RecipesService);
    controller = TestBed.inject(ApolloTestingController);

    spyOnProperty(recipesService, 'recipes').and.returnValue(of({ data: { recipes }}));

    component.name = group.name;
    component.meals = group.meals;
    component.shoppingList = group.shoppingList;
    component.loading = false;

    component.ngOnInit();
    fixture.detectChanges();
  });

  afterEach(() => {
    controller.expectOne(GET_ALL_RECIPES).flush({
      data: {
        recipes: []
      }
    });
    controller.verify();
  });

  it('should initialize the form correctly based on the loaded group then render the proper UI elements', () => {
    expect(component.recipes).toEqual(recipes);

    expect(component.weekForm.value['shoppingList']).toEqual(group.shoppingList.map(i => ({ name: i.name, quantity: i.quantity, unit: i.unit })));
    expect(component.weekForm.value['meals']).toEqual(group.meals.map(m => ({ time: m.time, day: m.day, text: m.text ? m.text : null, recipeId: m.recipe ? m.recipe.id : null })));

    const shoppingListSection = fixture.debugElement.query(By.css('.shopping-list'));
    const shoppingListItems = shoppingListSection.queryAll(By.css('li'));

    expect(shoppingListItems.length).toEqual(group.shoppingList.length);
    for (let i = 0; i < shoppingListItems.length; i++) {
      const inputs = shoppingListItems[i].queryAll(By.css('input'));
      expect(inputs[0].nativeElement.value).toEqual(group.shoppingList[i].name);
      expect(inputs[1].nativeElement.value).toEqual(group.shoppingList[i].quantity);
      expect(inputs[2].nativeElement.value).toEqual(group.shoppingList[i].unit);
    }

    const mealsSection = fixture.debugElement.query(By.css('.meals'));
    const mealsList = mealsSection.queryAll(By.css('li'));

    expect(mealsList.length).toEqual(group.meals.length);
    for (let i = 0; i < mealsList.length; i++) {
      const selects = mealsList[i].queryAll(By.css('select'));
      expect(selects[0].nativeElement.value.slice(3)).toEqual(group.meals[i].day);
      expect(selects[1].nativeElement.value.slice(3)).toEqual(group.meals[i].time);
      if (group.meals[i].recipe) {
        expect(selects[2].nativeElement.value.slice(3)).toEqual(group.meals[i].recipe?.id);
      }
      const recipeOptions = selects[2].queryAll(By.css('option'));
      expect(recipeOptions.length).toEqual(recipes.length + 1);
      for (let j = 0; j < recipeOptions.length - 1; j++) {
        expect(recipeOptions[j + 1].nativeElement.value.slice(3)).toEqual(recipes[j].id);
        expect(recipeOptions[j + 1].nativeElement.innerText.trim()).toEqual(recipes[j].name);
      }
    }
  });

  it('should return the controls with appropriate values when getting the controls properties', () => {
    const shoppingListControls = component.shoppingListControls;
    expect(shoppingListControls.length).toEqual(group.shoppingList.length);
    for (let i = 0; i < shoppingListControls.length; i++) {
      const item = group.shoppingList[i];
      expect(shoppingListControls[i].value).toEqual({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit
      });
    }

    const mealsControls = component.mealsControls;
    expect(mealsControls.length).toEqual(group.meals.length);
    for (let i = 0; i < mealsControls.length; i++) {
      const item = group.meals[i];
      expect(mealsControls[i].value).toEqual({
        day: item.day,
        time: item.time,
        text: item.text ? item.text : null,
        recipeId: item.recipe ? item.recipe.id : null
      });
    }
  });

  it('should add the appropriate items when the addMeal and addShoppingItem methods are called', () => {
    // addShoppingItem() inserts the item at index 0
    component.addShoppingItem();
    expect(component.shoppingListControls.length).toEqual(4);
    const addedShoppingItem = component.shoppingListControls[0];
    expect(addedShoppingItem.value).toEqual({ name: null, quantity: null, unit: null });

    // To demonstrate the list has been unshifted
    const firstGroupShoppingItem = group.shoppingList[0];
    expect(component.shoppingListControls[1].value).toEqual({
      name: firstGroupShoppingItem.name,
      quantity: firstGroupShoppingItem.quantity,
      unit: firstGroupShoppingItem.unit
    });

    component.addMeal();
    expect(component.mealsControls.length).toEqual(4);
    const addedMeal = component.mealsControls[component.mealsControls.length - 1];
    expect(addedMeal.value).toEqual({ day: 'MON', time: 'B', text: null, recipeId: null });
  });

  it('should delete the appropriate items when the removeShoppingItem and removeMeal methods are called', () => {
    component.removeMeal(0);
    component.removeShoppingItem(0);

    expect(component.weekForm.value['shoppingList'][0]).toEqual({
      name: 'Bread',
      quantity: '3',
      unit: 'loaves'
    });

    expect(component.weekForm.value['meals'][0]).toEqual({
      day: 'TUE',
      time: 'B',
      text: 'test meal 2',
      recipeId: null
    });
  });

  it('should delete the appropriate lists when the deleteShoppingList and deleteAllMeals methods are called', () => {
    component.deleteAllMeals();
    component.deleteShoppingList();

    expect(component.weekForm.value['shoppingList'].length).toEqual(0);
    expect(component.weekForm.value['meals'].length).toEqual(0);
  });

  it('should return true if all day and times of meals are unique from the getDaysAndTimesUnique property if true and vice versa', () => {
    expect(component.daysAndTimesUnique).toBeTrue();

    const repeatedDays = new FormArray([]);
    repeatedDays.push(
      new FormGroup({
        time: new FormControl('B', [Validators.required]),
        day: new FormControl('MON', [Validators.required]),
        text: new FormControl(null),
        recipeId: new FormControl(null)
      })
    );

    repeatedDays.push(
      new FormGroup({
        time: new FormControl('B', [Validators.required]),
        day: new FormControl('MON', [Validators.required]),
        text: new FormControl(null),
        recipeId: new FormControl(null)
      })
    );

    component.weekForm = new FormGroup({
      'meals': repeatedDays
    });
    expect(component.daysAndTimesUnique).toBeFalse();
  });

  it('should call updateIndividual in the onSubmit method if the groupId is my-week and then pass the appropriate information to the weekService updateWeekForIndividual mutation', () => {
    spyOn(weekService, 'updateWeekForIndividual').and.returnValue(of({ data: true } as any));
    spyOn<any>(component, 'handleMutationResults');

    component.groupId = 'my-week';
    component.onSubmit();

    const processedShoppingList = component.weekForm.value['shoppingList'];
    const processedMeals: Array<MealInputType> = (<Array<Meal>>component.weekForm.value['meals'])
      .map(m => ({
        ...m,
        time: Time[m.time].toUpperCase(),
        day: Day[m.day].toUpperCase()
      }));

    expect(weekService.updateWeekForIndividual).toHaveBeenCalledWith(processedShoppingList, processedMeals);
    expect(component['handleMutationResults']).toHaveBeenCalledWith(undefined, true as any);
  });

  it('should call updateGroup in the onSubmit method if the groupId is my-week and then pass the appropriate information to the weekService updateWeekForGroup mutation', () => {
    spyOn(weekService, 'updateWeekForGroup').and.returnValue(of({ data: true } as any));
    spyOn<any>(component, 'handleMutationResults');

    component.groupId = 'testgroupid';
    component.onSubmit();

    const processedShoppingList = component.weekForm.value['shoppingList'];
    const processedMeals: Array<MealInputType> = (<Array<Meal>>component.weekForm.value['meals'])
      .map(m => ({
        ...m,
        time: Time[m.time].toUpperCase(),
        day: Day[m.day].toUpperCase()
      }));

    expect(weekService.updateWeekForGroup).toHaveBeenCalledWith('testgroupid', processedShoppingList, processedMeals);
    expect(component['handleMutationResults']).toHaveBeenCalledWith(undefined, true as any);
  });

  it('should add the recipe\'s ingredients to the shopping list when the addRecipeIngredientsToShoppingList method is called', () => {
    component.addRecipeIngredientsToShoppingList();

    const slc = component.shoppingListControls;
    expect(slc.length).toEqual(group.shoppingList.length + 2);

    expect(slc[slc.length - 2].value).toEqual({
      name: 'Meat',
      quantity: '1/4',
      unit: 'lb'
    });

    expect(slc[slc.length - 1].value).toEqual({
      name: 'Bread',
      quantity: '10',
      unit: 'loaves'
    });
  });

  it('should correctly consolidate the shopping list when the consolidateShoppingList method is called', () => {
    // Just get a whole lot of ingredients in there
    component.addRecipeIngredientsToShoppingList();
    component.consolidateShoppingList();

    const slc = component.shoppingListControls;

    expect(slc[0].value).toEqual({
      name: 'Bread',
      quantity: '15',
      unit: 'loaves'
    });

    expect(slc[1].value).toEqual({
      name: 'Meat',
      quantity: '1',
      unit: 'pounds'
    });
  });

  it('should replace all meals with blanks for lunch and dinner for every day of the week if the resetToBlankWeek method is called', () => {
    component.resetToBlankWeek();

    const { mealsControls } = component;

    // MONDAY
    expect(mealsControls[0].value).toEqual({
      time: 'L',
      day: 'MON',
      text: null,
      recipeId: null
    });
    expect(mealsControls[1].value).toEqual({
      time: 'D',
      day: 'MON',
      text: null,
      recipeId: null
    });

    // TUESDAY
    expect(mealsControls[2].value).toEqual({
      time: 'L',
      day: 'TUE',
      text: null,
      recipeId: null
    });
    expect(mealsControls[3].value).toEqual({
      time: 'D',
      day: 'TUE',
      text: null,
      recipeId: null
    });

    // WEDNESDAY
    expect(mealsControls[4].value).toEqual({
      time: 'L',
      day: 'WED',
      text: null,
      recipeId: null
    });
    expect(mealsControls[5].value).toEqual({
      time: 'D',
      day: 'WED',
      text: null,
      recipeId: null
    });

    // THURSDAY
    expect(mealsControls[6].value).toEqual({
      time: 'L',
      day: 'THU',
      text: null,
      recipeId: null
    });
    expect(mealsControls[7].value).toEqual({
      time: 'D',
      day: 'THU',
      text: null,
      recipeId: null
    });

    // FRIDAY
    expect(mealsControls[8].value).toEqual({
      time: 'L',
      day: 'FRI',
      text: null,
      recipeId: null
    });
    expect(mealsControls[9].value).toEqual({
      time: 'D',
      day: 'FRI',
      text: null,
      recipeId: null
    });

    // SATURDAY
    expect(mealsControls[10].value).toEqual({
      time: 'L',
      day: 'SAT',
      text: null,
      recipeId: null
    });
    expect(mealsControls[11].value).toEqual({
      time: 'D',
      day: 'SAT',
      text: null,
      recipeId: null
    });

    // SUNDAY
    expect(mealsControls[12].value).toEqual({
      time: 'L',
      day: 'SUN',
      text: null,
      recipeId: null
    });
    expect(mealsControls[13].value).toEqual({
      time: 'D',
      day: 'SUN',
      text: null,
      recipeId: null
    });
  });
});

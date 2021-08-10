import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';

import { WeekService } from 'src/app/shared/services/week/week.service';
import { ModalService } from 'src/app/shared/services/modal/modal.service';

import * as fromApp from 'src/app/store/app.reducer';

import { WeekDetailComponent } from './week-detail.component';

import { LimitedMealGroup, PartialGroup } from 'src/app/types/graphql/groups';
import { PartialMeal } from 'src/app/types/graphql/individual';
import { Ingredient } from 'src/app/shared/classes/ingredient/ingredient';

describe('WeekDetailComponent', () => {
  let component: WeekDetailComponent;
  let fixture: ComponentFixture<WeekDetailComponent>;
  let router: Router;
  let controller: ApolloTestingController;
  let store: Store<fromApp.AppState>;
  let weekService: WeekService;
  let modalService: ModalService;

  const group: LimitedMealGroup = {
    id: 'test group id',
    name: 'test group name',
    members: ['test user 1', 'test user 2'],
    shoppingList: [
      new Ingredient('test ingredient name 1', 'test ingredient quantity 1', 'test ingredient unit 1'),
      new Ingredient('test ingredient name 2', 'test ingredient quantity 2', 'test ingredient unit 2'),
      new Ingredient('test ingredient name 3', 'test ingredient quantity 3', 'test ingredient unit 3'),
    ],
    meals: [
      {
        day: 'MON',
        time: 'B',
        text: 'test meal 1',
        recipe: {
          id: 'testrecipeid1',
          name: 'test recipe name 1'
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
          name: 'test recipe name 3'
        }
      }
    ]
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        WeekDetailComponent
      ],
      imports: [
        RouterTestingModule,
        StoreModule.forRoot(fromApp.appReducer),
        ApolloTestingModule
      ],
      providers: [
        WeekService,
        ModalService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    controller = TestBed.inject(ApolloTestingController);
    router = TestBed.inject(Router);
    store = TestBed.inject(Store);
    weekService = TestBed.inject(WeekService);
    modalService = TestBed.inject(ModalService);
  });

  afterEach(() => {
    controller.verify();
  })

  it('should render the appropriate details if the group has meals and a shopping list', () => {
    component.name = group.name;
    component.meals = group.meals;
    component.shoppingList = group.shoppingList;
    component.dayMode = false;

    fixture.detectChanges();

    const title = fixture.debugElement.query(By.css('.name__display')).query(By.css('h3'));
    expect(title.nativeElement.innerText).toEqual(group.name);

    const shoppingListDiv = fixture.debugElement.query(By.css('.shopping-list'));
    const shoppingListItems = shoppingListDiv.queryAll(By.css('li'));
    expect(shoppingListItems.length).toEqual(group.shoppingList.length);
    for (let i = 0; i < shoppingListItems.length; i++) {
      const ing = group.shoppingList[i];
      const p = shoppingListItems[i].query(By.css('p'));
      expect(p.nativeElement.innerText).toEqual(component.prepareShoppingItem(ing.name, ing.quantity, ing.unit));
    }

    // To make it easier to test the meals, dayMode is off
    const mealsDiv = fixture.debugElement.query(By.css('.no-day-mode'));
    const mealsList = mealsDiv.queryAll(By.css('.meals__content__day__list--no-day-mode'));
    expect(mealsList.length).toEqual(group.shoppingList.length);

    for (let i = 0; i < mealsList.length; i++) {
      const p = mealsList[i].query(By.css('p'));
      expect(p.nativeElement.innerText).toEqual(component.mealtime(group.meals[i].time) + ':');

      const divs = mealsList[i].queryAll(By.css('div'));
      if (group.meals[i].recipe && group.meals[i].text) {
        expect(divs.length).toEqual(2)
        const a = divs[0].query(By.css('a'));
        const split = a.nativeElement.href.split('/');
        expect(a.nativeElement.innerText.trim()).toEqual(group.meals[i].recipe!.name);

        expect(split[split.length - 2]).toEqual('recipes');
        expect(split[split.length - 1]).toEqual(group.meals[i].recipe!.id);

        const span = divs[1].query(By.css('span'));
        expect(span.nativeElement.innerHTML.trim()).toEqual(`Direction: ${group.meals[i].text}`);
      } else {
        if (group.meals[i].recipe) {
          expect(divs.length).toEqual(1);
          const a = divs[0].query(By.css('a'));
          expect(a.nativeElement.innerText.trim()).toEqual(group.meals[i].recipe!.name);

          const split = a.nativeElement.href.split('/');
          expect(split[split.length - 2]).toEqual('recipes');
          expect(split[split.length - 1]).toEqual(group.meals[i].recipe!.id);
        } else if (group.meals[i].text) {
          expect(divs.length).toEqual(1);
          const span = divs[0].query(By.css('span'));
          expect(span.nativeElement.innerHTML.trim()).toEqual(`Direction: ${group.meals[i].text}`);
        }
      }
    }
  });

  it('should render the appropriate placeholder menus if there is no meals or shopping list', () => {
    component.name = group.name;
    component.meals = [];
    component.shoppingList = [];
    component.dayMode = false;

    fixture.detectChanges();

    const noShoppingList = fixture.debugElement.query(By.css('.shopping-list__no-items'));
    expect(noShoppingList).toBeTruthy();

    const noMeals = fixture.debugElement.query(By.css('.meals__no-meals'));
    expect(noMeals).toBeTruthy();
  });

  it('should filter the meals appropriately by clicking on the various buttons to change the day filter', () => {
    component.name = group.name;
    component.meals = group.meals;
    component.shoppingList = [];
    component.dayMode = true;

    fixture.detectChanges();

    const buttons = fixture.debugElement.query(By.css('.mode-buttons')).queryAll(By.css('button'));
    expect(buttons).toBeTruthy();
    expect(buttons[0].nativeElement).toHaveClass('active');
    expect(component.dayFilter).toEqual('MON');

    // I'm not going to check it authoritatively
    let mealsList = fixture.debugElement.query(By.css('.day-mode')).queryAll(By.css('li'));
    expect(mealsList.length).toEqual(group.meals.filter(m => m.day === 'MON').length);

    buttons[1].nativeElement.click();
    fixture.detectChanges();

    expect(buttons[1].nativeElement).toHaveClass('active');
    expect(component.dayFilter).toEqual('TUE');

    mealsList = fixture.debugElement.query(By.css('.day-mode')).queryAll(By.css('li'));
    expect(mealsList.length).toEqual(group.meals.filter(m => m.day === 'TUE').length);
  });

  it('should prepare the output correctly when calling the prepareShoppingItem method', () => {
    const unitQuantityAndName = { name: 'Meat',quantity:  '1/4', unit: 'lb' };
    const quantityAndName = { name: 'Eggs', quantity: '5', unit: 'n/a' };
    const unitAndName = { name: 'Butter', quantity: 'n/a', unit: 'Pound' };
    const onlyName = { name: 'Jack cheese', quantity: 'n/a', unit: 'n/a' };

    expect(component.prepareShoppingItem(unitQuantityAndName.name, unitQuantityAndName.quantity, unitQuantityAndName.unit))
      .toEqual(`${unitQuantityAndName.quantity} ${unitQuantityAndName.unit} of ${unitQuantityAndName.name}`);

    expect(component.prepareShoppingItem(quantityAndName.name, quantityAndName.quantity, quantityAndName.unit))
      .toEqual(`${quantityAndName.quantity} ${quantityAndName.name}`);

    expect(component.prepareShoppingItem(unitAndName.name, unitAndName.quantity, unitAndName.unit))
      .toEqual(`${unitAndName.unit} of ${unitAndName.name}`);

    expect(component.prepareShoppingItem(onlyName.name, onlyName.quantity, onlyName.unit))
      .toEqual(`${onlyName.name}`);
  });
});

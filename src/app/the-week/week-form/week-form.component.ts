import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { moveRightFade } from 'src/app/shared/animations/void-animations';

import { ModalService } from 'src/app/shared/services/modal/modal.service';
import { WeekService } from 'src/app/shared/services/week/week.service';
import { RecipesService } from 'src/app/shared/services/recipes/recipes.service';

import { PartialMeal, DayKey, TimeKey, UpdateIndividual } from 'src/app/types/graphql/individual';
import { Ingredient } from 'src/app/shared/classes/ingredient/ingredient';
import { Recipe } from 'src/app/shared/classes/recipe/recipe';
import { Meal } from 'src/app/shared/classes/meal/meal';
import { Day } from 'src/app/shared/enums/day.enum';
import { Time } from 'src/app/shared/enums/time.enum';

import { MealInputType, QuantityAndUnit } from 'src/app/types/general';
import {
  changeQuantityToFractions,
  combineMeasures,
  convertRatioToNumber,
  convertToSmallerUnits,
  simplifyUnits
} from 'src/app/utils/units';
import { GraphQLError } from 'graphql';
import { UpdateGroup } from 'src/app/types/graphql/groups';

@Component({
  selector: 'app-week-form',
  animations: [moveRightFade('list')],
  templateUrl: './week-form.component.html',
  styleUrls: ['./week-form.component.scss']
})
export class WeekFormComponent implements OnInit, OnDestroy {
  @HostListener('window:scroll')
  setModalTop() {
    this.modalTop = window.scrollY;
  }

  error?: string;
  loading: boolean = true;
  recipeLoading: boolean = true;
  mutationLoading: boolean = false;
  groupId?: string;

  name?: string;
  mealTimesAndDaysUnique: boolean = true;
  meals: Array<PartialMeal> = [];

  recipes: Array<Recipe> = [];
  shoppingList: Array<Ingredient> = [];
  weekForm!: FormGroup;

  modalId: string = 'the-week-form-modal';
  modalTitle: string = 'Something went wrong';
  modalText: string = `
    Unable to load recipe.
    Please check the URL and try again.
    If the problem persists, tell Ben about your problem.
  `;
  modalTop: number = 0;

  private weekSubscription?: Subscription;
  private recipesSubscription?: Subscription;
  private mutationSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: ModalService,
    private weekService: WeekService,
    private recipesService: RecipesService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.route.params
      .subscribe(p => {
        if (!p['id']) {
          this.modalText = `
            Unable to load recipe.
            Please check the URL and try again.
            If the problem persists, tell Ben about your problem.
          `;
          this.showModal();
          return;
        }
        this.groupId = p['id'];
        this.weekSubscription?.unsubscribe();
        this.weekSubscription = this.weekService.allMyInfo
          .subscribe(({ data, errors, loading }) => {
            this.loading = loading;
            if (errors) {
              this.error = errors[0].message;
              return;
            }
            this.error = undefined;
            if (p['id'] === 'my-week') {
              this.name = 'My Week';
              this.meals = data.me.individual.meals;
              this.shoppingList = data.me.individual.shoppingList;
            } else {
              const selectedGroup = data.me.individual.groups.find(g => g.id === p['id']);
              if (!selectedGroup) {
                this.modalText = `
                    Unable to locate group based on ID.
                    Please check the URL and try again.
                  `;
                this.showModal();
                return;
              }
              this.name = selectedGroup.name;
              this.meals = selectedGroup.meals;
              this.shoppingList = selectedGroup.shoppingList;
            }
            this.initForm();
          });
      });

    this.recipesSubscription = this.recipesService.recipes
      .subscribe(({ data, errors, loading }) => {
        this.recipeLoading = loading;
        if (errors) {
          this.error = errors[0].message;
          return;
        }
        this.recipes = data.recipes;
      })
  }

  private initForm() {
    let groupShoppingList = new FormArray([]);
    let groupMeals = new FormArray([]);
    if (!!this.name) {
      for (let shoppingItem of this.shoppingList) {
        groupShoppingList.push(
          new FormGroup({
            name: new FormControl(shoppingItem.name, [Validators.required]),
            quantity: new FormControl(shoppingItem.quantity, [Validators.required]),
            unit: new FormControl(shoppingItem.unit, [Validators.required]),
          })
        );
      }
      for (let meal of this.meals) {
        groupMeals.push(
          new FormGroup({
            time: new FormControl(meal.time, [Validators.required]),
            day: new FormControl(meal.day, [Validators.required]),
            text: new FormControl(meal.text),
            recipeId: new FormControl(meal.recipe?.id)
          })
        );
      }
    }
    this.weekForm = new FormGroup({
      shoppingList: groupShoppingList,
      meals: groupMeals
    });
  }

  addRecipeIngredientsToShoppingList() {
    const recipeIds: Array<string> = this.weekForm.value['meals']
      .map((meal: { recipeId: string }) => meal.recipeId)
      .filter((id?: string) => !!id);
    let shoppingItems: Array<Ingredient> = [];
    for (let id of recipeIds) {
      const recipe = this.recipes.find(r => r.id === id);
      if (!recipe) {
        return;
      }
      shoppingItems = shoppingItems.concat(recipe.ingredients);
    }
    for (let ingredient of shoppingItems) {
      (<FormArray>this.weekForm.get('shoppingList')).push(
        new FormGroup({
          name: new FormControl(ingredient.name, [Validators.required]),
          quantity: new FormControl(ingredient.quantity, [Validators.required]),
          unit: new FormControl(ingredient.unit, [Validators.required]),
        })
      );
    }
  }

  consolidateShoppingList() {
    const shoppingList: Array<Ingredient> = this.weekForm.controls['shoppingList'].value;
    const ingredientNames = shoppingList.map((ing: Ingredient) => ing.name.toLowerCase());
    if (new Set(ingredientNames).size === ingredientNames.length) {
      return;
    }
    const newIngredientList: Array<Ingredient> = [];
    const newIngredientNames: Array<string> = [];
    for (let item of shoppingList) {
      if (newIngredientNames.includes(item.name.toLowerCase())) {
        // Since the items are getting pushed into both arrays at the same time
        // The index of the ingredient in the names array will be the same as that
        // of the index in the ingredients array
        const ingredientIndex = newIngredientNames.indexOf(item.name.toLowerCase().trim());
        const attemptToConvertNewItemRatio = convertRatioToNumber(item.quantity.trim());
        const newItem: QuantityAndUnit = {
          quantity: attemptToConvertNewItemRatio ? attemptToConvertNewItemRatio : +item.quantity.trim(),
          unit: item.unit.toLowerCase().trim()
        };
        const attemptToConvertOldItemRatio = convertRatioToNumber(newIngredientList[ingredientIndex].quantity.trim());
        const oldItem: QuantityAndUnit = {
          quantity: attemptToConvertOldItemRatio
            ? attemptToConvertOldItemRatio
            : +newIngredientList[ingredientIndex].quantity.trim(),
          unit: newIngredientList[ingredientIndex].unit.toLowerCase().trim()
        };
        if (!isNaN(newItem.quantity) && !isNaN(oldItem.quantity)) {
          const newQuantityAndUnit = combineMeasures(newItem, oldItem);
          if (newQuantityAndUnit) {
            newIngredientList[ingredientIndex].quantity = newQuantityAndUnit.quantity.toString();
            newIngredientList[ingredientIndex].unit = newQuantityAndUnit.unit;
          } else if (newItem.unit.toLowerCase().trim() === oldItem.unit.toLowerCase().trim()) {
            // Even if we can't mathematically combine the units, if they're the same units
            // then 2 buns + 2 buns = 4 buns
            newIngredientList[ingredientIndex].quantity = (newItem.quantity + oldItem.quantity).toString();
          } else {
            newIngredientNames.push(item.name.toLowerCase());
            newIngredientList.push(item);
          }
        } else {
          newIngredientNames.push(item.name.toLowerCase());
          newIngredientList.push(item);
        }
      } else {
        // Let's lower case it so butter is also included with Butter
        // I'm too lazy to do any other checks
        newIngredientNames.push(item.name.toLowerCase().trim());
        newIngredientList.push(item);
      }
    }
    const simplifiedIngredients: Array<Ingredient> = newIngredientList
      .map(ing => {
        const simplifiedIng: QuantityAndUnit = simplifyUnits({
          quantity: +ing.quantity, unit: ing.unit
        });
        const convertedUnits = convertToSmallerUnits(simplifiedIng);
        const ingFractioned = changeQuantityToFractions(convertedUnits.quantity);
        return {
          name: ing.name,
          quantity: isNaN(simplifiedIng.quantity) ? ing.quantity : ingFractioned,
          unit: convertedUnits.unit
        }
      })
      .filter((ing, ind, ings) => {
        if (ind === ings.length - 1) {
          return true;
        }
        return !ings.slice(ind + 1).find(i => i.name === ing.name);
      });

    const simplifiedFormArray = new FormArray([]);
    for (let ing of simplifiedIngredients) {
      simplifiedFormArray.push(
        new FormGroup({
          name: new FormControl(ing.name, [Validators.required]),
          quantity: new FormControl(ing.quantity, [Validators.required]),
          unit: new FormControl(ing.unit, [Validators.required]),
        })
      );
    }
    this.weekForm.setControl('shoppingList', simplifiedFormArray);
  }

  get shoppingListControls() {
    return (<FormArray>this.weekForm.get('shoppingList')).controls;
  }

  addShoppingItem() {
    (<FormArray>this.weekForm.get('shoppingList')).push(
      new FormGroup({
        name: new FormControl(null, [Validators.required]),
        quantity: new FormControl(null, [Validators.required]),
        unit: new FormControl(null, [Validators.required]),
      })
    );
  }

  removeShoppingItem(idx: number) {
    (<FormArray>this.weekForm.get('shoppingList')).removeAt(idx);
  }

  deleteShoppingList() {
    this.weekForm.setControl('shoppingList', new FormArray([]));
  }

  get mealsControls() {
    return (<FormArray>this.weekForm.get('meals')).controls;
  }

  addMeal() {
    (<FormArray>this.weekForm.get('meals')).push(
      new FormGroup({
        time: new FormControl('B', [Validators.required]),
        day: new FormControl('MON', [Validators.required]),
        text: new FormControl(null),
        recipeId: new FormControl(null)
      })
    );
  }

  removeMeal(idx: number) {
    (<FormArray>this.weekForm.get('meals')).removeAt(idx);
  }

  deleteAllMeals() {
    this.weekForm.setControl('meals', new FormArray([]));
  }

  get weekdayKey(): Array<DayKey> {
    return Object.keys(Day) as Array<DayKey>;
  }

  get timeKey(): Array<TimeKey> {
    return Object.keys(Time) as Array<TimeKey>;
  }

  weekday(day: DayKey): string {
    return Day[day];
  }

  mealtime(time: TimeKey): string {
    return Time[time];
  }

  get daysAndTimesUnique(): boolean {
    for (let day of this.weekdayKey) {
      const timesOnDay: Array<string> = this.weekForm.value['meals']
        .filter((meal: PartialMeal) => meal.day === day)
        .map((meal: PartialMeal) => meal.time);
      if (timesOnDay.length !== new Set(timesOnDay).size) {
        return false;
      }
    }
    return true;
  }

  onSubmit() {
    if (
      !this.weekForm.valid ||
      !this.daysAndTimesUnique) {
      this.modalTitle = 'An Error Occurred While Creating The Recipe'
      this.modalText = `
        The form isn't correct and we can't proceed. The most likely reason
        is that the form has empty fields, hasn't been edited, or there are
        days with overlapping mealtimes. Please check the form and try again.
      `
      this.showModal();
      return;
    }
    const shoppingList = this.weekForm.value['shoppingList'];
    const meals: Array<MealInputType> = (<Array<Meal>>this.weekForm.value['meals'])
      .map(m => ({
        ...m,
        time: Time[m.time].toUpperCase(),
        day: Day[m.day].toUpperCase()
      }));

    this.mutationSubscription?.unsubscribe();
    if (this.groupId === 'my-week') {
      this.mutationSubscription = this.weekService
        .updateWeekForIndividual(shoppingList, meals)
        .subscribe(({ errors, data }) => this.handleMutationResults(errors, data));
    } else {
      this.mutationSubscription = this.weekService
        .updateWeekForGroup(this.groupId!, shoppingList, meals)
        .subscribe(({ errors, data }) => this.handleMutationResults(errors, data));
    }
  }

  private handleMutationResults(
    errors: readonly GraphQLError[] | undefined,
    data: UpdateGroup | UpdateIndividual | null | undefined
  ) {
    if (errors) {
      this.error = errors[0].message;
      return;
    }
    if (data) {
      this.router.navigate(['the-week', this.groupId])
    }
  }

  showModal(): void {
    this.modalService.open(this.modalId);
  }

  closeModal(): void {
    this.modalService.close(this.modalId);
  }

  ngOnDestroy(): void {
    this.recipesSubscription?.unsubscribe();
    this.weekSubscription?.unsubscribe();
    this.mutationSubscription?.unsubscribe();
  }
}

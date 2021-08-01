import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  FormArray,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import { Subscription } from 'rxjs';

import { Recipe } from 'src/app/shared/classes/recipe/recipe';
import { moveRightFade } from 'src/app/shared/animations/void-animations';

import { RecipesService } from 'src/app/shared/services/recipes/recipes.service';
import { ModalService } from 'src/app/shared/services/modal/modal.service';

@Component({
  selector: 'app-recipe-form',
  animations: [
    moveRightFade('list')
  ],
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.scss']
})
export class RecipeFormComponent implements OnInit, OnDestroy {
  @HostListener('window:scroll')
  setModalTop() {
    this.modalTop = window.scrollY;
  }

  loading: boolean = false;
  error?: string;

  recipeForm!: FormGroup;
  recipe?: Recipe;
  showPhoto: boolean = false;

  modalId: string = 'recipe-form-error';
  modalTitle: string = 'An Error Occurred Performing Operation On The Recipe';
  modalText: string = '';
  modalTop: number = 0;

  private querySubscription?: Subscription;
  private mutationSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipesService: RecipesService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.route.params
      .subscribe((p: Params) => {
        if (!p['id']) {
          return;
        }
        this.querySubscription?.unsubscribe();
        this.querySubscription = this.recipesService
          .getRecipe(p['id'])
          .subscribe(({ data, loading, errors }) => {
            if (errors) {
              this.error = errors[0].message;
              return;
            }
            this.error = undefined;
            this.recipe = data.recipe;
            this.loading = loading;
            this.initForm();
          })
      });
  }

  private initForm() {
    let recipeName = '';
    let recipePhoto = '';
    let recipeUrl = '';
    let recipeIngredients = new FormArray([]);
    let recipeSteps = new FormArray([]);

    if (!!this.recipe) {
      recipeName = this.recipe.name;
      recipePhoto = this.recipe.photo || '';
      recipeUrl = this.recipe.url || '';
      for (let ingredient of this.recipe.ingredients) {
        recipeIngredients.push(
          new FormGroup({
            name: new FormControl(ingredient.name, [Validators.required, Validators.maxLength(100)]),
            quantity: new FormControl(ingredient.quantity, [Validators.required, Validators.maxLength(100)]),
            unit: new FormControl(ingredient.unit, [Validators.required, Validators.maxLength(50)])
          })
        );
      }
      for (let step of this.recipe.steps) {
        recipeSteps.push(
          new FormGroup({
            step: new FormControl(step.step, Validators.required)
          })
        )
      }
    } else {
      recipeIngredients.push(
        new FormGroup({
          name: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
          quantity: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
          unit: new FormControl(null, [Validators.required, Validators.maxLength(50)])
        })
      );
      recipeSteps.push(
        new FormGroup({
          step: new FormControl(null, Validators.required)
        })
      )
    }
    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      photo: new FormControl(recipePhoto),
      url: new FormControl(recipeUrl),
      ingredients: recipeIngredients,
      steps: recipeSteps
    });
  }

  toggleShowPhoto() {
    this.showPhoto = !this.showPhoto;
  }

  get ingredientControls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients'))
      .push(new FormGroup({
        name: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
        quantity: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
        unit: new FormControl(null, [Validators.required, Validators.maxLength(50)])
      }));
  }

  get stepControls() {
    return (<FormArray>this.recipeForm.get('steps')).controls;
  }

  onSubtractIngredient(idx: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(idx);
  }

  onAddStep() {
    (<FormArray>this.recipeForm.get('steps'))
      .push(new FormGroup({
        step: new FormControl(null, Validators.required)
      }));
  }

  onSubtractStep(idx: number) {
    (<FormArray>this.recipeForm.get('steps')).removeAt(idx);
  }

  navigateAway() {
    this.router.navigate(['/recipes']);
  }

  onDelete() {
    if (!this.recipe) {
      this.error = 'Unable to find recipe to delete.';
      return
    }
    this.error = undefined;
    this.loading = true;
    try {
      this.recipesService
        .deleteRecipe(this.recipe.id)
        .subscribe(({ errors }) => {
          this.loading = false;
          if (errors) {
            this.error = errors[0].message;
            return;
          }
          this.navigateAway();
        });
    } catch (e) {
      this.modalTitle = 'An Error Occurred While Deleting the Recipe';
      this.modalText = e.message;
      this.showModal();
    }
  }

  onSubmit() {
    if (!this.recipeForm.valid || this.recipeForm.pristine || this.error) {
      this.modalTitle = 'An Error Occurred While Creating The Recipe'
      this.modalText = `
        I haven't yet figured out why you're able to submit the form while it's
        incorrect, but it is possible to do so. Please fill out all boxes marked
        as required or, if you're updating a recipe, change some detail about it, even
        if it doesn't make sense, for example you can put 'N/A' for a unit.
      `
      this.showModal();
      return;
    }
    // If this.recipe - we're in edit mode; otherwise
    // We're creating a recipe
    const _recipe = new Recipe(
      this.recipe ? this.recipe.id : '',
      this.recipeForm.value['name'],
      this.recipeForm.value['ingredients'],
      this.recipeForm.value['steps'],
      this.recipeForm.value['photo'],
      this.recipeForm.value['url']
    )
    try {
      this.mutationSubscription = this.recipe
        ? this.recipesService
          .updateRecipe(_recipe)
          .subscribe(({ data, errors }) => {
            if (errors) {
              this.modalTitle = 'An Error Occurred While Updating the Recipe'
              this.modalText = `
                ${errors[0].message} -- Please check the recipe and try again. If the
                problem persists, it may be an error with the database. Please try to
                contact Ben and tell him about the problem.
              `
            } else {
              this.router.navigate(['/recipes', data?.updateRecipe.recipe.id])
            }
          })
        : this.recipesService.createRecipe(_recipe)
          .subscribe(({ data, errors }) => {
            if (errors) {
              this.modalTitle = 'An Error Occurred While Creating the Recipe'
              this.modalText = `
                ${errors[0].message} -- Please check the recipe and try again. If the
                problem persists, it may be an error with the database. Please try to
                contact Ben and tell him about the problem.
              `
            this.showModal();
            } else {
              this.router.navigate(['/recipes', data?.createRecipe.recipe.id])
            }
          });
    } catch (e) {
      this.modalTitle = 'An Error Occurred While Processing the Recipe';
      this.modalText = e.message;
      this.showModal();
    }
  }

  showModal(): void {
    this.modalService.open(this.modalId);
  }

  closeModal(): void {
    this.modalService.close(this.modalId);
  }

  ngOnDestroy(): void {
    this.querySubscription?.unsubscribe();
    this.mutationSubscription?.unsubscribe();
  }
}

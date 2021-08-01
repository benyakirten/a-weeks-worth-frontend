import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { Recipe } from 'src/app/shared/classes/recipe/recipe';

import { RecipesService } from 'src/app/shared/services/recipes/recipes.service';

import { moveDownFade } from 'src/app/shared/animations/void-animations';

@Component({
  selector: 'app-recipe-list',
  animations: [moveDownFade('recipes')],
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  loggedIn: boolean = false;
  recipes?: Array<Recipe>;

  private querySubscription?: Subscription;

  constructor(private recipesService: RecipesService) {}

  ngOnInit() {
    this.querySubscription = this.recipesService.recipes
      .subscribe(({ data }) => this.recipes = data['recipes']);
  }

  ngOnDestroy() {
    this.querySubscription?.unsubscribe();
  }
}

import { Injectable } from '@angular/core';

import { Apollo } from 'apollo-angular';

import { environment } from 'src/environments/environment';

import { GET_ALL_RECIPES, GET_RECIPE } from 'src/app/shared/graphql/queries';
import { CREATE_RECIPE, DELETE_RECIPE, UPDATE_RECIPE } from 'src/app/shared/graphql/mutations/recipes';
import {
  CreateRecipe,
  DeleteRecipe,
  RecipeResponse,
  RecipesResponse,
  UpdateRecipe
} from 'src/app/types/graphql/recipes';

import { Recipe } from 'src/app/shared/classes/recipe/recipe';
import { Ingredient } from 'src/app/shared/classes/ingredient/ingredient';
import { Step } from 'src/app/shared/classes/step/step';
import { TranslatedError, TranslatedRecipe } from 'src/app/types/general';

@Injectable({ providedIn: 'root' })
export class RecipesService {
  constructor(private apollo: Apollo) {}

  get recipes() {
    return this.apollo
      .watchQuery<RecipesResponse>({ query: GET_ALL_RECIPES })
      .valueChanges
  }

  getRecipe(id: string) {
    return this.apollo
      .watchQuery<RecipeResponse>({
        query: GET_RECIPE,
        variables: { id }
      })
      .valueChanges
  }

  createRecipe(recipe: Recipe) {
    return this.apollo
      .mutate<CreateRecipe>(
        {
          mutation: CREATE_RECIPE,
          variables: {
            ...recipe
          },
          update: (cache, { data, errors }) => {
            if (errors) {
              throw Error(`Unable to update recipe: ${errors[0].message}`);
            }
            const existingRecipes = cache.readQuery<RecipesResponse>({ query: GET_ALL_RECIPES })
            const updatedRecipes = existingRecipes?.recipes.concat(data!.createRecipe.recipe)
            cache.writeQuery({
              query: GET_ALL_RECIPES,
              data: { recipes: updatedRecipes }
            })
          }
        }
      );
  }

  updateRecipe(recipe: Recipe) {
    return this.apollo
      .mutate<UpdateRecipe>({
        mutation: UPDATE_RECIPE,
        variables: {
          ...recipe
        },
      });
  }

  deleteRecipe(id: string) {
    if (!localStorage.getItem('AWW_token')) {
      throw Error('User must be logged in to delete a recipe');
    }
    return this.apollo.mutate<DeleteRecipe>({
      mutation: DELETE_RECIPE,
      variables: { id },
      update: (cache, { errors }) => {
        if (errors) {
          throw Error(`Unable to delete recipe: ${errors[0].message}`);
        }
        const existingRecipes = cache.readQuery<RecipesResponse>({ query: GET_ALL_RECIPES })
        const updatedRecipes = existingRecipes?.recipes.filter(r => r.id !== id)
        cache.writeQuery({
          query: GET_ALL_RECIPES,
          data: { recipes: updatedRecipes }
        })
      }
    })
  }

  async translateRecipe(url: string, convertUnits: boolean = true): Promise<TranslatedRecipe | TranslatedError> {
    // I'd prefer to do this with the Angular http client
    // However, it was causing CORS problems
    try {
      const res = await fetch(environment.translationUrl, { method: 'POST', body: JSON.stringify({ url, convertUnits }) })
      return res.json();
    } catch (e) {
      return { error: e };
    }
  }

  prepareRecipe(recipe: TranslatedRecipe, url: string): Recipe {
    return new Recipe(
      '',
      recipe.name,
      recipe.ingredients.map(i => new Ingredient(i[0], i[1].toString(), i[2])),
      recipe.preparation.map((prep, idx) => new Step(prep, idx + 1)),
      recipe.image,
      url,
    );
  }
}

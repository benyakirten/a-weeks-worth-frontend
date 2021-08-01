import { Recipe } from "src/app/shared/classes/recipe/recipe";

interface PartialRecipe {
  id: string;
  name: string;
}

interface RecipeAsResponse {
  recipe: Recipe;
}

// Queries
interface RecipesResponse {
  recipes: Array<Recipe>
}

interface RecipeResponse {
  recipe: Recipe
}

// Mutations
interface UpdateRecipe {
  updateRecipe: RecipeAsResponse
}

interface CreateRecipe {
  createRecipe: RecipeAsResponse
}

interface DeleteRecipe {
  deleteRecipe: {
    recipe: PartialRecipe
  }
}

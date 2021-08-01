import { gql } from "apollo-angular";

export const CREATE_RECIPE = gql`
  mutation createRecipe($name: String!, $photo: String, $url: String, $ingredients: [IngredientInputType!], $steps: [RecipeStepInputType!]) {
    createRecipe(name: $name, photo: $photo, url: $url, ingredients: $ingredients, steps: $steps) {
      recipe {
        id
        name
        photo
        ingredients {
          name
          quantity
          unit
        }
        steps {
          step
          order
        }
      }
    }
  }
`;

export const UPDATE_RECIPE = gql`
  mutation updateRecipe($id: ID!, $name: String!, $photo: String, $ingredients: [IngredientInputType!], $steps: [RecipeStepInputType!]) {
    updateRecipe(id: $id, name: $name, photo: $photo, ingredients: $ingredients, steps: $steps) {
      recipe {
        id
        name
        photo
        ingredients {
          name
          quantity
          unit
        }
        steps {
          step
          order
        }
      }
    }
  }
`;

export const DELETE_RECIPE = gql`
  mutation deleteRecipe($id: ID!) {
    deleteRecipe(id: $id) {
      recipe {
        name
        id
      }
    }
  }
`;

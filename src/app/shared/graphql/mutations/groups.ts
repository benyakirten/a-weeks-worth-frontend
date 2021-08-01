import { gql } from "apollo-angular";

export const CREATE_GROUP = gql`
  mutation createGroup($name: String!) {
    createGroup(name: $name) {
      individual {
        groups {
          id
          name
          members
        }
      }
      group {
        id
        name
        members
      }
    }
  }
`;

export const UPDATE_WEEK_FOR_GROUP = gql`
  mutation updateGroup($id: ID!, $shoppingList: [IngredientInputType!], $meals: [MealInputType!]) {
    updateGroup(id: $id, shoppingList: $shoppingList, meals: $meals) {
      group {
        id
        name
        members
        shoppingList {
          name
          quantity
          unit
        }
        meals {
          text
          recipe {
            id
            name
          }
          time
          day
        }
      }
    }
  }
`;

export const DELETE_GROUP = gql`
  mutation deleteGroup($id: ID!) {
    deleteGroup(id: $id) {
      group {
        id
        name
        members
      }
    }
  }
`;

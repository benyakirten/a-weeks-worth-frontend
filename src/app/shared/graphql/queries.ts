import { gql } from 'apollo-angular';

export const GET_ALL_RECIPES = gql`
  query GetAllRecipes {
    recipes {
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
`;

export const GET_RECIPE = gql`
  query GetRecipe($id: ID) {
    recipe(id: $id) {
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
`;

export const GET_ALL_GROUPS = gql`
  query allGroups {
    groups {
      id
      name
      members
    }
  }
`;

export const GET_MY_GROUPS = gql`
  query myGroups {
    me {
      individual {
        requests {
          id
          name
        }
        groups {
          id
          name
          members
          requests {
            id
            name
          }
          meals {
            text
            recipe {
              id
              name
            }
            day
            time
          }
          shoppingList {
            name
            quantity
            unit
          }
        }
      }
    }
  }
`;

export const GET_MY_INFO = gql`
  query myWeek {
    me {
      individual {
        meals {
          text
          recipe {
            id
            name
          }
          day
          time
        }
        shoppingList {
          name
          quantity
          unit
        }
        groups {
          id
          name
          members
          requests {
            id
            name
          }
          meals {
            text
            recipe {
              id
              name
            }
            day
            time
          }
          shoppingList {
            name
            quantity
            unit
          }
        }
      }
    }
  }
`;

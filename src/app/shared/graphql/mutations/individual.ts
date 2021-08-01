import { gql } from "apollo-angular";

export const UPDATE_INDIVIDUAL = gql`
  mutation updateIndividual($shoppingList: [IngredientInputType!], $meals: [MealInputType]) {
    updateIndividual(shoppingList: $shoppingList, meals: $meals) {
      individual {
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

export const REQUEST_ACCESS = gql`
  mutation requestAccess($id: ID!) {
    requestAccess(id: $id) {
      success
      individual {
        requests {
          id
          name
        }
      }
    }
  }
`;

export const CANCEL_REQUEST = gql`
  mutation cancelRequest($id: ID!) {
    cancelRequest(id: $id) {
      success
      individual {
        requests {
          id
          name
        }
      }
    }
  }
`;

export const INVITE_TO_GROUP = gql`
  mutation inviteToGroup($invitedId: ID!, $groupId: ID!) {
    inviteToGroup(invitedId: $invitedId, groupId: $groupId) {
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

export const LEAVE_GROUP = gql`
  mutation leaveGroup($id: ID!) {
    leaveGroup(id: $id) {
      individual {
        username
        groups {
          id
          name
        }
      }
    }
  }
`;

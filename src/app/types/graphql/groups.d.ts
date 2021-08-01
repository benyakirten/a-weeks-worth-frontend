import { Group } from "src/app/shared/classes/group/group";
import { Ingredient } from "src/app/shared/classes/ingredient/ingredient";
import { Meal } from "src/app/shared/classes/meal/meal";

import { PartialMeal } from "./individual";

interface PartialGroup {
  id: string;
  name: string;
  members: Array<string>;
}

interface LimitedMealGroup extends PartialGroup {
  shoppingList: Array<Ingredient>;
  meals: Array<PartialMeal>;
}

interface FullGroup extends PartialGroup {
  shoppingList: Array<Ingredient>;
  meals: Array<Meal>;
}

interface GroupRequest {
  id: string;
  name: string;
}

interface Requests {
  requests: Array<GroupRequest>;
}

// Queries
interface GroupsResponse {
  groups: Array<PartialGroup>
}

interface MyGroupsResponse {
  me: {
    individual: {
      id: string;
      groups: Array<Group>;
      requests: Array<GroupRequest>
    }
  }
}

// Mutations
interface CreateGroup {
  createGroup: {
    individual: {
      groups: Array<PartialGroup>;
    }
    group: PartialGroup
  }
}

interface UpdateGroup {
  updateGroup: {
    group: FullGroup;
  }
}

interface DeleteGroup {
  deleteGroup: {
    group: PartialGroup;
  }
}

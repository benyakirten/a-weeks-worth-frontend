import { Ingredient } from "src/app/shared/classes/ingredient/ingredient";
import { Meal } from "src/app/shared/classes/meal/meal";

import { Day } from "src/app/shared/enums/day.enum";
import { Time } from "src/app/shared/enums/time.enum";

import { LimitedMealGroup, PartialGroup, Requests } from "./groups";

type DayKey = keyof typeof Day;
type TimeKey = keyof typeof Time;

interface PartialMeal {
  day: DayKey;
  time: TimeKey;
  text?: string;
  recipe?: {
    id: string;
    name: string;
  }
}

// Queries
interface IndividualBase {
  individual: {
    meals: Array<Meal>;
    shoppingList: Array<Ingredient>;
  }
}

interface MeQuery {
  me: IndividualBase;
}

interface IndividualGroups {
  groups: Array<PartialGroup>;
}

interface AllMyInfo {
  me: {
    individual: {
      meals: Array<PartialMeal>;
      shoppingList: Array<Ingredient>;
      groups: Array<LimitedMealGroup>;
    }
  }
}

interface GroupSummary {
  id: string;
  name: string;
}

// Mutations
interface UpdateIndividual {
  updateIndividual: IndividualBase;
}

interface RequestResponse {
  success: boolean;
  individual: Requests;
}

interface RequestAccess {
  requestAccess: RequestResponse;
}

interface CancelRequest {
  cancelRequest: RequestResponse;
}

interface InviteToGroup {
  inviteToGroup: {
    individual: IndividualGroups;
    group: PartialGroup;
  }
}

interface LeaveGroup {
  leaveGroup: {
    individual: {
      username: string;
      groups: Array<PartialGroup>;
    }
  }
}

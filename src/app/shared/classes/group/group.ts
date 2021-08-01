import { Ingredient } from "../ingredient/ingredient";
import { Meal } from "../meal/meal";

import { GroupRequest } from "src/app/types/graphql/groups";

export class Group {
  constructor(
    public id: string,
    public name: string,
    public members: Array<string>,
    public requests?: Array<GroupRequest>,
    public shoppingList?: Array<Ingredient>,
    public meals?: Array<Meal>
  ) {}
}

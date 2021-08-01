import { Group } from "../group/group";
import { Ingredient } from "../ingredient/ingredient";
import { LimitedGroup } from "../limited-group/limited-group";
import { Meal } from "../meal/meal";
import { User } from "../user/user";

export class Individual {
  constructor(
    public id: string,
    public user: User,
    public requests?: Array<LimitedGroup>,
    public meals?: Array<Meal>,
    public shoppingList?: Array<Ingredient>,
    public groups?: Array<Group>
  ) {}
}

import { DayKey, TimeKey } from "src/app/types/graphql/individual";
import { Recipe } from "../recipe/recipe";

export class Meal {
  constructor(
    public day: DayKey,
    public time: TimeKey,
    public text?: string,
    public recipe?: Recipe
  ) {}
}

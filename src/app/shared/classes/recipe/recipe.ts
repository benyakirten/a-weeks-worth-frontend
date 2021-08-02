import { Ingredient } from "../ingredient/ingredient";
import { Step } from "../step/step";

export class Recipe {
  constructor(
    public id: string,
    public name: string,
    public ingredients: Array<Ingredient>,
    public steps: Array<Step>,
    public photo?: string,
    public url?: string
  ) {}
}

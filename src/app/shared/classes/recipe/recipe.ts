import { Ingredient } from "../ingredient/ingredient";
import { Step } from "../step/step";

export class Recipe {
  get url(): string | undefined {
    return this._url;
  }
  constructor(
    public id: string,
    public name: string,
    public ingredients: Array<Ingredient>,
    public steps: Array<Step>,
    public photo?: string,
    private _url?: string
  ) {}
}

import { Ingredient } from "../shared/classes/ingredient/ingredient";

type PartialStep = {
  step: string;
}

type ButtonType = 'submit' | 'button' | 'reset';

type CSSProp = 'height' | 'width' | 'margin' | 'padding';

type ComponentProps = {
  [key in CSSProp]?: string | null | undefined;
};

type TranslatedIngredient = [string, number, string];

type TranslatedRecipe = {
  name: string;
  image: string;
  ingredients: Array<TranslatedIngredient>;
  preparation: Array<string>;
  error: undefined;
}

type TranslatedError = {
  error: any;
}

type QuantityAndUnit = {
  quantity: number;
  unit: string;
}

type ConversionTable = {
  [key: string]: number
}

type MealInputType = {
  time: string;
  day: string;
  text?: string;
  unit?: string;
}

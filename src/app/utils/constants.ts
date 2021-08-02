import { ConversionTable } from "src/app/types/general";

export const MILLISECONDS_IN_TWO_HOURS = 2 * 60 * 60 * 1000;
export const MILLISECONDS_IN_A_MINUTE = 60 * 1000;

export const METRIC_SOLIDS: ConversionTable = {
  'kilograms': 1000000,
  'kilogram': 1000000,
  'kg': 1000000,
  'hectograms': 100000,
  'hectogram': 100000,
  'hg': 100000,
  'decagrams': 10000,
  'decagram': 10000,
  'dg': 10000,
  'grams': 1000,
  'gram': 1000,
  'g': 1000,
  'centigrams': 10,
  'centigram': 10,
  'cg': 10,
  'milligrams': 1,
  'milligram': 1,
  'mg': 1
};
export const METRIC_SOLID_BASE_UNIT = 'milligrams';

export const IMPERIAL_SOLIDS: ConversionTable = {
  'pounds': 16,
  'pound': 16,
  'lb': 16,
  'ounces': 1,
  'ounce': 1,
  'oz': 1
};
export const IMPERIAL_SOLID_BASE_UNIT = 'ounces';

export const METRIC_FLUIDS: ConversionTable = {
  'kiloliters': 1000000,
  'kiloliter': 1000000,
  'kl': 1000000,
  'hectoliters': 100000,
  'hectoliter': 100000,
  'hl': 100000,
  'decaliters': 10000,
  'decaliter': 10000,
  'dl': 10000,
  'liters': 1000,
  'liter': 1000,
  'l': 1000,
  'centiliters': 10,
  'centiliter': 10,
  'cl': 10,
  'millileters': 1,
  'millileter': 1,
  'ml': 1
};
export const METRIC_FLUID_BASE_UNIT = 'millileters'

export const IMPERIAL_FLUIDS: ConversionTable = {
  'gallons': 768,
  'gallon': 768,
  'quarts': 192,
  'quart': 192,
  'qt': 192,
  'cup': 48,
  'fluid ounce': 6,
  'fl oz': 6,
  'ounces': 6,
  'ounce': 6,
  'oz': 6,
  'tablespoons': 3,
  'tablespoon': 3,
  'tbsp': 3,
  'teaspoons': 3,
  'teaspoon': 1,
  'tsp': 1
};
export const IMPERIAL_FLUID_BASE_UNIT = 'teaspoons';

export const COMPLEX_RATIO_PATTERN = /^(\d+\s+)(\d+)\/(\d+)$/
export const SIMPLE_RATIO_PATTERN = /^(\d+)\/(\d+)$/;
export const DECIMAL_PATTERN = /^(\d+)\.(\d+)$/;

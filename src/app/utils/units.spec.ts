import { QuantityAndUnit } from "../types/general";
import {
  combineMeasures,
  convertRatioToNumber,
  simplifyUnits,
  convertToSmallerUnits
} from "./units";

describe('combineMeasures', () => {
  const knownGoodMetricFluidsMeasuresAndResults: Array<{ oldQuantity: QuantityAndUnit , newQuantity: QuantityAndUnit , result: QuantityAndUnit }> = [
    {
      oldQuantity: {
        quantity: 25,
        unit: 'kl'
      },
      newQuantity: {
        quantity: 5,
        unit: 'kiloliters'
      },
      result: {
        quantity: 30000000,
        unit: 'milliliters'
      }
    },
    {
      oldQuantity: {
        quantity: 25,
        unit: 'kiloliter'
      },
      newQuantity: {
        quantity: 5,
        unit: 'hectoliters'
      },
      result: {
        quantity: 25500000,
        unit: 'milliliters'
      }
    },
    {
      oldQuantity: {
        quantity: 25,
        unit: 'hl'
      },
      newQuantity: {
        quantity: 5,
        unit: 'hectoliters'
      },
      result: {
        quantity: 3000000,
        unit: 'milliliters'
      }
    },
    {
      oldQuantity: {
        quantity: 25,
        unit: 'hectoliter'
      },
      newQuantity: {
        quantity: 5,
        unit: 'decaliters'
      },
      result: {
        quantity: 2550000,
        unit: 'milliliters'
      }
    },
    {
      oldQuantity: {
        quantity: 25,
        unit: 'decaliter'
      },
      newQuantity: {
        quantity: 5,
        unit: 'dl'
      },
      result: {
        quantity: 300000,
        unit: 'milliliters'
      }
    },
    {
      oldQuantity: {
        quantity: 25,
        unit: 'liters'
      },
      newQuantity: {
        quantity: 5,
        unit: 'l'
      },
      result: {
        quantity: 30000,
        unit: 'milliliters'
      }
    },
    {
      oldQuantity: {
        quantity: 25,
        unit: 'liter'
      },
      newQuantity: {
        quantity: 5,
        unit: 'centiliters'
      },
      result: {
        quantity: 25050,
        unit: 'milliliters'
      }
    },
    {
      oldQuantity: {
        quantity: 25,
        unit: 'centiliter'
      },
      newQuantity: {
        quantity: 5,
        unit: 'cl'
      },
      result: {
        quantity: 300,
        unit: 'milliliters'
      }
    },
    {
      oldQuantity: {
        quantity: 25,
        unit: 'ml'
      },
      newQuantity: {
        quantity: 5,
        unit: 'milliliter'
      },
      result: {
        quantity: 30,
        unit: 'milliliters'
      }
    },
    {
      oldQuantity: {
        quantity: 5,
        unit: 'kl'
      },
      newQuantity: {
        quantity: 5,
        unit: 'milliliters'
      },
      result: {
        quantity: 5000005,
        unit: 'milliliters'
      }
    },
  ];

  const knownGoodMetricSolidsMeasuresAndResults: Array<{ oldQuantity: QuantityAndUnit , newQuantity: QuantityAndUnit , result: QuantityAndUnit }> = [
    {
      oldQuantity: {
        quantity: 25,
        unit: 'kg'
      },
      newQuantity: {
        quantity: 5,
        unit: 'kilograms'
      },
      result: {
        quantity: 30000000,
        unit: 'milligrams'
      }
    },
    {
      oldQuantity: {
        quantity: 25,
        unit: 'kilogram'
      },
      newQuantity: {
        quantity: 5,
        unit: 'hectograms'
      },
      result: {
        quantity: 25500000,
        unit: 'milligrams'
      }
    },
    {
      oldQuantity: {
        quantity: 25,
        unit: 'hg'
      },
      newQuantity: {
        quantity: 5,
        unit: 'hectograms'
      },
      result: {
        quantity: 3000000,
        unit: 'milligrams'
      }
    },
    {
      oldQuantity: {
        quantity: 25,
        unit: 'hectogram'
      },
      newQuantity: {
        quantity: 5,
        unit: 'decagrams'
      },
      result: {
        quantity: 2550000,
        unit: 'milligrams'
      }
    },
    {
      oldQuantity: {
        quantity: 25,
        unit: 'decagram'
      },
      newQuantity: {
        quantity: 5,
        unit: 'dg'
      },
      result: {
        quantity: 300000,
        unit: 'milligrams'
      }
    },
    {
      oldQuantity: {
        quantity: 25,
        unit: 'grams'
      },
      newQuantity: {
        quantity: 5,
        unit: 'g'
      },
      result: {
        quantity: 30000,
        unit: 'milligrams'
      }
    },
    {
      oldQuantity: {
        quantity: 25,
        unit: 'gram'
      },
      newQuantity: {
        quantity: 5,
        unit: 'centigrams'
      },
      result: {
        quantity: 25050,
        unit: 'milligrams'
      }
    },
    {
      oldQuantity: {
        quantity: 25,
        unit: 'centigram'
      },
      newQuantity: {
        quantity: 5,
        unit: 'cg'
      },
      result: {
        quantity: 300,
        unit: 'milligrams'
      }
    },
    {
      oldQuantity: {
        quantity: 25,
        unit: 'mg'
      },
      newQuantity: {
        quantity: 5,
        unit: 'milligram'
      },
      result: {
        quantity: 30,
        unit: 'milligrams'
      }
    },
    {
      oldQuantity: {
        quantity: 5,
        unit: 'kg'
      },
      newQuantity: {
        quantity: 5,
        unit: 'milligrams'
      },
      result: {
        quantity: 5000005,
        unit: 'milligrams'
      }
    },
  ];

  const knownGoodImperialFluidsMeasuresAndResults: Array<{ oldQuantity: QuantityAndUnit , newQuantity: QuantityAndUnit , result: QuantityAndUnit }> = [
    {
      oldQuantity: {
        quantity: 25,
        unit: 'gallons'
      },
      newQuantity: {
        quantity: 5,
        unit: 'gallon'
      },
      result: {
        quantity: 23040,
        unit: 'teaspoons'
      }
    },
    {
      oldQuantity: {
        quantity: 25,
        unit: 'quarts'
      },
      newQuantity: {
        quantity: 5,
        unit: 'quart'
      },
      result: {
        quantity: 5760,
        unit: 'teaspoons'
      }
    },
    {
      oldQuantity: {
        quantity: 25,
        unit: 'qt'
      },
      newQuantity: {
        quantity: 5,
        unit: 'cup'
      },
      result: {
        quantity: 5040,
        unit: 'teaspoons'
      }
    },
    {
      oldQuantity: {
        quantity: 25,
        unit: 'fluid ounce'
      },
      newQuantity: {
        quantity: 5,
        unit: 'fl oz'
      },
      result: {
        quantity: 180,
        unit: 'teaspoons'
      }
    },
    {
      oldQuantity: {
        quantity: 25,
        unit: 'ounces'
      },
      newQuantity: {
        quantity: 5,
        unit: 'fl oz'
      },
      result: {
        quantity: 180,
        unit: 'teaspoons'
      }
    },
    {
      oldQuantity: {
        quantity: 25,
        unit: 'ounce'
      },
      newQuantity: {
        quantity: 5,
        unit: 'fl oz'
      },
      result: {
        quantity: 180,
        unit: 'teaspoons'
      }
    },
    {
      oldQuantity: {
        quantity: 25,
        unit: 'oz'
      },
      newQuantity: {
        quantity: 5,
        unit: 'fl oz'
      },
      result: {
        quantity: 180,
        unit: 'teaspoons'
      }
    },
    {
      oldQuantity: {
        quantity: 25,
        unit: 'tablespoons'
      },
      newQuantity: {
        quantity: 5,
        unit: 'tablespoon'
      },
      result: {
        quantity: 90,
        unit: 'teaspoons'
      }
    },
    {
      oldQuantity: {
        quantity: 25,
        unit: 'tbsp'
      },
      newQuantity: {
        quantity: 5,
        unit: 'tsp'
      },
      result: {
        quantity: 80,
        unit: 'teaspoons'
      }
    },
    {
      oldQuantity: {
        quantity: 25,
        unit: 'teaspoon'
      },
      newQuantity: {
        quantity: 5,
        unit: 'teaspoons'
      },
      result: {
        quantity: 30,
        unit: 'teaspoons'
      }
    },
  ];

  const knownGoodImperialSolidsMeasuresAndResults: Array<{ oldQuantity: QuantityAndUnit , newQuantity: QuantityAndUnit , result: QuantityAndUnit }> = [
    {
      oldQuantity: {
        quantity: 1,
        unit: 'pound'
      },
      newQuantity: {
        quantity: 2,
        unit: 'pounds'
      },
      result: {
        quantity: 48,
        unit: 'ounces'
      }
    },
    {
      oldQuantity: {
        quantity: 2,
        unit: 'lb'
      },
      newQuantity: {
        quantity: 5,
        unit: 'oz'
      },
      result: {
        quantity: 37,
        unit: 'ounces'
      }
    },
    {
      oldQuantity: {
        quantity: 25,
        unit: 'ounce'
      },
      newQuantity: {
        quantity: 10,
        unit: 'lb'
      },
      result: {
        quantity: 185,
        unit: 'ounces'
      }
    },
  ]

  it('should give known correct results for known inputs', () => {
    for (let knownGoodResult of knownGoodMetricFluidsMeasuresAndResults) {
      const result = combineMeasures(knownGoodResult.oldQuantity, knownGoodResult.newQuantity);
      expect(result).toEqual(knownGoodResult.result);
    }

    for (let knownGoodResult of knownGoodMetricSolidsMeasuresAndResults) {
      const result = combineMeasures(knownGoodResult.oldQuantity, knownGoodResult.newQuantity);
      expect(result).toEqual(knownGoodResult.result);
    }

    for (let knownGoodResult of knownGoodImperialFluidsMeasuresAndResults) {
      const result = combineMeasures(knownGoodResult.oldQuantity, knownGoodResult.newQuantity);
      expect(result).toEqual(knownGoodResult.result);
    }

    for (let knownGoodResult of knownGoodImperialSolidsMeasuresAndResults) {
      const result = combineMeasures(knownGoodResult.oldQuantity, knownGoodResult.newQuantity);
      expect(result).toEqual(knownGoodResult.result);
    }
  });

  const knownBadMeasuresAndResults: Array<{ oldQuantity: QuantityAndUnit, newQuantity: QuantityAndUnit }> = [
    {
      oldQuantity: {
        quantity: 25,
        unit: 'mg'
      },
      newQuantity: {
        quantity: 5,
        unit: 'l'
      }
    },
    {
      oldQuantity: {
        quantity: 25,
        unit: 'mg'
      },
      newQuantity: {
        quantity: 5,
        unit: 'leters'
      }
    },
    {
      oldQuantity: {
        quantity: 25,
        unit: 'unparsea ble'
      },
      newQuantity: {
        quantity: 5,
        unit: 'heretoo'
      }
    },
  ];

  it('should return undefined if the inputs are not parseable', () => {
    for (let badMeasure of knownBadMeasuresAndResults) {
      const result = combineMeasures(badMeasure.newQuantity, badMeasure.oldQuantity);
      expect(result).toBeUndefined();
    }
  })
});

describe('convertRatioToNumber', () => {
  const convertableRatios: Array<{ ratio: string, digit: number }> = [
    {
      ratio: '1/4',
      digit: .25
    },
    {
      ratio: '3/5',
      digit: .6
    },
    {
      ratio: '2/7',
      digit: 2/7
    },
    {
      ratio: '2 11/5',
      digit: 4.2
    },
  ];

  it('should return known results for known convertable ratios', () => {
    for (let ratio of convertableRatios) {
      expect(convertRatioToNumber(ratio.ratio)).toEqual(ratio.digit);
    }
  });

  const unconvertableRatios: Array<string> = [
    '2 11/s',
    'word',
    '2 11',
    '11'
  ];

  it('should return null for known unconvertable inputs', () => {
    for (let input of unconvertableRatios) {
      expect(convertRatioToNumber(input)).toBeFalsy();
    }
  });
});

describe('simplifyUnits', () => {
  const convertableAmounts: Array<{ oldAmount: QuantityAndUnit, newAmount: QuantityAndUnit }> = [
    {
      oldAmount: {
        quantity: 500001,
        unit: 'mg'
      },
      newAmount: {
        quantity: 0.5,
        unit: 'kilograms'
      }
    },
    {
      oldAmount: {
        quantity: 1499999,
        unit: 'milligrams'
      },
      newAmount: {
        quantity: 1.5,
        unit: 'kilograms'
      }
    },
    {
      oldAmount: {
        quantity: 1499999,
        unit: 'milligram'
      },
      newAmount: {
        quantity: 1.5,
        unit: 'kilograms'
      }
    },
    {
      oldAmount: {
        quantity: 499999,
        unit: 'mg'
      },
      newAmount: {
        quantity: 500,
        unit: 'grams'
      }
    },
    {
      oldAmount: {
        quantity: 1002,
        unit: 'milligrams'
      },
      newAmount: {
        quantity: 1,
        unit: 'grams'
      }
    },
    {
      oldAmount: {
        quantity: 1002,
        unit: 'milligram'
      },
      newAmount: {
        quantity: 1,
        unit: 'grams'
      }
    },
    {
      oldAmount: {
        quantity: 17,
        unit: 'oz'
      },
      newAmount: {
        quantity: 1.06,
        unit: 'pounds'
      }
    },
    {
      oldAmount: {
        quantity: 18.9,
        unit: 'ounces'
      },
      newAmount: {
        quantity: 1.18,
        unit: 'pounds'
      }
    },
    {
      oldAmount: {
        quantity: 16.00001,
        unit: 'ounce'
      },
      newAmount: {
        quantity: 1,
        unit: 'pounds'
      }
    },
    {
      oldAmount: {
        quantity: 499999,
        unit: 'ml'
      },
      newAmount: {
        quantity: 500,
        unit: 'liters'
      }
    },
    {
      oldAmount: {
        quantity: 1002,
        unit: 'milliliters'
      },
      newAmount: {
        quantity: 1,
        unit: 'liters'
      }
    },
    {
      oldAmount: {
        quantity: 1002,
        unit: 'milliliter'
      },
      newAmount: {
        quantity: 1,
        unit: 'liters'
      }
    },
    {
      oldAmount: {
        quantity: 3.0001,
        unit: 'tsp'
      },
      newAmount: {
        quantity: 1,
        unit: 'tablespoons'
      }
    },
    {
      oldAmount: {
        quantity: 11.9,
        unit: 'teaspoons'
      },
      newAmount: {
        quantity: 1.98,
        unit: 'fluid ounces'
      }
    },
    {
      oldAmount: {
        quantity: 48,
        unit: 'teaspoon'
      },
      newAmount: {
        quantity: 1,
        unit: 'cups'
      }
    },
    {
      oldAmount: {
        quantity: 383.999,
        unit: 'tsp'
      },
      newAmount: {
        quantity: 2,
        unit: 'quarts'
      }
    },
    {
      oldAmount: {
        quantity: 2000,
        unit: 'tsp'
      },
      newAmount: {
        quantity: 2.6,
        unit: 'gallons'
      }
    }
  ];

  it('should return a known value for a known input', () => {
    for (let amount of convertableAmounts) {
      expect(simplifyUnits(amount.oldAmount)).toEqual(amount.newAmount);
    }
  });

  const unconvertableAmounts: Array<QuantityAndUnit> = [
    {
      quantity: 999.99,
      unit: 'grams'
    },
    {
      quantity: 15.999,
      unit: 'ounces'
    },
    {
      quantity: 499.99,
      unit: 'ml'
    },
    {
      quantity: 2.999,
      unit: 'tsp'
    },
    {
      quantity: 1000,
      unit: 'graams'
    },
    {
      quantity: 10000,
      unit: 'leters'
    }
  ];

  it('should not convert inputs that are of the incorrect format or too small to be converted', () => {
    for (let amount of unconvertableAmounts) {
      expect(simplifyUnits(amount)).toEqual(amount);
    }
  });
});

describe('convertToSmallerUnits', () => {
  const convertableAmounts: Array<{ oldAmount: QuantityAndUnit, newAmount: QuantityAndUnit }> = [
    // IMPERIAL SOLIDS
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'lb'
      },
      newAmount: {
        quantity: 0.15 * 16,
        unit: 'ounces'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'pound'
      },
      newAmount: {
        quantity: 0.15 * 16,
        unit: 'ounces'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'pounds'
      },
      newAmount: {
        quantity: 0.15 * 16,
        unit: 'ounces'
      }
    },
    // IMPERIAL FLUIDS
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'gallon'
      },
      newAmount: {
        quantity: 0.15 * 16,
        unit: 'cups'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'gallons'
      },
      newAmount: {
        quantity: 0.15 * 16,
        unit: 'cups'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'quart'
      },
      newAmount: {
        quantity: 0.15 * 32,
        unit: 'fluid ounces'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'quarts'
      },
      newAmount: {
        quantity: 0.15 * 32,
        unit: 'fluid ounces'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'qt'
      },
      newAmount: {
        quantity: 0.15 * 32,
        unit: 'fluid ounces'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'fluid ounces'
      },
      newAmount: {
        quantity: 0.15 * 6,
        unit: 'teaspoon'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'fluid ounce'
      },
      newAmount: {
        quantity: 0.15 * 6,
        unit: 'teaspoon'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'fl oz'
      },
      newAmount: {
        quantity: 0.15 * 6,
        unit: 'teaspoon'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'tablespoons'
      },
      newAmount: {
        quantity: 0.15 * 3,
        unit: 'teaspoon'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'tablespoon'
      },
      newAmount: {
        quantity: 0.15 * 3,
        unit: 'teaspoon'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'tbsp'
      },
      newAmount: {
        quantity: 0.15 * 3,
        unit: 'teaspoon'
      }
    },
    // METRIC SOLIDS
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'kilograms'
      },
      newAmount: {
        quantity: 0.15 * 1000,
        unit: 'grams'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'kilogram'
      },
      newAmount: {
        quantity: 0.15 * 1000,
        unit: 'grams'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'kg'
      },
      newAmount: {
        quantity: 0.15 * 1000,
        unit: 'grams'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'hectograms'
      },
      newAmount: {
        quantity: 0.15 * 100,
        unit: 'grams'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'hectogram'
      },
      newAmount: {
        quantity: 0.15 * 100,
        unit: 'grams'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'hg'
      },
      newAmount: {
        quantity: 0.15 * 100,
        unit: 'grams'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'decagrams'
      },
      newAmount: {
        quantity: 0.15 * 10,
        unit: 'grams'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'decagram'
      },
      newAmount: {
        quantity: 0.15 * 10,
        unit: 'grams'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'dg'
      },
      newAmount: {
        quantity: 0.15 * 10,
        unit: 'grams'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'grams'
      },
      newAmount: {
        quantity: 0.15 * 1000,
        unit: 'milligrams'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'gram'
      },
      newAmount: {
        quantity: 0.15 * 1000,
        unit: 'milligrams'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'centigrams'
      },
      newAmount: {
        quantity: 0.15 * 10,
        unit: 'milligrams'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'centigram'
      },
      newAmount: {
        quantity: 0.15 * 10,
        unit: 'milligrams'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'cg'
      },
      newAmount: {
        quantity: 0.15 * 10,
        unit: 'milligrams'
      }
    },
    // METRIC FLUIDS
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'kiloliters'
      },
      newAmount: {
        quantity: 0.15 * 1000,
        unit: 'liters'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'kiloliter'
      },
      newAmount: {
        quantity: 0.15 * 1000,
        unit: 'liters'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'kl'
      },
      newAmount: {
        quantity: 0.15 * 1000,
        unit: 'liters'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'hectoliters'
      },
      newAmount: {
        quantity: 0.15 * 100,
        unit: 'liters'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'hectoliter'
      },
      newAmount: {
        quantity: 0.15 * 100,
        unit: 'liters'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'hl'
      },
      newAmount: {
        quantity: 0.15 * 100,
        unit: 'liters'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'decaliters'
      },
      newAmount: {
        quantity: 0.15 * 10,
        unit: 'liters'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'decaliter'
      },
      newAmount: {
        quantity: 0.15 * 10,
        unit: 'liters'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'dl'
      },
      newAmount: {
        quantity: 0.15 * 10,
        unit: 'liters'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'liters'
      },
      newAmount: {
        quantity: 0.15 * 1000,
        unit: 'milliliters'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'liter'
      },
      newAmount: {
        quantity: 0.15 * 1000,
        unit: 'milliliters'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'centiliters'
      },
      newAmount: {
        quantity: 0.15 * 10,
        unit: 'milliliters'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'centiliter'
      },
      newAmount: {
        quantity: 0.15 * 10,
        unit: 'milliliters'
      }
    },
    {
      oldAmount: {
        quantity: 0.15,
        unit: 'cl'
      },
      newAmount: {
        quantity: 0.15 * 10,
        unit: 'milliliters'
      }
    },
  ];

  it('should return a known converted amount for a known convertable input', () => {
    for (let amount of convertableAmounts) {
      expect(convertToSmallerUnits(amount.oldAmount)).toEqual(amount.newAmount);
    }
  })

  const unconvertableAmounts: Array<QuantityAndUnit> = [
    {
      quantity: 3,
      unit: 'lb'
    },
    {
      quantity: 0.2000001,
      unit: 'liter'
    },
    {
      quantity: 0,
      unit: 'kg'
    },
    {
      quantity: 1,
      unit: 'gram'
    },
    {
      quantity: 1000,
      unit: 'milligrams'
    },
    {
      quantity: 1000,
      unit: 'graams'
    },
  ];

  it('should return the same amount for a known unconvertable input', () => {
    for (let amount of unconvertableAmounts) {
      expect(convertToSmallerUnits(amount)).toEqual(amount);
    }
  })
});

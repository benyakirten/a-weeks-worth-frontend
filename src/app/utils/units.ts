import { QuantityAndUnit } from "src/app/types/general";
import {
  METRIC_SOLIDS,
  METRIC_SOLID_BASE_UNIT,
  METRIC_FLUIDS,
  METRIC_FLUID_BASE_UNIT,
  IMPERIAL_SOLIDS,
  IMPERIAL_SOLID_BASE_UNIT,
  IMPERIAL_FLUIDS,
  IMPERIAL_FLUID_BASE_UNIT,
  COMPLEX_RATIO_PATTERN,
  SIMPLE_RATIO_PATTERN,
  DECIMAL_PATTERN
} from './constants';

export const combineMeasures = (newItem: QuantityAndUnit, oldItem: QuantityAndUnit): QuantityAndUnit | undefined => {
  if (newItem.unit in METRIC_SOLIDS && oldItem.unit in METRIC_SOLIDS) {
    const newQuantity = newItem.quantity * METRIC_SOLIDS[newItem.unit];
    const oldQuantity = oldItem.quantity * METRIC_SOLIDS[oldItem.unit];
    return {
      quantity: newQuantity + oldQuantity,
      unit: METRIC_SOLID_BASE_UNIT
    }
  } else if (newItem.unit in METRIC_FLUIDS && oldItem.unit in METRIC_FLUIDS) {
    const newQuantity = newItem.quantity * METRIC_FLUIDS[newItem.unit];
    const oldQuantity = oldItem.quantity * METRIC_FLUIDS[oldItem.unit];
    return {
      quantity: newQuantity + oldQuantity,
      unit: METRIC_FLUID_BASE_UNIT
    }
  } else if (newItem.unit in IMPERIAL_SOLIDS && oldItem.unit in IMPERIAL_SOLIDS) {
    const newQuantity = newItem.quantity * IMPERIAL_SOLIDS[newItem.unit];
    const oldQuantity = oldItem.quantity * IMPERIAL_SOLIDS[oldItem.unit];
    return {
      quantity: newQuantity + oldQuantity,
      unit: IMPERIAL_SOLID_BASE_UNIT
    }
  } else if (newItem.unit in IMPERIAL_FLUIDS && oldItem.unit in IMPERIAL_FLUIDS) {
    const newQuantity = newItem.quantity * IMPERIAL_FLUIDS[newItem.unit];
    const oldQuantity = oldItem.quantity * IMPERIAL_FLUIDS[oldItem.unit];
    return {
      quantity: newQuantity + oldQuantity,
      unit: IMPERIAL_FLUID_BASE_UNIT
    }
  }
  return;
}

export const convertRatioToNumber = (quantity: string): number | null => {
  const complexRatioMatches = quantity.match(COMPLEX_RATIO_PATTERN);
  if (complexRatioMatches) {
    return +complexRatioMatches[1] + (+complexRatioMatches[2] / +complexRatioMatches[3])
  }
  const simpleRatioMatches = quantity.match(SIMPLE_RATIO_PATTERN);
  if (simpleRatioMatches) {
    return +simpleRatioMatches[1] / +simpleRatioMatches[2];
  }
  return null;
}

export const simplifyUnits = (item: QuantityAndUnit): QuantityAndUnit => {
  switch (item.unit) {
    case 'milligrams':
    case 'mg':
      if (item.quantity / (1000 * 1000) > 0) {
        const newQuantity = (item.quantity / (1000 * 1000)).toFixed(2);
        return {
          unit: 'kilograms',
          quantity: +newQuantity
        };
      }
      return item;
    case 'oz':
    case 'ounces':
      if (item.quantity / 16 > 0) {
        const newQuantity = (item.quantity / 16).toFixed(2);
        return {
          unit: 'pound',
          quantity: +newQuantity
        };
      }
      return item;
    case 'ml':
    case 'millileters':
      if (item.quantity / 1000 > 0) {
        const newQuantity = (item.quantity / 16).toFixed(2);
        return {
          unit: 'liters',
          quantity: +newQuantity
        };
      }
      return item;
    case 'tsp':
    case 'teaspoons':
      if (item.quantity / 768 > 0) {
        const newQuantity = (item.quantity / 768).toFixed(2);
        return {
          unit: 'gallons',
          quantity: +newQuantity
        }
      }
      if (item.quantity / 192 > 0) {
        const newQuantity = (item.quantity / 192).toFixed(2);
        return {
          unit: 'quarts',
          quantity: +newQuantity
        }
      }
      if (item.quantity / 48 > 0) {
        const newQuantity = (item.quantity / 48).toFixed(2);
        return {
          unit: 'cups',
          quantity: +newQuantity
        }
      }
      if (item.quantity / 6 > 0) {
        const newQuantity = (item.quantity / 6).toFixed(2);
        return {
          unit: 'fluid ounces',
          quantity: +newQuantity
        }
      }
      if (item.quantity / 3 > 0) {
        const newQuantity = (item.quantity / 3).toFixed(2);
        return {
          unit: 'tablespoons',
          quantity: +newQuantity
        }
      }
      return item;
    default:
      return item;
  }
}

export const changeQuantityToFractions = (quantity: number): string => {
  const _quantity = quantity.toFixed(2);
  const matches = _quantity.match(DECIMAL_PATTERN);
  if (!matches) return quantity.toString();

  let whole = +matches[1] > 0 ? +matches[1] : 0;
  const decimal = +matches[2];

  let _decimal = '';

  if (decimal < 12) {
    _decimal = '';
  } else if (decimal < 37) {
    _decimal = '1/4';
  } else if (decimal < 62) {
    _decimal = '1/2';
  } else if (decimal < 77) {
    _decimal = '3/4';
  } else if (decimal >= 77) {
    _decimal = '';
    whole++;
  }

  return `${whole > 0 ? whole : ''} ${_decimal}`;
}

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
    case 'milligram':
    case 'mg':
      if (item.quantity / (1000 * 1000) >= 0.5) {
        const newQuantity = (item.quantity / (1000 * 1000)).toFixed(2);
        return {
          unit: 'kilograms',
          quantity: +newQuantity
        };
      }
      if (item.quantity / 1000 >= 1) {
        const newQuantity = (item.quantity / 1000).toFixed(2);
        return {
          unit: 'grams',
          quantity: +newQuantity
        };
      }
      return item;
    case 'oz':
    case 'ounce':
    case 'ounces':
      if (item.quantity / 16 >= 1) {
        const newQuantity = (item.quantity / 16).toFixed(2);
        return {
          unit: 'pounds',
          quantity: +newQuantity
        };
      }
      return item;
    case 'ml':
    case 'milliliter':
    case 'milliliters':
      if (item.quantity / 1000 >= 0.5) {
        const newQuantity = (item.quantity / 1000).toFixed(2);
        return {
          unit: 'liters',
          quantity: +newQuantity
        };
      }
      return item;
    case 'tsp':
    case 'teaspoon':
    case 'teaspoons':
      if (item.quantity / 768 >= 0.5) {
        const newQuantity = (item.quantity / 768).toFixed(2);
        return {
          unit: 'gallons',
          quantity: +newQuantity
        }
      }
      if (item.quantity / 192 >= 0.5) {
        const newQuantity = (item.quantity / 192).toFixed(2);
        return {
          unit: 'quarts',
          quantity: +newQuantity
        }
      }
      if (item.quantity / 48 >= 0.25) {
        const newQuantity = (item.quantity / 48).toFixed(2);
        return {
          unit: 'cups',
          quantity: +newQuantity
        }
      }
      if (item.quantity / 6 >= 1) {
        const newQuantity = (item.quantity / 6).toFixed(2);
        return {
          unit: 'fluid ounces',
          quantity: +newQuantity
        }
      }
      if (item.quantity / 3 >= 1) {
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

  if (decimal < 12 && whole > 0) {
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

  return `${whole > 0 ? whole : ''}${whole > 0 && _decimal ? ' ' : ''}${_decimal}`;
}

export const convertToSmallerUnits = (item: QuantityAndUnit): QuantityAndUnit => {
  const _item = { ...item, unit: item.unit.toLowerCase().trim() };

  if (_item.quantity < 0.2 && _item.quantity > 0) {
    // I could just do one giant switch statement and not care about
    // the units. But this is at least some sort of organization
    if (_item.unit in IMPERIAL_SOLIDS) {
      switch(_item.unit) {
        case 'lb':
        case 'pound':
        case 'pounds':
          return { quantity: 16 * _item.quantity, unit: 'ounces' };
        default:
          break;
      }
    }
    if (_item.unit in IMPERIAL_FLUIDS) {
      switch (_item.unit) {
        case 'gallon':
        case 'gallons':
          return { quantity: 16 * _item.quantity, unit: 'cups' };
        case 'quart':
        case 'quarts':
        case 'qt':
          return { quantity: 32 * _item.quantity, unit: 'fluid ounces' };
        case 'cups':
        case 'cup':
          return { quantity: 8 * _item.quantity, unit: 'fluid ounces' };
        // We can't tell if it means oz/ounce/ounces mean fluid or not
        // so we'll only go with the ones explicitly fluid for this conversion
        case 'fluid ounces':
        case 'fluid ounce':
        case 'fl oz':
          return { quantity: 6 * _item.quantity, unit: 'teaspoon' }
        case 'tablespoons':
        case 'tablespoon':
        case 'tbsp':
          return { quantity: 3 * _item.quantity, unit: 'teaspoon' }
        default:
          break;
      }
    }
    if (_item.unit in METRIC_SOLIDS) {
      switch (_item.unit) {
        case 'kilograms':
        case 'kilogram':
        case 'kg':
          return { quantity: 1000 * _item.quantity, unit: 'grams' };
        case 'hectograms':
        case 'hectogram':
        case 'hg':
          return { quantity: 100 * _item.quantity, unit: 'grams' };
        case 'decagrams':
        case 'decagram':
        case 'dg':
          return { quantity: 10 * _item.quantity, unit: 'grams' };
        case 'grams':
        case 'gram':
          return { quantity: 1000 * _item.quantity, unit: 'milligrams' };
        case 'centigrams':
        case 'centigram':
        case 'cg':
          return { quantity: 10 * _item.quantity, unit: 'milligrams' };
        default: break;
      }
    }
    if (_item.unit in METRIC_FLUIDS) {
      switch (_item.unit) {
        case 'kiloliters':
        case 'kiloliter':
        case 'kl':
          return { quantity: 1000 * _item.quantity, unit: 'liters' };
        case 'hectoliters':
        case 'hectoliter':
        case 'hl':
          return { quantity: 100 * _item.quantity, unit: 'liters' };
        case 'decaliters':
        case 'decaliter':
        case 'dl':
          return { quantity: 10 * _item.quantity, unit: 'liters' };
        case 'liters':
        case 'liter':
        case 'l':
          return { quantity: 1000 * _item.quantity, unit: 'milliliters' };
        case 'centiliters':
        case 'centiliter':
        case 'cl':
          return { quantity: 10 * _item.quantity, unit: 'milliliters' };
        default: break;
      }
    }
  }
  return item;
}

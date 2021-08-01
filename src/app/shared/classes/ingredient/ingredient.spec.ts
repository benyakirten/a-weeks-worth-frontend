import { Ingredient } from './ingredient';

describe('Ingredient', () => {
  it('should create an instance', () => {
    expect(new Ingredient("Test Name", "Test Quantity", "Test Unit")).toBeTruthy();
  });
});

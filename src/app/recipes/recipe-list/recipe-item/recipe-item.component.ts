import { Component, Input } from '@angular/core';

import { Recipe } from 'src/app/shared/classes/recipe/recipe';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.scss']
})
export class RecipeItemComponent {
  @Input() recipe!: Recipe;
}

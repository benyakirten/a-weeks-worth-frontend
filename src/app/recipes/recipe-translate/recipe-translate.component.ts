import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { RecipesService } from 'src/app/shared/services/recipes/recipes.service';
import { TranslatedRecipe } from 'src/app/types/general';

@Component({
  selector: 'app-recipe-translate',
  templateUrl: './recipe-translate.component.html',
  styleUrls: ['./recipe-translate.component.scss']
})
export class RecipeTranslateComponent implements OnDestroy {
  error?: string;
  loading: boolean = false;

  url: string = '';
  convertUnits: boolean = true;
  convertableUrl: boolean = false;

  private mutationSub?: Subscription;

  AVAILABLE_CONVERTERS: Array<string> = [
    "ricette.giallozafferano",
    "fattoincasa",
    "mollichedizucchero",
    "allacciateilgrembiule",
    "primipiattiricette",
  ];

  constructor(
    private recipesService: RecipesService,
    private router: Router
  ) { }

  checkEligibility(e: string) {
    for (let converter of this.AVAILABLE_CONVERTERS) {
      if (e.includes(converter)) {
        this.convertableUrl = true;
      }
    }
    this.url = e;
  }


  toggleConvertUnits() {
    this.convertUnits = !this.convertUnits;
  }

  async onSubmit() {
    this.loading = true;
    this.error = undefined;
    const translatedRecipe =  await this.recipesService
      .translateRecipe(this.url, this.convertUnits);
    if (translatedRecipe.error) {
      this.loading = false;
      this.error = 'Unable to translate recipe. Please check the URL and try again.';
      return;
    }
    const recipe = this.recipesService.prepareRecipe(translatedRecipe as TranslatedRecipe, this.url);
    this.mutationSub = this.recipesService.createRecipe(recipe)
      .subscribe(({ data, errors }) => {
        this.loading = false;
        if (errors) {
          this.error = errors[0].message;
          return;
        }
        if (data) {
          this.router.navigate(['/recipes', data.createRecipe.recipe.id]);
        }
      })
  }

  ngOnDestroy(): void {
    this.mutationSub?.unsubscribe();
  }
}

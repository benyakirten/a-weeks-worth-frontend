import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RecipesComponent } from './recipes.component';
import { RecipeBlankComponent } from './recipe-blank/recipe-blank.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeFormComponent } from './recipe-form/recipe-form.component';
import { RecipeTranslateComponent } from './recipe-translate/recipe-translate.component';

import { RecipesGuard } from './recipes.guard';

const recipeRoutes: Routes = [
  { path: '',
    component: RecipesComponent,
    canActivateChild: [RecipesGuard],
    children: [
      { path: '', pathMatch: 'exact', component: RecipeBlankComponent },
      { path: 'new', component: RecipeFormComponent },
      { path: 'translate', component: RecipeTranslateComponent },
      { path: 'edit/:id', component: RecipeFormComponent },
      { path: ':id', component: RecipeDetailComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(recipeRoutes)],
  exports: [RouterModule]
})
export class RecipesRoutingModule {}

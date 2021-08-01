import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RecipesRoutingModule } from './recipes-routing.module';

import { RecipesComponent } from './recipes.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeItemComponent } from './recipe-list/recipe-item/recipe-item.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeFormComponent } from './recipe-form/recipe-form.component';
import { RecipeBlankComponent } from './recipe-blank/recipe-blank.component';
import { SharedModule } from '../shared/shared.module';
import { RecipeTranslateComponent } from './recipe-translate/recipe-translate.component';

@NgModule({
  declarations: [
    RecipesComponent,
    RecipeListComponent,
    RecipeItemComponent,
    RecipeDetailComponent,
    RecipeFormComponent,
    RecipeBlankComponent,
    RecipeTranslateComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RecipesRoutingModule,
    SharedModule
  ]
})
export class RecipesModule { }

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { of } from 'rxjs';

import { Recipe } from 'src/app/shared/classes/recipe/recipe';

import { GET_ALL_RECIPES } from 'src/app/shared/graphql/queries';

import { RecipesService } from 'src/app/shared/services/recipes/recipes.service';
import { RecipeItemComponent } from './recipe-item/recipe-item.component';

import { RecipeListComponent } from './recipe-list.component';

describe('RecipeListComponent', () => {
  let component: RecipeListComponent;
  let fixture: ComponentFixture<RecipeListComponent>;
  let controller: ApolloTestingController;
  let service: RecipesService;

  const recipes: Array<Recipe> = [
    new Recipe('testrecipeid1', 'test recipe 1', [], []),
    new Recipe('testrecipeid2', 'test recipe 2', [], []),
    new Recipe('testrecipeid3', 'test recipe 3', [], []),
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RecipeListComponent,
        RecipeItemComponent
      ],
      imports: [
        BrowserAnimationsModule,
        ApolloTestingModule
      ],
      providers: [
        RecipesService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    controller = TestBed.inject(ApolloTestingController);
    service = TestBed.inject(RecipesService);
  });

  afterEach(() => {
    controller.expectOne(GET_ALL_RECIPES).flush({
      data: null
    });

    controller.verify();
  });

  it('should show a special app-card if there are no recipes', () => {
    spyOnProperty(service, 'recipes').and.returnValue(of({ data: { recipes: [] } }));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.recipes).toEqual([]);
    const noRecipes = fixture.debugElement.query(By.css('app-card'));
    expect(noRecipes).toBeTruthy();
  });

  it('should set the error prop if recipesService\'s recipes returns an error', () => {
    spyOnProperty(service, 'recipes').and.returnValue(of({ errors: [{ message: 'testerror' }] } ));
    component.ngOnInit();

    expect(component.error).toEqual('testerror');
  });

  it('should render an app-recipe-item for every recipe returned if there are no errors', () => {
    spyOnProperty(service, 'recipes').and.returnValue(of({ data: { recipes: recipes }, loading: false }));
    component.ngOnInit();

    fixture.detectChanges();

    const recipeItems = fixture.debugElement.queryAll(By.css('app-recipe-item'));
    expect(recipeItems.length).toEqual(recipes.length);
    for (let i = 0; i < recipes.length; i++) {
      expect(recipeItems[i].componentInstance.recipe).toEqual(recipes[i]);
    }
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { StoreModule } from '@ngrx/store';

import * as fromApp from 'src/app/store/app.reducer';

import { RecipesComponent } from './recipes.component';

describe('RecipesComponent', () => {
  let component: RecipesComponent;
  let fixture: ComponentFixture<RecipesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipesComponent ],
      imports: [StoreModule.forRoot(fromApp.appReducer)]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render the translate recipe and create recipe buttons conditionally if the user is logged in', () => {
    component.loggedIn = false;
    fixture.detectChanges();

    const recipeButtonsNoUser = fixture.debugElement.query(By.css('.recipe-buttons'));
    expect(recipeButtonsNoUser).not.toBeTruthy();

    component.loggedIn = true;
    fixture.detectChanges();

    const recipeButtonsWithUser = fixture.debugElement.query(By.css('.recipe-buttons'));
    expect(recipeButtonsWithUser).toBeTruthy();
  });
});

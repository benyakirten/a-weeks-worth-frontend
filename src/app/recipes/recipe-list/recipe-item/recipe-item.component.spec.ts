import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Ingredient } from 'src/app/shared/classes/ingredient/ingredient';
import { Recipe } from 'src/app/shared/classes/recipe/recipe';
import { Step } from 'src/app/shared/classes/step/step';

import { PhotoCardComponent } from 'src/app/shared/components/photo-card/photo-card.component';
import { RecipeItemComponent } from './recipe-item.component';

describe('RecipeItemComponent', () => {
  let component: RecipeItemComponent;
  let fixture: ComponentFixture<RecipeItemComponent>;
  let router: Router

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RecipeItemComponent,
        PhotoCardComponent
      ],
      imports: [RouterTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeItemComponent);
    component = fixture.componentInstance;
    component.recipe = new Recipe(
      'testid',
      'test name',
      [new Ingredient('test ingredient', 'test quantity', 'test unit')],
      [new Step('test step', 1)],
      'https://www.testphotoimage.url'
    );
    fixture.detectChanges();
    router = TestBed.inject(Router);
  });

  it('should create an app photo card based on the recipe', () => {
    const photoCard = fixture.debugElement.query(By.css('app-photo-card')).componentInstance as PhotoCardComponent;
    expect(photoCard.caption).toEqual('test name');
    expect(photoCard.image).toEqual('https://www.testphotoimage.url');

    const h3 = fixture.debugElement.query(By.css('h3'));
    // This is set in the css: text-transform: uppercase;
    expect(h3.nativeElement.innerText).toEqual('test name'.toUpperCase());
  });
});

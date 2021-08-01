import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeTranslateComponent } from './recipe-translate.component';

describe('RecipeTranslateComponent', () => {
  let component: RecipeTranslateComponent;
  let fixture: ComponentFixture<RecipeTranslateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipeTranslateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeTranslateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

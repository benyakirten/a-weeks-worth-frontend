import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeBlankComponent } from './recipe-blank.component';

describe('RecipeBlankComponent', () => {
  let component: RecipeBlankComponent;
  let fixture: ComponentFixture<RecipeBlankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipeBlankComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeBlankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheWeekComponent } from './the-week.component';

describe('TheWeekComponent', () => {
  let component: TheWeekComponent;
  let fixture: ComponentFixture<TheWeekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheWeekComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

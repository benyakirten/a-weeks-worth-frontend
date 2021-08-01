import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekBlankComponent } from './week-blank.component';

describe('WeekBlankComponent', () => {
  let component: WeekBlankComponent;
  let fixture: ComponentFixture<WeekBlankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeekBlankComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekBlankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

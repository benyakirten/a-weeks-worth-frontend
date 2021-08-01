import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekDetailComponent } from './week-detail.component';

describe('WeekDetailComponent', () => {
  let component: WeekDetailComponent;
  let fixture: ComponentFixture<WeekDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeekDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

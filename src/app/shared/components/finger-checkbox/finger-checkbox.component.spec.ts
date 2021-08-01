import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FingerCheckboxComponent } from './finger-checkbox.component';

describe('FingerCheckboxComponent', () => {
  let component: FingerCheckboxComponent;
  let fixture: ComponentFixture<FingerCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FingerCheckboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FingerCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

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

  it('should have elements with the correct attributes based on props', () => {
    component.checked = false;
    component.id = 'test-id';
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    const label = fixture.debugElement.query(By.css('label')).nativeElement as HTMLLabelElement;
    const span = fixture.debugElement.query(By.css('span')).nativeElement as HTMLSpanElement;

    expect(input.name).toEqual('test-id');
    expect(input.id).toEqual('test-id');
    expect(input.checked).toEqual(false);
    expect(input.getAttribute('aria-labelledby')).toEqual('test-id-label');

    expect(label.getAttribute('for')).toEqual('test-id');
    expect(span.id).toEqual('test-id-label');
  });
});

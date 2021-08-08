import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;
  let button: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    button = fixture.debugElement.query(By.css('button'));
  });

  it('should set the style property based on the width, height, margin and padding props passed to it', () => {
    component.height = '1rem';
    component.width = '2rem';
    component.margin = '3rem';
    component.padding = '4rem';
    component.ngOnInit();

    fixture.detectChanges();

    expect(button.styles.height).toEqual('1rem');
    expect(button.styles.width).toEqual('2rem');
    expect(button.styles.margin).toEqual('3rem');
    expect(button.styles.padding).toEqual('4rem');
  });

  it('should set class on the button based on the warn prop', () => {
    component.warn = true;
    fixture.detectChanges();

    expect(button.nativeElement).not.toHaveClass('default');
    expect(button.nativeElement).toHaveClass('warn');

    component.warn = false;
    fixture.detectChanges();

    expect(button.nativeElement).toHaveClass('default');
    expect(button.nativeElement).not.toHaveClass('warn');
  });

  it('should set the disabled prop on the button based on the disabled prop', () => {
    component.disabled = true;
    fixture.detectChanges();
    expect(button.nativeElement.disabled).toBeTrue();

    component.disabled = false;
    fixture.detectChanges();
    expect(button.nativeElement.disabled).toBeFalse();
  });

  it('should set the button type based on the type prop', () => {
    component.type = 'button';
    fixture.detectChanges();
    expect(button.nativeElement.type).toEqual('button')

    component.type = 'submit';
    fixture.detectChanges();
    expect(button.nativeElement.type).toEqual('submit');

    component.type = 'reset';
    fixture.detectChanges();
    expect(button.nativeElement.type).toEqual('reset');
  })
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DefaultHoverToolbarComponent } from './default-hover-toolbar.component';

describe('DefaultHoverToolbarComponent', () => {
  let component: DefaultHoverToolbarComponent;
  let fixture: ComponentFixture<DefaultHoverToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefaultHoverToolbarComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultHoverToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should pass on the fontSize and width properties', () => {
    component.fontSize = '20rem';
    component.width = '100rem';
    fixture.detectChanges();

    const toolbar = fixture.debugElement.query(By.css('app-hover-toolbar')).componentInstance;
    expect(toolbar.fontSize).toEqual('20rem');
    expect(toolbar.width).toEqual('100rem');
  });
});

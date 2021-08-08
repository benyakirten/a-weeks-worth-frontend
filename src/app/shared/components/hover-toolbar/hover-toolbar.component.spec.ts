import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { HoverToolbarComponent } from './hover-toolbar.component';

describe('HoverToolbarComponent', () => {
  let component: HoverToolbarComponent;
  let fixture: ComponentFixture<HoverToolbarComponent>;
  let span: DebugElement;
  let div: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoverToolbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoverToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    span = fixture.debugElement.query(By.css('span'));
    div = span.query(By.css('div'));
  });

  it('should change the span\'s fontsize depending on the fontSize prop and tbe div\'s width based on the width prop', () => {
    component.fontSize = '20px';
    component.width = '300px';
    fixture.detectChanges();

    expect(span.styles.fontSize).toEqual('20px');
    expect(div.styles.width).toEqual('300px');
  });
});

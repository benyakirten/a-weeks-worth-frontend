import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DefaultDisplayBoxComponent } from './default-display-box.component';

describe('DefaultDisplayBoxComponent', () => {
  let component: DefaultDisplayBoxComponent;
  let fixture: ComponentFixture<DefaultDisplayBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefaultDisplayBoxComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultDisplayBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should output the headline prop in the h4 element', () => {
    component.headline = 'Test headline';
    fixture.detectChanges();

    const h4 = fixture.debugElement.query(By.css('h4'));
    expect(h4.nativeElement.innerHTML.trim()).toEqual('Test headline');
  });

  it('should output a list item for every item in rules with its corresponding value', () => {
    const rules = ['A', 'B', 'C']
    component.rules = rules;
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('li'));
    expect(items.length).toEqual(3);
    for (let i = 0; i < items.length; i++) {
      expect(items[i].nativeElement.innerHTML.trim()).toEqual(rules[i]);
    }
  })
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultHoverToolbarComponent } from './default-hover-toolbar.component';

describe('DefaultHoverToolbarComponent', () => {
  let component: DefaultHoverToolbarComponent;
  let fixture: ComponentFixture<DefaultHoverToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefaultHoverToolbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultHoverToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultDisplayBoxComponent } from './default-display-box.component';

describe('DefaultDisplayBoxComponent', () => {
  let component: DefaultDisplayBoxComponent;
  let fixture: ComponentFixture<DefaultDisplayBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefaultDisplayBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultDisplayBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

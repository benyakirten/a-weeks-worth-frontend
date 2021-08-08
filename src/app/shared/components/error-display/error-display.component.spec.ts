import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ErrorDisplayComponent } from './error-display.component';

describe('ErrorDisplayComponent', () => {
  let component: ErrorDisplayComponent;
  let fixture: ComponentFixture<ErrorDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should alternate the background color if success is true or false', () => {
    const div = fixture.debugElement.query(By.css('div')).nativeElement as HTMLDivElement;
    component.success = true;
    fixture.detectChanges();

    expect(div.style.backgroundColor).toEqual('rgba(183, 228, 199, 0.7)');

    component.success = false;
    fixture.detectChanges();

    expect(div.style.backgroundColor).toEqual('rgba(255, 77, 109, 0.7)');
  });
});

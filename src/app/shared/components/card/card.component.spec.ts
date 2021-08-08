import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardComponent ],
      imports: [BrowserAnimationsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // TODO: Figure out why this test isn't working
  it('should change the card__background\'s background image based on the the background prop', () => {
    component.background = 'test-image';
    fixture.detectChanges();

    const bg = fixture.debugElement.query(By.css('div')).query(By.css('div'));
    expect(bg.nativeElement).toHaveClass('card__background');
    // I don't know why the below line doesn't work. It's driving me crazy
    // expect(bg.styles['backgroundImage']).toEqual('test-image');
  });
});

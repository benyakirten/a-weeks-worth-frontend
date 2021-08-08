import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CardComponent } from '../card/card.component';

import { PhotoCardComponent } from './photo-card.component';

describe('PhotoCardComponent', () => {
  let component: PhotoCardComponent;
  let fixture: ComponentFixture<PhotoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PhotoCardComponent,
        CardComponent
      ],
      imports: [BrowserAnimationsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have properties based on input props', () => {
    component.caption = 'Test caption';
    component.image = 'https://www.path-to-test-image.com/';
    component.showPhoto = true;

    fixture.detectChanges();

    const debugEl = fixture.debugElement;

    const card = debugEl.query(By.css('app-card'));
    expect(card.nativeElement.getAttribute('aria-hidden')).toEqual(JSON.stringify(!component.showPhoto));
    expect(card.componentInstance.showCard).toEqual(component.showPhoto);

    const img: HTMLImageElement = debugEl.nativeElement.querySelector('img') as HTMLImageElement;
    expect(img.src).toEqual(component.image);
    expect(img.alt).toEqual(component.caption);
  });
});

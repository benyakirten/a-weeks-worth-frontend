import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LoadingComponent } from './loading.component';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should print a console error if size cannot be parsed by the regex', () => {
    spyOn(console, 'error');

    component.size = "unparseable";
    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('Size must be able to be parsed by the regex /(\d+\.?\d?)(\w+)/')
  });

  it('should compute the circle size to be 1/5th of the of the size, using the same units', () => {
    component.size = '5rem';
    component.ngOnInit();
    expect(component.circleSize).toEqual('1rem');
  });

  it(`
    should have the container\'s and loading div\'s height and width
    to be equal to size, and the internal divs\' width and height to be equal to the circleSize
  `, () => {
    component.size = '5rem';
    component.ngOnInit();
    fixture.detectChanges();

    const debugContainer = fixture.debugElement.query(By.css('.container'));
    expect(debugContainer.styles.height).toEqual('5rem');
    expect(debugContainer.styles.width).toEqual('5rem');

    const debugLoading = debugContainer.query(By.css('.loading'));
    expect(debugLoading.styles.height).toEqual('5rem');
    expect(debugLoading.styles.width).toEqual('5rem');

    const loadingCircles = debugLoading.queryAll(By.css('div'));
    for (let circle of loadingCircles) {
      expect(circle.styles.height).toEqual(component.circleSize);
      expect(circle.styles.width).toEqual(component.circleSize);
    }
  });
});

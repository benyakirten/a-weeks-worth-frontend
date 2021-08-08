import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DefaultModalComponent } from './default-modal.component';

describe('DefaultModalComponent', () => {
  let component: DefaultModalComponent;
  let fixture: ComponentFixture<DefaultModalComponent>;
  let debugEl: DebugElement;
  let nativeEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DefaultModalComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    debugEl = fixture.debugElement;
    nativeEl = fixture.nativeElement;
  });

  it('should use the inputs to appropiately change attributes and text', () => {
    component.id = 'Testid';
    component.text = 'Test text';
    component.title = 'Test title';
    component.buttonCaption = 'Test button caption';
    component.top = 200;

    fixture.detectChanges();

    const appModal = debugEl.query(By.css('app-modal'));
    expect(appModal.attributes['id']).toEqual('Testid');
    expect(appModal.componentInstance.top).toEqual(200);

    const h2 = debugEl.query(By.css('h2'));
    expect(h2.nativeElement.innerHTML).toEqual('Test title');

    const p = debugEl.query(By.css('p'));
    expect(p.nativeElement.innerHTML).toEqual('Test text');

    const appButton = debugEl.query(By.css('app-button'));
    expect(appButton.nativeElement.innerHTML).toEqual('Test button caption');
  });

  it('should console error if there\'s no ID', () => {
    spyOn(console, 'error');
    component.id = '';
    component.ngOnInit();

    expect(console.error).toHaveBeenCalled()
  })

  it('should emit the close event if the app button is clicked', () => {
    spyOn(component.close, 'emit');

    const appButton = debugEl.query(By.css('app-button'));
    appButton.nativeElement.click();
    expect(component.close.emit).toHaveBeenCalled();
  });
});

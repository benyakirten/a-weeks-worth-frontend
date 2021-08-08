import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ModalService } from '../../services/modal/modal.service';

import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let modalService: ModalService;
  let debugEl: DebugElement;
  let background: DebugElement;
  let modal: DebugElement;
  let nativeEl: HTMLElement;
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    modalService = TestBed.inject(ModalService);
    fixture = TestBed.createComponent(ModalComponent);

    component = fixture.componentInstance;
    component.id = 'test-id';
    nativeEl = fixture.nativeElement;

    debugEl = fixture.debugElement;
    background = debugEl.query(By.css('.modal-background'));
    modal = debugEl.query(By.css('.modal'))

    fixture.detectChanges();
  });

  it('should contain a div with the modal class whose top is offset by a number of pixels based on the top prop', () => {
    component.top = 200;
    fixture.detectChanges();

    expect(modal.styles.top).toEqual(`${component.top + 200}px`);
  });

  it('should call the close method when the modal-background or the button on the modal are clicked', () => {
    spyOn(component, 'close');
    const bgEl: any = nativeEl.querySelector('.modal-background');
    bgEl.click();
    expect(component.close).toHaveBeenCalled();

    const modalButton: any = nativeEl.querySelector('.modal')?.querySelector('button');
    modalButton.click();
    expect(component.close).toHaveBeenCalledTimes(2);
  });

  it('should console.error in the init function if the ID isn\'t set', () => {
    spyOn(console, 'error');
    component.id = '';
    component.ngOnInit();
    expect(console.error).toHaveBeenCalledWith('Modal must have an ID');
  });

  it('should append its native element to the document body then add itself to the modal service on init', () => {
    spyOn(document.body, 'appendChild');
    spyOn(modalService, 'add');

    component.ngOnInit();

    expect(document.body.appendChild).toHaveBeenCalledWith(component['element']);
    expect(modalService.add).toHaveBeenCalledWith(component);
  });

  it('should add the modal-open class to the body element and change its element\'s display to block when the open method is called', () => {
    component.ngOnInit();
    component.open();

    expect(document.body.classList).toContain('modal-open');
    expect(component['element'].style.display).toEqual('block');
  });

  it('should remove the modal-open class from the body element and change its element\'s display to none when the open method is called', () => {
    component.ngOnInit();
    component.open();

    expect(document.body.classList).toContain('modal-open');
    expect(component['element'].style.display).toEqual('block');

    component.close();

    expect(document.body.classList).not.toContain('modal-open');
    expect(component['element'].style.display).toEqual('none');
  });

  it('should call the remove method on the modal service and the destroy method on its element when the element is destroyed', () => {
    spyOn(modalService, 'remove');
    spyOn(component['element'], 'remove');

    component.ngOnInit();
    component.ngOnDestroy();

    expect(modalService.remove).toHaveBeenCalledTimes(1);
    expect(component['element'].remove).toHaveBeenCalledTimes(1);
  })
});

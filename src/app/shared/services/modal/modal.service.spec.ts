import { TestBed } from '@angular/core/testing';

import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { ModalService } from './modal.service';

describe('ModalService', () => {
  let service: ModalService;
  let modal: ModalComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ModalComponent
      ]
    });
    service = TestBed.inject(ModalService);
    const fixture = TestBed.createComponent(ModalComponent);
    modal = fixture.componentInstance;
    modal.id = 'test-modal';
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have a property modals that\'s an array', () => {
    expect(service['modals']).toBeDefined();
    expect(service['modals']).toBeInstanceOf(Array);
  });

  it('should add a modal service to the array if add is called', () => {
    expect(service['modals'].length).toEqual(0);
    service.add(modal);
    expect(service['modals'].length).toEqual(1);
    expect(service['modals']).toContain(modal);
  });

  it('should call the open method on the modal whose id is called when the service\'s open method is called', () => {
    const modalSpy = spyOn(modal, 'open');
    service.add(modal);
    service.open('test-modal');
    expect(modalSpy).toHaveBeenCalled();
  });

  it('should not call the open method on the modal when the id is incorrect', () => {
    const modalSpy = spyOn(modal, 'open');
    service.add(modal);
    service.open('incorrect-id');
    expect(modalSpy).not.toHaveBeenCalled();
  });

  it('should call the close method on the modal if the id is correct', () => {
    const modalSpy = spyOn(modal, 'close');
    service.add(modal);
    service.close('test-modal');
    expect(modalSpy).toHaveBeenCalled();
  });

  it('should not call the close method on the modal if the id is icorrect', () => {
    const modalSpy = spyOn(modal, 'close');
    service.add(modal);
    service.close('incorrect-id');
    expect(modalSpy).not.toHaveBeenCalled();
  });

  it('should remove a modal from its modals property if the remove method is called with the proper id', () => {
    service.add(modal);
    expect(service['modals'].length).toEqual(1);
    expect(service['modals']).toContain(modal);
    service.remove('test-modal');
    expect(service['modals'].length).toEqual(0);
    expect(service['modals']).not.toContain(modal);
  });

  it('should not remove a modal from its modals property if the remove method is called with the improper id', () => {
    service.add(modal);
    expect(service['modals'].length).toEqual(1);
    expect(service['modals']).toContain(modal);
    service.remove('incorrect-id');
    expect(service['modals'].length).toEqual(1);
    expect(service['modals']).toContain(modal);
  });
});

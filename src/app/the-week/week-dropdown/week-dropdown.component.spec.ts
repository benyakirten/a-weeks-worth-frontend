import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';

import { WeekService } from 'src/app/shared/services/week/week.service';
import { ModalService } from 'src/app/shared/services/modal/modal.service';

import * as fromApp from 'src/app/store/app.reducer';

import { WeekDropdownComponent } from './week-dropdown.component';

import { GET_MY_INFO } from 'src/app/shared/graphql/queries';
import { PartialGroup } from 'src/app/types/graphql/groups';

describe('WeekDropdownComponent', () => {
  let component: WeekDropdownComponent;
  let fixture: ComponentFixture<WeekDropdownComponent>;
  let router: Router;
  let controller: ApolloTestingController;
  let weekService: WeekService;

  const myGroups: Array<PartialGroup> = [
    {
      name: 'test group 1',
      id: 'testid1',
      members: []
    },
    {
      name: 'test group 2',
      id: 'testid2',
      members: []
    },
    {
      name: 'test group 3',
      id: 'testid3',
      members: []
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        WeekDropdownComponent
      ],
      imports: [
        RouterTestingModule,
        StoreModule.forRoot(fromApp.appReducer),
        ApolloTestingModule
      ],
      providers: [
        WeekService,
        ModalService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    controller = TestBed.inject(ApolloTestingController);
    router = TestBed.inject(Router);
    weekService = TestBed.inject(WeekService);
  });

  afterEach(() => {
    controller.expectOne(GET_MY_INFO).flush({
      data: {
        me: {
          individual: {
            groups: [],
            shoppingList: [],
            meals: []
          }
        }
      }
    });
    controller.verify();
  })

  it('should show the modal with appropriate information if the weekService AllMyInfo returns an error', () => {
    spyOnProperty(weekService, 'allMyInfo').and.returnValue(of({ errors: [{ message: 'testerror' }] }));
    spyOn(component, 'showModal');
    component.ngOnInit();;

    // expect(component.modalText).toEqual(`
    //   There was an error retrieving information -- teserror.
    //   Please refresh the page or navigate away then back. If the problem persists,
    //   contact Ben and let him know what went wrong.
    // `);
    expect(component.showModal).toHaveBeenCalled();
  });

  it('should create options for the appropriate groups the weekService AllMyInfo returns', () => {
    spyOnProperty(weekService, 'allMyInfo').and.returnValue(of({
      data: {
        me: {
          individual: {
            groups: myGroups
          }
        }
      }
     }));
     component.ngOnInit();
     component.username = 'test user';
     fixture.detectChanges();

     const options = fixture.debugElement.queryAll(By.css('option'));
     expect(options.length).toEqual(myGroups.length + 2);

     expect(options[0].nativeElement.value).toEqual('');
     expect(options[0].nativeElement.innerText.trim()).toEqual('Choose week to view');

     expect(options[1].nativeElement.value).toEqual('my-week');
     expect(options[1].nativeElement.innerText.trim()).toEqual('test user\'s week');

     for (let i = 2; i < options.length; i++) {
       expect(options[i].nativeElement.value).toEqual(myGroups[i - 2].id);
       expect(options[i].nativeElement.innerText.trim()).toEqual(myGroups[i - 2].name);
     }
  });

  it('should call the changeGroup method if an option is chosen from the select and for navigate to be called appropriately', () => {
    spyOn(router, 'navigate');
    spyOnProperty(weekService, 'allMyInfo').and.returnValue(of({
      data: {
        me: {
          individual: {
            groups: myGroups
          }
        }
      }
     }));
     component.ngOnInit();
     component.username = 'test user';
     fixture.detectChanges();

     const select = fixture.debugElement.query(By.css('select'));
     select.nativeElement.value = 'my-week'
     select.nativeElement.dispatchEvent(new Event('change'));
     expect(router.navigate).toHaveBeenCalledWith(['the-week', 'my-week']);

     select.nativeElement.value = ''
     select.nativeElement.dispatchEvent(new Event('change'));
     expect(router.navigate).toHaveBeenCalledWith(['the-week']);
  });
});

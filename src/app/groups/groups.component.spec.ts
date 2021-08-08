import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { StoreModule } from '@ngrx/store';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';

import { of } from 'rxjs';

import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { GroupsService } from '../shared/services/groups/groups.service';

import * as fromApp from 'src/app/store/app.reducer';

import { GroupsComponent } from './groups.component';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';

import { GET_ALL_GROUPS, GET_MY_GROUPS } from 'src/app/shared/graphql/queries';

import { GroupRequest, PartialGroup } from 'src/app/types/graphql/groups';
import { Group } from 'src/app/shared/classes/group/group';

describe('GroupsComponent', () => {
  let component: GroupsComponent;
  let fixture: ComponentFixture<GroupsComponent>;
  let groupsService: GroupsService;

  let debugEl: DebugElement;

  let controller: ApolloTestingController;

  const partialGroups: Array<PartialGroup> = [
    {
      id: 'testpg1',
      name: 'test partial group 1',
      members: ['testuser1', 'testuser2']
    },
    {
      id: 'testpg2',
      name: 'test partial group 2',
      members: ['testuser2', 'testuser3']
    },
    {
      id: 'testpg3',
      name: 'test partial group 3',
      members: ['testuser1']
    }
  ];
  const myGroups: Array<Group> = [
    new Group('testpg3', 'test partial group 3', ['testuser1'], [{ id: 'testuser2id', name: 'testuser2' }])
  ];
  const myRequests: Array<GroupRequest> = [
    {
      id: 'testpg2',
      name: 'test partial group 2'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        GroupsComponent,
        ButtonComponent
      ],
      imports: [
        ApolloTestingModule,
        RouterTestingModule,
        FormsModule,
        BrowserAnimationsModule,
        StoreModule.forRoot(fromApp.appReducer)
      ],
      providers: [
        AuthService,
        GroupsService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupsComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    component.loadingGroups = false;
    component.loadingMutations = false;
    component.loadingMyGroups = false;

    groupsService = TestBed.inject(GroupsService);
    controller = TestBed.inject(ApolloTestingController);

    fixture.detectChanges();
  });

  afterEach(() => {
    controller.expectOne(GET_ALL_GROUPS).flush({
      data: null
    });

    controller.expectOne(GET_MY_GROUPS).flush({
      data: null
    });

    controller.verify();
  });

  it('should toggle joinMode if the mode button\'s active button is clicked, and the other should not do anything and not have the active class', () => {
    const buttons = debugEl.query(By.css('.mode-buttons')).queryAll(By.css('button'));
    const otherGroupsButton = buttons[0];
    const myGroupsButton = buttons[1];

    expect(component.joinMode).toEqual(true);
    expect(myGroupsButton.nativeElement).toHaveClass('active');
    expect(otherGroupsButton.nativeElement).not.toHaveClass('active');

    // Mode doesn't change if we click the button that's active
    myGroupsButton.nativeElement.click();
    fixture.detectChanges();
    expect(component.joinMode).toEqual(true);

    // Now we can change sides
    otherGroupsButton.nativeElement.click();
    fixture.detectChanges();
    expect(component.joinMode).toEqual(false);
    expect(myGroupsButton.nativeElement).not.toHaveClass('active');
    expect(otherGroupsButton.nativeElement).toHaveClass('active');

    // Password mode stays true because it's already true
    otherGroupsButton.nativeElement.click();
    fixture.detectChanges();
    expect(component.joinMode).toEqual(false);

    // Change back
    myGroupsButton.nativeElement.click();
    fixture.detectChanges();
    expect(component.joinMode).toEqual(true);
    expect(myGroupsButton.nativeElement).toHaveClass('active');
    expect(otherGroupsButton.nativeElement).not.toHaveClass('active');
  });

  describe('groups in OnInit', () => {
    it('should set the groupsLoading property to true if the groupsService groups loading is true', () => {
      spyOnProperty(groupsService, 'groups').and.returnValue(of({ data: null, loading: true, errors: null }));
      component.ngOnInit();

      expect(component.loadingGroups).toBeTrue();
    });

    it('should set the groupsLoading property to false if the groupsService groups loading is false', () => {
      spyOnProperty(groupsService, 'groups').and.returnValue(of({ data: null, loading: false, errors: null }));
      component.ngOnInit();

      expect(component.loadingGroups).toBeFalse();
    });

    it('should set the error property to the first error\'s message if groupsService groups gives errors', () => {
      spyOnProperty(groupsService, 'groups').and.returnValue(of({ data: null, loading: false, errors: [{ message: 'testerror' }] }));
      component.ngOnInit();

      expect(component.error).toEqual('testerror');
    });

    it('should set the allGroups property and call the filterAllGroups method with the search filter if the groupsService groups returns data', () => {
      spyOnProperty(groupsService, 'groups').and.returnValue(of({ data: { groups: partialGroups }, loading: false, errors: null }));
      spyOn(component, 'filterAllGroups');
      component.searchFilter = 'testfilter';
      component.ngOnInit();

      expect(component.allGroups).toEqual(partialGroups);
      expect(component.filterAllGroups).toHaveBeenCalledOnceWith('testfilter');
    });
  });

  describe('myGroups in OnInit', () => {
    it('should set the groupsLoading property to true if the groupsService myGroups loading is true', () => {
      spyOnProperty(groupsService, 'myGroups').and.returnValue(of({ data: null, loading: true, errors: null }));
      component.ngOnInit();

      expect(component.loadingMyGroups).toBeTrue();
    });

    it('should set the groupsLoading property to false if the groupsService myGroups loading is false', () => {
      spyOnProperty(groupsService, 'myGroups').and.returnValue(of({ data: null, loading: false, errors: null }));
      component.ngOnInit();

      expect(component.loadingMyGroups).toBeFalse();
    });

    it('should set the error property to the first error\'s message if groupsService myGroups gives errors', () => {
      spyOnProperty(groupsService, 'myGroups').and.returnValue(of({ data: null, loading: false, errors: [{ message: 'testerror' }] }));
      component.ngOnInit();

      expect(component.error).toEqual('testerror');
    });

    it('should set the myGroups and myRequests properties if groupService\'s mygroups returns data', () => {
      spyOnProperty(groupsService, 'myGroups').and.returnValue(of({
        data: {
          me: {
            individual: {
              groups: myGroups,
              requests: myRequests
            }
          }
        },
        loading: false,
        errors: null
      }));
      component.ngOnInit();

      expect(component.myGroups).toEqual(myGroups);
      expect(component.myRequests).toEqual(myRequests);
    });
  });

  describe('testing group functionality', () => {
    beforeEach(() => {
      spyOnProperty(groupsService, 'groups').and.returnValue(of({ data: { groups: partialGroups }, loading: false, errors: null }));
      spyOnProperty(groupsService, 'myGroups').and.returnValue(of({
        data: {
          me: {
            individual: {
              groups: myGroups,
              requests: myRequests
            }
          }
        },
        loading: false,
        errors: null
      }));
      component.ngOnInit();
    });

    it('should return a boolean of if the group id is among myRequests\' ids when calling the alreadyRequestedAccess method', () => {
      expect(component.alreadyRequestedAccess('testpg2')).toBeTrue();
      expect(component.alreadyRequestedAccess('testpg3')).toBeFalse();
    });

    it('should return a boolean if the user is a part of the specified group when calling the notMember method', () => {
      expect(component.notMember('testpg1')).toBeTrue();
      expect(component.notMember('testpg3')).toBeFalse();
    });

    it('should return a boolean of if a potential group\'s name is already in use by another group when calling the nameAlreadyInUse method with the new group\'s name', () => {
      expect(component.nameAlreadyInUse('test partial group 2')).toBeTrue();
      expect(component.nameAlreadyInUse('new group name')).toBeFalse();
    });

    it('should return a list of all groups that have a member with that string as their name or the group\'s name is equal to the parameter when calling filterAllGroups method with a string', () => {
      expect(component.filterAllGroups('testuser1')).toEqual([partialGroups[0], partialGroups[2]]);
      expect(component.filterAllGroups('test partial group 2')).toEqual([partialGroups[1]]);
    });

    describe('joinMode true', () => {
      let otherGroups: DebugElement
      beforeEach(() => {
        component.joinMode = true;
        fixture.detectChanges();
        otherGroups = debugEl.query(By.css('.other-groups'));
      });

      it('should display the other groups div with two inputs, the first of which changes the searchFilter prop and calls the filterAllGroups function', () => {
        expect(otherGroups).toBeTruthy();

        const search = otherGroups.query(By.css('.search'));
        const inputs = search.queryAll(By.css('input'));

        spyOn(component, 'filterAllGroups');

        expect(inputs.length).toEqual(2);

        inputs[0].nativeElement.value = 'testsearchvalue';
        inputs[0].nativeElement.dispatchEvent(new Event('input'));
        expect(component.searchFilter).toEqual('testsearchvalue');
        expect(component.filterAllGroups).toHaveBeenCalledOnceWith('testsearchvalue');
      });

      it('should display the other group div with two inputs, the second of which creates a new group with a corresponding submit button', () => {
        expect(otherGroups).toBeTruthy();

        const search = otherGroups.query(By.css('.search'));
        const inputs = search.queryAll(By.css('input'));
        spyOn(component, 'createGroup');

        inputs[1].nativeElement.value = 'testsearchvalue';
        inputs[1].nativeElement.dispatchEvent(new Event('input'));
        const form = search.query(By.css('form'));
        form.nativeElement.dispatchEvent(new Event('submit'));
        fixture.detectChanges();

        expect(component.createGroup).toHaveBeenCalledWith(form.references['f']);
      });

      it('should display a card for every group in allGroups with a button to make a request to join the group or to cancel the request if they\'ve already made the request', () => {
        expect(otherGroups).toBeTruthy();

        const cards = otherGroups.query(By.css('.all-groups')).queryAll(By.css('.card'));
        expect(cards.length).toEqual(partialGroups.length);

        for (let i = 0; i < cards.length; i++) {
          const title = cards[i].query(By.css('h3'));
          expect(title.nativeElement.innerText).toEqual(partialGroups[i].name);

          const members = cards[i].query(By.css('ul')).queryAll(By.css('li'));
          expect(members.length).toEqual(partialGroups[i].members.length);
        }

        spyOn(component, 'cancelRequest');
        spyOn(component, 'requestAccess');

        const buttons = otherGroups.query(By.css('.all-groups')).queryAll(By.css('app-button'));
        // Group user has requested access to
        expect(buttons[0].nativeElement.innerText.trim()).toEqual('Request Access');
        buttons[0].nativeElement.click();
        fixture.detectChanges();
        expect(component.requestAccess).toHaveBeenCalledOnceWith(partialGroups[0].id, partialGroups[0].name);

        // Group user hasn't requested access to
        expect(buttons[1].nativeElement.innerText.trim()).toEqual('Cancel Request');
        buttons[1].nativeElement.click();
        fixture.detectChanges();
        expect(component.cancelRequest).toHaveBeenCalledOnceWith(partialGroups[1].id);
      });

      it('should call the groupsService\'s requestAccess method with the passed parameters and set the error prop to the error when requestAccess is called', () => {
        spyOn(groupsService, 'requestAccess').and.returnValue(of({ errors: [{ message: 'testerror' }]} as any));

        component.requestAccess('testgroupid', 'test group name');

        expect(groupsService.requestAccess).toHaveBeenCalledOnceWith('testgroupid', 'test group name');
        expect(component.error).toEqual('testerror');
      });

      it('should call the groupService\'s cancelRequest method if the cancelRequest method is called, passing in the appropriate information then setting the error if there is one', () => {
        spyOn(groupsService, 'cancelRequest').and.returnValue(of({ errors: [{ message: 'testerror' }]} as any));

        component.cancelRequest('testgroupid');

        expect(groupsService.cancelRequest).toHaveBeenCalledOnceWith('testgroupid');
        expect(component.error).toEqual('testerror');
      });
    });

    describe('joinMode false', () => {
      beforeEach(() => {
        component.joinMode = false;
        fixture.detectChanges();
      });

      it('should display the body div and a card for every group in myGroups that has its information on it as well as join, leave and buttons to accept requests that call the appropriate functions with the appropriate parameters, and also the user\'s requests with cancel request bones', () => {
        const body = debugEl.query(By.css('.body'));
        expect(body).toBeTruthy();

        const cards = body.queryAll(By.css('.card'));
        expect(cards.length).toEqual(1);

        const card = cards[0];

        const h3 = card.query(By.css('h3'));
        expect(h3.nativeElement.innerText.trim()).toEqual(myGroups[0].name);

        const members = card.query(By.css('.card__members')).queryAll(By.css('li'));
        expect(members.length).toEqual(myGroups[0].members.length);
        for (let i = 0; i < members.length; i++) {
          expect(members[i].nativeElement.innerText).toEqual(myGroups[0].members[i]);
        }

        const requests = card.query(By.css('.card__requests')).queryAll(By.css('li'));
        expect(requests.length).toEqual(myGroups[0].requests!.length);

        for (let i = 0; i < requests.length; i++) {
          expect(requests[i].query(By.css('p')).nativeElement.innerText).toEqual(myGroups[0].requests![i].name);
        }

        spyOn(component, 'deleteGroup');
        spyOn(component, 'leaveGroup');
        spyOn(component, 'acceptRequest');
        const buttons = card.queryAll(By.css('app-button'));

        expect(buttons.length).toEqual(3);

        const leaveButton = buttons[0];
        const deleteButton = buttons[1];
        const acceptButton = buttons[2];

        leaveButton.nativeElement.click();
        expect(component.leaveGroup).toHaveBeenCalledOnceWith(myGroups[0].id);

        deleteButton.nativeElement.click();
        expect(component.deleteGroup).toHaveBeenCalledOnceWith(myGroups[0].id);

        acceptButton.nativeElement.click();
        expect(component.acceptRequest).toHaveBeenCalledOnceWith(
          myGroups[0].requests![0].id,
          myGroups[0].id,
          myGroups[0].requests![0].name
        );

        const myRequestsDiv = body.query(By.css('.my-requests'));
        expect(myRequestsDiv).toBeTruthy();

        const items = myRequestsDiv.queryAll(By.css('li'));
        expect(items.length).toEqual(myRequests.length);
        spyOn(component, 'cancelRequest');
        for (let i = 0; i < items.length; i++) {
          expect(items[i].query(By.css('p')).nativeElement.innerText).toEqual(myRequests[i].name);
          const cancelRequestButton = items[i].query(By.css('app-button'));
          cancelRequestButton.nativeElement.click();
          expect(component.cancelRequest).toHaveBeenCalledWith(myRequests[i].id);
        }
        expect(component.cancelRequest).toHaveBeenCalledTimes(myRequests.length);
      });

      it('should call the groupService\'s leaveGroup method if the leaveGroup method is called, passing in the appropriate information then setting the error if there is one', () => {
        spyOn(groupsService, 'leaveGroup').and.returnValue(of({ errors: [{ message: 'testerror' }]} as any));

        component.leaveGroup('testgroupid');

        expect(groupsService.leaveGroup).toHaveBeenCalledOnceWith('testgroupid');
        expect(component.error).toEqual('testerror');
      });

      it('should call the groupService\'s deleteGroup method if the deleteGroup method is called, passing in the appropriate information then setting the error if there is one', () => {
        spyOn(groupsService, 'deleteGroup').and.returnValue(of({ errors: [{ message: 'testerror' }]} as any));

        component.deleteGroup('testgroupid');

        expect(groupsService.deleteGroup).toHaveBeenCalledOnceWith('testgroupid');
        expect(component.error).toEqual('testerror');
      });

      it('should call the groupService\'s acceptRequest method if the acceptRequest method is called, passing in the appropriate information then setting the error if there is one', () => {
        spyOn(groupsService, 'acceptRequest').and.returnValue(of({ errors: [{ message: 'testerror' }]} as any));

        component.acceptRequest('testinvitedid', 'testgroupid', 'testinviteduser');

        expect(groupsService.acceptRequest).toHaveBeenCalledOnceWith('testinvitedid', 'testgroupid', 'testinviteduser');
        expect(component.error).toEqual('testerror');
      });
    });
  });
});

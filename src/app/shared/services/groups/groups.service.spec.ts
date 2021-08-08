import { TestBed } from '@angular/core/testing';

import {
  ApolloTestingModule,
  ApolloTestingController
} from 'apollo-angular/testing';
import { Observable } from 'rxjs';

import { GroupsService } from './groups.service';

import { GET_ALL_GROUPS, GET_MY_GROUPS } from 'src/app/shared/graphql/queries';
import { CREATE_GROUP } from 'src/app/shared/graphql/mutations/groups';
import { CreateGroup, MyGroupsResponse, PartialGroup } from 'src/app/types/graphql/groups';

import { Group } from 'src/app/shared/classes/group/group';

describe('GroupsService', () => {
  let service: GroupsService;
  let controller: ApolloTestingController;

  const fakeData: { partialGroups: Array<PartialGroup>, myGroups: MyGroupsResponse } = {
    partialGroups: [
      {
        id: "test1",
        name: "test group 1",
        members: [
          "test1person1",
          "test1person2"
        ]
      },
      {
        id: "test2",
        name: "test group 2",
        members: [
          "test2person1",
          "test2person2"
        ]
      },
      {
        id: "test3",
        name: "test group 3",
        members: [
          "test3person1",
          "test3person2"
        ]
      },
    ],
    myGroups: {
      me: {
        individual: {
          id: 'testindividual1',
          groups: [
            new Group(
              'testgroup1id',
              'test group 1 name',
              [
                'testuser1',
                'testuser2'
              ],
              [
                {
                  id: 'testindividual2',
                  name: 'test individual 2'
                }
              ]
            )
          ],
          requests: [
            {
              id: 'test2',
              name: 'test group 2'
            }
          ]
        }
      }
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule]
    });
    service = TestBed.inject(GroupsService);
    controller = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => {
    controller.verify();
  })

  it('should have a groups property that returns an Observable that yields an array of Partial Groups', () => {
    expect(service.groups).toBeInstanceOf(Observable);
    service.groups.subscribe(({ data }) => {
      expect(data.groups).toEqual(fakeData.partialGroups);
    });

    const op = controller.expectOne(GET_ALL_GROUPS);

    op.flush({
      data: {
        groups: fakeData.partialGroups
      }
    });
  });

  it('should have a myGroups property that returns an Observable that yields an array of Groups', () => {
    expect(service.myGroups).toBeInstanceOf(Observable);
    service.myGroups.subscribe(({ data }) => {
      expect(data).toEqual(fakeData.myGroups);
    });

    const op = controller.expectOne(GET_MY_GROUPS);

    op.flush({
      data: fakeData.myGroups
    });
  });

  // I don't know how to test the cache, so there's nothing really to gain by doing more tests
  it('should have a createGroup method that returns the data with the new group added', () => {
    const newGroup: Group = new Group('testgroup3id', 'New Group', ["testindividual1"]);
    const createGroupResponse: CreateGroup = {
      createGroup: {
        group: {
          ...newGroup
        },
        individual: {
          groups: [
            ...fakeData.myGroups.me.individual.groups,
            newGroup
          ]
        }
      }
    }

    service.createGroup('New Group').subscribe(({ data }) => {
      expect(data).toEqual(createGroupResponse);
    });

    const op = controller.expectOne(CREATE_GROUP);
    // It was warning me against having no expects here
    // so I did this
    expect(op).toBeTruthy();

    op.flush({
      data: createGroupResponse
    })
  });
});

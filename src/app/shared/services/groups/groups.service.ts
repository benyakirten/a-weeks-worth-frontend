import { Injectable } from '@angular/core';

import { Apollo } from 'apollo-angular';

import { GET_ALL_GROUPS, GET_MY_GROUPS } from 'src/app/shared/graphql/queries';
import { CREATE_GROUP, DELETE_GROUP } from 'src/app/shared/graphql/mutations/groups';
import {
  INVITE_TO_GROUP,
  CANCEL_REQUEST,
  LEAVE_GROUP,
  REQUEST_ACCESS
} from 'src/app/shared/graphql/mutations/individual';

import {
  CreateGroup,
  DeleteGroup,
  GroupsResponse,
  MyGroupsResponse,
  PartialGroup
} from 'src/app/types/graphql/groups';
import {
  CancelRequest,
  InviteToGroup,
  LeaveGroup,
  RequestAccess
} from 'src/app/types/graphql/individual';
import { Group } from 'src/app/shared/classes/group/group';

@Injectable({ providedIn: 'root' })
export class GroupsService {

  constructor(private apollo: Apollo) { }

  get groups() {
    return this.apollo.watchQuery<GroupsResponse>({
      query: GET_ALL_GROUPS
    }).valueChanges
  }

  get myGroups() {
    return this.apollo.watchQuery<MyGroupsResponse>({
      query: GET_MY_GROUPS
    }).valueChanges
  }

  createGroup(name: string) {
    return this.apollo.mutate<CreateGroup>({
      mutation: CREATE_GROUP,
      variables: { name },
      update: (cache, { data, errors }) => {
        if (errors) {
          throw new Error(`Unable to create group: ${errors[0].message}`);
        }
        if (data) {
          const myGroups = cache.readQuery<MyGroupsResponse>({ query: GET_MY_GROUPS });
          if (myGroups) {
            const newGroup = new Group(
              data.createGroup.group.id,
              data.createGroup.group.name,
              data.createGroup.group.members,
            );
            const updatedMyGroups: MyGroupsResponse = {
              ...myGroups,
              me: {
                ...myGroups.me,
                individual: {
                  ...myGroups.me.individual,
                  groups: {
                    ...myGroups.me.individual.groups.concat(newGroup)
                  }
                }
              }
            }
            cache.writeQuery<MyGroupsResponse>({ query: GET_MY_GROUPS, data: updatedMyGroups });
          }
          const allGroups = cache.readQuery<GroupsResponse>({ query: GET_ALL_GROUPS });
          if (allGroups) {
            const newGroup: PartialGroup = {
              id: data.createGroup.group.id,
              name: data.createGroup.group.name,
              members: data.createGroup.group.members,
            };
            const updatedAllGroups: GroupsResponse = {
              groups: allGroups.groups.concat(newGroup)
            };
            cache.writeQuery<GroupsResponse>({ query: GET_ALL_GROUPS, data: updatedAllGroups });
          }
        }
      }
    });
  }

  leaveGroup(id: string) {
    return this.apollo.mutate<LeaveGroup>({
      mutation: LEAVE_GROUP,
      variables: { id },
      update: (cache, { data, errors }) => {
        if (errors) {
          throw new Error(`Unable to leave group: ${errors[0].message}`);
        }
        if (data) {
          const myGroups = cache.readQuery<MyGroupsResponse>({ query: GET_MY_GROUPS });
          if (myGroups) {
            const updatedGroups = myGroups.me.individual.groups.filter(g => g.id !== id);
            const updatedMyGroups: MyGroupsResponse = {
              ...myGroups,
              me: {
                ...myGroups.me,
                individual: {
                  ...myGroups.me.individual,
                  groups: updatedGroups
                }
              }
            }
            cache.writeQuery<MyGroupsResponse>({ query: GET_MY_GROUPS, data: updatedMyGroups })
          }
          const allGroups = cache.readQuery<GroupsResponse>({ query: GET_ALL_GROUPS });
          if (allGroups) {
            const leftGroup = allGroups.groups.find(g => g.id === id);
            if (!leftGroup) {
              return;
            }
            let updatedGroups: GroupsResponse;
            if (leftGroup.members.length > 1) {
              // If the group has at least 2 members, just remove the one who left
              const updatedMembers = leftGroup.members.filter(m => m !== data.leaveGroup.individual.username);
              const updatedGroup: PartialGroup = {
                id: leftGroup.id,
                name: leftGroup.name,
                members: updatedMembers
              };
              updatedGroups = {
                groups: allGroups.groups.map(g => g.id === updatedGroup.id ? updatedGroup : g)
              }
            } else {
              // If the group has only one member -- they have left so the group will be deleted
              updatedGroups = { groups: allGroups.groups.filter(g => g.id !== id) };
            }
            if (updatedGroups) {
              cache.writeQuery<GroupsResponse>({ query: GET_ALL_GROUPS, data: updatedGroups });
            }
          }
        }
      }
    });
  }

  deleteGroup(id: string) {
    return this.apollo.mutate<DeleteGroup>({
      mutation: DELETE_GROUP,
      variables: { id },
      update: (cache, { data, errors }) => {
        if (errors) {
          throw new Error(`Unable to delete group: ${errors[0].message}`);
        }
        if (data) {
          const existingMyGroupsQuery = cache
            .readQuery<MyGroupsResponse>({ query: GET_MY_GROUPS });
          if (existingMyGroupsQuery) {
            const updatedMyGroups = existingMyGroupsQuery.me.individual.groups
              .filter(g => g.id !== data.deleteGroup.group.id)
            const finalMyGroupsQuery: MyGroupsResponse = {
              ...existingMyGroupsQuery,
              me: {
                ...existingMyGroupsQuery.me,
                individual: {
                  ...existingMyGroupsQuery.me.individual,
                  groups: updatedMyGroups
                }
              }
            };
            cache.writeQuery<MyGroupsResponse>(
              {
                query: GET_MY_GROUPS,
                data: finalMyGroupsQuery
              }
            );
          }
          const existingGroupsQuery = cache
            .readQuery<GroupsResponse>({ query: GET_ALL_GROUPS })
          if (existingGroupsQuery) {
            const updatedGroups = {
              groups: existingGroupsQuery.groups
                .filter(g => g.id !== data.deleteGroup.group.id)
            };
            cache.writeQuery<GroupsResponse>({
              query: GET_ALL_GROUPS,
              data: updatedGroups
            });
          }
        }
      }
    });
  }

  requestAccess(id: string, name: string) {
    return this.apollo.mutate<RequestAccess>({
      mutation: REQUEST_ACCESS,
      variables: { id },
      update: (cache, { data, errors }) => {
        if (errors) {
          throw new Error(`Unable to request group access for ${id}: ${errors[0].message}`);
        }
        if (data) {
          const myGroups = cache.readQuery<MyGroupsResponse>({ query: GET_MY_GROUPS });
          if (myGroups) {
            const requests = myGroups.me.individual.requests.slice();
            const updatedRequests = requests.concat({ id, name });
            const updatedMyGroups: MyGroupsResponse = {
              ...myGroups,
              me: {
                ...myGroups.me,
                individual: {
                  ...myGroups.me.individual,
                  requests: {
                    ...updatedRequests
                  }
                }
              }
            };
            cache.writeQuery<MyGroupsResponse>({ query: GET_MY_GROUPS, data: updatedMyGroups });
          }
        }
      }
    });
  }

  acceptRequest(invitedId: string, groupId: string, username: string) {
    return this.apollo.mutate<InviteToGroup>({
      mutation: INVITE_TO_GROUP,
      variables: { invitedId, groupId },
      update: (cache, { data, errors }) => {
        if (errors) {
          throw new Error(`Unable to accept group request: ${errors[0].message}`)
        }
        if (data) {
          const myGroups = cache.readQuery<MyGroupsResponse>({ query: GET_MY_GROUPS });
          if (myGroups) {
            const requests = myGroups.me.individual.requests.slice();
            const updatedMyRequests = requests.filter(r => r.id !== groupId);
            const group = myGroups.me.individual.groups.find(g => g.id === groupId);
            const updatedGroupRequests = group!.requests!.filter(r => r.id !== invitedId);
            const updatedGroup = new Group(
              group!.id,
              group!.name,
              group!.members,
              updatedGroupRequests,
              group?.shoppingList,
              group?.meals
            );
            const updatedGroups = myGroups.me.individual.groups.map(g => g.id === updatedGroup.id ? updatedGroup : g);
            const updatedMyGroups: MyGroupsResponse = {
              ...myGroups,
              me: {
                ...myGroups.me,
                individual: {
                  ...myGroups.me.individual,
                  requests: updatedMyRequests,
                  groups: updatedGroups
                }
              }
            }
            cache.writeQuery<MyGroupsResponse>({ query: GET_MY_GROUPS, data: updatedMyGroups });
          }
          const allGroups = cache.readQuery<GroupsResponse>({ query: GET_ALL_GROUPS });
          if (allGroups) {
            const group = allGroups.groups.find(g => g.id === groupId);
            if (group) {
              const updatedGroup: PartialGroup = {
                id: group.id,
                name: group.name,
                members: group.members.concat(username)
              }
              const updatedGroups = allGroups.groups.map(g => g.id === updatedGroup.id ? updatedGroup : g);
              cache.writeQuery<GroupsResponse>({ query: GET_ALL_GROUPS, data: { groups: updatedGroups } });
            }
          }
        }
      }
    });
  }

  cancelRequest(id: string) {
    return this.apollo.mutate<CancelRequest>({
      mutation: CANCEL_REQUEST,
      variables: { id },
      update: (cache, { data, errors }) => {
        if (errors) {
          throw new Error(`Unable to cancel request: ${errors[0].message}`);
        }
        if (data && data.cancelRequest.success) {
          const myGroups = cache.readQuery<MyGroupsResponse>({ query: GET_MY_GROUPS });
          if (myGroups) {
            const updatedMyGroups: MyGroupsResponse = {
              ...myGroups,
              me: {
                ...myGroups.me,
                individual: {
                  ...myGroups.me.individual,
                  requests: myGroups.me.individual.requests.filter(r => r.id !== id)
                }
              }
            }
            cache.writeQuery<MyGroupsResponse>({ query: GET_MY_GROUPS, data: updatedMyGroups });
          }
        }
      }
    });
  }
}

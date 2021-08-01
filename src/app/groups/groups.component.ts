import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { GroupsService } from 'src/app/shared/services/groups/groups.service';

import { GroupRequest, PartialGroup } from 'src/app/types/graphql/groups';
import { Group } from 'src/app/shared/classes/group/group';

import { simpleFade } from 'src/app/shared/animations/void-animations';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-groups',
  animations: [simpleFade('card')],
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit, OnDestroy {
  joinMode: boolean = true;
  error?: string;

  loadingGroups: boolean = true;
  loadingMyGroups: boolean = true;
  loadingMutations: boolean = false;

  allGroups: Array<PartialGroup> = [];
  searchFilter: string = '';
  filteredAllGroups: Array<PartialGroup> = [];
  myGroups: Array<Group> = [];
  myRequests: Array<GroupRequest> = [];

  private queryGroupsSubscription?: Subscription;
  private queryMyGroupsSubscription?: Subscription;
  private mutationSubscriptions: Array<Subscription> = [];

  constructor(private groupsService: GroupsService) { }

  ngOnInit(): void {
    this.queryGroupsSubscription = this.groupsService.groups
      .subscribe(({ data, errors, loading }) => {
        this.loadingGroups = loading;
        if (errors) {
          this.error = errors[0].message;
        }
        if (data) {
          this.allGroups = data.groups;
          this.filteredAllGroups = this.filterAllGroups(this.searchFilter);
        }
      });

    this.queryMyGroupsSubscription = this.groupsService.myGroups
      .subscribe(({ data, errors, loading }) => {
        this.loadingMyGroups = loading;
        if (errors) {
          this.error = errors[0].message;
        }
        if (data) {
          this.myRequests = data.me.individual.requests;
          this.myGroups = data.me.individual.groups;
        }
      });
  }

  toggleJoinMode(): void {
    this.joinMode = !this.joinMode;
  }

  leaveGroup(id: string) {
    this.error = undefined;
    this.loadingMutations = true;
    try {
      const mutationSub = this.groupsService
        .leaveGroup(id)
        .subscribe(({ errors }) => {
          this.loadingMutations = false;
          if (errors) {
            this.error = errors[0].message;
          }
        });
      this.mutationSubscriptions.push(mutationSub);
    } catch(e) {
      this.loadingMutations = false;
      this.error = e.message;
    }
  }

  deleteGroup(id: string) {
    this.error = undefined;
    this.loadingMutations = true;
    try {
      const mutationSub = this.groupsService
        .deleteGroup(id)
        .subscribe(({ errors }) => {
          this.loadingMutations = false;
          if (errors) {
            this.error = errors[0].message;
          }
        });
      this.mutationSubscriptions.push(mutationSub);
    } catch(e) {
      this.loadingMutations = false;
      this.error = e.message;
    }
  }

  acceptRequest(invitedId: string, groupId: string, username: string) {
    this.error = undefined;
    this.loadingMutations = true;
    try {
      const mutationSub = this.groupsService
        .acceptRequest(invitedId, groupId, username)
        .subscribe(({ errors }) => {
          this.loadingMutations = false;
          if (errors) {
            this.error = errors[0].message;
          }
        });
      this.mutationSubscriptions.push(mutationSub);
    } catch(e) {
      this.loadingMutations = false;
      this.error = e.message;
    }
  }

  cancelRequest(id: string) {
    this.error = undefined;
    this.loadingMutations = true;
    try {
      const mutationSub = this.groupsService.cancelRequest(id)
        .subscribe(({ errors }) => {
          this.loadingMutations = false;
          if (errors) {
            this.error = errors[0].message;
          }
        })
      this.mutationSubscriptions.push(mutationSub);
    } catch (e) {
      this.error = e.message;
      this.loadingMutations = false;
    }
  }

  filterAllGroups(search: string) {
    return this.allGroups
      .filter(g =>
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.members.includes(search)
      );
  }

  searchAllGroups(searchString: string) {
    this.searchFilter = searchString;
    this.filteredAllGroups = this.filterAllGroups(searchString);
  }

  alreadyRequestedAccess(id: string) {
    return !!this.myRequests.find(r => r.id === id);
  }

  nameAlreadyInUse(name: string) {
    return !!this.allGroups.find(g => g.name === name);
  }

  notMember(id: string) {
    return !this.myGroups.find(r => r.id === id);
  }

  requestAccess(id: string, name: string) {
    this.loadingMutations = true;
    this.error = undefined;
    try {
      const mutationSub = this.groupsService.requestAccess(id, name)
        .subscribe(({ errors }) => {
          this.loadingMutations = false;
          if (errors) {
            this.error = errors[0].message;
            return;
          }
        });
        this.mutationSubscriptions.push(mutationSub);
    } catch(e) {
      this.loadingMutations = false;
      this.error = e.message;
    }
  }

  createGroup(form: NgForm) {
    if (!form.valid || this.nameAlreadyInUse(form.value['create'])) {
      this.error = 'Unable to create group -- invalid name';
    }
    try {
      this.loadingMutations = true;
      this.error = undefined;
      const mutationSub = this.groupsService.createGroup(form.value['create'])
        .subscribe(({ errors }) => {
          this.loadingMutations = false;
          if (errors) {
            this.error = errors[0].message;
            return;
          }
        });
      this.mutationSubscriptions.push(mutationSub);
    } catch (e) {
      this.loadingMutations = false;
      this.error = e.message;
    }
  }

  ngOnDestroy(): void {
    this.queryGroupsSubscription?.unsubscribe();
    this.queryMyGroupsSubscription?.unsubscribe();
    this.mutationSubscriptions?.forEach(sub => sub.unsubscribe());
  }
}

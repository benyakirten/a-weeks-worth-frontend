import {
  Component,
  HostListener,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import * as fromApp from 'src/app/store/app.reducer';

import { ModalService } from 'src/app/shared/services/modal/modal.service';
import { WeekService } from 'src/app/shared/services/week/week.service';

import { GroupSummary } from 'src/app/types/graphql/individual';

@Component({
  selector: 'app-week-dropdown',
  templateUrl: './week-dropdown.component.html',
  styleUrls: ['./week-dropdown.component.scss']
})
export class WeekDropdownComponent implements OnInit, OnDestroy {
  @HostListener('window:scroll')
  setModalTop() {
    this.modalTop = window.scrollY;
  }

  loading: boolean = true;

  modalId: string = 'the-week-dropdown-modal';
  modalTitle: string = 'Something went wrong';
  modalText: string = `
    Please try to load this page again,
    either by refreshing the page or navigate away
    then back here again
  `;
  modalTop: number = 0;

  username?: string;
  groupsSummary: Array<GroupSummary> = [];

  private storeSubscription?: Subscription;
  private querySubscription?: Subscription

  constructor(
    private store: Store<fromApp.AppState>,
    private weekService: WeekService,
    private modalService: ModalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.querySubscription = this.weekService.allMyInfo
      .subscribe(({ data, errors, loading }) => {
        this.loading = loading;
        if (errors) {
          this.modalText = `
            There was an error retrieving information -- ${errors[0].message}.
            Please refresh the page or navigate away then back. If the problem persists,
            contact Ben and let him know what went wrong.
          `;
          this.showModal();
          return;
        }
        this.groupsSummary = data.me.individual.groups
          .map(g => ({ id: g.id, name: g.name }));
      })

    this.storeSubscription = this.store.select('auth')
      .pipe(map(authState => authState.user?.username))
      .subscribe(username => this.username = username)
  }

  changeGroup(selection: any) {
    selection.target.value
      ? this.router.navigate(['the-week', selection.target.value])
      : this.router.navigate(['the-week']);
  }

  showModal(): void {
    this.modalService.open(this.modalId);
  }

  closeModal(): void {
    this.modalService.close(this.modalId);
  }

  ngOnDestroy(): void {
    this.querySubscription?.unsubscribe();
    this.storeSubscription?.unsubscribe();
  }

}

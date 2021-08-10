import {
  Component,
  HostListener,
  OnDestroy,
  OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { ModalService } from 'src/app/shared/services/modal/modal.service';
import { WeekService } from 'src/app/shared/services/week/week.service';

import { Ingredient } from 'src/app/shared/classes/ingredient/ingredient';
import { DayKey, PartialMeal, TimeKey } from 'src/app/types/graphql/individual';
import { Day } from 'src/app/shared/enums/day.enum';
import { Time } from 'src/app/shared/enums/time.enum';

@Component({
  selector: 'app-week-detail',
  templateUrl: './week-detail.component.html',
  styleUrls: ['./week-detail.component.scss']
})
export class WeekDetailComponent implements OnInit, OnDestroy {
  @HostListener('window:scroll')
  setModalTop() {
    this.modalTop = window.scrollY;
  }

  error?: string;
  loading: boolean = true;
  groupId?: string;

  name?: string;
  meals: Array<PartialMeal> = [];
  shoppingList: Array<Ingredient> = [];

  dayFilter: DayKey = 'MON';
  dayMode: boolean = true;

  modalId: string = 'the-week-detail-modal';
  modalTitle: string = 'Something went wrong';
  modalText: string = `
    Unable to load recipe.
    Please check the URL and try again.
    If the problem persists, tell Ben about your problem.
  `;
  modalTop: number = 0;

  private querySubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: ModalService,
    private weekService: WeekService
  ) { }

  ngOnInit(): void {
    this.route.params
      .subscribe(p => {
        if (!p['id']) {
          this.modalText = `
            Unable to load recipe.
            Please check the URL and try again.
            If the problem persists, tell Ben about your problem.
          `;
          this.showModal();
          return;
        }
        this.groupId = p['id'];
        this.querySubscription?.unsubscribe();
        this.querySubscription = this.weekService.allMyInfo
          .subscribe(({ data, errors, loading }) => {
            this.loading = loading;
            if (errors) {
              this.error = errors[0].message;
              return;
            }
            this.error = undefined;
            if (p['id'] === 'my-week') {
              this.name = 'My Week';
              this.meals = data.me.individual.meals;
              this.shoppingList = data.me.individual.shoppingList;
            } else {
              const selectedGroup = data.me.individual.groups.find(g => g.id === this.groupId);
              if (!selectedGroup) {
                this.modalText = `
                    Unable to locate group based on ID.
                    Please check the URL and try again.
                  `;
                this.showModal();
                return;
              }
              this.name = selectedGroup.name;
              this.meals = selectedGroup.meals;
              this.shoppingList = selectedGroup.shoppingList;
            }
          });
      });
  }

  toggleDayMode() {
    this.dayMode = !this.dayMode;
  }

  get weekdayKey(): Array<DayKey> {
    return Object.keys(Day) as Array<DayKey>;
  }

  weekday(day: DayKey): string {
    return Day[day];
  }

  mealtime(time: TimeKey): string {
    return Time[time];
  }

  editWeek() {
    this.router.navigate(['the-week', 'edit', this.groupId]);
  }

  setDayFilter(day: DayKey) {
    this.dayFilter = day;
  }

  get filteredMeals() {
    return this.mealsByDay(this.dayFilter);
  }

  mealsByDay(day: DayKey) {
    return this.meals.filter(m => m.day === day);
  }

  prepareShoppingItem(name: string, quantity: string, unit: string): string {
    if (unit.toLowerCase().trim() === 'n/a') {
      if (quantity.toLowerCase().trim() === 'n/a') {
        // Both unit and quantity are n/a
        return name;
      }
      // Just unit is n/a
      return `${quantity} ${name}`;
    }
    // Just quantity is n/a
    if (quantity.toLowerCase().trim() === 'n/a') {
      return `${unit} of ${name}`;
    }
    // Everything is normal
    return `${quantity} ${unit} of ${name}`;
  }

  showModal(): void {
    this.modalService.open(this.modalId);
  }

  closeModal(): void {
    this.modalService.close(this.modalId);
    this.router.navigate(['the-week']);
  }

  ngOnDestroy(): void {
    this.querySubscription?.unsubscribe();
  }
}

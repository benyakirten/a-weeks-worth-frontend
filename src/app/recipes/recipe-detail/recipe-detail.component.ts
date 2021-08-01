import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { Recipe } from 'src/app/shared/classes/recipe/recipe';
import { slideUpFade } from 'src/app/shared/animations/void-animations';

import { RecipesService } from 'src/app/shared/services/recipes/recipes.service';
import { ModalService } from 'src/app/shared/services/modal/modal.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-recipe-detail',
  animations: [slideUpFade('submenu')],
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  @HostListener('window:scroll')
  setModalTop() {
    this.modalTop = window.scrollY;
  }

  isLoggedIn: boolean = false;
  loading: boolean = false;
  error?: string;

  modalId: string = 'recipe-detail-delete-error';
  modalTitle: string = 'An Error Occurred Deleting the Recipe';
  modalText: string = '';
  modalTop: number = 0;

  recipe?: Recipe;
  showPhoto: boolean = true;

  showMenuHovered: boolean = false;
  showMenuClicked: boolean = false;

  private authSubscription?: Subscription;
  private querySubscription?: Subscription;
  private mutationSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipesService: RecipesService,
    private modalService: ModalService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.params
      .subscribe((p: Params) => {
        if (!p['id']) {
          this.modalText = `Unable to identify a recipe. Please try a different URL`;
          this.showModal();
          return;
        }
        this.querySubscription?.unsubscribe();
        this.querySubscription = this.recipesService
          .getRecipe(p['id'])
          .subscribe(({ data, loading, errors }) => {
            if (errors) {
              this.error = errors[0].message;
              return;
            }
            this.error = undefined;
            this.loading = loading;
            this.recipe = data.recipe;
          });
      });
    this.authSubscription = this.authService
      .isLoggedIn
      .subscribe(loggedIn => this.isLoggedIn = loggedIn);
  }

  toggleShowPhoto(): void {
    this.showPhoto = !this.showPhoto;
  }

  toggleMenuClicked(): void {
    this.showMenuHovered = !this.showMenuHovered;
  }

  toggleMenuHovered(): void {
    this.showMenuClicked = !this.showMenuClicked;
  }

  ariaButtonListener(e: KeyboardEvent): void {
    switch(e.code) {
      case "Space":
        this.toggleMenuClicked();
        break;
      case "Enter":
        this.toggleMenuClicked();
        break;
      default:
        break;
    }
  }

  editRecipe(): void {
    this.router.navigate(['/recipes', 'edit', this.recipe!.id])
  }

  deleteRecipe(): void {
    // Check user auth, etc.
    if (!this.recipe) {
      return
    }
    try {
      this.mutationSubscription = this.recipesService
        .deleteRecipe(this.recipe.id)
        .subscribe(({ errors }) => {
          if (errors) {
            this.modalText = `
              ${errors[0].message} -- A problem occurred deleting the recipe. Please
              try again later. If the problem persists, it probably is a problem with the
              database. Please contact Ben and let him know what's happening.
            `
            this.showModal();
          } else {
            this.router.navigate(['/recipes']);
          }
        });
    } catch (e) {
      this.modalText = `
        ${e.message} -- A problem occurred deleting the recipe. Please
        try again later. If the problem persists, it probably is a problem with the
        database. Please contact Ben and let him know what's happening.
      `;
      this.showModal();
    }
  }

  showModal() {
    this.modalService.open(this.modalId);
  }

  closeModal() {
    this.modalService.close(this.modalId);
  }

  ngOnDestroy(): void {
    this.querySubscription?.unsubscribe();
    this.mutationSubscription?.unsubscribe();
    this.authSubscription?.unsubscribe();
  }
}

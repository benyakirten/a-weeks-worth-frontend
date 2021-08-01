import { Injectable } from '@angular/core';

import { Apollo } from 'apollo-angular';

import { GET_MY_INFO } from 'src/app/shared/graphql/queries';
import { UPDATE_INDIVIDUAL } from 'src/app/shared/graphql/mutations/individual';
import { UPDATE_WEEK_FOR_GROUP } from 'src/app/shared/graphql/mutations/groups';

import { AllMyInfo, UpdateIndividual } from 'src/app/types/graphql/individual';

import { Ingredient } from 'src/app/shared/classes/ingredient/ingredient';
import { UpdateGroup } from 'src/app/types/graphql/groups';
import { MealInputType } from 'src/app/types/general';

@Injectable({ providedIn: 'root' })
export class WeekService {

  constructor(private apollo: Apollo) { }

  get allMyInfo() {
    return this.apollo.watchQuery<AllMyInfo>({ query: GET_MY_INFO })
      .valueChanges
  }

  updateWeekForIndividual(shoppingList: Array<Ingredient>, meals: Array<MealInputType>) {
    return this.apollo.mutate<UpdateIndividual>({
      mutation: UPDATE_INDIVIDUAL,
      variables: { shoppingList, meals },
      update: (cache, { data, errors }) => {
        if (errors) {
          throw Error(`Unable to update individual: ${errors[0].message}`);
        }
        if (data) {
          const allMyInfo = cache.readQuery<AllMyInfo>({ query: GET_MY_INFO });
          if (allMyInfo) {
            const updatedInfo: AllMyInfo = {
              ...allMyInfo,
              me: {
                ...allMyInfo.me,
                individual: {
                  ...allMyInfo.me.individual,
                  shoppingList: data.updateIndividual.individual.shoppingList,
                  meals: data.updateIndividual.individual.meals
                }
              }
            };
            cache.writeQuery({ query: GET_MY_INFO, data: updatedInfo });
          }
        }
      }
    });
  }

  updateWeekForGroup(id: string, shoppingList: Array<Ingredient>, meals: Array<MealInputType>) {
    return this.apollo.mutate<UpdateGroup>({
      mutation: UPDATE_WEEK_FOR_GROUP,
      variables: { id, shoppingList, meals }
    });
  }
}

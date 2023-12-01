import { Component, Type } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  build,
  contextBuilder,
  fragments,
  hooks,
  methods,
} from '@web-fragments/ng-fragments';
import { TwoPlayersCardsLayoutComponent } from '../../../base/components/two-players-cards-layout/two-players-cards-layout.component';
import { comparePeople } from '../../services/people-comparer';
import { mapPeople } from '../../services/people-mapper';
import { store$ } from '../../../base/fragments/card-store.fragment';
import { peopleGet, peopleGetAll } from '../../../../../api/people';
import {
  CARD_COMPONENT_CONTEXT,
  CardComponentContext,
  draw$,
  totalPages$,
} from '../../../base/fragments/card.fragment';

const styles = `
  :host {
    height: 100%;
    display: block;
  }
`;

export const PeopleComponentContext: Type<CardComponentContext> = build(
  contextBuilder(),
  fragments({
    store$,
    totalPages$,
    getAll$: peopleGetAll,
    get$: peopleGet,
  }),
  hooks(() => ({
    onInit: () => {
      console.log('people context initialized');
    },
    onDestroy: () => {
      console.log('people context destroyed');
    },
  })),
  methods(({ _exec, store$ }) => ({
    draw: () => _exec(draw$),
    getState: () => _exec(store$),
    compare: comparePeople,
    map: mapPeople,
  }))
);

@Component({
  selector: 'sw-people-page',
  standalone: true,
  imports: [TranslateModule, TwoPlayersCardsLayoutComponent],
  providers: [
    { provide: CARD_COMPONENT_CONTEXT, useClass: PeopleComponentContext },
  ],
  template: `
    <sw-two-players-cards-layout [title]="'CARDS.PEOPLE' | translate">
    </sw-two-players-cards-layout>
  `,
  styles: [styles],
})
export class PeoplePageComponent {}

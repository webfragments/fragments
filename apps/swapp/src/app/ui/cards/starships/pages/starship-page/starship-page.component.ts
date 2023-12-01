import { Component, Type } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  build,
  contextBuilder,
  fragments,
  methods,
} from '@fragments/ng-fragments';
import { TwoPlayersCardsLayoutComponent } from '../../../base/components/two-players-cards-layout/two-players-cards-layout.component';
import { store$ } from '../../../base/fragments/card-store.fragment';
import {
  CARD_COMPONENT_CONTEXT,
  CardComponentContext,
  draw$,
  totalPages$,
} from '../../../base/fragments/card.fragment';
import { starshipGet, starshipGetAll } from '../../../../../api/starships';
import { compareStarships } from '../../services/starship-comparer';
import { mapStarship } from '../../services/starship-mapper';

export const StarshipComponentContext: Type<CardComponentContext> = build(
  contextBuilder(),
  fragments({
    store$,
    totalPages$,
    getAll$: starshipGetAll,
    get$: starshipGet,
  }),
  methods(({ _exec, store$ }) => ({
    draw: () => _exec(draw$),
    getState: () => _exec(store$),
    compare: compareStarships,
    map: mapStarship,
  }))
);

@Component({
  selector: 'sw-starship-page',
  standalone: true,
  imports: [TranslateModule, TwoPlayersCardsLayoutComponent],
  providers: [
    { provide: CARD_COMPONENT_CONTEXT, useClass: StarshipComponentContext },
  ],
  templateUrl: './starship-page.component.html',
  styleUrls: ['./starship-page.component.scss'],
})
export class StarshipPageComponent {}

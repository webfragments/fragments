import { InjectionToken } from '@angular/core';
import {
  ApiResult,
  ExecutionContext,
  fragment,
  memoFragment,
  Fragment,
  FragmentResultType,
  FragmentType,
} from '@web-fragments/ng-fragments';
import { getRandom } from '../../../../common';
import { store$ } from './card-store.fragment';
import { Card } from '../models/card';
import { CollectionParams, CollectionResult } from '../../../../api';

export type CardComponentContext = {
  store$: FragmentType<typeof store$>;
  getAll$: Fragment<CollectionParams, Promise<ApiResult<CollectionResult>>>;
  get$: Fragment<number, Promise<ApiResult<unknown>>>;
  totalPages$: Fragment<unknown, Promise<number>>;
  draw: () => void;
  getState: () => FragmentResultType<typeof store$>;
  compare: ([card1, card2]: [Card, Card]) => number;
  map: (model: unknown) => Card;
} & ExecutionContext;

export const CARD_COMPONENT_CONTEXT = new InjectionToken<CardComponentContext>(
  'CARD_COMPONENT_CONTEXT'
);

export const totalPages$ = memoFragment(
  async ({ _exec, getAll$ }: CardComponentContext) => {
    const { data, error } = await _exec(getAll$, { page: 1, limit: 1 });
    return error ? 0 : data?.totalPages;
  }
);

const getCard$ = fragment(
  async ({ _exec, getAll$, get$, totalPages$, map }: CardComponentContext) => {
    const totalPages = await _exec(totalPages$);
    const { data: resourceResult } = await _exec(getAll$, {
      page: getRandomPage(totalPages),
      limit: 1,
    });

    const itemId = resourceResult?.items?.[0]?.uid;

    if (itemId && !isNaN(+itemId)) {
      const { data: resourceItemResult } = await _exec(get$, +itemId);
      return map(resourceItemResult);
    } else {
      return null;
    }
  }
);

export const draw$ = fragment(
  async ({ _exec, store$, compare }: CardComponentContext) => {
    const { draw, drawSuccess, drawFailure } = _exec(store$);
    draw();

    const [card1, card2] = await Promise.all([
      _exec(getCard$),
      _exec(getCard$),
    ]);

    if (card1 && card2) {
      const winner = compare([card1, card2]);
      drawSuccess([card1, card2], winner);
    } else {
      drawFailure();
    }
  }
);

const getRandomPage = (range: number): number => {
  return getRandom(1, range);
};

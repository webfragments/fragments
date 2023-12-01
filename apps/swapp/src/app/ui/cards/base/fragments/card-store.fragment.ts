import { DestroyRef } from '@angular/core';
import {
  build,
  getters,
  signalState,
  storeBuilder,
  storeFragment,
  updaters,
} from '@fragments/ng-fragments';
import { CardPlayer } from '../models/card-player';
import { Card } from '../models/card';

interface CardState {
  [key: string]: unknown;
  player1: CardPlayer;
  player2: CardPlayer;
}

const initialState: CardState = {
  player1: { score: 0, isLoading: false, win: false },
  player2: { score: 0, isLoading: false, win: false },
};

export const store$ = storeFragment(({ _inject }) => {
  _inject(DestroyRef).onDestroy(() => {
    console.log('store destroyed');
  });

  const store = build(
    storeBuilder(signalState(initialState)),
    getters(({ select }) => ({
      isLoading: select(
        (state) => state.player1.isLoading && state.player2.isLoading
      ),
    })),
    updaters(({ update }) => ({
      draw: () =>
        update((state) => ({
          player1: {
            ...state.player1,
            isLoading: true,
            card: null,
            win: false,
          },
          player2: {
            ...state.player2,
            isLoading: true,
            card: null,
            win: false,
          },
        })),
      drawSuccess: ([card1, card2]: [Card, Card], winner: number) => {
        const isCard1Winner = [0, 1].includes(winner);
        const isCard2Winner = [0, -1].includes(winner);

        update((state) => ({
          player1: {
            ...state.player1,
            card: card1,
            win: isCard1Winner,
            isLoading: false,
            score: state.player1.score + (isCard1Winner ? 1 : 0),
          },
          player2: {
            ...state.player2,
            card: card2,
            win: isCard2Winner,
            isLoading: false,
            score: state.player2.score + (isCard2Winner ? 1 : 0),
          },
        }));
      },
      drawFailure: () =>
        update((state) => ({
          player1: {
            ...state.player1,
            isLoading: false,
            card: null,
            win: false,
          },
          player2: {
            ...state.player2,
            isLoading: false,
            card: null,
            win: false,
          },
        })),
    }))
  );

  console.log('store initialized');

  return store;
});

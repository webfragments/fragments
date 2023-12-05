import { DestroyRef } from '@angular/core';
import {
  build,
  props,
  signalState,
  storeBuilder,
  storeFragment,
} from '@web-fragments/ng-fragments';
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

  const state = signalState(initialState);
  const { update, select } = state;

  // Getters
  const player1 = select((state) => state.player1);
  const player2 = select((state) => state.player2);
  const isLoading = select(
    (state) => state.player1.isLoading && state.player2.isLoading
  );

  // Updaters
  const draw = () => {
    const _state = (player: CardPlayer) => ({
      ...player,
      isLoading: true,
      card: null,
      win: false,
    });

    update((state) => ({
      player1: {
        ..._state(state.player1),
      },
      player2: {
        ..._state(state.player2),
      },
    }));
  };

  const drawSuccess = ([card1, card2]: [Card, Card], winner: number) => {
    const isCard1Winner = [0, 1].includes(winner);
    const isCard2Winner = [0, -1].includes(winner);
    const _state = (player: CardPlayer, card: Card, isWinner: boolean) => ({
      ...player,
      card,
      win: isWinner,
      isLoading: false,
      score: player.score + (isWinner ? 1 : 0),
    });

    update((state) => ({
      player1: {
        ..._state(state.player1, card1, isCard1Winner),
      },
      player2: {
        ..._state(state.player2, card2, isCard2Winner),
      },
    }));
  };

  const drawFailure = () => {
    const _state = (player: CardPlayer) => ({
      ...player,
      isLoading: false,
      card: null,
      win: false,
    });

    update((state) => ({
      player1: {
        ..._state(state.player1),
      },
      player2: {
        ..._state(state.player2),
      },
    }));
  };

  const store = build(
    storeBuilder(state),
    props({
      player1,
      player2,
      isLoading,
      draw,
      drawSuccess,
      drawFailure,
    })
  );

  console.log('store initialized');

  return store;
});

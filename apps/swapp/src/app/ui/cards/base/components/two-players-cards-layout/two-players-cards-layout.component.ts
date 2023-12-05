import { Component, Input, Signal, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CardsLayoutComponent } from '../cards-layout/cards-layout.component';
import { CardPlayer } from '../../models/card-player';
import { CardPlayerComponent } from '../card-player/card-player.component';
import { CARD_COMPONENT_CONTEXT } from '../../fragments/card.fragment';

@Component({
  selector: 'sw-two-players-cards-layout',
  standalone: true,
  imports: [
    AsyncPipe,
    TranslateModule,
    CardsLayoutComponent,
    CardPlayerComponent,
  ],
  templateUrl: './two-players-cards-layout.component.html',
  styleUrls: ['./two-players-cards-layout.component.scss'],
})
export class TwoPlayersCardsLayoutComponent {
  @Input() title: string;

  private readonly ctx = inject(CARD_COMPONENT_CONTEXT);
  store = this.ctx.getStore();
  player1: Signal<CardPlayer> = this.store.player1;
  player2: Signal<CardPlayer> = this.store.player2;
  isLoading: Signal<boolean> = this.store.isLoading;

  draw(): void {
    this.ctx.draw();
  }
}

import { Component, Input, OnInit, Signal, inject } from '@angular/core';
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
export class TwoPlayersCardsLayoutComponent implements OnInit {
  @Input() title: string;

  private readonly ctx = inject(CARD_COMPONENT_CONTEXT);
  player1: Signal<CardPlayer>;
  player2: Signal<CardPlayer>;
  isLoading: Signal<boolean>;

  async ngOnInit(): Promise<void> {
    const store = this.ctx.getState();
    this.player1 = store.select((state) => state.player1);
    this.player2 = store.select((state) => state.player2);
    this.isLoading = store.isLoading;
  }

  draw(): void {
    this.ctx.draw();
  }
}

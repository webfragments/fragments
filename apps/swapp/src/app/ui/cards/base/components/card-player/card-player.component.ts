import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { CardPlayer } from '../../models/card-player';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'sw-card-player',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatProgressSpinnerModule, CardComponent],
  templateUrl: './card-player.component.html',
  styleUrls: ['./card-player.component.scss']
})
export class CardPlayerComponent {
  @Input() name: string;
  @Input() player: CardPlayer;
}

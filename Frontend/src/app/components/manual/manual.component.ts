import { Component, OnInit, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';
import { GameDataService } from '../../services/game-data.service'
import { GameState } from '../../models/game.models';


@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.css']
})
export class ManualComponent implements OnInit, OnDestroy {

  currentPage: number = 1;

  currentState: GameState | null = null;
  private sub!: Subscription;

  constructor(public gameService: GameDataService) { }

  ngOnInit(): void {
    this.sub = this.gameService.gameState$.subscribe((state) => {
      this.currentState = state;
    });
  }
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  getStatsEntries(stats: any): { key: string; value: number }[] {
    if (!stats) return [];
    return Object.keys(stats).map(key => ({
      key: key,
      value: stats[key]
    }));
  }

  flipPageNext() {
    if (this.currentPage < 3) {
      this.currentPage++;
    }
  }
  flipPageBack() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  closeManual() {
    this.gameService.closeManual();
   }

}

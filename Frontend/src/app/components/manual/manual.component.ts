import { Component, OnInit } from '@angular/core';
import { GameDataService } from '../../services/game-data.service'

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.css']
})
export class ManualComponent implements OnInit {

  isPageFlipped: boolean = false;

  constructor(public gameService: GameDataService) { }

  ngOnInit(): void {
  }

  flipPageNext() {
    this.isPageFlipped = true;
  }
  flipPageBack() {
    this.isPageFlipped = false;
  }
  closeManual() {
    this.gameService.closeManual();
   }

}

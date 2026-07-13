import { Component, OnInit } from '@angular/core';
import { GameDataService } from '../../services/game-data.service'

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.css']
})
export class ManualComponent implements OnInit {

  constructor(public gameService: GameDataService) { }

  ngOnInit(): void {
  }

  closeManual() {
    this.gameService.closeManual();
   }

}

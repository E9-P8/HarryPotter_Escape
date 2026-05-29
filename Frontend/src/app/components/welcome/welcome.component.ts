import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameDataService } from '../../services/game-data.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(private router: Router, private gameData: GameDataService) { }

  wizardPlayerName = "";
  currentWelcomeStep: number = 1;

  ngOnInit(): void {
    this.wizardPlayerName = this.gameData.wizardName;
    this.currentWelcomeStep = this.gameData.currentWelcomeStep;
  }

  startGame(){ 
    this.router.navigate(['/intro']);
  }
  startFirstYear(){ }
}

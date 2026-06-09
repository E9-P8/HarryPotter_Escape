import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameDataService } from '../../services/game-data.service';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(private router: Router, private gameData: GameDataService, public audioService: AudioService) { }

  wizardPlayerName = "";
  currentWelcomeStep: number = 1;

  isLensOpen : boolean = false;
  isLensTransited : boolean= false;

  ngOnInit(): void {
    this.audioService.startGlobalBackground('intro', 0.1);
    this.wizardPlayerName = this.gameData.wizardName;
    this.currentWelcomeStep = this.gameData.currentWelcomeStep;

    setTimeout(()=> {
      this.isLensOpen = true;
      }, 100);
  }

  toggleAudio(): void {
  this.audioService.toggleGlobalMute(0.2);
}

  startGame(){ 
    this.isLensOpen = false;
    this.isLensTransited= true;
    this.audioService.playSound('timeMachine');
    setTimeout(()=>{
      this.audioService.stopSound('timeMachine');
      this.router.navigate(['/intro']);
      
     }, 1500);
    

  }
  startFirstYear(){ }


}

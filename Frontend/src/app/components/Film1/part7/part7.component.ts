import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AudioService } from '../../../services/audio.service';

interface MagicPlantDialogue{
  character : string;
  image: string;
  text : string;
 }
 interface FlyingKeyDialogue{
  character : string;
  image: string;
  text : string;
 }
 interface MagicCheersDialogue{
  character : string;
  image: string;
  text : string;
 }
 interface FinalComparisonDialogue{
  character : string;
  image: string;
  text : string;
 }


@Component({
  selector: 'app-part7',
  templateUrl: './part7.component.html',
  styleUrls: ['./part7.component.css']
})
export class Part7Component implements OnInit {

  constructor(private router: Router, public audioService : AudioService) { }

  currentLineMagicPlant = 0;
  isMagicPlantDialogueEnd: boolean = false;

  currentLineFlyingKey = 0;
  isFlyingKeyDialogueEnd: boolean = false;

  currentLineMagicCheers = 0;
  isMagicCheersDialogueEnd: boolean = false;

  currentLineFinalComparison = 0;
  isFinalComparisonDialogueEnd: boolean = false;

  toggleAudio(): void {
  this.audioService.toggleGlobalMute(0.2);
  }

  ngOnInit(): void {
    this.startIntroSequence();
    this.startFlyingKeyDialogue();
  }
    startIntroSequence() {
    this.audioService.startGlobalBackground('LetTheMysteryUnfold', 0.3); 
  }

   actualFase: 'MagicPlant' | 'FlyingKey' | 'MagicCheers' | 'FinalComparison' = 'MagicPlant';

/***************** MagicPlant ************************ */

    script0 : MagicPlantDialogue[] = [
      { 
        character : 'Harry',
        image: "assets/img/Part2/", 
        text : "Hagrid, cosa sono esattamente questi cosi?"
      },
      { 
        character : 'Folletto',
        image: "assets/img/Part2/",
        text : "Il signor harry potter ha la sua chiave?"
      },
      { 
        character : 'Folletto',
        image: "assets/img/Part2/",
        text : "La chiave prego!" //dare chiave
      }
    ]
    startMagicPlantDialogue(){
        if(this.currentLineMagicPlant >= this.script0.length){
          this.isMagicPlantDialogueEnd = true;
          return;
       }
        setTimeout(() => {
          this.currentLineMagicPlant++;
          this.startMagicPlantDialogue();
            }, 3000);
    }
  goToFlyingKey(){
    this.actualFase= 'FlyingKey';
    this.audioService.startGlobalBackground('rainAndThunder', 0.3);

    this.currentLineFlyingKey = 0;
    this.startFlyingKeyDialogue();
  }

   /***************** FlyingKey ************************ */

    script1 : FlyingKeyDialogue[] = [
      { 
        character : 'Hagrid',
        image: "assets/img/Part2/", 
        text : "Qui troverai le penne d'oca e l'inchiostro.. e di la tutte le cianfrusaglie per fare le stregonerie"
      },
      { 
        character : 'Ragazzi in sottofondo',
        image: "assets/img/Part2/",
        text : "Una scopa da corsa bellissima! Guardate che roba, la  nuova Ninbus 2000!" 
      }
    ]
    startFlyingKeyDialogue(){
        if(this.currentLineFlyingKey >= this.script1.length){
          this.isFlyingKeyDialogueEnd = true;
          return;
       }
        setTimeout(() => {
          this.currentLineFlyingKey++;
          this.startFlyingKeyDialogue();
            }, 3000);
    }
    goToMagicCheers(){
      this.actualFase= 'MagicCheers';
      this.audioService.startGlobalBackground('rainAndThunder', 0.3);

      this.currentLineMagicCheers = 0;
      this.startMagicCheersDialogue();
    }
  
  /***************** MagicCheers ************************ */

    script2 : MagicCheersDialogue[] = [
      { 
        character : 'Harry',
        image: "assets/img/Part2/", 
        text : "C'è nessuno?"
      },
      { 
        character : 'Hagrid',
        image: "assets/img/Part2/", //hagrid che bussa con una civetta
        text : "Harry! Buon compleanno!"
      }
    ]
    startMagicCheersDialogue(){
        if(this.currentLineMagicCheers >= this.script2.length){
          this.isMagicCheersDialogueEnd = true;
          return;
       }
        setTimeout(() => {
          this.currentLineMagicCheers++;
          this.startMagicCheersDialogue();
            }, 3000);
    }
    goToFinalComparison(){
      this.actualFase= 'FinalComparison';
      this.audioService.startGlobalBackground('rainAndThunder', 0.3);

      this.currentLineFinalComparison = 0;
      this.startFinalComparisonDialogue();
    }

    /***************** FinalComparison ************************ */

    script3 : FinalComparisonDialogue[] = [
      { 
        character : 'Harry',
        image: "assets/img/Part2/", 
        text : "C'è nessuno?"
      },
      { 
        character : 'Hagrid',
        image: "assets/img/Part2/", //hagrid che bussa con una civetta
        text : "Harry! Buon compleanno!"
      }
    ]
    startFinalComparisonDialogue(){
        if(this.currentLineFinalComparison >= this.script3.length){
          this.isFinalComparisonDialogueEnd = true;
          return;
       }
        setTimeout(() => {
          this.currentLineFinalComparison++;
          this.startFinalComparisonDialogue();
            }, 3000);
    }
    GameFinished(){
      this.router.navigate(['/part7']);
    }
 
}

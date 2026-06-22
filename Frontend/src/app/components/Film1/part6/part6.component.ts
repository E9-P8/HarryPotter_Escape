import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AudioService } from '../../../services/audio.service';

interface QuidditchGameDialogue{
  character : string;
  image: string;
  text : string;
 }
 interface FuffiDialogue{
  character : string;
  image: string;
  text : string;
 }
 interface RestrictedSectionDialogue{
  character : string;
  image: string;
  text : string;
 }

@Component({
  selector: 'app-part6',
  templateUrl: './part6.component.html',
  styleUrls: ['./part6.component.css']
})
export class Part6Component implements OnInit {

  constructor(private router: Router, public audioService : AudioService) { }

  currentLineQuidditchGame = 0;
  isQuidditchGameDialogueEnd: boolean = false;

  currentLineFuffi = 0;
  isFuffiDialogueEnd: boolean = false;

  currentLineRestrictedSection = 0;
  isRestrictedSectionDialogueEnd: boolean = false;


  toggleAudio(): void {
  this.audioService.toggleGlobalMute(0.2);
  }

  ngOnInit(): void {
    this.startIntroSequence();
    this.startFuffiDialogue();
  }
    startIntroSequence() {
    this.audioService.startGlobalBackground('LetTheMysteryUnfold', 0.3); 
  }

   actualFase: 'QuidditchGame' | 'Fuffi' | 'RestrictedSection'  = 'QuidditchGame';

/***************** QuidditchGame ************************ */

    script0 : QuidditchGameDialogue[] = [
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
    startQuidditchGameDialogue(){
        if(this.currentLineQuidditchGame >= this.script0.length){
          this.isQuidditchGameDialogueEnd = true;
          return;
       }
        setTimeout(() => {
          this.currentLineQuidditchGame++;
          this.startQuidditchGameDialogue();
            }, 3000);
    }
  goToFuffi(){
    this.actualFase= 'Fuffi';
    this.audioService.startGlobalBackground('rainAndThunder', 0.3);

    this.currentLineFuffi = 0;
    this.startFuffiDialogue();
  }

   /***************** Fuffi ************************ */

    script1 : FuffiDialogue[] = [
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
    startFuffiDialogue(){
        if(this.currentLineFuffi >= this.script1.length){
          this.isFuffiDialogueEnd = true;
          return;
       }
        setTimeout(() => {
          this.currentLineFuffi++;
          this.startFuffiDialogue();
            }, 3000);
    }
    goToRestrictedSection(){
      this.actualFase= 'RestrictedSection';
      this.audioService.startGlobalBackground('rainAndThunder', 0.3);

      this.currentLineRestrictedSection = 0;
      this.startRestrictedSectionDialogue();
    }
  
  /***************** RestrictedSection ************************ */

    script2 : RestrictedSectionDialogue[] = [
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
    startRestrictedSectionDialogue(){
        if(this.currentLineRestrictedSection >= this.script2.length){
          this.isRestrictedSectionDialogueEnd = true;
          return;
       }
        setTimeout(() => {
          this.currentLineRestrictedSection++;
          this.startRestrictedSectionDialogue();
            }, 3000); 
    }
    GoToMagicPlant(){
      this.router.navigate(['/part7']);
    }
 
}

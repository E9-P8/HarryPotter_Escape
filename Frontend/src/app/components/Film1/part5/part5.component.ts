import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AudioService } from '../../../services/audio.service';

interface GreatHallDialogue{
  character : string;
  image: string;
  text : string;
 }
 interface SpellsClassDialogue{
  character : string;
  image: string;
  text : string;
 }
 interface GirlsBathroomDialogue{
  character : string;
  image: string;
  text : string;
 }

@Component({
  selector: 'app-part5',
  templateUrl: './part5.component.html',
  styleUrls: ['./part5.component.css']
})
export class Part5Component implements OnInit {

  constructor(private router: Router, public audioService : AudioService) { }

  currentLineGreatHall = 0;
  isGreatHallDialogueEnd: boolean = false;

  currentLineSpellsClass = 0;
  isSpellsClassDialogueEnd: boolean = false;

  currentLineGirlsBathroom = 0;
  isGirlsBathroomDialogueEnd: boolean = false;

  toggleAudio(): void {
  this.audioService.toggleGlobalMute(0.2);
  }

  ngOnInit(): void {
    this.startIntroSequence();
    this.startSpellsClassDialogue();
  }
  startIntroSequence() {
    this.audioService.startGlobalBackground('LetTheMysteryUnfold', 0.3); 
  }

   actualFase: 'GreatHall' | 'SpellsClass' | 'GirlsBathroom'  = 'GreatHall';

/***************** GreatHall ************************ */

    script0 : GreatHallDialogue[] = [
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
    startGreatHallDialogue(){
        if(this.currentLineGreatHall >= this.script0.length){
          this.isGreatHallDialogueEnd = true;
          return;
       }
        setTimeout(() => {
          this.currentLineGreatHall++;
          this.startGreatHallDialogue();
            }, 3000);
    }
  goToSpellsClass(){
    this.actualFase= 'SpellsClass';
    this.audioService.startGlobalBackground('rainAndThunder', 0.3);

    this.currentLineSpellsClass = 0;
    this.startSpellsClassDialogue();
  }

   /***************** SpellsClass ************************ */

    script1 : SpellsClassDialogue[] = [
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
    startSpellsClassDialogue(){
        if(this.currentLineSpellsClass >= this.script1.length){
          this.isSpellsClassDialogueEnd = true;
          return;
       }
        setTimeout(() => {
          this.currentLineSpellsClass++;
          this.startSpellsClassDialogue();
            }, 3000);
    }
    findTroll(){
      this.actualFase= 'GirlsBathroom';
      this.audioService.startGlobalBackground('rainAndThunder', 0.3);

      this.currentLineGirlsBathroom = 0;
      this.startGirlsBathroomDialogue();
    }
  
  /***************** GirlsBathroom ************************ */

    script2 : GirlsBathroomDialogue[] = [
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
    startGirlsBathroomDialogue(){
        if(this.currentLineGirlsBathroom >= this.script2.length){
          this.isGirlsBathroomDialogueEnd = true;
          return;
       }
        setTimeout(() => {
          this.currentLineGirlsBathroom++;
          this.startGirlsBathroomDialogue();
            }, 3000);
    }
    thirdFloor(){
      this.router.navigate(['/part6']);
    }

} 

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AudioService } from '../../../services/audio.service';

interface StationDialogue{
  character : string;
  image: string;
  text : string;
 }
 interface WagonDialogue{
  character : string;
  image: string;
  text : string;
 }
 interface LakeDialogue{
  character : string;
  image: string;
  text : string;
 }

@Component({
  selector: 'app-part4',
  templateUrl: './part4.component.html',
  styleUrls: ['./part4.component.css']
})
export class Part4Component implements OnInit {

  constructor(private router: Router, public audioService : AudioService) { }

  actualFase: 'Station' | 'Wagon' | 'Lake'  = 'Station';

  currentLineStation = 0;
  isStationDialogueEnd: boolean = false;

  currentLineWagon = 0;
  isWagonDialogueEnd: boolean = false;

  currentLineLake = 0;
  isLakeDialogueEnd: boolean = false;

  isGameStarted = false;
  isVictory = false;
  isOutOfRoute = false;
  hagridX = 50;
  playerX = 50;
  playerDirection: 'left' | 'right' | 'straight' = 'straight';
  currentWave = 1;

  private gameInterval: any;
  private waveInterval: any;
  private moveInterval: any;
  private dialogueTimer: any;

  gameLevels = [
    { name: 'Harry', boatImg: 'assets/img/Part4/harry-boat.png' },
    { name: 'Ron', boatImg: 'assets/img/Part4/ron-boat.png' },
    { name: 'Hermione', boatImg: 'assets/img/Part4/hermione-boat.png' }
  ];

  private hagridPaths: any = {
    1: [50, 40, 30, 40, 50],
    2: [50, 60, 70, 60, 50],
    3: [50, 20, 80, 50]
  };

 

  toggleAudio(): void {
  this.audioService.toggleGlobalMute(0.2);
  } 

  ngOnInit(): void {
    this.audioService.startGlobalBackground('LetTheMysteryUnfold', 0.3);
    this.startStationDialogue();
  }

  ngOnDestroy() {
    clearTimeout(this.dialogueTimer);
    clearInterval(this.gameInterval);
    clearInterval(this.waveInterval);
    clearInterval(this.moveInterval);
  }

   /***************** STATION ************************ */


    script0 : StationDialogue[] = [
      { 
        character : 'Hagrid',
        image: "assets/img/Part4/HarryHagridStation.png", 
        text : "Perdinci è già l'ora! Scusa Harry, ti devo lasciare... Il tuo treno parte tra 10 minuti, tieniti stretto il biglietto!"
      },
      { 
        character : 'Harry',
        image: "assets/img/Part4/HarryStation.png",
        text : "Binario 9 3/4... Ma Hagrid, deve esserci un errore, non esiste il binario 9 3/4.... vero?" 
      },
      { 
        character : 'Molly Weasley',
        image: "assets/img/Part4/weasley3.png",
        text : "Forza, il binario 9 3/4 è di qua! " //bottone
      },
      { 
        character : 'Harry',
        image: "assets/img/Part4/weasley4.png",
        text : "Mi scusi, può dirmi come raggiungere il binario?" 
      },
      { 
        character : 'Molly Weasley',
        image: "assets/img/Part4/weasley4.png",
        text : "Non preoccuparti caro! Anche Ron sta andando ad Hogwarts per la prima volta! Non devi fare altro che camminare dritto verso il muro. Mi raccomando: NON FARTI VEDERE DAI BABBANI!" 
      },
      { 
        character : '',
        image: "assets/img/Part4/Harry enigma.png",
        text : ""  //ENIGMA
      },
      { 
        character : '',
        image: "assets/img/Part4/binario9.png", //immagine hogwarts express poi video treno in natura
        text : "" 
      }
    ]
    startStationDialogue(){
        if(this.currentLineStation >= this.script0.length){
          this.isStationDialogueEnd = true;
          return;
       }
        setTimeout(() => {
          this.currentLineStation++;
          this.startStationDialogue();
            }, 1000);
    }
  EnterTrain(){
    this.actualFase= 'Wagon';
    this.audioService.startGlobalBackground('rainAndThunder', 0.3);

    this.currentLineWagon = 0;
    this.startWagonDialogue();
  }


 /***************** WAGON ************************ */
      script1 : WagonDialogue[] = [
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
    startWagonDialogue(){
        if(this.currentLineWagon >= this.script1.length){
          this.isWagonDialogueEnd = true;
          return;
       }
        setTimeout(() => {
          this.currentLineWagon++;
          this.startWagonDialogue();
            }, 3000);
    }
    getOffTrain(){
      this.actualFase= 'Lake';
      this.audioService.startGlobalBackground('rainAndThunder', 0.3);

      this.currentLineLake = 0;
      this.startLakeDialogue();
    }
  /***************** LAKE ************************ */

    script2 : LakeDialogue[] = [
      { 
        character : 'Hagrid',
        image: "assets/img/Part4/", 
        text : "Primo anno, da questa parte! Su dai, non siate timidi!"
      },
      { 
        character : 'Hagrid',
        image: "assets/img/Part4/", 
        text : "Bene, da questa parte per le barche, seguitemi!"
      },
      { 
        character : '',
        image: "assets/img/Part4/EnigmaLake.png", //Enigma
        text : ""
      }
    ]
    startLakeDialogue(){ 
        if(this.currentLineLake >= this.script2.length){
          this.isLakeDialogueEnd = true;
          return;
       }
       if (this.currentLineLake === 2) {
        return;
        }
        setTimeout(() => {
          this.currentLineLake++;
          this.startLakeDialogue();
            }, 3000);
    }

    startGame() {
    this.isGameStarted = true;
    this.audioService.startGlobalBackground('LakeActionTheme', 0.4);
    this.startWave(1);
    
    /*
    this.gameInterval = setInterval(() => {
      this.isOutOfRoute = Math.abs(this.hagridX - this.playerX) > 20;
    }, 100);*/
    }
  startWave(wave: number) {
    this.currentWave = wave;
    let step = 0;
    const path = this.hagridPaths[wave];

    /*this.waveInterval = setInterval(() => {
      this.hagridX = path[step];
      step++;
      if (step >= path.length) {
        clearInterval(this.waveInterval);
        if (this.currentWave < 3) this.startWave(this.currentWave + 1);
        else { this.isVictory = true; this.isGameStarted = false; }
      }
    }, 1000);*/
   }
/*
  startMoving(dir: 'left' | 'right') {
  this.playerDirection = dir;
  if (this.moveInterval) clearInterval(this.moveInterval);

  this.moveInterval = setInterval(() => {
    // Aumentato step a 2.5 per essere più reattivo
    const step = 2.5; 
    if (dir === 'left') {
      this.playerX = Math.max(5, this.playerX - step);
    } else {
      this.playerX = Math.min(85, this.playerX + step);
    }
  }, 30); // 30ms è più fluido
}
  stopMoving() {
    this.playerDirection = 'straight';
    clearInterval(this.moveInterval);
  }
*/
  getBoatDirectionClass() {
   // return { 'turn-left': this.playerDirection === 'left', 'turn-right': this.playerDirection === 'right' };
  }

    goToCastle(){
      this.router.navigate(['/part5']);
    }
} 

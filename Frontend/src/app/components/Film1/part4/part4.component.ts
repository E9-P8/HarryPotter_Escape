import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AudioService } from '../../../services/audio.service';
import { HostListener } from '@angular/core';

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
  isWaveComplete = false;
  isVictory = false;
  currentWave = 1;
  darknessLevel = 0.5;
  
  // Posizioni
  hagridX = 50;
  playerX = 50;
  private movingDir: 'left' | 'right' | null = null;
  
  // Animation
  private animationFrameId: number = 0;
  private lastTimestamp: number = 0;
  private hagridProgress: number = 0;
  private currentPathIndex: number = 0;

  // Dati
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
  if (this.animationFrameId) {
    cancelAnimationFrame(this.animationFrameId);
  }  }
  
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
        image: "assets/img/Part4/Hagrid_welcome.png", 
        text : "Primo anno, da questa parte! Su dai, non siate timidi!"
      },
      { 
        character : 'Hagrid',
        image: "assets/img/Part4/Hagrid_welcome2.png", 
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
    this.isVictory = false;
    this.currentWave = 1;
    this.resetWaveState();
    this.lastTimestamp = 0;
    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  }

  resetWaveState() {
    this.currentPathIndex = 0;
    this.hagridProgress = 0;
    this.hagridX = 50;
    this.playerX = 50;
    this.darknessLevel = 0.5;
    this.isWaveComplete = false;
    this.movingDir = null;
  }

  completeWave() {
    if (this.currentWave < 3) {
    this.currentWave++;
    this.resetWaveState();
    this.isGameStarted = true; 
    this.isWaveComplete = false; 
    this.lastTimestamp = 0;
    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  } else {
    this.isVictory = true;
    this.isGameStarted = false;
  }
  }
gameLoop = (timestamp: number) => {
    if (!this.isGameStarted) return;

    if (this.lastTimestamp === 0) this.lastTimestamp = timestamp;
    const dt = Math.min(timestamp - this.lastTimestamp, 32);
    this.lastTimestamp = timestamp;

    this.updateHagrid(dt);
    this.updatePlayerPosition();

    const distance = Math.abs(this.hagridX - this.playerX);
    this.darknessLevel = distance > 25 
      ? Math.min(0.95, this.darknessLevel + 0.01) 
      : Math.max(0.5, this.darknessLevel - 0.02);

    if (distance > 45) this.resetWaveState();

    if (this.darknessLevel >= 0.95) {
    this.resetWaveState();
    this.isGameStarted = false; 
    alert("Hagrid è scomparso nell'oscurità! Ricomincia la sfida.");
  }

    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };

  updateHagrid(dt: number) {
    const path = this.hagridPaths[this.currentWave];
    const speed = 0.0005;

    this.hagridProgress += dt * speed;

    if (this.hagridProgress >= 1) {
      this.hagridProgress = 0;
      this.currentPathIndex++;

      if (this.currentPathIndex >= path.length - 1) {
        this.isWaveComplete = true;
        this.isGameStarted = false;
        this.hagridX = path[path.length - 1];
        return;
      }
    }
    this.hagridX = path[this.currentPathIndex] + 
      (path[this.currentPathIndex + 1] - path[this.currentPathIndex]) * this.hagridProgress;
  }

  updatePlayerPosition() {
    if (this.movingDir === 'left') this.playerX = Math.max(0, this.playerX - 0.5);
    if (this.movingDir === 'right') this.playerX = Math.min(100, this.playerX + 0.5);
  }


  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (!this.isGameStarted) return;
    if (event.key === 'ArrowLeft') this.movingDir = 'left';
    if (event.key === 'ArrowRight') this.movingDir = 'right';
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp() { this.movingDir = null; }

  startMoving(dir: 'left' | 'right') { this.movingDir = dir; }
  stopMoving() { this.movingDir = null; }

    goToCastle(){
      this.router.navigate(['/part5']);
    }
} 

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AudioService } from '../../../services/audio.service';
import { HostListener } from '@angular/core';
import { GameDataService } from '../../../services/game-data.service';


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

 interface Babbano {
  id: number;
  image: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  x: number;   
  y: number;  
  progress: number;
  active: boolean;
  speed: number;
  flipTimer: number;      
  flipInterval: number;  
  isCurrentlyFlipped: boolean;
  defaultDirection: 'left' | 'right';
}

@Component({
  selector: 'app-part4',
  templateUrl: './part4.component.html',
  styleUrls: ['./part4.component.css']
})
export class Part4Component implements OnInit {

  constructor(private router: Router, private gameData: GameDataService, public audioService : AudioService) { }

  actualFase: 'Station' | 'Wagon' | 'Lake'  = 'Station';

  currentLineStation = 0;
  isStationDialogueEnd: boolean = false;

babbani = [
  { id: 1, image: 'assets/img/Part4/babbana-1.png', startX: 46, startY: 10, endX: -25, endY: 55, x: 46, y: 10, progress: 0, active: false, direction: 'down', speed: 0.03, flipTimer: 0, flipInterval: 3000, isCurrentlyFlipped: false, defaultDirection: 'right'},
  { id: 2, image: 'assets/img/Part4/babbano-2.png', startX: -10, startY: 61, endX: 48, endY: 6, x: -6, y: 71, progress: 0, active: false , direction: 'up', speed: 0.04, flipTimer: 0, flipInterval: 2000, isCurrentlyFlipped: false, defaultDirection: 'right'},
  { id: 3, image: 'assets/img/Part4/babbano-3.png', startX: 40, startY: 22, endX: 1, endY: 80, x: 40, y: 22, progress: 0, active: false, direction: 'down', speed: 0.02, flipTimer: 0, flipInterval: 6000, isCurrentlyFlipped: false, defaultDirection: 'right'},
  { id: 4, image: 'assets/img/Part4/babbana-4.png', startX: 100, startY: 170, endX: 48, endY: 8, x: 100, y: 170, progress: 0, active: false, direction: 'up', speed: 0.05, flipTimer: 0, flipInterval: 4000, isCurrentlyFlipped: false, defaultDirection: 'left'},
  { id: 5, image: 'assets/img/Part4/babbano-5.png', startX: 48, startY: 12, endX: 130, endY: 60, x: 48, y: 8, progress: 0, active: false, direction: 'down', speed: 0.02,flipTimer: 0, flipInterval: 7000, isCurrentlyFlipped: false,  defaultDirection: 'left'},
  { id: 5, image: 'assets/img/Part4/babbana-6.png', startX: 4, startY: 140, endX: 42, endY: 7, x: 11, y: 69, progress: 0, active: false, direction: 'up', speed: 0.04, flipTimer: 0, flipInterval: 5000, isCurrentlyFlipped: false, defaultDirection: 'right'}
];

private talkWithWeasley: boolean = false;
private globalResetTimer: number = 0;
private isTheRightTime: boolean = false;
private winWindowTimer: number = 0;

  harryState: 'ready' | 'newspaper' | 'shoes' | 'scratching' = 'ready';

  harryImages = {
  ready: 'assets/img/Part4/Harry-ready.png',
  newspaper: 'assets/img/Part4/Harry-newspaper.png',
  shoes: 'assets/img/Part4/Harry-shoes.png',
  scratching: 'assets/img/Part4/Harry-scratching.png'
  };
  isHarryAdvancing: boolean = false;
  isFlashActive: boolean = false;

  currentLineWagon = 0;
  isWagonDialogueEnd: boolean = false;
  isChooseCandyClicked = false;
  correctOrder = ['jellyBeans', 'toad', 'cauldron', 'liquorice', 'lollipop', 'vomitPills'];
  placedItems: (string | null)[] = [null, null, null, null, null, null];
  isOrderCorrect: boolean | null = null;
  itemX: number = 0;
  itemY: number = 0;
  private dragOffsetX: number = 0;
  private dragOffsetY: number = 0;
  isEnigmaActive: boolean = false;
  activeItem: 'cauldron' | 'jellyBeans' | 'liquorice' | 'lollipop' | 'toad' |'vomitPills' | null = null;
  
  isDragging: boolean = false;
  
  isCharging = false;
  chargeTimer: any;
  showSparkles = false;


  currentLineLake = 0;
  isLakeDialogueEnd: boolean = false;

  isGameStarted = false;
  isWaveComplete = false;
  isVictory = false;
  showCastleVideo = false;
  currentWave = 1;
  darknessLevel = 0.8;
  
  // Posizioni
  hagridX = 50;
  playerX = 50;
  private movingDir: 'left' | 'right' | null = null;
  
  // Animation
  private animationFrameId: number = 0;
  private lastTimestamp: number = 0;
  private hagridProgress: number = 0;
  private currentPathIndex: number = 0;
  private inactivityTimer: number = 0;
  private readonly MAX_INACTIVITY = 4000;
  private isAlertActive = false;

  // Dati
  gameLevels = [
    { name: 'Harry', boatImg: 'assets/img/Part4/harry-boat.png' },
    { name: 'Ron', boatImg: 'assets/img/Part4/ron-boat.png' },
    { name: 'Hermione', boatImg: 'assets/img/Part4/hermione-boat.png' }
  ];

  private hagridPaths: any = {
    1: [50, 40, 30, 40, 50, 20, 60, 40, 70],
    2: [50, 60, 20, 70, 50, 10, 40, 10, 50,90, 20],
    3: [50, 20, 80, 50, 10, 30, 0, 50, 10, 90, 60, 70, 20, 50]
  };


  toggleAudio(): void {
  this.audioService.toggleGlobalMute(0.2);
  } 
  ngOnInit(): void {
    this.audioService.startGlobalBackground('LetTheMysteryUnfold', 0.3);
    this.startStationDialogue();

    this.animationFrameId = requestAnimationFrame(this.gameLoop);

    const name = this.gameData.wizardName;
    this.script1[3].text += name;
    
  }
  ngOnDestroy() {
  if (this.animationFrameId) {
    cancelAnimationFrame(this.animationFrameId);
  }  
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
        image: "assets/img/Part4/station-game.png",
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
   
      if(this.currentLineStation === 2 && !this.talkWithWeasley) {
      return;
      }

       if(this.currentLineStation === 5) {
      return;
      }
        setTimeout(() => {
          this.currentLineStation++;
          this.startStationDialogue();
            }, 3000);
    }

  talk(){
    this.talkWithWeasley = true;
    this.currentLineStation = 3;
    this.currentLineStation++;
    this.startStationDialogue();
  }

  calculateZIndex(b: Babbano): number {
    return Math.floor(b.y * 100);
  }

  getScale(b: Babbano): number {
    const minScale = 0.2;
    const maxScale = 2.7;
    const normalizedY = b.y / 100;
    return minScale + (maxScale - minScale) * normalizedY;
  }

  getTransform(b: Babbano): string {
    const scaleValue = this.getScale(b);
    
    const flipValue = b.isCurrentlyFlipped ? -1 : 1;

    return `scaleX(${flipValue}) scale(${scaleValue})`;
  }

startBabbaniMovement() {
  this.babbani.forEach(b => {
    b.active = true;
    b.progress = 0;
  });
}
updateBabbani(dt: number) {
  this.globalResetTimer += dt;
  const forceFlip = this.globalResetTimer >= 15000;

  if (this.globalResetTimer >= 15000) {
    this.isTheRightTime = true; 
    this.winWindowTimer = 0;   
    
    this.babbani.forEach(b => {
      b.isCurrentlyFlipped = !b.isCurrentlyFlipped;
      b.flipTimer = 0;
    });

    this.globalResetTimer = 0; 
  }

  if (this.isTheRightTime) {
    this.winWindowTimer += dt;
    if (this.winWindowTimer >= 2000) { 
      this.isTheRightTime = false;
    }
  }

  this.babbani.forEach(b => {
    if (!b.active) return;

    b.flipTimer += dt;
    if (b.flipTimer >= b.flipInterval) {
      b.isCurrentlyFlipped = !b.isCurrentlyFlipped;
      b.flipTimer = 0;
    }
/*
    if (forceFlip) {
      b.isCurrentlyFlipped = !b.isCurrentlyFlipped;
    }*/

    b.progress += b.speed * (dt / 1000);

    if (b.progress >= 1) {
      b.progress = 0;
      b.x = b.startX;
      b.y = b.startY;
    } else {
      b.x = b.startX + (b.endX - b.startX) * b.progress;
      b.y = b.startY + (b.endY - b.startY) * b.progress;
    }
  });
/*
  if (forceFlip) {
    this.globalResetTimer = 0;
  }*/
}
    

onWallClick(){
  
  console.log(this.isTheRightTime);

    if (this.isTheRightTime) {
    this.isHarryAdvancing = true;

    this.isFlashActive = true; 

      setTimeout(()=> {
        this.isFlashActive = false;
        this.currentLineStation = 6;
      }, 3000);
  } else {
    this.changeErrorState();
  }

  }

  changeErrorState(){
  const errorStates: ('newspaper' | 'shoes' | 'scratching')[] = ['newspaper', 'shoes', 'scratching'];
  const randomIndex = Math.floor(Math.random() * errorStates.length);
  
  this.harryState = errorStates[randomIndex];

  setTimeout(() => {
    this.harryState = 'ready';
  }, 1500);
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
        character : 'Ron',
        image: "assets/img/Part4/Ron-wagon.png", 
        text : "Scusa, ti dispiace? il treno è tutto occupato!"
      },
      { 
        character : 'Ron',
        image: "assets/img/Part4/Ron&Harry-presentation.png",
        text : "A proposito, io sono Ron, Ron Weasley" 
      },
      { 
        character : 'Harry',
        image: "assets/img/Part4/Ron&Harry-presentation.png",
        text : "Io sono Harry, Harry Potter" 
      },
      { 
        character : 'Harry & Ron',
        image: "assets/img/Part4/YourPresentation.png",
        text : "E tu devi essere "
      },
      { 
        character : 'Strega del carrello',
        image: "assets/img/Part4/TrolleyWitch.png",
        text : "Qualcosa dal carrello, cari?" 
      },
      { 
        character : '..',
        image: "assets/img/Part4/Wagon-Enigma.png", //ENIGMA
        text : "" 
      },
      { 
        character : 'Hermione',
        image: "assets/img/Part4/Hermione-door.png",
        text : "Qualcuno ha visto un rospo? Oh! State facendo magie! Naturalmente anche io ho provato a farne alcuni semplici e mi sono riusciti sempre!" 
      },
      { 
        character : 'Hermione',
        image: "assets/img/Part4/Hermione-magia.png",
        text : "Lasciate che vi mostri." 
      },
      { 
        character : '',
        image: "assets/img/Part4/brokenGlasses.png", //magia
        text : "" 
      },
      { 
        character : '',
        image: "assets/img/Part4/repairedGlasses.png.png",
        text : "" 
      },
      { 
        character : 'Hermione',
        image: "assets/img/Part4/Hermione-exit.png",
        text : "Vi conviene indossare le vostre divise, credo che manchi poco all'arrivo." 
      }
    ]
    startWagonDialogue(){
      
      if(this.currentLineWagon >= this.script1.length){
          this.isWagonDialogueEnd = true;
          return;
       }
       if(this.currentLineWagon === 4 && !this.isChooseCandyClicked){
        return;
       }
       if(this.currentLineWagon === 8){
        return;
       }
       if(this.currentLineWagon === 5){
        this.isEnigmaActive = true;
        return;
       }
        setTimeout(() => {
          this.currentLineWagon++;
          this.startWagonDialogue();
            }, 3000);
    }
    chooseCandy(){
      console.log(this.currentLineWagon);
      this.isChooseCandyClicked = true;
      this.currentLineWagon++;
    }
    startItemDrag(event: MouseEvent | TouchEvent, item: 'cauldron' | 'jellyBeans' | 'liquorice' | 'lollipop' | 'toad' |'vomitPills' ) {
    this.activeItem = item;
    
    const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
    
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    
    this.dragOffsetX = clientX - rect.left;
    this.dragOffsetY = clientY - rect.top;

    this.itemX = rect.left;
    this.itemY = rect.top;
    }
    removePlacedItem(index: number) {
    if (this.placedItems[index] !== null) {
      this.placedItems[index] = null;
    }
    }


    @HostListener('window:mousemove', ['$event'])
  @HostListener('window:touchmove', ['$event'])
  onDragging(event: MouseEvent | TouchEvent) {
    if (!this.activeItem) return;

    const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;

    this.itemX = clientX - this.dragOffsetX;
    this.itemY = clientY - this.dragOffsetY;
  }

checkItemDrop() {
    const imgElement = document.querySelector(`.candy-item.dragging`);
    
    if (!imgElement || !this.activeItem) {
      this.resetItemPosition();
      return;
    }

    const rect = imgElement.getBoundingClientRect();
    const currentGlobalX = rect.left + rect.width / 2;
    const currentGlobalY = rect.top + rect.height / 2;

    const dropZones = document.querySelectorAll('.drop-zone');
    let targetZoneIndex: number | null = null;

for (let i = 0; i < dropZones.length; i++) {
    const zone = dropZones[i];
    const zoneRect = zone.getBoundingClientRect();
    const zoneIndexAttr = zone.getAttribute('data-zone-index');
    
    const insideX = currentGlobalX > zoneRect.left && currentGlobalX < zoneRect.right;
    const insideY = currentGlobalY > zoneRect.top && currentGlobalY < zoneRect.bottom;

    if (insideX && insideY && zoneIndexAttr !== null) {
      targetZoneIndex = Number(zoneIndexAttr);
      break; 
    }
  }
  if (targetZoneIndex !== null && !isNaN(targetZoneIndex)) {
    this.placedItems[targetZoneIndex] = this.activeItem;
  }

  this.resetItemPosition();
   }

  @HostListener('window:mouseup')
  @HostListener('window:touchend')
  stopDrag() {
    if (this.activeItem) {
      this.checkItemDrop();
    }
  }

  resetItemPosition() {
    this.activeItem = null;
  }

  /*dropItem(zoneIndex: number) {
  if (this.activeItem) {
    this.placedItems[zoneIndex] = this.activeItem;
    this.activeItem = null; 
  }
  }*/
   getItemImage(item: string): string {
  const paths: any = {
    'cauldron': 'assets/img/Part4/Cauldron-wagon.png',
    'jellyBeans': 'assets/img/Part4/GellyBeans-wagon.png',
    'liquorice': 'assets/img/Part4/Liquorice-wagon.png',
    'lollipop': 'assets/img/Part4/Lollipop-wagon.png',
    'toad': 'assets/img/Part4/Toad-wagon.png',
    'vomitPills': 'assets/img/Part4/VomitPills-wagon.png'
  };
  return paths[item];
   }
   checkSolution() {
  this.isOrderCorrect = this.placedItems.every((item, index) => item === this.correctOrder[index]);
  
  if (this.isOrderCorrect) {
    this.currentLineWagon++; 
     this.startWagonDialogue(); 
  } else {
    setTimeout(() => {
      this.placedItems = [null, null, null, null, null, null];
      this.isOrderCorrect = null;
    }, 1000);
  }
   }
    startCharging() {
    this.isCharging = true;
    this.chargeTimer = setTimeout(() => {
      this.repair();
    }, 2000);
  }
  stopCharging() {
    if (this.isCharging) { 
       this.isCharging = false;
    }
  }

  repair() {
  this.isCharging = false;
    this.showSparkles = true;  
    
    setTimeout(() => {
      this.showSparkles = false;
      this.currentLineWagon ++;
      this.startWagonDialogue();
    }, 600);
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
    this.darknessLevel = 0.8;
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
    this.showCastleVideo = true;
    this.isGameStarted = false;
  }
  }
gameLoop = (timestamp: number) => {

    if (this.actualFase === 'Station') {
        if (this.currentLineStation === 5) {
             if (!this.babbani[0].active) this.startBabbaniMovement();
             
             if (this.lastTimestamp === 0) this.lastTimestamp = timestamp;
             const dt = Math.min(timestamp - this.lastTimestamp, 32);
             this.lastTimestamp = timestamp;

             this.updateBabbani(dt);
        }
    } else if (this.isGameStarted) {

    if (this.lastTimestamp === 0) this.lastTimestamp = timestamp;
    const dt = Math.min(timestamp - this.lastTimestamp, 32);
    this.lastTimestamp = timestamp;

    if(this.movingDir === null){
      this.inactivityTimer += dt;
    } else {
      this.inactivityTimer = 0;
    }

    if(this.inactivityTimer > this.MAX_INACTIVITY){
      this.isAlertActive = true;
      alert("Aiuta " + this.gameLevels[this.currentWave -1].name + ' ad attraversare il lago.');

      this.resetWaveState;
      this.inactivityTimer = 0;
      this.isAlertActive = false;
      this.lastTimestamp = 0;
    }

    this.updateHagrid(dt);
    this.updatePlayerPosition();

    const distance = Math.abs(this.hagridX - this.playerX);
    this.darknessLevel = distance > 25 
      ? Math.min(0.95, this.darknessLevel + 0.01) 
      : Math.max(0.5, this.darknessLevel - 0.02);

    if (distance > 45) {
      this.resetWaveState();
    }

    if (this.darknessLevel >= 0.95) {
    this.resetWaveState();
    alert("Hagrid è scomparso nell'oscurità! Ricomincia la sfida.");
  }
}
    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };

  updateHagrid(dt: number) {
    const path = this.hagridPaths[this.currentWave];
    const baseSpeed = 0.0005;
    const speed = baseSpeed * (1 + (this.currentWave - 1) * 0.25);

    this.hagridProgress += dt * speed;

    
    if (this.currentPathIndex < path.length - 2) {
        if (this.hagridProgress >= 1) {
          this.hagridProgress = 0;
          this.currentPathIndex++;
        }
    
      } else {
          if (this.hagridProgress >= 1) {
            this.hagridX = path[path.length - 1];

            this.isGameStarted = false;

            if (this.currentWave === 3) {
              this.isVictory = true;
              this.showCastleVideo = true;
            } else {
              this.isWaveComplete = true;
            }

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

  onCastleVideoEnded(): void {
      this.showCastleVideo = true;   
      this.router.navigate(['/part5']); 
    }
  
} 

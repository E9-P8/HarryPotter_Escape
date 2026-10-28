import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

export type GamePhase =
  | 'fuffy'
  | 'fuffySolved'
  | 'trapdoor'
  | 'falling'
  | 'plants'
  | 'plantsSolved'
  | 'failureFluffy'
  | 'failurePlants'
  | 'success';

export type HeadState = 'awake' | 'look' | 'sleep';

export interface HeadReactionMap {
  left: HeadState;
  center: HeadState;
  right: HeadState;
}

export interface HotspotConfig {
  top: string;
  left: string;
  width: string;
  height: string;
}

export const ASSET_PATHS = {
  fuffyRoom: 'assets/img/Part8/fuffy/fuffy-room.png',
  falling: 'assets/img/Part8/falling.png',
  plantsRoom: 'assets/img/Part8/plants/plants-room.png',
  plantsRoomEscaped: 'assets/img/Part8/plants/plants-room-escaped.jpg',
  
  // Oggetti sonori
  flute: 'assets/img/Part8/flute.png',
  bell: 'assets/img/Part8/bell.png',
  musicBox: 'assets/img/Part8/music-box.png',
  
  // Teste Fuffi (3 Stati per ciascuna testa)
  fuffy: {
    headLeftAwake: 'assets/img/Part8/fuffy/head-left-awake.png',
    headLeftLook: 'assets/img/Part8/fuffy/head-left-look.png',
    headLeftSleep: 'assets/img/Part8/fuffy/head-left-sleep.png',

    headCenterAwake: 'assets/img/Part8/fuffy/head-center-awake.png',
    headCenterLook: 'assets/img/Part8/fuffy/head-center-look.png',
    headCenterSleep: 'assets/img/Part8/fuffy/head-center-sleep.png',

    headRightAwake: 'assets/img/Part8/fuffy/head-right-awake.png',
    headRightLook: 'assets/img/Part8/fuffy/head-right-look.png',
    headRightSleep: 'assets/img/Part8/fuffy/head-right-sleep.png',
  },
  
  // Piante e Radici
  plants: {
    hermione: 'assets/img/Part8/plants/hermione.png',
    ron: 'assets/img/Part8/plants/ron.png',

    vinesLevel1: 'assets/img/Part8/plants/vines-front.png', 
    vinesLevel2: 'assets/img/Part8/plants/vines-left.png',  
    vinesLevel3: 'assets/img/Part8/plants/vines-right.png',
    
    rootA: 'assets/img/Part8/plants/root-a.png',
    rootB: 'assets/img/Part8/plants/root-b.png',
    rootC: 'assets/img/Part8/plants/root-c.png',

    symbolFlower: 'assets/img/Part8/plants/symbol-flower.png',
    symbolLeaf: 'assets/img/Part8/plants/symbol-leaf.png',
    symbolRoot: 'assets/img/Part8/plants/symbol-root.png',
  },
  
  effects: {
    glow: 'assets/img/Part8/effects/glow.png',
    darkness: 'assets/img/Part8/effects/darkness.png',
  }
};

export const GAME_SETTINGS = {
  maxFluffyMistakes: 6,
  plantsTargetSequence: ['root', 'leaf', 'flower'],
  maxPlantDangerLevel: 4
};

export const HOTSPOT_CONFIGS = {
  fuffyObjects: {
    flute: { top: '33%', left: '3%', width: '12%', height: '10%' },
    bell: { top: '18%', left: '3%', width: '10%', height: '10%' },
    musicBox: { top: '4%', left: '3%', width: '12%', height: '12%' }
  },
  trapdoor: { top: '68%', left: '42%', width: '16%', height: '14%' },
  roots: {
    rootA: { top: '53%', left: '10%', width: '50%', height: '50%' },
    rootB: { top: '54%', left: '50%', width: '50%', height: '50%' },
    rootC: { top: '10%', left: '-5%', width: '50%', height: '50%' }
  },
  wallSymbols: {
    flower: { top: '15%', left: '43%', width: '7%', height: '10%' },
    leaf: { top: '12%', left: '50%', width: '7%', height: '10%' },
    root: { top: '15%', left: '57%', width: '7%', height: '10%' }
  }
};

@Component({
  selector: 'app-trapdoor-enigma',
  templateUrl: './trapdoor-enigma.component.html',
  styleUrls: ['./trapdoor-enigma.component.css']
})
export class TrapdoorEnigmaComponent implements OnInit {

  constructor(private router: Router) { }

  @Input() hasHagridHint: boolean = false;
  @Output() quizSolved = new EventEmitter<string>();
  //@Output() success = new EventEmitter<void>();

  readonly assets = ASSET_PATHS;
  readonly settings = GAME_SETTINGS;
  readonly hotspots = HOTSPOT_CONFIGS;

  gamePhase: GamePhase = 'fuffy';
  interactionLocked: boolean = false;
  showHagridMemory: boolean = false;
  screenShake: boolean = false;
  narrativeText: string = 'Le teste reagiscono alla musica avanzando o arretrando nel ciclo di attenzione. Osserva i cambiamenti!';

  fuffyMistakes: number = 0;
  activeSoundObject: string | null = null;

  // Livelli numerici di sonno per ciascuna testa (0 = awake, 1 = look, 2 = sleep)
  private fluffyLevels = {
    left: 0,
    center: 1,
    right: 0
  };

  // Mappa visiva esposta al template basata sui 3 livelli
  get headStates(): HeadReactionMap {
    return {
      left: this.fluffyLevels.left === 2 ? 'sleep' : (this.fluffyLevels.left === 1 ? 'look' : 'awake'),
      center: this.fluffyLevels.center === 2 ? 'sleep' : (this.fluffyLevels.center === 1 ? 'look' : 'awake'),
      right: this.fluffyLevels.right === 2 ? 'sleep' : (this.fluffyLevels.right === 1 ? 'look' : 'awake')
    };
  }

  // Step 2: Piante
  plantDangerLevel: number = 0;
  selectedPlantSequence: string[] = [];
  
  revealedSymbols = {
    flower: false,
    leaf: false,
    root: false
  };

  rootStates = {
    rootA: false,
    rootB: false,
    rootC: false
  };

  ngOnInit(): void {
     console.log('TRAPDOOR INIT');
    this.resetStep1();
  }

  

  toggleHagridMemory(): void {
    this.showHagridMemory = !this.showHagridMemory;
  }

  onObjectClick(objectKey: 'flute' | 'bell' | 'musicBox'): void {
    if (this.interactionLocked || this.gamePhase !== 'fuffy') return;

    this.activeSoundObject = objectKey;
    this.interactionLocked = true;
    this.playSound(objectKey);

    if (objectKey === 'flute') {
      this.fluffyLevels.left = (this.fluffyLevels.left + 1) % 3; 
      this.fluffyLevels.center = (this.fluffyLevels.center + 2) % 3; 
      this.narrativeText = 'Il flauto spinge la testa sinistra verso il sonno, ma fa avanzare lo stato di quella centrale.';
    } else if (objectKey === 'bell') {
      this.fluffyLevels.center = (this.fluffyLevels.center + 1) % 3; 
      this.fluffyLevels.right = (this.fluffyLevels.right + 2) % 3;   
      this.narrativeText = 'Il campanello fa progredire la testa centrale, alterando lo stato di quella destra.';
    } else if (objectKey === 'musicBox') {
      this.fluffyLevels.right = (this.fluffyLevels.right + 1) % 3;   
      this.fluffyLevels.left = (this.fluffyLevels.left + 2) % 3;     
      this.narrativeText = 'Il carillon fa avanzare la testa destra, modificando il ciclo di quella sinistra.';
    }

    const allAsleep = this.fluffyLevels.left === 2 && 
                      this.fluffyLevels.center === 2 && 
                      this.fluffyLevels.right === 2;

    setTimeout(() => {
      this.activeSoundObject = null;

      if (allAsleep) {
        this.handleFluffySuccess();
      } else {
        this.fuffyMistakes++;
        if (this.fuffyMistakes >= this.settings.maxFluffyMistakes) {
          this.gamePhase = 'failureFluffy';
          this.playSound('fuffy-angry');
        } else {
          this.interactionLocked = false;
        }
      }
    }, 800);
  }

  private handleFluffySuccess(): void {
    this.gamePhase = 'fuffySolved';
    this.narrativeText = 'Perfetto! Hai trovato il perfetto equilibrio sonoro: tutte e tre le teste sono sprofondate nel sonno. La botola è aperta!';
    this.interactionLocked = false;
  }

  onTrapdoorClick(): void {
    if (this.gamePhase !== 'fuffySolved' || this.interactionLocked) return;

    this.interactionLocked = true;
    this.gamePhase = 'trapdoor';
    this.playSound('trapdoor-open');

    setTimeout(() => {
      this.gamePhase = 'falling';
      this.playSound('falling');
    }, 800);

    setTimeout(() => {
      this.initStep2();
    }, 2500);
  }

  private initStep2(): void {
    this.gamePhase = 'plants';
    this.plantDangerLevel = 0;
    this.selectedPlantSequence = [];
    this.revealedSymbols = { flower: false, leaf: false, root: false };
    this.narrativeText = 'Osserva la parete: la pianta cresce dal basso verso l\'alto. Cerca la formula ordinata per liberarti dal tranello.';
    this.interactionLocked = false;
  }

  onRootClick(rootKey: 'rootA' | 'rootB' | 'rootC'): void {
    if (this.interactionLocked || this.gamePhase !== 'plants') return;

    this.interactionLocked = true;
    this.animateRoot(rootKey);
    this.playSound('vines-move');

    if (rootKey === 'rootA') {
      this.plantDangerLevel = Math.min(this.settings.maxPlantDangerLevel, this.plantDangerLevel + 1);
      this.revealedSymbols.flower = true;
      this.narrativeText = 'La vegetazione si sposta leggermente ... Un simbolo è emerso dalla parete!';
    } else if (rootKey === 'rootB') {
      if (this.plantDangerLevel > 0) {
        this.plantDangerLevel--;
        this.narrativeText = 'Alcune liane si allentano e la pressione diminuisce.';
      } else {
        this.narrativeText = 'La radice vibra, ma le liane sono già calme.';
      }
      this.revealedSymbols.root = true;
    } else if (rootKey === 'rootC') {
      this.plantDangerLevel = Math.min(this.settings.maxPlantDangerLevel, this.plantDangerLevel + 1);
      this.revealedSymbols.leaf = true;
      this.narrativeText = 'Hai scoperto un altro simbolo inciso sulla parete, ma le liane attorno si stringono!';
    }

    this.checkPlantDangerStatus();
  }

  private animateRoot(rootKey: 'rootA' | 'rootB' | 'rootC'): void {
    this.rootStates[rootKey] = true;
    setTimeout(() => {
      this.rootStates[rootKey] = false;
    }, 600);
  }

  onSymbolClick(symbolKey: 'flower' | 'leaf' | 'root'): void {
    if (this.interactionLocked || this.gamePhase !== 'plants') return;
    if (!this.revealedSymbols[symbolKey]) return;

    this.selectedPlantSequence.push(symbolKey);
    this.playSound('symbol-select');

    if (this.selectedPlantSequence.length === 3) {
      this.interactionLocked = true;
      this.evaluatePlantSequence();
    }
  }

  getSymbolClass(symbolKey: 'flower' | 'leaf' | 'root'): string {
    const isRevealed = this.revealedSymbols[symbolKey];
    const isSelected = this.selectedPlantSequence.includes(symbolKey);

    const classes: string[] = ['hotspot', 'wall-symbol'];
    if (isRevealed) classes.push('revealed');
    if (isSelected) classes.push('selected');

    return classes.join(' ');
  }

  private evaluatePlantSequence(): void {
    const target = this.settings.plantsTargetSequence;
    const isCorrect = JSON.stringify(this.selectedPlantSequence) === JSON.stringify(target);

    if (isCorrect) {
      this.handlePlantSuccess();
    } else {
      this.handlePlantMistake();
    }
  }

  private handlePlantSuccess(): void {
    this.gamePhase = 'plantsSolved';
    this.narrativeText = 'Le liane si allontanano rapidamente lasciando libero il passaggio!';
    this.playSound('plants-escape');

    setTimeout(() => {
      this.gamePhase = 'success';
      //this.router.navigate(['/final_part']);
      console.log('TRAPDOOR EMIT');
      this.quizSolved.emit('final_part');
    }, 2000);
  }

  private handlePlantMistake(): void {
    this.selectedPlantSequence = [];
    this.plantDangerLevel++;
    this.triggerScreenShake();
    this.narrativeText = 'La sequenza dei simboli è errata! La pianta si stringe con violenza!';

    this.checkPlantDangerStatus();
  }

  private checkPlantDangerStatus(): void {
    if (this.plantDangerLevel >= this.settings.maxPlantDangerLevel) {
      setTimeout(() => {
        this.gamePhase = 'failurePlants';
        this.playSound('plants-gameover');
      }, 800);
    } else {
      setTimeout(() => {
        this.interactionLocked = false;
      }, 600);
    }
  }

  retryFluffy(): void {
    this.resetStep1();
  }

  retryPlants(): void {
    this.initStep2();
  }

  private resetStep1(): void {
    this.gamePhase = 'fuffy';
    this.fuffyMistakes = 0;
    this.activeSoundObject = null;
    this.interactionLocked = false;
    this.narrativeText = 'Le teste hanno reazioni diverse: bilancia la musica per farle addormentare tutte.';
    
    this.fluffyLevels = { left: 1, center: 2, right: 0 };
  }

  private triggerScreenShake(): void {
    this.screenShake = true;
    setTimeout(() => {
      this.screenShake = false;
    }, 500);
  }

  private playSound(soundKey: string): void {}
}
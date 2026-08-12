import { Component, OnInit, Output, EventEmitter , OnDestroy, HostListener} from '@angular/core';

interface ThreatPoint {
  id: number;
  x: number; // Percentuale posizione X sulla porta
  y: number; // Percentuale posizione Y sulla porta
  type: 'claws' | 'face' | 'crack' | 'teeth' | 'bulge';
  progress: number; // 0 a 100
  timer: any;
}

@Component({
  selector: 'app-heads-dog-minigame',
  templateUrl: './heads-dog-minigame.component.html',
  styleUrls: ['./heads-dog-minigame.component.css']
})
export class HeadsDogMinigameComponent implements OnInit {

  @Output() minigameSolved = new EventEmitter<string>();
  @Output() minigameFailed = new EventEmitter<void>();

  constructor() { }

  doorStability: number = 100;
  escapeProgress: number = 0;
  activeThreats: ThreatPoint[] = [];
  holdingThreat: ThreatPoint | null = null;
  
  isGameOver: boolean = false;
  isVictory: boolean = false;

  // Intervalli e Timer
  private gameLoopInterval: any;
  private holdInterval: any;
  private threatSpawnTimeout: any;

  // Bilanciamento del Gioco
  private readonly GAME_DURATION_SEC = 35; 
  private currentPhase: 1 | 2 | 3 = 1;

  // Tipi di indicatori visivi
  readonly threatTypes: ('claws' | 'face' | 'crack' | 'teeth' | 'bulge')[] = [
    'claws', 'face', 'crack', 'teeth', 'bulge'
  ];

  ngOnInit(): void {
    this.startGame();
  }
  ngOnDestroy(): void {
    this.clearAllTimers();
  }
  private startGame(): void {
    this.doorStability = 100;
    this.escapeProgress = 0;
    this.activeThreats = [];
    this.isGameOver = false;
    this.isVictory = false;

    //aggiornamento dello stato
    this.gameLoopInterval = setInterval(() => {
      this.updateGameState();
    }, 100);

    // generazione delle minacce
    this.scheduleNextThreat();
  }

  private updateGameState(): void {
    if (this.isGameOver || this.isVictory) return;

    // 1. Avanzamento della Barra Fuga
    this.escapeProgress += (100 / (this.GAME_DURATION_SEC * 10));
    
    // Gestione Fasi in base all'avanzamento
    if (this.escapeProgress > 66) {
      this.currentPhase = 3;
    } else if (this.escapeProgress > 33) {
      this.currentPhase = 2;
    }

    // Controllo Vittoria
    if (this.escapeProgress >= 100) {
      this.handleVictory();
      return;
    }

    // 2. Calcolo Danno alla Porta
    if (this.activeThreats.length > 0) {
      // Ogni minaccia attiva infligge danno costante
      const damage = this.activeThreats.length * 0.15 * this.currentPhase;
      this.doorStability = Math.max(0, this.doorStability - damage);
    } else {
      // Recupero lento se non ci sono attacchi in corso
      this.doorStability = Math.min(100, this.doorStability + 0.10);
    }

    // Controllo Sconfitta
    if (this.doorStability <= 0) {
      this.handleDefeat();
    }
  }

  private scheduleNextThreat(): void {
    if (this.isGameOver || this.isVictory) return;

    // Tempo di attesa casuale tra un attacco e l'altro basato sulla fase
    let minDelay = 1800;
    let maxDelay = 2500;

    if (this.currentPhase === 2) {
      minDelay = 1000;
      maxDelay = 1800;
    } else if (this.currentPhase === 3) {
      minDelay = 500;
      maxDelay = 1200;
    }

    const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

    this.threatSpawnTimeout = setTimeout(() => {
      this.spawnThreat();
      this.scheduleNextThreat();
    }, delay);
  }

  private spawnThreat(): void {
    if (this.holdingThreat) {
      return;
    }

    // Limita il numero di minacce contemporanee in base alla fase
    const maxConcurrent = this.currentPhase === 3 ? 2 : 1;
    if (this.activeThreats.length >= maxConcurrent) return;

    // coordinate casuali centro della porta
    const x = Math.floor(Math.random() * 60) + 20; // tra 20% e 80%
    const y = Math.floor(Math.random() * 60) + 20; // tra 20% e 80%
    
    const randomType = this.threatTypes[Math.floor(Math.random() * this.threatTypes.length)];

    const newThreat: ThreatPoint = {
      id: Date.now(),
      x,
      y,
      type: randomType,
      progress: 0,
      timer: null
    };

    this.activeThreats.push(newThreat);
  }

startHolding(threat: ThreatPoint): void {
    if (this.isGameOver || this.isVictory) return;

    this.holdingThreat = threat;
    
    // Pressione ogni 50ms -> completa la stabilizzazione in circa 1.5 secondi
    this.holdInterval = setInterval(() => {
      if (this.holdingThreat) {
        this.holdingThreat.progress += 6;

        if (this.holdingThreat.progress >= 100) {
          this.resolveThreat(this.holdingThreat);
          this.stopHolding();
        }
      }
    }, 50);
  }

  @HostListener('window:mouseup')
  @HostListener('window:touchend')
  stopHolding(): void {
    if (this.holdInterval) {
      clearInterval(this.holdInterval);
      this.holdInterval = null;
    }

    // Se rilasciato prima del 100%, resetta il progresso della minaccia attiva
    if (this.holdingThreat && this.holdingThreat.progress < 100) {
      this.holdingThreat.progress = 0;
    }

    this.holdingThreat = null;
  }

  private resolveThreat(threat: ThreatPoint): void {
    this.activeThreats = this.activeThreats.filter(t => t.id !== threat.id);
  }


  

  private handleVictory(): void {
    this.clearAllTimers();
    this.isVictory = true;
  }

  private handleDefeat(): void {
    this.clearAllTimers();
    this.isGameOver = true;
  }

  completeMinigame() {
    this.endMinigame(true); 
  }

  endMinigame(success: boolean) {
    const targetNode = success ? '3HeadsDog2' : 'hospital';
    this.minigameSolved.emit(targetNode);
  }

  retryMinigame(): void {
    this.startGame();
  }

  private clearAllTimers(): void {
    if (this.gameLoopInterval) clearInterval(this.gameLoopInterval);
    if (this.holdInterval) clearInterval(this.holdInterval);
    if (this.threatSpawnTimeout) clearTimeout(this.threatSpawnTimeout);
  }

}

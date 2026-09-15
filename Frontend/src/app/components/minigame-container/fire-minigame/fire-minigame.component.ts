import { Component, OnInit,  Output, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef, EventEmitter } from '@angular/core';

export interface GameObject {
  id: string;
  name: string;
  imagePath: string;
  type: 'lantern' | 'cup' | 'armor' | 'shield' | 'banner';
  behavior: string;
  position: { top: string; left: string; width?: string };
}

@Component({
  selector: 'app-fire-minigame',
  templateUrl: './fire-minigame.component.html',
  styleUrls: ['./fire-minigame.component.css']
})
export class FireMinigameComponent implements OnInit, OnDestroy {
  @Output() minigameSolved = new EventEmitter<string>();

  @ViewChild('arenaContainer') arenaContainer!: ElementRef;

  // --- STATO GENERALE DEL GIOCO ---
  currentPhase: 'observation' | 'binoculars' | 'trajectory' | 'victory' | 'loss' = 'observation';
  binocularScene: number = 1;

  // Timer e Resistenza di Harry
  harryResistance: number = 100;
  private timerInterval: any;

  availableObjects: GameObject[] = [
    {
      id: 'lantern',
      name: 'Lanterna Magica',
      imagePath: 'assets/img/Part7/lantern.png',
      type: 'lantern',
      behavior: 'Riceve la magia dal basso e la riflette verso la coppa.',
      position: { top: '85%', left: '17%', width: '65px' }
    },
    {
      id: 'cup',
      name: 'Coppa Dorata',
      imagePath: 'assets/img/Part7/cup.png',
      type: 'cup',
      behavior: 'Rilancia la magia in diagonale verso l\'armatura.',
      position: { top: '80%', left: '37%', width: '100px' }
    },
    {
      id: 'armor',
      name: 'Armatura Decorativa',
      imagePath: 'assets/img/Part7/armor.png',
      type: 'armor',
      behavior: 'Direziona l\'incantesimo esattamente su Piton.',
      position: { top: '18%', left: '41%', width: '250px' }
    },
    {
      id: 'shield',
      name: 'Scudo di Bronzo',
      imagePath: 'assets/img/Part7/shield.png',
      type: 'shield',
      behavior: 'Riflette la magia all\'indietro.',
      position: { top: '80%', left: '80%', width: '120px' }
    },
    {
      id: 'banner',
      name: 'Stendardo in Tessuto',
      imagePath: 'assets/img/Part7/banner.png',
      type: 'banner',
      behavior: 'Assorbe la magia creando fumo.',
      position: { top: '41%', left: '26%', width: '158px' }
    }
  ];

  selectedSequence: GameObject[] = [];
  private readonly correctSequenceIds: string[] = ['lantern', 'cup', 'armor'];

  // --- MODALITÀ DI GIOCO ---
  isPlanningMode: boolean = false;

  // --- STATO UI ED EFFETTI VISIVI ---
  activeHint: string | null = null;
  errorMessage: string | null = null;
  isSpellCasting: boolean = false;
  isSnapeOnFire: boolean = false;

  // Gestione Scia SVG e Animazione Fumo
  magicTrailPath: string = '';
  isBannerSmoking: boolean = false;
  smokePosition = { top: '0px', left: '0px' };

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.startResistanceTimer();
  }

  ngOnDestroy(): void {
    this.stopResistanceTimer();
  }

  // TIMER RESISTENZA
  private startResistanceTimer(): void {
    this.stopResistanceTimer();
    this.harryResistance = 100;

    const totalSeconds = 300; // 5 minuti
    const decrementPerSecond = 100 / totalSeconds; // ~0.3333%

    this.timerInterval = setInterval(() => {
      if (this.harryResistance > 0 && this.currentPhase !== 'victory') {
        this.harryResistance = Math.max(0, this.harryResistance - decrementPerSecond);
        
        this.cdr.detectChanges();

        if (this.harryResistance <= 0) {
          this.harryResistance = 0;
          this.triggerLoss();
        }
      }
    }, 1000);
  }

  private stopResistanceTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
  get displayResistance(): number {
    return Math.round(this.harryResistance);
  }

  // --- FASE 1 & 2: BINOCOLO E SCENE ---
  openBinoculars(): void {
    this.currentPhase = 'binoculars';
    this.binocularScene = 1;
  }

  switchBinocularScene(sceneNumber: number): void {
    this.binocularScene = sceneNumber;
  }

  selectSnape(): void {
    this.currentPhase = 'trajectory';
  }

  // --- ATTIVAZIONE MODALITÀ PIANIFICAZIONE ---
  togglePlanningMode(): void {
    if (this.isSpellCasting) return;
    this.isPlanningMode = !this.isPlanningMode;
    this.errorMessage = null;
    this.magicTrailPath = '';
  }

  // --- GESTIONE CLICK SUGLI OGGETTI ---
  testObjectMagic(obj: GameObject, event: MouseEvent): void {
    if (this.isSpellCasting) return;

    if (!this.isPlanningMode) {
      // 1. MODALITÀ ESPLORAZIONE
      const targetEl = event.currentTarget as HTMLElement;
      this.animateExplorationTrajectory(targetEl, obj);
    } else {
      // 2. MODALITÀ PIANIFICAZIONE
      this.selectedSequence.push(obj);
      this.errorMessage = null;
    }
  }

  // FASE ESPLORAZIONE
  private animateExplorationTrajectory(targetEl: HTMLElement, obj: GameObject): void {
    if (!this.arenaContainer) return;

    this.isSpellCasting = true;
    this.isBannerSmoking = false;
    this.magicTrailPath = '';
    this.cdr.detectChanges();

    const arenaRect = this.arenaContainer.nativeElement.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    const targetX = targetRect.left - arenaRect.left + targetRect.width / 2;
    const targetY = targetRect.top - arenaRect.top + targetRect.height / 2;

    if (obj.type === 'banner') {
      this.smokePosition = {
        left: `${targetX - 22}px`,
        top: `${targetY - 25}px`
      };
      this.isBannerSmoking = true;

      setTimeout(() => {
        this.isBannerSmoking = false;
        this.isSpellCasting = false;
        this.cdr.detectChanges();
      }, 1400);
      return;
    }
    const startX = arenaRect.width / 2;
    const startY = arenaRect.height - 10; 

    const controlX = (startX + targetX) / 2;
    const controlY = Math.min(startY, targetY) - 40;

    requestAnimationFrame(() => {
      this.magicTrailPath = `M ${startX} ${startY} Q ${controlX} ${controlY}, ${targetX} ${targetY}`;
      this.cdr.detectChanges();
    });

    setTimeout(() => {
      this.magicTrailPath = '';
      this.isSpellCasting = false;
      this.cdr.detectChanges();
    }, 1400);
  }

  removeSequenceItem(index: number): void {
    if (this.isSpellCasting) return;
    this.selectedSequence.splice(index, 1);
  }

  clearSequence(): void {
    if (this.isSpellCasting) return;
    this.selectedSequence = [];
    this.errorMessage = null;
    this.magicTrailPath = '';
    this.isBannerSmoking = false;
  }

  // INCANTESIMO FINALE
  castSpell(): void {
    if (this.selectedSequence.length === 0 || this.isSpellCasting) return;

    this.isSpellCasting = true;
    this.errorMessage = null;
    this.drawSequencePath();

    const isCorrect =
      this.selectedSequence.length === this.correctSequenceIds.length &&
      this.selectedSequence.every((item, idx) => item.id === this.correctSequenceIds[idx]);

    setTimeout(() => {
      if (isCorrect) {
        this.triggerVictory();
      } else {
        this.errorMessage = 'La sequenza pianificata è errata! L\'incantesimo non raggiunge il bersaglio.';
        this.isSpellCasting = false;
        this.magicTrailPath = '';
        this.cdr.detectChanges();
      }
    }, 2000);
  }

  // Disegna il tracciato partendo dal centro in basso
  private drawSequencePath(): void {
    if (!this.arenaContainer) return;

    const arenaRect = this.arenaContainer.nativeElement.getBoundingClientRect();
    let path = `M ${arenaRect.width / 2} ${arenaRect.height - 5}`;

    const buttons = this.arenaContainer.nativeElement.querySelectorAll('.scene-object-btn');

    this.selectedSequence.forEach((stepObj) => {
      this.availableObjects.forEach((obj, index) => {
        if (obj.id === stepObj.id && buttons[index]) {
          const rect = buttons[index].getBoundingClientRect();
          const x = rect.left - arenaRect.left + rect.width / 2;
          const y = rect.top - arenaRect.top + rect.height / 2;
          path += ` L ${x} ${y}`;
        }
      });
    });

    this.magicTrailPath = path;
    this.cdr.detectChanges();
  }

  // --- ESITI E CAMBIO SCENA ---
  private triggerVictory(): void {
    this.stopResistanceTimer();
    this.isSnapeOnFire = true;
    setTimeout(() => {
      this.minigameSolved.emit('quidditch_victory');
    }, 2500);
  }

  private triggerLoss(): void {
    this.stopResistanceTimer();
    this.minigameSolved.emit('quidditch_loss');
  }
}
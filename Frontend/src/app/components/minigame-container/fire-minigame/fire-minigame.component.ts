import { Component, OnInit, OnDestroy } from '@angular/core';

export interface InteractiveObject {
  id: string;
  name: string;
  angleDeflection: number; // Gradi di deviazione
  isTrap: boolean;
  hint: string;
  icon: string;
}

@Component({
  selector: 'app-fire-minigame',
  templateUrl: './fire-minigame.component.html',
  styleUrls: ['./fire-minigame.component.css']
})
export class FireMinigameComponent implements OnInit, OnDestroy {

  currentPhase: 'observation' | 'binoculars' | 'trajectory' | 'victory' | 'loss' = 'observation';
  
  // Vista Binocolo: 1 = Zoom Harry, 2 = Spalti Piton
  binocularScene: number = 1;

  // Resistenza di Harry
  harryResistance: number = 100;
  private timerInterval: any;

  // Oggetti disponibili negli spalti per la Fase 3
  availableObjects: InteractiveObject[] = [
    { id: 'lantern', name: 'Lanterna Magica', angleDeflection: 90, isTrap: false, hint: 'La luce sembra cambiare direzione attraversando il vetro.', icon: '🕯️' },
    { id: 'cup', name: 'Coppa Dorata', angleDeflection: 45, isTrap: false, hint: 'Riesci a vedere il riflesso delle tribune sulla sua superficie.', icon: '🏆' },
    { id: 'armor', name: 'Armatura Decorativa', angleDeflection: 0, isTrap: false, hint: 'La superficie riflette perfettamente ciò che le passa davanti.', icon: '🛡️' },
    { id: 'shield', name: 'Scudo Cerimoniale', angleDeflection: 180, isTrap: false, hint: 'L\'interno è così curvo da riflettere la tua immagine.', icon: '🔰' },
    { id: 'banner', name: 'Stendardo della Casa', angleDeflection: 0, isTrap: true, hint: 'Il tessuto assorbe quasi tutta la luce.', icon: '🚩' },
    { id: 'torch', name: 'Torcia Accesa', angleDeflection: 0, isTrap: true, hint: 'Le scintille sembrano svanire vicino alle fiamme.', icon: '🔥' }
  ];

  // Sequenza selezionata dal giocatore
  selectedSequence: InteractiveObject[] = [];
  
  // Sequenza corretta per la soluzione
  private readonly correctSequenceIds: string[] = ['lantern', 'cup', 'armor'];

  // Stato UI ed errori
  activeHint: string | null = null;
  errorMessage: string | null = null;
  isSpellCasting: boolean = false;
  isSnapeOnFire: boolean = false;

  ngOnInit(): void {
   // this.startResistanceTimer();
  }

  ngOnDestroy(): void {
    this.stopResistanceTimer();
  }

  // --- TIMER RESISTENZA HARRY ---
  /*private startResistanceTimer(): void {
    this.timerInterval = setInterval(() => {
      if (this.harryResistance > 0 && this.currentPhase !== 'victory') {
        this.harryResistance -= 2;
        if (this.harryResistance <= 0) {
          this.triggerLoss();
        }
      }
    }, 1000);
  }*/

  private stopResistanceTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  // --- FASE 1 & 2: BINOCOLO & PITON ---
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

  // --- FASE 3: COSTRUZIONE TRAIETTORIA ---
  selectObject(obj: InteractiveObject): void {
    if (this.isSpellCasting) return;
    
    this.activeHint = obj.hint;
    this.errorMessage = null;

    // Impedisci duplicati nella sequenza
    if (!this.selectedSequence.some(item => item.id === obj.id)) {
      this.selectedSequence.push(obj);
    }
  }

  removeSequenceItem(index: number): void {
    if (this.isSpellCasting) return;
    this.selectedSequence.splice(index, 1);
  }

  clearSequence(): void {
    if (this.isSpellCasting) return;
    this.selectedSequence = [];
    this.errorMessage = null;
  }

  // --- VERIFICA INCANTESIMO ---
  castSpell(): void {
    if (this.selectedSequence.length === 0 || this.isSpellCasting) return;

    this.isSpellCasting = true;
    this.errorMessage = null;

    // Controllo trappole o lunghezza
    const hasTrap = this.selectedSequence.some(item => item.isTrap);
    const isCorrect = !hasTrap && 
      this.selectedSequence.length === this.correctSequenceIds.length &&
      this.selectedSequence.every((item, idx) => item.id === this.correctSequenceIds[idx]);

    setTimeout(() => {
      if (isCorrect) {
        this.triggerVictory();
      } else {
        this.errorMessage = 'La scintilla si disperde prima di raggiungere il bersaglio.';
        this.isSpellCasting = false;
      }
    }, 1800); // Durata animazione scintilla
  }

  // --- ESITI ---
  private triggerVictory(): void {
    this.stopResistanceTimer();
    this.isSnapeOnFire = true;
    
    setTimeout(() => {
      this.currentPhase = 'victory';
      // Gestione cambio nodo globale
      // this.gameService.goToNode('quidditch_victory');
    }, 2500);
  }

  private triggerLoss(): void {
    this.stopResistanceTimer();
    this.currentPhase = 'loss';
    // Gestione cambio nodo globale
    // this.gameService.goToNode('quidditch_loss');
  }
}

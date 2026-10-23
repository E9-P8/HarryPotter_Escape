import { Component, EventEmitter, Output, OnInit} from '@angular/core';

interface LocationItem {
  id: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-enigma-forest',
  templateUrl: './enigma-forest.component.html',
  styleUrls: ['./enigma-forest.component.css']
})
export class EnigmaForestComponent implements OnInit {

  ngOnInit(): void {
  }

  @Output() quizSolved = new EventEmitter<string>();

  introStep: number = 0; 
  attemptsLeft: number = 3;
  errorMessage: string = '';
  showWinSequence: boolean = false;
  currentWinStep: number = -1;
  winMessageIndex: number = 0;
  isGameOver: boolean = false;
  isVictorious: boolean = false;

  availableLocations: LocationItem[] = [
    { id: 'ruscello', name: 'Ruscello d\'Argento', icon: '🌊' },
    { id: 'funghi', name: 'Cerchio di Funghi', icon: '🍄' },
    { id: 'quercia', name: 'Vecchia Quercia', icon: '🌳' },
    { id: 'radura_oscura', name: 'Radura Oscura', icon: '🌌' },
    { id: 'lago', name: 'Radura del Lago', icon: '💧' },
    { id: 'sentiero', name: 'Sentiero Roccioso', icon: '🪨' }
  ];

  // 6 Timeline Slots (index 0 to 5)
  slots: (LocationItem | null)[] = [null, null, null, null, null, null];

  // Correct order sequence
  readonly correctOrder: string[] = [
      'lago',
      'funghi',
      'sentiero',
      'radura_oscura',
      'ruscello',
      'quercia'
  ];

  readonly winMessages: string[] = [
    'L\'unicorno stava cercando di fuggire.',
    'Qualcosa lo stava inseguendo.',
    'E sai esattamente dove trovarlo.'
  ];

  get starsArray(): number[] {
    return Array(this.attemptsLeft).fill(0);
  }

  get emptyStarsArray(): number[] {
    return Array(3 - this.attemptsLeft).fill(0);
  }

  startInvestigation(): void {
    this.introStep = 2;
  }

  nextIntro(): void {
    this.introStep = 1;
  }


  draggedItem: LocationItem | null = null;
  draggedSourceType: 'pool' | 'slot' = 'pool';
  draggedSourceIndex: number = -1;

  onDragStart(item: LocationItem, sourceType: 'pool' | 'slot', index: number, event: DragEvent): void {
    if (this.isGameOver || this.isVictorious) return;
    this.draggedItem = item;
    this.draggedSourceType = sourceType;
    this.draggedSourceIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', item.id);
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDropToSlot(targetSlotIndex: number, event: DragEvent): void {
    event.preventDefault();
    if (this.isGameOver || this.isVictorious || !this.draggedItem) return;

    const targetItem = this.slots[targetSlotIndex];

    // rimozione elemento dalla sorgente
    if (this.draggedSourceType === 'pool') {
      const idx = this.availableLocations.findIndex(i => i.id === this.draggedItem?.id);
      if (idx !== -1) {
        this.availableLocations.splice(idx, 1);
      }
    } else if (this.draggedSourceType === 'slot') {
      this.slots[this.draggedSourceIndex] = null;
    }

    // Posizione nel target slot e gestione scambio
    if (targetItem) {
      if (this.draggedSourceType === 'pool') {
        this.availableLocations.push(targetItem);
      } else if (this.draggedSourceType === 'slot') {
        this.slots[this.draggedSourceIndex] = targetItem;
      }
    }

    this.slots[targetSlotIndex] = this.draggedItem;
    this.resetDragState();
  }

  onDropToPool(event: DragEvent): void {
    event.preventDefault();
    if (this.isGameOver || this.isVictorious || !this.draggedItem) return;

    if (this.draggedSourceType === 'slot') {
      this.slots[this.draggedSourceIndex] = null;
      this.availableLocations.push(this.draggedItem);
    }
    this.resetDragState();
  }

  resetDragState(): void {
    this.draggedItem = null;
    this.draggedSourceIndex = -1;
  }

  checkSolution(): void {
    if (this.isGameOver || this.isVictorious) return;

    const currentOrder = this.slots.map(s => s ? s.id : null);
    if (currentOrder.includes(null)) {
      this.errorMessage = 'Posiziona un luogo in ciascuno dei 6 slot temporali prima di ricostruire il percorso.';
      return;
    }

    const isCorrect = currentOrder.every((val, index) => val === this.correctOrder[index]);

    if (isCorrect) {
      this.handleVictory();
    } else {
      this.handleFailure();
    }
  }

  private handleFailure(): void {
    this.attemptsLeft--;

    if (this.attemptsLeft === 2) {
      this.errorMessage = 'Le tracce non coincidono. Forse stai collegando gli indizi nel modo sbagliato.';
    } else if (this.attemptsLeft === 1) {
      this.errorMessage = 'Qualcosa non torna. Rileggi attentamente gli indizi.';
    } else if (this.attemptsLeft <= 0) {
      this.isGameOver = true;
      this.errorMessage = 'Hai perso la pista.';
      setTimeout(() => {
        this.quizSolved.emit('forest_enigma_fail');
      }, 3500);
    }
  }

  private handleVictory(): void {
    this.isVictorious = true;
    this.errorMessage = '';
    this.showWinSequence = true;

    let step = 0;
    const interval = setInterval(() => {
      this.currentWinStep = step;
      step++;
      if (step >= 6) {
        clearInterval(interval);
        setTimeout(() => {
          this.startNarrativeSequence();
        }, 1000);
      }
    }, 600);
  }

  private startNarrativeSequence(): void {
    this.winMessageIndex = 0;
    const msgInterval = setInterval(() => {
      this.winMessageIndex++;
      if (this.winMessageIndex >= this.winMessages.length - 1) {
        clearInterval(msgInterval);
      }
    }, 2500);
  }

  finishPuzzle(): void {
    console.log('finishPuzzle chiamato! Emissione nodo: Voldemort_encountered');
    this.quizSolved.emit('Voldemort_encountered');
  }
}

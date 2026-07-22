import { Component, OnInit, Output, EventEmitter  } from '@angular/core';

type GemColor = 'yellow' | 'red' | 'green' | 'blue';
type SlotDirection = 'N' | 'E' | 'S' | 'W';

interface GemInfo {
  color: GemColor;
  label: string;
  rune: string;
}

@Component({
  selector: 'app-puzzle-frame',
  templateUrl: './puzzle-frame.component.html',
  styleUrls: ['./puzzle-frame.component.css']
})
export class PuzzleFrameComponent implements OnInit {

  readonly gemsData: Record<GemColor, GemInfo> = {
    yellow: { color: 'yellow', label: 'Gialla', rune: '𐎢' },
    red:    { color: 'red',    label: 'Rossa',  rune: '𐎘' },
    green:  { color: 'green',  label: 'Verde',  rune: '𐎎' },
    blue:   { color: 'blue',   label: 'Blu',    rune: '𐎖' }
  };

  private readonly solution: Record<SlotDirection, GemColor> = {
    N: 'blue',   // Cielo (Aria - Corvonero)
    E: 'red',    // Calore d'oriente (Fuoco - Grifondoro)
    S: 'green',  // Profondità dell'abisso (Acqua - Serpeverde)
    W: 'yellow'  // Vette contrapposte all'oriente (Terra - Tassorosso)
  };

  selectedGem: GemColor | null = null;
  selectedPaletteId: string | null = null;

  board: Record<SlotDirection, GemColor | null> = {
    N: null,
    E: null,
    S: null,
    W: null
  };

  feedbackMessage: string = '';
  isSolved: boolean = false;
  isEnigmaHidden: boolean = false; 
  isDoorOpening: boolean = false;

  @Output() quizSolved = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  selectGemFromPalette(color: string, paletteId: string): void {
    const gemColor = color as GemColor;

    if (this.selectedGem === gemColor) {
      this.selectedGem = null;
      this.selectedPaletteId = null;
      this.feedbackMessage = '';
      return;
    }

    this.selectedGem = gemColor;
    this.selectedPaletteId = paletteId;
    this.feedbackMessage = `Sigillo ${this.gemsData[gemColor].label} selezionato. Scegli uno slot dove incastonarlo.`;
  }
  
  interactWithSlot(slot: string): void {
    const direction = slot as SlotDirection;

    // Caso A: Se abbiamo una gemma selezionata, inseriscila nello slot
    if (this.selectedGem) {
      this.board[direction] = this.selectedGem;
      
      // Resetta la selezione corrente
      const gemPlaced = this.selectedGem;
      this.selectedGem = null;
      this.selectedPaletteId = null;
      this.feedbackMessage = `Incastonato il Sigillo ${this.gemsData[gemPlaced].label} in posizione ${this.getDirectionName(direction)}.`;
      return;
    }

    // Caso B: Se NON abbiamo una gemma selezionata ma lo slot è pieno, rimuoviamo la gemma
    if (this.board[direction]) {
      const removedGem = this.board[direction]!;
      this.board[direction] = null;
      this.feedbackMessage = `Rimosso il Sigillo ${this.gemsData[removedGem].label} dallo slot ${this.getDirectionName(direction)}.`;
      return;
    }

    // Caso C: Slot vuoto e nessuna gemma selezionata
    this.feedbackMessage = 'Seleziona prima una gemma dalla teca in basso!';
  }

  checkEnigma(): void {
    // Controlla se tutti gli slot sono stati riempiti
    const isComplete = Object.values(this.board).every(val => val !== null);

    if (!isComplete) {
      this.feedbackMessage = 'Attenzione! Devi posizionare tutti e 4 i sigilli prima di attivare il meccanismo!';
      return;
    }

    const isCorrect = (Object.keys(this.solution) as SlotDirection[]).every(
      key => this.board[key] === this.solution[key]
    );

    if (isCorrect) {
    this.isSolved = true;
    this.feedbackMessage = 'Meccanismo sbloccato!';

    setTimeout(() => {
      this.isEnigmaHidden = true;
      
      setTimeout(() => {
        this.isDoorOpening = true;
        setTimeout(() => {
          this.goToNextNode();
        }, 1500); 

      }, 500); 

    }, 600);
    } else {
      this.isSolved = false;
      this.feedbackMessage = 'Risposte elementali in conflitto. La combinazione non è corretta!';
    }
  }
  goToNextNode(): void {
    this.quizSolved.emit('lesson'); 
    console.log('Passaggio al nodo successivo...');
  }

  resetEnigma(): void {
    this.board = { N: null, E: null, S: null, W: null };
    this.selectedGem = null;
    this.selectedPaletteId = null;
    this.isSolved = false;
    this.feedbackMessage = 'Tutti i sigilli sono stati rimossi dalla bussola.';
  }
  private getDirectionName(dir: SlotDirection): string {
    const names: Record<SlotDirection, string> = {
      N: 'Nord',
      E: 'Est',
      S: 'Sud',
      W: 'Ovest'
    };
    return names[dir];
  }
}

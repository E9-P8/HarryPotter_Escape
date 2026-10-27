import { Component, OnInit, Output, EventEmitter } from '@angular/core';

interface ChessPiece {
  id: string;
  name: string;
  image: string;
  statement: string;
  selectedClaim: boolean | null; // true = Dice la verità, false = Sta mentendo
  isCorrectClaim: boolean;     // La verità logica corretta
  cardClass: string;
}

@Component({
  selector: 'app-chess-enigma',
  templateUrl: './chess-enigma.component.html',
  styleUrls: ['./chess-enigma.component.css']
})
export class ChessEnigmaComponent {

  @Output() quizSolved = new EventEmitter<string>();

  // Stati del flusso di gioco
  currentPhase: 'intro' | 'puzzle' | 'sacrifice' | 'success_final' = 'intro';
  
  showSacrificeDialogue: boolean = true;

  errorsCount: number = 0;
  showErrorPopup: boolean = false;
  errorMessage: string = '';
  errorButtonText: string = 'Riprova';

  pieces: ChessPiece[] = [
    {
      id: 'queen',
      name: 'Regina',
      image: 'queen-white.png',
      statement: 'La Torre protegge il Re.',
      selectedClaim: null,
      isCorrectClaim: false, // Mente
      cardClass: 'card-light'
    },
    {
      id: 'knight',
      name: 'Cavallo',
      image: 'knight-black.png',
      statement: 'La Regina mente.',
      selectedClaim: null,
      isCorrectClaim: true,
      cardClass: 'card-dark' // Dice la verità
    },
    {
      id: 'bishop',
      name: 'Alfiere',
      image: 'bishop-black.png',
      statement: "Il Cavallo è l'unico che dice la verità.",
      selectedClaim: null,
      isCorrectClaim: false,
      cardClass: 'card-dark' // Mente
    },
     {
      id: 'rook',
      name: 'Torre',
      image: 'rook-white.png',
      statement: "L'Alfiere sta mentendo.",
      selectedClaim: null,
      isCorrectClaim: true,
      cardClass: 'card-light' // Dice la verità
    },
  ];

  isPuzzleValidated: boolean = false; // Diventa true quando il ragionamento è corretto

  // Seleziona la verità o la menzogna per una carta
  selectClaim(pieceId: string, claim: boolean): void {
    if (this.isPuzzleValidated) return;
    const piece = this.pieces.find(p => p.id === pieceId);
    if (piece) {
      piece.selectedClaim = claim;
    }
  }

  // Controlla se tutte e 4 le carte hanno una scelta
  get areAllPiecesAnswered(): boolean {
    return this.pieces.every(p => p.selectedClaim !== null);
  }
  verifyReasoning(): void {
    if (!this.areAllPiecesAnswered || this.isPuzzleValidated) return;

    // Controlla se le scelte corrispondono alla soluzione corretta
    const isAllCorrect = this.pieces.every(p => p.selectedClaim === p.isCorrectClaim);

    if (isAllCorrect) {
      this.isPuzzleValidated = true;
    } else {
      this.errorsCount++;
      
      if (this.errorsCount === 1) {
        this.errorMessage = "La logica della scacchiera non è corretta.";
        this.errorButtonText = "Riprova";
        this.showErrorPopup = true;
      } else if (this.errorsCount === 2) {
        this.errorMessage = "Qualcuno è stato giudicato nel modo sbagliato.";
        this.errorButtonText = "Riprova";
        this.showErrorPopup = true;
      } else if (this.errorsCount >= 3) {
        this.errorMessage = "Hai fallito la prova della Regina.";
        this.showErrorPopup = true;
        // Attende 2 secondi prima di emettere il fallimento
        setTimeout(() => {
          this.quizSolved.emit('chess_fail');
        }, 2000);
      }
    }
  }

  closeErrorPopup(): void {
    if (this.errorsCount < 3) {
      this.showErrorPopup = false;
      this.pieces.forEach(p => p.selectedClaim = null);
    }
  }
  proceedToSacrifice(): void {
    this.currentPhase = 'sacrifice';
    this.showSacrificeDialogue = true; // Mostra prima il dialogo di Ron
  }

  openSacrificeGrid(): void {
    this.showSacrificeDialogue = false;
  }


  // Scelta del sacrificio
  selectSacrifice(pieceId: string): void {
    if (pieceId === 'knight') {
      // Scelta Corretta (Il Cavallo / Ron)
      this.currentPhase = 'success_final';
    } else {
      // Scelta Errata
      this.errorMessage = "Quella scelta non permetterebbe agli altri di proseguire.";
      this.errorButtonText = "Torna alla scelta";
      this.showErrorPopup = true;
    }
  }

  closeSacrificeError(): void {
    this.showErrorPopup = false;
  }

  finishGame(): void {
    this.quizSolved.emit('chess_victory');
  }

}

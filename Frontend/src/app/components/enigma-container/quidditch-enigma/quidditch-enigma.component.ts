import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';

export interface StadiumZone {
  id: string;
  name: string;
  x: number; // % X rispetto allo stadio
  y: number; // % Y rispetto allo stadio
}
@Component({
  selector: 'app-quidditch-enigma',
  templateUrl: './quidditch-enigma.component.html',
  styleUrls: ['./quidditch-enigma.component.css']
})
export class QuidditchEnigmaComponent implements OnInit {

@Output() quizSolved = new EventEmitter<string>();

  // Zone interattive dello Stadio (Punti fisici dove apparirà il Boccino)
  zones: StadiumZone[] = [
    { id: 'torre_nord', name: 'Torre Nord', x: 50, y: 18 },
    { id: 'anello_est', name: 'Anelli Est', x: 86, y: 30 },
    { id: 'tribuna_ovest', name: 'Tribuna Ovest', x: 7, y: 37 },
    { id: 'tribuna_sud', name: 'Tribuna Sud', x: 50, y: 96 },
    { id: 'centro_campo', name: 'Centro Campo', x: 50, y: 64 },
    { id: 'anello_ovest', name: 'Anelli Ovest', x: 22, y: 16},
    { id: 'tribuna_est', name: 'Tribuna Est', x: 88, y: 49 }
  ];

  attemptsLeft: number = 3;
  maxAttempts: number = 3;

  // Gestione Fasi Game Loop
  gameState: 'observation' | 'selection' | 'waiting' | 'result' = 'observation';

  // Pattern del Boccino
  currentPattern: StadiumZone[] = [];
  currentIndex: number = 0;
  cyclesCompleted: number = 0;
  maxCycles: number = 3;

  // Boccino & Scie
  snitchPos: { x: number; y: number } | null = null;
  snitchVisible: boolean = false;
  snitchTrails: { fromX: number; fromY: number; toX: number; toY: number; opacity: number }[] = [];

  // Posizionamento Harry & Asset Visivi
  harryPos = { x: 50, y: 0 }; // Posizione iniziale in volo
  selectedZone: StadiumZone | null = null;
  correctTargetZone: StadiumZone | null = null;

  harryState: 'flying' | 'waiting' | 'success' | 'fail' = 'flying';
  messageText: string = 'Osserva attentamente il comportamento del Boccino...';

  private cycleTimer: any = null;

  ngOnInit(): void {
    this.startNewAttempt();
  }
  startNewAttempt(): void {
    this.gameState = 'observation';
    this.harryState = 'flying';
    this.harryPos = { x: 50, y: 0 };
    this.selectedZone = null;
    this.snitchTrails = [];
    this.cyclesCompleted = 0;
    this.currentIndex = 0;

    this.generateRandomPattern();
    this.messageText = `Osserva il Boccino (Ciclo 1/${this.maxCycles})`;
    this.runObservationCycle();
  }

  generateRandomPattern(): void {
    // Mescola e sceglie 5 zone uniche per formare un pattern sequenziale
    const shuffled = [...this.zones].sort(() => 0.5 - Math.random());
    this.currentPattern = shuffled.slice(0, 5);
    // Il punto corretto da indovinare sarà l'elemento immediatamente successivo al ciclo
    this.correctTargetZone = this.currentPattern[0]; 
  }
  // --- 2. FASE DI OSSERVAZIONE (3 CICLI) ---
  runObservationCycle(): void {
    if (this.cyclesCompleted >= this.maxCycles) {
      this.endObservationPhase();
      return;
    }

    const currentZone = this.currentPattern[this.currentIndex];
    const prevZone = this.currentIndex > 0 
      ? this.currentPattern[this.currentIndex - 1] 
      : (this.cyclesCompleted > 0 ? this.currentPattern[this.currentPattern.length - 1] : null);

    // Posiziona il Boccino
    this.snitchPos = { x: currentZone.x, y: currentZone.y };
    this.snitchVisible = true;

    // Aggiungi Scia Dorata se c'è un punto precedente
    if (prevZone) {
      this.snitchTrails.push({
        fromX: prevZone.x,
        fromY: prevZone.y,
        toX: currentZone.x,
        toY: currentZone.y,
        opacity: 0.4 + (this.cyclesCompleted * 0.2) // Si intensificano ad ogni ciclo
      });
    }

    // Passaggio al nodo successivo del ciclo
    this.cycleTimer = setTimeout(() => {
      this.snitchVisible = false;

      this.cycleTimer = setTimeout(() => {
        this.currentIndex++;

        if (this.currentIndex >= this.currentPattern.length) {
          this.currentIndex = 0;
          this.cyclesCompleted++;
          if (this.cyclesCompleted < this.maxCycles) {
            this.messageText = `Osserva il Boccino (Ciclo ${this.cyclesCompleted + 1}/${this.maxCycles})`;
          }
        }

        this.runObservationCycle();
      }, 300); // Pausa di sparizione breve
    }, 1200); // Permanenza a schermo del Boccino
  }

  endObservationPhase(): void {
    this.snitchVisible = false;
    this.gameState = 'selection';
    this.messageText = 'Hai osservato il percorso del Boccino. Dove comparirà la prossima volta?';
  }
  // --- 3. SELEZIONE DELLA ZONA E POSIZIONAMENTO DI HARRY ---
  selectZone(zone: StadiumZone): void {
    if (this.gameState !== 'selection') return;

    this.selectedZone = zone;
    this.gameState = 'waiting';
    this.harryState = 'waiting';

    // Sposta Harry nella zona scelta dal giocatore
    this.harryPos = { x: zone.x, y: zone.y + 6 }; // Poco sotto la zona per intercettarlo
    this.messageText = `Harry si prepara ad intercettare il Boccino presso: ${zone.name}.`;

    setTimeout(() => {
      this.verifyPrediction();
    }, 2200);
  }

  // --- 4. VERIFICA E RISOLUZIONE ENIGMA ---
  verifyPrediction(): void {
    this.gameState = 'result';

    // Il boccino riappare nel punto corretto previsto dal pattern
    if (this.correctTargetZone) {
      this.snitchPos = { x: this.correctTargetZone.x, y: this.correctTargetZone.y };
      this.snitchVisible = true;
    }

    const isCorrect = this.selectedZone?.id === this.correctTargetZone?.id;

    if (isCorrect) {
      // VITTORIA
      this.harryState = 'success';
      this.harryPos = { x: this.correctTargetZone!.x, y: this.correctTargetZone!.y };
      this.messageText = 'Hai previsto correttamente il percorso! Harry cattura il Boccino d\'Oro e vince la partita!';

      setTimeout(() => {
        this.quizSolved.emit('quidditch_victory'); 
      }, 3000);

    } else {
      // ERRORE
      this.harryState = 'fail';
      this.attemptsLeft--;

      if (this.attemptsLeft > 0) {
        this.messageText = `Harry ha scelto il punto sbagliato. Il Boccino è apparso a ${this.correctTargetZone?.name}.`;
        
        setTimeout(() => {
          this.startNewAttempt(); // Nuovo tentativo con nuovo pattern
        }, 3200);

      } else {
        // PERDITA DEFINITIVA
        this.messageText = 'Il Boccino scomplete oltre le tribune. La partita termina prima della cattura!';
        
        setTimeout(() => {
          this.quizSolved.emit('quidditch_loss'); // Nodo di sconfitta
        }, 3000);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.cycleTimer) clearTimeout(this.cycleTimer);
  }
}

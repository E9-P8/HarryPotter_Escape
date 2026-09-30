import { Component, Output, EventEmitter, HostListener, OnInit } from '@angular/core';

type GameNode = 
  | 'entrance' 
  | 'restricted_section' 
  | 'escape_1' 
  | 'escape_2' 
  | 'escape_3' 
  | 'escape_4' 
  | 'exit_door' 
  | 'fail_purr' 
  | 'fail_gazza';

interface EscapeClues {
  left: string;
  right: string;
  correct: 'left' | 'right';
  failType: 'purr' | 'gazza';
}

@Component({
  selector: 'app-library-enigma',
  templateUrl: './library-enigma.component.html',
  styleUrls: ['./library-enigma.component.css']
})
export class LibraryEnigmaComponent implements OnInit {

  @Output() quizSolved = new EventEmitter<string>();
  @Output() nodoFallimento = new EventEmitter<string>();
  @Output() missionSuccess = new EventEmitter<void>();

  currentNode: GameNode = 'entrance';
  isFading: boolean = false;
  
  // Gestione Tooltip
  tooltipText: string = '';
  mousePos = { x: 0, y: 0 };

  // Fase 1 - Libro Drag & Drop
  showDraggableBook: boolean = false;
  isBookOpened: boolean = false;
  isBookZoomed: boolean = false;
  isDragging: boolean = false;
  bookPosition = { x: 0, y: 0 };

  escapeNodesData: Record<string, EscapeClues> = {
    'escape_1': {
      left: 'Impronte di gatto e una ciotola del latte rovesciata...',
      right: 'Polvere e libri perfettamente allineati...',
      correct: 'right',
      failType: 'purr'
    },
    'escape_2': {
      left: 'Una lanterna sta ancora oscillando lievemente e c\'è una sedia spostata...',
      right: 'La luce è accesa e le impronte sono coperte dalla polvere.',
      correct: 'right',
      failType: 'gazza'
    },
    'escape_3': {
      left: 'Libri fuori posto e uno scaffale mezzo svuotato...',
      right: 'Una lieve luce sul pavimento e un riflesso intermittente...',
      correct: 'left',
      failType: 'gazza'
    },
    'escape_4': {
      left: 'Un miagolio lontano e peli di gatto sul pavimento...',
      right: 'Si intravede una porta in fondo, porterà ad un\'altra sezione?...',
      correct: 'right',
      failType: 'purr'
    }
  };

  ngOnInit(): void {
    this.resetBookPosition();
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.mousePos = { x: event.clientX, y: event.clientY };

    if (this.isDragging) {
      this.bookPosition = { x: event.clientX, y: event.clientY };
    }
  }

  @HostListener('mouseup')
  @HostListener('touchend')
  onDragEnd(): void {
    if (!this.isDragging) return;
    this.isDragging = false;

    // Controlla se il libro è stato rilasciato al centro dello schermo (Drop Zone)
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight * 0.77;
    const distance = Math.hypot(this.bookPosition.x - centerX, this.bookPosition.y - centerY);

    if (distance < 150) {
      this.triggerBookOpeningSequence();
    } else {
      this.resetBookPosition();
    }
  }

  showTooltip(text: string): void {
    this.tooltipText = text;
  }

  hideTooltip(): void {
    this.tooltipText = '';
  }

  // NODO 1: INGRESSO BIBLIOTECA
  onEntranceChoice(choice: 'left' | 'right'): void {
    if (choice === 'right') {
      this.transitionTo('restricted_section');
    } else {
      // Scelta sbagliata al nodo 1
      this.quizSolved.emit('');
    }
  }

  // NODO 2: SEZIONE RISERVATA & MECCANICHE LIBRO
  revealBook(): void {
    this.bookPosition = { x: 150, y: 300 };
    this.showDraggableBook = true;
    this.resetBookPosition();
  }

  startDrag(event: MouseEvent | TouchEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  resetBookPosition(): void {
    this.bookPosition = {
      x: window.innerWidth * 0.45,
      y: window.innerHeight * 0.40
    };
  }

  triggerBookOpeningSequence(): void {
    this.isBookOpened = true;
    this.playMagicSound();

    setTimeout(() => {
      this.isBookZoomed = true;
      
      setTimeout(() => {
        alert("Fai attenzione. Anche una sola piccola svista può farti scoprire. Tieni gli occhi aperti, hai solo una possibilità per non farti scoprire.");
        this.transitionTo('escape_1');
      }, 1500);

    }, 300);
  }

  // FASE 2: GESTIONE SCELTE FUGA
  isEscapeNode(): boolean {
    return this.currentNode.startsWith('escape_');
  }

  getEscapeBgClass(): string {
    return `${this.currentNode.replace('_', '-')}-bg`;
  }

  getCurrentNodeClue(direction: 'left' | 'right'): string {
    const data = this.escapeNodesData[this.currentNode];
    return data ? data[direction] : '';
  }

  onEscapeChoice(choice: 'left' | 'right'): void {
    const currentData = this.escapeNodesData[this.currentNode];
    if (!currentData) return;

    if (choice === currentData.correct) {
      this.advanceEscape();
    } else {
      this.triggerFailure(currentData.failType);
    }
  }

  advanceEscape(): void {
    switch (this.currentNode) {
      case 'escape_1': this.transitionTo('escape_2'); break;
      case 'escape_2': this.transitionTo('escape_3'); break;
      case 'escape_3': this.transitionTo('escape_4'); break;
      case 'escape_4': this.transitionTo('exit_door'); break;
    }
  }

triggerFailure(type: 'purr' | 'gazza'): void {
    const TARGET_FAIL_NODE = 'filch_catch_warning'; 

    if (type === 'purr') {
      this.transitionTo('fail_purr');
      
      setTimeout(() => {
        this.transitionTo('fail_gazza', () => {
          setTimeout(() => {
            this.quizSolved.emit('TARGET_FAIL_NODE');
          }, 2500);
        });
      }, 2500);

    } else {
      this.transitionTo('fail_gazza', () => {
        setTimeout(() => {
          this.quizSolved.emit('TARGET_FAIL_NODE');
        }, 2500);
      });
    }
  }

  // NODO USCITA
  exitLibrary(): void {
    this.quizSolved.emit('snape_quirrell_argument');
  }

  // UTILITY TRANSIZIONI FADE
  transitionTo(newNode: GameNode, callback?: () => void): void {
    this.hideTooltip();
    this.isFading = true;
    setTimeout(() => {
      this.currentNode = newNode;
      this.isFading = false;
      if (callback) callback();
    }, 500);
  }

  // RIPRODUZIONE AUDIO SINTETIZZATO (WEB AUDIO API)
  private playMagicSound(): void {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 1);

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 1);
    } catch (e) {
      // Audio fallback silenzioso se il contesto non è ancora attivato dall'utente
    }
  }

}

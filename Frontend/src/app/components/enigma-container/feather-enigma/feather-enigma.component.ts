import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, EventEmitter, Output } from '@angular/core';

interface Clue {
  id: string;
  title: string;
  text: string[];
  unlocked: boolean;
  hidden?: boolean;
}

enum SpellFeedback {
  IDLE = '',
  NO_INITIAL_RISE = 'La piuma rimane completamente immobile.',
  MISSING_CURVE = 'Una debole scintilla compare sulla punta della bacchetta e scompare immediatamente.',
  MISSING_CIRCLE = 'La piuma vibra leggermente ma non riesce a staccarsi dal banco.',
  MISSING_RIGHT_SWIPE = 'La piuma si solleva di pochi centimetri e ricade subito.',
  MISSING_FINAL_RISE = "La piuma fluttua brevemente nell'aria ma l'incantesimo perde stabilità.",
  NEAR_PERFECT = 'La piuma sale lentamente ma torna subito sul banco. Sembra mancare un piccolo dettaglio nel movimento.',
  SUCCESS = 'Wingardium Leviosa! La piuma si solleva elegantemente dal banco e rimane sospesa in aria.'
}

@Component({
  selector: 'app-feather-enigma',
  templateUrl: './feather-enigma.component.html',
  styleUrls: ['./feather-enigma.component.css']
})
export class FeatherEnigmaComponent implements AfterViewInit {

  @Output() quizSolved = new EventEmitter<string>();
  @ViewChild('gestureCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  currentStage: 'EXPLORATION' | 'DESK' = 'EXPLORATION';
  activeClue: Clue | null = null;
  feedbackMessage: string = SpellFeedback.IDLE;
  isSpellSuccess: boolean = false;

  // Tracciamento del disegno
  isDrawing = false;
  drawnPoints: { x: number; y: number; time: number }[] = [];

  clues: Record<string, Clue> = {
    flitwick: {
      id: 'flitwick',
      title: 'Professor Vitious',
      text: [
        '"La levitazione è una magia ascendente."',
        '"Ricordatevi sempre che il movimento deve partire dal basso e dirigersi verso l\'alto."'
      ],
      unlocked: false
    },
    hermione: {
      id: 'hermione',
      title: 'Appunti di Hermione',
      text: [
        'Hermione ha scritto ogni parola del professore.',
        'In una nota particolarmente ordinata trovi una frase cerchiata:',
        '"Dopo la salita la traiettoria cambia direzione verso destra, curvandosi leggermente."'
      ],
      unlocked: false
    },
    books: {
      id: 'books',
      title: 'Libri del Professore',
      text: [
        'Sfogliando un capitolo dedicato agli incantesimi di levitazione trovi una nota evidenziata:',
        '"La rotazione concentra l\'energia magica prima del rilascio."'
      ],
      unlocked: false
    },
    ron: {
      id: 'ron',
      title: 'Banco di Ron',
      text: [
        'Ron sembra frustrato.',
        '"Avevo quasi fatto levitare la piuma..."',
        '"Dopo la rotazione ho continuato il movimento verso destra, ma qualcosa è andato storto."'
      ],
      unlocked: false
    },
    blackboard: {
      id: 'blackboard',
      title: 'Lavagna del Professore',
      text: [
        'Tra formule cancellate e vecchi schemi del professore noti una piccola annotazione scritta nell\'angolo inferiore:',
        '"Il gesto si conclude sempre con una lieve elevazione."'
      ],
      unlocked: false,
      hidden: true
    }
  };

  ngAfterViewInit(): void {
    if (this.currentStage === 'DESK') {
      this.initCanvas();
    }
  }
  
  openClue(key: string): void {
    if (this.clues[key]) {
      this.clues[key].unlocked = true;
      this.activeClue = this.clues[key];
    }
  }

  closeModal(): void {
    this.activeClue = null;
  }

  goToDesk(): void {
    this.currentStage = 'DESK';
    setTimeout(() => this.initCanvas(), 100);
  }

  returnToExploration(): void {
    this.currentStage = 'EXPLORATION';
  }
  // --- LOGICA CANVAS E GESTI ---

  private initCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.clearCanvas();
  }

  clearCanvas(): void {
    if (!this.ctx) return;
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawnPoints = [];
    this.feedbackMessage = SpellFeedback.IDLE;
    this.isSpellSuccess = false;
  }

  startDrawing(event: MouseEvent | TouchEvent): void {
    this.isDrawing = true;
    this.drawnPoints = [];
    this.feedbackMessage = SpellFeedback.IDLE;
    this.addPoint(event);
  }

  draw(event: MouseEvent | TouchEvent): void {
    if (!this.isDrawing) return;
    event.preventDefault();
    this.addPoint(event);
    this.renderStroke();
  }

  stopDrawing(): void {
    this.isDrawing = false;
  }

  private addPoint(event: MouseEvent | TouchEvent): void {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

    this.drawnPoints.push({
      x: clientX - rect.left,
      y: clientY - rect.top,
      time: Date.now()
    });
  }

  private renderStroke(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (this.drawnPoints.length < 2) return;

    this.ctx.beginPath();
    this.ctx.strokeStyle = '#f1c40f';
    this.ctx.lineWidth = 4;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = '#f39c12';

    this.ctx.moveTo(this.drawnPoints[0].x, this.drawnPoints[0].y);
    for (let i = 1; i < this.drawnPoints.length; i++) {
      this.ctx.lineTo(this.drawnPoints[i].x, this.drawnPoints[i].y);
    }
    this.ctx.stroke();
  }

  // --- ANALISI DEL GESTO E VERIFICA INCANTESIMO ---

  castSpell(): void {
    if (this.drawnPoints.length < 15) {
      this.feedbackMessage = SpellFeedback.NO_INITIAL_RISE;
      return;
    }

    const sequence = this.analyzeGesture(this.drawnPoints);
    this.evaluateSequence(sequence);
  }

  private analyzeGesture(points: { x: number; y: number }[]) {
    // Semplificazione del percorso in segmenti di direzione
    const segments: string[] = [];
    let hasCircle = false;

    // Rilevamento cerchio/loop (intersezione del percorso)
    for (let i = 5; i < points.length - 5; i++) {
      for (let j = i + 10; j < points.length - 5; j++) {
        const dist = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
        if (dist < 12) {
          hasCircle = true;
          break;
        }
      }
    }

    // Rilevamento direzioni temporali principali
    const start = points[0];
    const quarter = points[Math.floor(points.length * 0.25)];
    const half = points[Math.floor(points.length * 0.5)];
    const threeQuarters = points[Math.floor(points.length * 0.75)];
    const end = points[points.length - 1];

    const initialRise = quarter.y < start.y - 30; // Salita iniziale
    const rightCurve = half.x > quarter.x + 20;   // Curva a destra
    const rightSwipe = threeQuarters.x > half.x + 10; // Proseguimento a destra
    const finalRise = end.y < threeQuarters.y - 15;  // Breve salita finale

    return {
      initialRise,
      rightCurve,
      hasCircle,
      rightSwipe,
      finalRise
    };
  }
  private evaluateSequence(seq: any): void {
    if (!seq.initialRise) {
      this.feedbackMessage = SpellFeedback.NO_INITIAL_RISE;
      return;
    }
    if (!seq.rightCurve) {
      this.feedbackMessage = SpellFeedback.MISSING_CURVE;
      return;
    }
    if (!seq.hasCircle) {
      this.feedbackMessage = SpellFeedback.MISSING_CIRCLE;
      return;
    }
    if (!seq.rightSwipe) {
      this.feedbackMessage = SpellFeedback.MISSING_RIGHT_SWIPE;
      return;
    }
    if (!seq.finalRise) {
      this.feedbackMessage = SpellFeedback.MISSING_FINAL_RISE;
      return;
    }

    // Se tutti i controlli sono superati:
    this.feedbackMessage = SpellFeedback.SUCCESS;
    this.isSpellSuccess = true;
  }



}

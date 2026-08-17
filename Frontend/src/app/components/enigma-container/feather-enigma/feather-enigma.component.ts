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

    if (event.cancelable) {
      event.preventDefault();
    }

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
    /*const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;*/

    let clientX = 0;
    let clientY = 0;

    if ('touches' in event && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else if ('changedTouches' in event && event.changedTouches.length > 0) {
        clientX = event.changedTouches[0].clientX;
        clientY = event.changedTouches[0].clientY;
      } else if (event instanceof MouseEvent) {
        clientX = event.clientX;
        clientY = event.clientY;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Coordinate reali all'interno della griglia 400x300 del canvas
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    this.drawnPoints.push({
      x,
      y,
      time: Date.now()
    });

    /*
    this.drawnPoints.push({
      x: clientX - rect.left,
      y: clientY - rect.top,
      time: Date.now()
    });*/
  }


  private renderStroke(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (this.drawnPoints.length < 2) return;

    this.ctx.beginPath();
    this.ctx.strokeStyle = '#f5d142';
    this.ctx.lineWidth = 4;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = '#e2a749';

    this.ctx.moveTo(this.drawnPoints[0].x, this.drawnPoints[0].y);
    for (let i = 1; i < this.drawnPoints.length; i++) {
      this.ctx.lineTo(this.drawnPoints[i].x, this.drawnPoints[i].y);
    }
    this.ctx.stroke();
  }

  castSpell(): void {
    if (this.drawnPoints.length < 15) {
      this.feedbackMessage = SpellFeedback.NO_INITIAL_RISE;
      return;
    }

    const sequence = this.analyzeGesture(this.drawnPoints);
    this.evaluateSequence(sequence);
  }

private analyzeGesture(points: { x: number; y: number }[]) {
  const len = points.length;
  const start = points[0];

  // 1. SALITA INIZIALE
  let initialRiseIdx = 0;
  let minYInFirstHalf = start.y;

  for (let i = 1; i < Math.floor(len * 0.45); i++) {
    if (points[i].y < minYInFirstHalf) {
      minYInFirstHalf = points[i].y;
      initialRiseIdx = i;
    }
  }

  const dyInitial = start.y - minYInFirstHalf;
  const dxBeforeRise = Math.abs(points[initialRiseIdx].x - start.x);
  const initialRise = dyInitial >= 20 && dyInitial > (dxBeforeRise * 0.5);


  // 2. CURVA A DESTRA
  let maxXAfterRise = points[initialRiseIdx].x;
  for (let i = initialRiseIdx; i < Math.floor(len * 0.8); i++) {
    if (points[i].x > maxXAfterRise) {
      maxXAfterRise = points[i].x;
    }
  }

  const rightCurve = (maxXAfterRise - start.x >= 25) && (maxXAfterRise - points[initialRiseIdx].x >= 12);


  // 3. ROTAZIONE / CAPPIOLO
  let hasCircle = false;
  let loopStartIndex = -1;

  for (let i = Math.max(2, initialRiseIdx); i < len - 4; i++) {
    for (let j = i + 5; j < len - 2; j++) {
      const dist = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
      if (dist < 15) { // Tolleranza leggermente più morbida per il touch
        hasCircle = true;
        loopStartIndex = i;
        break;
      }
    }
    if (hasCircle) break;
  }


  // 4. ELEVAZIONE FINALE (Verso l'alto, non trascinato a destra)
  let finalRise = false;

  if (hasCircle && loopStartIndex > 0) {
    // Cerchiamo la "pancia" della curva: il punto più basso (Y max) raggiunto da quando inizia la rotazione in poi
    let lowestY = points[loopStartIndex].y;
    let lowestYIndex = loopStartIndex;

    for (let i = loopStartIndex; i < len; i++) {
      if (points[i].y >= lowestY) {
        lowestY = points[i].y;
        lowestYIndex = i;
      }
    }

    const endPoint = points[len - 1];
    const lowestPoint = points[lowestYIndex];

    const dyFinal = lowestPoint.y - endPoint.y; // Quanto si è saliti dal punto più basso
    const dxFinal = endPoint.x - lowestPoint.x; // Spostamento a destra dal punto più basso

    // Condizioni:
    // 1. Deve essere risalito di almeno 12px dal punto più basso
    // 2. La componente verticale verso l'alto (dyFinal) deve essere MAGGIORE dello spostamento a destra (dxFinal)
    //    (se va verso sinistra dxFinal sarà negativo/piccolo, il che va benissimo per una salita)
    finalRise = (dyFinal >= 12) && (dyFinal > dxFinal);
  }

  return {
    initialRise,
    rightCurve,
    hasCircle,
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
  if (!seq.finalRise) {
    this.feedbackMessage = SpellFeedback.MISSING_FINAL_RISE;
    return;
  }

  this.feedbackMessage = SpellFeedback.SUCCESS;
  this.isSpellSuccess = true;

  setTimeout(() => {
    this.quizSolved.emit('teasing');
  }, 5000);
}



}

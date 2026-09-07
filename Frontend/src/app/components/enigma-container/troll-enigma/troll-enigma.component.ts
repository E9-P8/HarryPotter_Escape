import { Component, EventEmitter, Output } from '@angular/core';

interface MagicNode {
  id: number;
  color: string;
  x: number; // Percentuale % rispetto alla schermata
  y: number; // Percentuale % rispetto alla schermata
  order: number;
}

@Component({
  selector: 'app-troll-enigma',
  templateUrl: './troll-enigma.component.html',
  styleUrls: ['./troll-enigma.component.css']
})
export class TrollEnigmaComponent {
@Output() quizSolved = new EventEmitter<string>();

  currentPhase: number = 1;

  // FASE 1: Stato Mazza e Tracciato
  clubFloating: boolean = false;
  isClubRising: boolean = false;
  isClubMovingToTarget: boolean = false;

  selectedColor: string | null = null;
  currentPathPoints: MagicNode[] = [];

  timeLeft: number = 50; 
  timerInterval: any = null;
  isTimerRunning: boolean = false;


  nodes: MagicNode[] = [
    // ORO ( Corretto)
    { id: 1, color: 'gold', x: 48, y: 75, order: 1 },
    { id: 2, color: 'gold', x: 48, y: 50, order: 2 },
    { id: 3, color: 'gold', x: 55, y: 45, order: 3 },
    { id: 4, color: 'gold', x: 60, y: 52, order: 4 },
    { id: 5, color: 'gold', x: 56, y: 55, order: 5 },
    { id: 6, color: 'gold', x: 63, y: 40, order: 6 },
    { id: 7, color: 'gold', x: 66, y: 25, order: 7 },

    // BLU
    { id: 8, color: 'blue', x: 25, y: 60, order: 1 },
    { id: 9, color: 'blue', x: 35, y: 40, order: 2 },
    { id: 10, color: 'blue', x: 45, y: 60, order: 3 },
    { id: 11, color: 'blue', x: 56, y: 60, order: 4 },
    { id: 12, color: 'blue', x: 50, y: 70, order: 5 },

    // VERDE
    { id: 13, color: 'green', x: 70, y: 70, order: 1 },
    { id: 14, color: 'green', x: 80, y: 60, order: 2 },
    { id: 15, color: 'green', x: 75, y: 45, order: 3 },
    { id: 16, color: 'green', x: 65, y: 30, order: 4 },

    // VIOLA
    { id: 17, color: 'purple', x: 20, y: 35, order: 1 },
    { id: 18, color: 'purple', x: 30, y: 20, order: 2 },
    { id: 19, color: 'purple', x: 60, y: 75, order: 3 },
    { id: 20, color: 'purple', x: 80, y: 15, order: 4 },
    { id: 21, color: 'purple', x: 45, y: 37, order: 5 },

    // ROSSO
    { id: 22, color: 'red', x: 70, y: 30, order: 1 },
    { id: 23, color: 'red', x: 85, y: 30, order: 2 },
    { id: 24, color: 'red', x: 40, y: 60, order: 3 },
    { id: 25, color: 'red', x: 75, y: 55, order: 4 },
    { id: 26, color: 'red', x: 55, y: 35, order: 5 }
  ];

  gridToPixelMap = [
    [ { x: 35, y: 40 }, { x: 45, y: 40 }, { x: 55, y: 40 }, { x: 65, y: 40 } ], // Riga 0 (Target Mazza)
    [ { x: 35, y: 48 }, { x: 45, y: 48 }, { x: 55, y: 48 }, { x: 65, y: 48 } ], // Riga 1
    [ { x: 35, y: 56 }, { x: 45, y: 56 }, { x: 55, y: 56 }, { x: 65, y: 56 } ], // Riga 2
    [ { x: 35, y: 64 }, { x: 45, y: 64 }, { x: 55, y: 64 }, { x: 65, y: 64 } ], // Riga 3
    [ { x: 35, y: 72 }, { x: 45, y: 72 }, { x: 55, y: 72 }, { x: 65, y: 72 } ], // Riga 4
    [ { x: 35, y: 80 }, { x: 45, y: 80 }, { x: 55, y: 80 }, { x: 65, y: 80 } ]  // Riga 5 (Partenza Troll)
  ];

  trollPos = { r: 5, c: 0 };
  trollDir: number = 1; // 0: N (↑), 1: E (→), 2: S (↓), 3: W (←)
  targetPos = { r: 0, c: 2 }; // Posizione sotto l'ombra della mazza

  isMoving: boolean = false;
  isTrollUnderClub: boolean = false;
  trollHit: boolean = false;
  trollDefeated: boolean = false;

  getTrollDirectionImage(): string {
    const dirImages: { [key: number]: string } = {
      0: 'assets/img/Part7/troll_back.png',
      1: 'assets/img/Part7/troll_right.png',
      2: 'assets/img/Part7/troll_front.png',
      3: 'assets/img/Part7/troll_left.png'
    };
    return dirImages[this.trollDir] || 'assets/img/Part7/troll_front.png';
  }
  
  

  // --- LOGICA FASE 1 ---
  selectNode(node: MagicNode): void {
    if (this.clubFloating) return;

    if (this.selectedColor !== node.color) {
      this.selectedColor = node.color;
      this.currentPathPoints = [];
    }

    const expectedOrder = this.currentPathPoints.length + 1;
    if (node.order === expectedOrder) {
      this.currentPathPoints.push(node);

      const totalNodes = this.nodes.filter(n => n.color === node.color).length;
      if (this.currentPathPoints.length === totalNodes) {
        this.validatePath();
      }
    }
  }

  isNodeSelected(node: MagicNode): boolean {
    return this.currentPathPoints.some(n => n.id === node.id);
  }

  getPolylinePoints(): string {
    const w = window.innerWidth;
    const h = window.innerHeight;
    return this.currentPathPoints.map(p => `${(p.x * w) / 100},${(p.y * h) / 100}`).join(' ');
  }

  getColorHex(color: string | null): string {
    if (!color) return '#ffffff';
    const hexMap: { [key: string]: string } = {
      gold: '#f3e17d',
      blue: '#94c4ec',
      green: '#7dd180',
      purple: '#c69dce',
      red: '#eb6b61'
    };
    return hexMap[color] || '#ffffff';
  }

  validatePath(): void {
    if (this.selectedColor === 'gold') {
      this.clubFloating = true;
      this.isClubRising = true;

      setTimeout(() => {
        this.isClubMovingToTarget = true;
      }, 1500);

      setTimeout(() => {
        this.currentPhase = 2;
        this.checkTargetMatch();
        this.startPhase2Timer();
      }, 3200);

    } else {
      setTimeout(() => {
        this.currentPathPoints = [];
        this.selectedColor = null;
      }, 1000);
    }
  }

  // --- LOGICA FASE 2 ---
  throwItem(type: 'rock' | 'wood' | 'bucket'): void {
    if (this.isMoving || this.trollHit) return;

    this.isMoving = true;

    if (type === 'rock') {
      this.moveTrollSteps(1);
    } else if (type === 'wood') {
      this.moveTrollSteps(2);
    } else if (type === 'bucket') {
      this.trollDir = (this.trollDir + 1) % 4;
    }

    setTimeout(() => {
      this.checkTargetMatch();
      this.isMoving = false;
    }, 650);
  }
  moveTrollSteps(steps: number): void {
    const dr = [-1, 0, 1, 0];
    const dc = [0, 1, 0, -1];

    let targetR = this.trollPos.r + dr[this.trollDir] * steps;
    let targetC = this.trollPos.c + dc[this.trollDir] * steps;

    this.trollPos.r = Math.max(0, Math.min(5, targetR));
    this.trollPos.c = Math.max(0, Math.min(4, targetC));
  }
  checkTargetMatch(): void {
    if (this.trollPos.r === this.targetPos.r && this.trollPos.c === this.targetPos.c) {
      this.isTrollUnderClub = true;
    } else {
      this.isTrollUnderClub = false;
    }
  }
  getTrollPixelPos() {
    return this.gridToPixelMap[this.trollPos.r][this.trollPos.c];
  }
  getTargetPixelPos() {
    return this.gridToPixelMap[this.targetPos.r][this.targetPos.c];
  }
  getTrollScale(): number {
    const minScale = 0.70; // Dimensione minima quando arriva alla riga 0
    const maxScale = 1.00; // Dimensione massima alla riga di partenza 5
    const startRow = 5;

    const progress = (startRow - this.trollPos.r) / startRow;
    return maxScale - progress * (maxScale - minScale);
  }


  startPhase2Timer(): void {
    this.timeLeft = 50;
    this.isTimerRunning = true;

    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.stopTimer();
        this.handleGameover();
      }
    }, 1000);
  }

  stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.isTimerRunning = false;
  }

  handleGameover(): void {
    if (!this.trollDefeated) {
      this.quizSolved.emit('troll_fail_harry_dangling');
    }
  }

  // formattazione "0:35"
  get formattedTime(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  smashTroll(): void {
    if (!this.isTrollUnderClub || this.trollHit) return;

    this.stopTimer();
    this.trollHit = true;

    setTimeout(() => {
      this.trollDefeated = true;
    }, 300);

    setTimeout(() => {
      this.quizSolved.emit('teachers_confrontation');
    }, 2500);
  }
  ngOnDestroy(): void {
    this.stopTimer();
  }

}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';

interface PipeTile {
  type: 'straight' | 'corner' | 'source' | 'lock';
  rotation: number; // 0, 90, 180, 270
  connections: boolean[]; // [NORD, EST, SUD, OVEST] a rotazione 0
  powered: boolean;
  isCrystal?: boolean;
}

@Component({
  selector: 'app-enigma-door',
  templateUrl: './enigma-door.component.html',
  styleUrls: ['./enigma-door.component.css']
})
export class EnigmaDoorComponent implements OnInit {

  @Output() quizSolved = new EventEmitter<string>();

  gameStarted: boolean = false;
  showIntroModal: boolean = true;
  puzzleSolved: boolean = false;
  showSpellText: boolean = false;
  doorOpening: boolean = false;

  readonly GRID_SIZE = 5;
  grid: PipeTile[][] = [];

  // Posizioni fisse per Sorgente e Serratura
  sourcePos = { r: 0, c: 0 };
  lockPos = { r: 4, c: 4 };

  constructor() { }

  ngOnInit(): void {
    this.initPuzzle();
  }
  startEnigma(): void {
    this.gameStarted = true;
    this.showIntroModal = true;
  }
  closeIntro(): void {
    this.showIntroModal = false;
  }
  initPuzzle(): void {
    // Definizione tipo di tubo per ogni cella della griglia 5x5
    const layout: PipeTile['type'][][] = [
      ['source', 'straight', 'corner', 'straight', 'corner'],
      ['corner', 'corner', 'corner', 'corner', 'corner'],
      ['straight', 'corner', 'corner', 'corner', 'straight'],
      ['corner', 'corner', 'straight', 'corner', 'corner'],
      ['corner', 'straight', 'corner', 'straight', 'lock']
    ];

    // Posizione dei 3 Cristalli Magici (Variante 1)
    const crystals = [
      { r: 0, c: 2 },
      { r: 2, c: 2 },
      { r: 4, c: 2 }
    ];

    this.grid = [];
    for (let r = 0; r < this.GRID_SIZE; r++) {
      const row: PipeTile[] = [];
      for (let c = 0; c < this.GRID_SIZE; c++) {
        const type = layout[r][c];
        const isCrystal = crystals.some(k => k.r === r && k.c === c);
        
        // Rotazione iniziale casuale (0, 90, 180, 270 gradi)
        const randomRotation = Math.floor(Math.random() * 4) * 90;

        row.push({
          type: type,
          rotation: randomRotation,
          connections: this.getBaseConnections(type),
          powered: false,
          isCrystal: isCrystal
        });
      }
      this.grid.push(row);
    }

    this.checkConnections();
  }

  private getBaseConnections(type: PipeTile['type']): boolean[] {
    // Orientamento a rotazione 0: [NORD, EST, SUD, OVEST]
    switch (type) {
      case 'straight': return [true, false, true, false]; // Linea verticale
      case 'corner': return [true, true, false, false];  // Curva NORD-EST
      case 'source': return [false, true, true, false];  // Sorgente (Est, Sud)
      case 'lock': return [true, false, false, true];    // Serratura (Nord, Ovest)
      default: return [false, false, false, false];
    }
  }

  rotateTile(r: number, c: number): void {
    if (this.puzzleSolved) return;

    this.grid[r][c].rotation = (this.grid[r][c].rotation + 90) % 360;
    this.checkConnections();
  }

  // Calcola le uscite effettive tenendo conto della rotazione del pezzo
  getOpenings(tile: PipeTile): boolean[] {
    const shift = (tile.rotation / 90) % 4;
    const base = tile.connections;
    return [
      base[(4 - shift) % 4],
      base[(5 - shift) % 4],
      base[(6 - shift) % 4],
      base[(7 - shift) % 4]
    ];
  }

  checkConnections(): void {
    // Reset dello stato di carica dei condotti
    for (let r = 0; r < this.GRID_SIZE; r++) {
      for (let c = 0; c < this.GRID_SIZE; c++) {
        this.grid[r][c].powered = false;
      }
    }

    // Algoritmo di visita della rete (BFS) partendo dalla sorgente
    const queue: { r: number; c: number }[] = [this.sourcePos];
    this.grid[this.sourcePos.r][this.sourcePos.c].powered = true;

    const directions = [
      { dr: -1, dc: 0, dir: 0, opposite: 2 }, // NORD
      { dr: 0, dc: 1, dir: 1, opposite: 3 },  // EST
      { dr: 1, dc: 0, dir: 2, opposite: 0 },  // SUD
      { dr: 0, dc: -1, dir: 3, opposite: 1 }   // OVEST
    ];

    let lockReached = false;
    let crystalsPowered = 0;

    while (queue.length > 0) {
      const current = queue.shift()!;
      const currentTile = this.grid[current.r][current.c];
      const currentOpenings = this.getOpenings(currentTile);

      if (current.r === this.lockPos.r && current.c === this.lockPos.c) {
        lockReached = true;
      }

      if (currentTile.isCrystal) {
        crystalsPowered++;
      }

      for (const d of directions) {
        const nr = current.r + d.dr;
        const nc = current.c + d.dc;

        if (nr >= 0 && nr < this.GRID_SIZE && nc >= 0 && nc < this.GRID_SIZE) {
          const neighbor = this.grid[nr][nc];
          
          if (!neighbor.powered && currentOpenings[d.dir]) {
            const neighborOpenings = this.getOpenings(neighbor);
            if (neighborOpenings[d.opposite]) {
              neighbor.powered = true;
              queue.push({ r: nr, c: nc });
            }
          }
        }
      }
    }

    // Risolto solo se raggiunge la serratura E passa da tutti e 3 i cristalli
    if (lockReached && crystalsPowered === 3 && !this.puzzleSolved) {
      this.puzzleSolved = true;
    }
  }

  castAlohomora(): void {
  this.gameStarted = false;

  setTimeout(() => {
    this.showSpellText = true;
  }, 1000);

  setTimeout(() => {
    this.doorOpening = true;
  }, 3000);

  setTimeout(() => {
    this.quizSolved.emit('Gazza');
  }, 4500);
}
}

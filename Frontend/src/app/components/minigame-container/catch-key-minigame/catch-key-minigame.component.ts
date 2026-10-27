import { Component, OnInit, 
  OnDestroy, Output, EventEmitter, Input} from '@angular/core';

interface KeyTarget {
  id: number;
  top: string;
  left: string;
  scale: number;
  isTarget: boolean;
  duration: string;
  delay: string;
  animType: number;
}

@Component({
  selector: 'app-catch-key-minigame',
  templateUrl: './catch-key-minigame.component.html',
  styleUrls: ['./catch-key-minigame.component.css']
})
export class CatchKeyMinigameComponent implements OnInit {
  @Input() keyImageSrc: string = 'assets/img/final_part/key.png';
  @Input() broomImageSrc: string = 'assets/img/final_part/broom_handle.png';

  @Output() minigameSolved = new EventEmitter<string>();
  @Output() minigameFailed = new EventEmitter<string>();

  keysList: KeyTarget[] = [];
  timeLeft: number = 35; 
  attemptsLeft: number = 3; 
  
  isGameActive: boolean = true;
  isShaking: boolean = false;
  
  private timerInterval: any;
  constructor() { }

  ngOnInit(): void {
    this.initGame();
  }

  ngOnDestroy(): void {
    this.clearIntervals();
  }

  private initGame(): void {
    this.generateKeys();
    this.startTimer();
  }

  private generateKeys(): void {
    this.keysList = [];
    const totalKeys = 55; 
    const targetIndex = Math.floor(Math.random() * totalKeys);

    for (let i = 0; i < totalKeys; i++) {
      this.keysList.push({
        id: i,
        top: `${Math.floor(Math.random() * 65) + 5}%`, 
        left: `${Math.floor(Math.random() * 90) + 5}%`,
        scale: parseFloat((Math.random() * 0.4 + 0.5).toFixed(2)), // Dimensioni assortite per dare profondità
        isTarget: i === targetIndex,
        duration: `${(Math.random() * 1.5 + 1.0).toFixed(1)}s`, // Sfrecciano anche più velocemente
        delay: `${(Math.random() * 2).toFixed(1)}s`,
        animType: Math.floor(Math.random() * 4) + 1
      });
    }
  }

  private startTimer(): void {
    this.clearIntervals();
    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.handleTimeOut();
      }
    }, 1000);
  }
  onKeyClick(key: KeyTarget): void {
    if (!this.isGameActive) return;

    if (key.isTarget) {
      this.handleSuccess();
    } else {
      this.handleWrongAttempt();
    }
  }

  private handleSuccess(): void {
    this.isGameActive = false;
    this.clearIntervals();

    // Piccolo ritardo scenico per far apprezzare la presa prima di emettere l'evento
    setTimeout(() => {
      this.minigameSolved.emit('keys_attacking');
    }, 500);
  }

  private handleWrongAttempt(): void {
    this.attemptsLeft--;
    this.triggerShakeEffect();

    if (this.attemptsLeft <= 0) {
      this.handleFailure();
    }
  }
  private handleTimeOut(): void {
    this.attemptsLeft--;
    this.triggerShakeEffect();

    if (this.attemptsLeft <= 0) {
      this.handleFailure();
    } else {
      this.timeLeft = 35;
      this.generateKeys();
    }
  }

  private triggerShakeEffect(): void {
    this.isShaking = true;
    setTimeout(() => {
      this.isShaking = false;
    }, 400);
  }

  private handleFailure(): void {
    this.isGameActive = false;
    this.clearIntervals();
    this.minigameFailed.emit('flying_keys');
  }

  private clearIntervals(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

}

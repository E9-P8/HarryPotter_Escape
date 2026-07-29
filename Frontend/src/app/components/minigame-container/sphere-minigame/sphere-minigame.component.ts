import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sphere-minigame',
  templateUrl: './sphere-minigame.component.html',
  styleUrls: ['./sphere-minigame.component.css']
})
export class SphereMinigameComponent implements OnInit {

  constructor() { }

  @Output() minigameSolved = new EventEmitter<string>();

  showSphere: boolean = false;
  spherePosX: number = 50;
  spherePosY: number = 50;
  catchTimer: number = 10;

  private gameTimer: any;
  private sphereInterval: any;

  ngOnInit(): void {
    this.startSphereMinigame();
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  startSphereMinigame() {
    this.catchTimer = 5;
    this.showSphere = true;
    this.moveSphereRandomly();

    this.sphereInterval = setInterval(() => {
      this.moveSphereRandomly();
    }, 400);

    // Timer alla rovescia
    this.gameTimer = setInterval(() => {
      this.catchTimer--;
      if (this.catchTimer <= 0) {
        this.endMinigame(false); 
      }
    }, 1000);
  }

  moveSphereRandomly() {
    this.spherePosX = Math.floor(Math.random() * 70) + 15; 
    this.spherePosY = Math.floor(Math.random() * 50) + 20; 
  }

  catchSphereSuccess() {
    this.endMinigame(true); 
  }

  endMinigame(success: boolean) {
    this.clearTimers();
    this.showSphere = false;

    const targetNode = success ? 'mcgranitt_reprimand' : 'malfoy_volo';
    this.minigameSolved.emit(targetNode);
  }

  clearTimers() {
    if (this.gameTimer) clearInterval(this.gameTimer);
    if (this.sphereInterval) clearInterval(this.sphereInterval);
  }
}

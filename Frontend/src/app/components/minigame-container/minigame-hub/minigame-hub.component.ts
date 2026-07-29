import { Component, OnInit, Type, Input,Output, EventEmitter } from '@angular/core';
import { SphereMinigameComponent } from '../sphere-minigame/sphere-minigame.component';

@Component({
  selector: 'app-minigame-hub',
  templateUrl: './minigame-hub.component.html',
  styleUrls: ['./minigame-hub.component.css']
})
export class MinigameHubComponent implements OnInit {

  @Input() minigameId: string = '';
  @Output() minigameSolved = new EventEmitter<string>();
  
  constructor() { }

  ngOnInit(): void {
  }

  get componentToLoad(): Type<any> | null {
    switch (this.minigameId) {
      case 'SPHERE_MINIGAME': return SphereMinigameComponent;
      default: return null;
    }
  }
  onMiniGameSolved(nextNode: string) {
    this.minigameSolved.emit(nextNode);
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AudioService } from '../../../services/audio.service';

@Component({
  selector: 'app-part2',
  templateUrl: './part2.component.html',
  styleUrls: ['./part2.component.css']
})
export class Part2Component implements OnInit { 

  constructor(private router: Router, public audioService : AudioService) { }

  actualFase: 'firePlace' | 'lightHouse' | 'diagonAlley' | 'letter' = 'letter';

  toggleAudio(): void {
  this.audioService.toggleGlobalMute(0.2);
  }

  ngOnInit(): void {
  }

}

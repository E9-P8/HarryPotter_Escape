import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AudioService } from '../../../services/audio.service';

@Component({
  selector: 'app-part7',
  templateUrl: './part7.component.html',
  styleUrls: ['./part7.component.css']
})
export class Part7Component implements OnInit {

  constructor(private router: Router, public audioService : AudioService) { }

  toggleAudio(): void {
  this.audioService.toggleGlobalMute(0.2);
  }

  ngOnInit(): void {
  }

}

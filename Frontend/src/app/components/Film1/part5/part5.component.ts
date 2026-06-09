import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AudioService } from '../../../services/audio.service';

@Component({
  selector: 'app-part5',
  templateUrl: './part5.component.html',
  styleUrls: ['./part5.component.css']
})
export class Part5Component implements OnInit {

  constructor(private router: Router, public audioService : AudioService) { }

  toggleAudio(): void {
  this.audioService.toggleGlobalMute(0.2);
  }

  ngOnInit(): void {
  }

}

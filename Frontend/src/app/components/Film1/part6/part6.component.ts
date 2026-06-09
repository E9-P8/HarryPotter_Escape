import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AudioService } from '../../../services/audio.service';

@Component({
  selector: 'app-part6',
  templateUrl: './part6.component.html',
  styleUrls: ['./part6.component.css']
})
export class Part6Component implements OnInit {

  constructor(private router: Router, public audioService : AudioService) { }

  toggleAudio(): void {
  this.audioService.toggleGlobalMute(0.2);
  }

  ngOnInit(): void {
  }

}

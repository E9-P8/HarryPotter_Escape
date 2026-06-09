import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AudioService } from '../../../services/audio.service';

@Component({
  selector: 'app-part4',
  templateUrl: './part4.component.html',
  styleUrls: ['./part4.component.css']
})
export class Part4Component implements OnInit {

  constructor(private router: Router, public audioService : AudioService) { }

  toggleAudio(): void {
  this.audioService.toggleGlobalMute(0.2);
  }

  ngOnInit(): void {
  }

}

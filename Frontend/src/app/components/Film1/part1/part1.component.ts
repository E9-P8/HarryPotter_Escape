import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-part1',
  templateUrl: './part1.component.html',
  styleUrls: ['./part1.component.css']
})
export class Part1Component implements OnInit {

  constructor() { }

  isBlackScreen: boolean = true;     
  isFadeOutActive: boolean = false;   
  isVideoPlaying: boolean = false;    
  isGameplayReady: boolean = false;  

  bgAudio!: HTMLAudioElement;

  ngOnInit(): void {
    this.startIntroSequence();
  } 

  startIntroSequence() {
    this.bgAudio = new Audio('assets/audio/intro_ambience.mp3'); 
    this.bgAudio.volume = 0.7;
    this.bgAudio.play().catch(err => console.log("Audio bloccato dal browser, richiede interazione:", err));

    setTimeout(() => {
      this.isFadeOutActive = true;
    }, 3000);
    setTimeout(() => {
      this.isBlackScreen = false;
      this.isVideoPlaying = true;
    }, 4500); 
  }
  onVideoEnd() {
    this.isVideoPlaying = false;
    this.isGameplayReady = true;
    this.bgAudio.pause();
  }
 

}

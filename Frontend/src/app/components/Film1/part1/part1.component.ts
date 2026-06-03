import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-part1',
  templateUrl: './part1.component.html',
  styleUrls: ['./part1.component.css']
})
export class Part1Component implements OnInit {


  constructor() { }

  @ViewChild('roomViewport') roomViewport!: ElementRef;

  isBlackScreen: boolean = true;     
  isFadeOutActive: boolean = false;   
  isVideoPlaying: boolean = false;    
  isGameplayReady: boolean = false;  
  HarrysAlarm : boolean = true;

  actualFase: 'understairs' | 'kitchen' | 'reptiles' = 'understairs';

  bgAudio!: HTMLAudioElement;

  isRoomIlluminated: boolean = false; 
  flashlightStyle: string = 'radial-gradient(circle 120px at -999px -999px, transparent 100%, black 100%)';


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

      setTimeout(() => {
      this.isGameplayReady = false;
      this.HarrysAlarm= false;

      setTimeout(() => {
        if (this.roomViewport) {

          const element = this.roomViewport.nativeElement;
          element.scrollLeft = (element.scrollWidth - element.clientWidth) / 2;
          element.scrollTop = (element.scrollHeight - element.clientHeight) / 2;
          element.focus();
        }
      }, 50);

      }, 3000);
  }
  updateFlashlight(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.flashlightStyle = `radial-gradient(circle 120px at ${x}px ${y}px, transparent 80%, black 100%)`;
  }
  updateFlashlightTouch(event: TouchEvent) {
      if (event.touches.length === 0) return;
      const touch = event.touches[0];
      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      this.flashlightStyle = `radial-gradient(circle 120px at ${x}px ${y}px, transparent 80%, black 100%)`;
    }

  findGlasses() {
    this.isRoomIlluminated = true;
  }
  openDoor(){
    if(this.isRoomIlluminated === true ){
        setTimeout(() => {
          this.actualFase = 'kitchen';
        }, 1500);
  }}
}

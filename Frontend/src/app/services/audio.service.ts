import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private sounds: { [key: string]: string } = {
    forest: 'assets/sound/Forest_sound.mp3', 
    mistery: 'assets/sound/hitslab-mystery-magic-harry-potter-music-390835.mp3',
    hogwartsExpress: 'assets/sound/HogwartsExpress.mp3',
    intro: 'assets/sound/Intro_sound.mp3',
    motorcycle: 'assets/sound/Motorcycle.mp3' ,
    parchment:'assets/sound/Parchment_sound.mp3',
    schoolOfMagic:'assets/sound/SchoolOfMagic.mp3',
    switchOnOff:'assets/sound/SwitchOnOffLamp.mp3',
    wizard:'assets/sound/TheMischievousWizard.mp3',
    timeMachine :'assets/sound/TimeMachine.mp3',
    traformation:'assets/sound/Trasformation.mp3',
    writingPen:'assets/sound/WritingPen.mp3'

  };
  private activeAudios: { [key: string]: HTMLAudioElement } = {};

  constructor() {
    this.preloadSounds();
   }

   private preloadSounds(): void {
    Object.keys(this.sounds).forEach(key => {
      const audio = new Audio(this.sounds[key]);
      audio.preload = 'auto';
      this.activeAudios[key] = audio;
    });
  }

  playSound(soundName: string, volume: number = 0.5, loop: boolean = false): void {
    const audioUrl = this.sounds[soundName];
    
    if (!audioUrl) return;
    if (this.activeAudios[soundName]) {
      this.activeAudios[soundName].pause();
    }

    const audio = new Audio(audioUrl);
    audio.volume = volume;
    audio.loop = loop; 

    this.activeAudios[soundName] = audio;

    audio.play().catch(error => console.warn(`Errore play:`, error));
  }

  
  pauseSound(soundName: string): void {
    const audio = this.activeAudios[soundName];
    if (audio) {
      audio.pause();
    }
  }

  stopSound(soundName: string): void {
    const audio = this.activeAudios[soundName];
    if (audio) {
      audio.pause();
      audio.currentTime = 0; 
      delete this.activeAudios[soundName];
    }
  }

  stopAllSounds(): void {
    Object.keys(this.activeAudios).forEach(key => {
      this.activeAudios[key].pause();
    });
    this.activeAudios = {};
  }
}

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
    writingPen:'assets/sound/WritingPen.mp3',
    kitchenTimer1: 'assets/sound/kitchenTimer1.mp3',
    kitchenTimer2: 'assets/sound/kitchenTimer2.mp3',
    doorOpening:'assets/sound/doorOpening.mp3',
    car:'assets/sound/car.mp3',
    kiss: 'assets/sound/ZiaKiss.mp3',
    snake_hiss: 'assets/sound/snake.mp3'

  };
  private activeAudios: { [key: string]: HTMLAudioElement } = {};
  public isMuted: boolean = true;
  private currentBackgroundKey: string = 'intro';
  private kitchenTimer1: boolean = true;

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
  startGlobalBackground(soundName: string, volume: number = 0.2): void {
    this.currentBackgroundKey = soundName;
    const audio = this.activeAudios[soundName];
    
    if (!audio) return;

    audio.loop = true;
    audio.volume = volume;

    if (!this.isMuted && audio.paused) {
      audio.play().catch(err => console.log("Autoplay bloccato:", err));
    }
  }

toggleGlobalMute(volumeIfPlaying: number = 0.2): void {
    const audio = this.activeAudios[this.currentBackgroundKey];
    if (!audio) return;

    if (this.isMuted) {
      this.isMuted = false;
      audio.volume = volumeIfPlaying;
      audio.play().catch(err => console.warn("Interazione richiesta:", err));
    } else {
      this.isMuted = true;
      audio.pause();
    }
  }

  playSound(soundName: string, volume: number = 0.5, loop: boolean = false): void {
    if (this.isMuted) return;
    
    if (loop) {
      const audio = this.activeAudios[soundName];
      if (audio) {
        audio.loop = true;
        audio.volume = volume;
        if (audio.paused) {
          audio.play().catch(error => console.warn(`Errore riproduzione loop ${soundName}:`, error));
        }
      }
      return;
    }

    const audioUrl = this.sounds[soundName];
    if (!audioUrl) return;

    if (this.activeAudios[soundName] && soundName !== this.currentBackgroundKey) {
      this.activeAudios[soundName].pause();
    }

    const audio = new Audio(audioUrl);
    audio.volume = volume;
    audio.loop = loop; 

    if (!this.isMuted) {
      audio.play().catch(error => console.warn(`Errore SFX:`, error));
    }
  }

  pauseSound(soundName: string): void {
    const audio = this.activeAudios[soundName];
    if (audio) audio.pause();
  }
  stopSound(soundName: string): void {
  const audio = this.activeAudios[soundName];
  if (audio) {
    audio.pause();
    audio.currentTime = 0; 
  }
}

  stopAllSounds(): void {
    Object.keys(this.activeAudios).forEach(key => {
      this.activeAudios[key].pause();
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameDataService } from '../../services/game-data.service';
import { AudioService } from '../../services/audio.service';

interface Particle {
  id: number;
  style: {
    width: string;
    height: string;
    left: string;
    top: string;
    animationDuration: string;
  };
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {


  showOverlay: boolean = true;       
  hideOverlayDOM: boolean = false;   
  isParchmentOpen: boolean = false;  

  fullStoryText: string = '';
  displayedText: string = '';
  private typewriterTimeout: any;

  wizardName = "";
  showInsertName : boolean = false; 

  particles: Particle[] = [];
  private particleInterval: any;
  private idCounter = 0;

  constructor(private router: Router, private gameData: GameDataService, private audioService: AudioService) { }

  ngOnInit(): void {
    this.particleInterval = setInterval(() => {
      this.createParticle();
    }, 500);

    this.prepareIntroText();
    this.startIntroSequence();
  }

  createParticle() {
    const size = Math.random() * 5 + 3;
    const newId = this.idCounter++;

    const newParticle: Particle = {
      id: newId,
      style: {
        width: `${size}px`,
        height: `${size}px`,
        left: `${Math.random() * 100}vw`,
        top: `${Math.random() * 100}vh`,
        animationDuration: `${Math.random() * 3 + 2}s`
      }
    };

    this.particles.push(newParticle);

    setTimeout(() => {
      this.particles = this.particles.filter(p => p.id !== newId);
    }, 5000);
  }
  ngOnDestroy(): void {
    if (this.particleInterval) {
      clearInterval(this.particleInterval);
    }
  }

  prepareIntroText() {
    this.fullStoryText = 
      "Sette anni di oscuri misteri, trappole e incantesimi ti attendono.\n\n" +
      "In questa avventura interattiva, rivivrai la storia passo dopo passo a fianco di Harry Potter, affrontando le sfide che hanno segnato il suo destino.\n\n" +
      "Per superare gli ostacoli che incontrerete, la magia da sola non basterà: dovrai attingere al potere dell'ingegno e usare la logica babbana per risolvere gli enigmi più complessi.\n\n" +
      "Preparati a dimostrare il tuo valore. Il viaggio nel Mondo Magico comincia da qui.";
  }
  startIntroSequence() {
    setTimeout(() => {
      this.showOverlay = false;
      setTimeout(() => {
        this.hideOverlayDOM = true;
        this.isParchmentOpen = true;
        this.audioService.playSound('writingPen', 0.6);
        setTimeout(() => {
          this.typeWriter(0);
        }, 800);

      }, 1000);
    }, 3000);
  }
  typeWriter(index: number) {
    if (index < this.fullStoryText.length) {
      this.displayedText += this.fullStoryText.charAt(index);
      this.typewriterTimeout = setTimeout(() => {
        this.typeWriter(index + 1);
      }, 30); 
    } else {
      this.audioService.stopSound('writingPen');
     }
  }

  isTextWritingComplete(): boolean {
    return this.displayedText.length === this.fullStoryText.length;
  }

  registration(){
    this.showInsertName = true;
    this.audioService.playSound('parchment', 0.6);
  }

  startGame(){
   
  if (this.wizardName && this.wizardName.trim() !== '') {
    this.gameData.wizardName = this.wizardName;
    this.gameData.currentWelcomeStep = 1; 
    this.router.navigate(['/welcome']);   
  } else {
    alert("Devi inserire il tuo nome per iniziare l'avventura!");
  }
   }

}

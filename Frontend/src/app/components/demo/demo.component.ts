import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit, OnDestroy {

  showOverlay: boolean = true;
  hideOverlayDOM: boolean = false;
  isVideoStarted: boolean = false;
  isVideoFinished: boolean = false;

  isParchmentOpen: boolean = false;
  fullStoryText: string = '';
  displayedText: string = '';
  private typewriterTimeout: any;

  wizardName: string = '';
  showInsertName: boolean = false;
  isPart7Active: boolean = false;

  showLens: boolean = false;
  isLensOpen: boolean = false;
  isLensTransited: boolean = false;
  private lensTimeouts: any[] = [];

  particles: Particle[] = [];
  private particleInterval: any;
  private idCounter = 0;

  isDemoEnded: boolean = false;
  isFullGameReady: boolean = false; 
  mirrorProfileImage: string = '';

  showBookTitle: boolean = false;
  isZooming: boolean = false;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gameData: GameDataService,
    public audioService: AudioService
  ) {}

  ngOnInit(): void {
    this.setDemoManifest();

    if (this.router.url.includes('demo/End') || this.route.snapshot.queryParams['ended'] === 'true') {
      this.isDemoEnded = true;

      // Recupera l'immagine salvata
      const queryImg = this.route.snapshot.queryParams['profileImg'];
      if (queryImg) {
        this.mirrorProfileImage = queryImg;
        this.gameData.setMirrorProfileImage(queryImg);
      } else {
        this.mirrorProfileImage = this.gameData.getMirrorProfileImage();
      }

      // Recupera il nome del mago
      this.wizardName = this.gameData.getWizardName() || this.gameData.wizardName || '';

      localStorage.removeItem('hp_demo_save');
    }

    // Avvia le particelle e il testo di intro solo se la demo NON è finita
    this.particleInterval = setInterval(() => {
      this.createParticle();
    }, 500);

    if (!this.isDemoEnded) {
      this.prepareIntroText();
    }
  }

  private setDemoManifest(): void {
    let manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    if (manifestLink) {
      manifestLink.setAttribute('href', 'assets/manifest-demo.webmanifest');
    }
  }

  ngOnDestroy(): void {
    if (this.particleInterval) {
      clearInterval(this.particleInterval);
    }
    if (this.typewriterTimeout) {
      clearTimeout(this.typewriterTimeout);
    }
    this.lensTimeouts.forEach(t => clearTimeout(t));
  }

  get containerStyle(): Record<string, string> {
    let imagePath = this.mirrorProfileImage || this.gameData.getMirrorProfileImage();

    if (!imagePath) {
      imagePath = 'assets/img/Part7/memories/vision-knowledge.png';
    }

    let formattedPath = imagePath;
    if (!formattedPath.startsWith('/') && !formattedPath.startsWith('http')) {
      formattedPath = '/' + formattedPath;
    }

    return {
      'background-image': `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.85)), url(${formattedPath})`
    };
  }

  private enableDemoState(): void {
    const demoFlags: Record<string, boolean> = {
      studentManualRead: true,
      knowledgeInterest: true,
      riskTaker: true,
      isSeeker: true,
      wantsRecognition: true,
      followedFriends: true,
      visited3HeadsDog: true,
    };

    Object.keys(demoFlags).forEach((flagKey) => {
      this.gameData.setFlag(flagKey, demoFlags[flagKey]);
    });
  }

  toggleAudio(): void {
    this.audioService.toggleGlobalMute(0.1);
  }

  createParticle(): void {
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

  playIntroVideo(videoElement: HTMLVideoElement): void {
    this.isVideoStarted = true;
    this.audioService.isMuted = false;

    videoElement.play().catch(err => {
      console.error("Errore durante la riproduzione del video:", err);
    });
  }


  onVideoTimeUpdate(videoElement: HTMLVideoElement): void {
    if (!videoElement.duration) return;

    const timeRemaining = videoElement.duration - videoElement.currentTime;

    // 1. Mostra il titolo quando mancano meno di 4 secondi
    if (timeRemaining <= 5 && timeRemaining > 0.3 && !this.showBookTitle) {
      this.showBookTitle = true;
    }

    // 2. Attiva lo zoom/dissolvenza in concomitanza con lo zoom del libro negli ultimi 1.8 secondi
    if (timeRemaining <= 3.8 && !this.isZooming) {
      this.isZooming = true;
    }
  }

  onVideoEnded(): void {
    this.showOverlay = false;
    this.showBookTitle = false;
    this.isZooming = false;

    setTimeout(() => {
      this.hideOverlayDOM = true;
      this.isVideoFinished = true;
      this.audioService.startGlobalBackground('intro', 0.1);
      this.startParchmentSequence();
    }, 500);
  }

  startParchmentSequence(): void {
    this.isParchmentOpen = true;
    this.audioService.playSound('writingPen', 0.8);

    setTimeout(() => {
      this.typeWriter(0);
    }, 800);
  }

  prepareIntroText(): void {
    this.fullStoryText =
      "Sette anni di oscuri misteri, trappole e incantesimi ti attendono.\n\n" +
      "In questa avventura interattiva, rivivrai la storia passo dopo passo a fianco di Harry Potter, affrontando le sfide che hanno segnato il suo destino.\n\n" +
      "Per superare gli ostacoli che incontrerete, la magia da sola non basterà: dovrai attingere al potere dell'ingegno e usare la logica babbana per risolvere gli enigmi più complessi.\n\n" +
      "Preparati a dimostrare il tuo valore. Il viaggio nel Mondo Magico comincia da qui.";
  }

  typeWriter(index: number): void {
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

  registration(): void {
    this.audioService.stopSound('writingPen');
    this.showInsertName = true;
    this.audioService.playSound('parchment', 0.6);
  }

  startGame(): void {
    if (this.wizardName && this.wizardName.trim() !== '') {
      this.gameData.setWizardName(this.wizardName.trim());

      this.showLens = true;

      const tOpen = setTimeout(() => {
        this.isLensOpen = true;
      }, 100);
      this.lensTimeouts.push(tOpen);

    } else {
      alert("Devi inserire il tuo nome per iniziare l'avventura!");
    }
  }

  startPart7(): void {
    const demoFlags: Record<string, boolean> = {
      studentManualRead: true,
      knowledgeInterest: true,
      riskTaker: true,
      isSeeker: true,
      wantsRecognition: true,
      followedFriends: true,
      visited3HeadsDog: true,
      friendshipChoice: true,
      hermioneRescued: true,
      protectFriends: true,
      suspectsSnape: true,
      knowsFlamel: true,
      enteredRestrictedSection: true,
      mirrorRevealed: true
    };

    this.gameData.initDemoSession(demoFlags);

    this.isLensOpen = false; 
    this.isLensTransited = true;
    if (this.audioService) {
      this.audioService.playSound('timeMachine');
    }
    const tNav = setTimeout(() => {
      if (this.audioService) {
        this.audioService.stopSound('timeMachine');
      }
      this.router.navigate(['demo/Misteri-e-pericoli-di-Hogwarts']);
      this.isPart7Active = true;
    }, 1500);

    this.lensTimeouts.push(tNav);
  }


  startFullGame(): void {
    localStorage.removeItem('hp_demo_save');
    localStorage.removeItem('hp_game_save');
    this.gameData.isDemoMode = false;

    this.router.navigate(['/welcome']).then(() => {
      location.reload();
    });
  }


  quitDemoToMenu(): void {
    localStorage.removeItem('hp_demo_save');
    localStorage.removeItem('hp_demo_mirror_img');
    this.gameData.setWizardName('');
    
    this.router.navigate(['/']).then(() => {
      location.reload();
    });
  }
}
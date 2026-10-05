import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { GameDataService } from '../../../services/game-data.service';

type MirrorPhase =
  | 'entrance'
  | 'covered'
  | 'revealing'
  | 'memories'
  | 'vision';

type VisionType =
  | 'friendship'
  | 'knowledge'
  | 'courage'
  | 'ambition'
  | 'adventure';

interface MirrorVision {
  type: VisionType;
  title: string;
  text: string[];
  image: string;
}

interface MemoryFragment {
  image: string;
  label?: string;
}

@Component({
  selector: 'app-mirror-reveal',
  templateUrl: './mirror-reveal.component.html',
  styleUrls: ['./mirror-reveal.component.css']
})
export class MirrorRevealComponent implements OnInit, OnDestroy {

  @Output() quizSolved = new EventEmitter<string>();

  phase: MirrorPhase = 'entrance';
  profile: any = {};
  flags: any = {};
  finalVision: MirrorVision | null = null;
  currentMemory: MemoryFragment | null = null;
  currentMemoryIndex = -1;
  curtainOpen = false;
  mirrorGlow = false;
  visionReady = false;

  // Stato per l'animazione del Boccino d'Oro
  snitchActive = false;

  private timers: any[] = [];
  memoryFragments: MemoryFragment[] = [];

  visions: { [key in VisionType]: MirrorVision } = {
    friendship: {
      type: 'friendship',
      title: 'AMICIZIA',
      image: 'assets/img/Part7/memories/vision-friendship.png',
      text: [
        'Non vedi fama.',
        'Non vedi ricchezze.',
        'Vedi persone che affrontano il mondo insieme.',
        'Per te il valore più importante è non essere mai solo.'
      ]
    },
    knowledge: {
      type: 'knowledge',
      title: 'CONOSCENZA',
      image: 'assets/img/Part7/memories/vision-knowledge.png',
      text: [
        'Lo specchio non mostra persone.',
        'Mostra risposte.',
        'Segreti.',
        'Conoscenza.',
        'Desideri comprendere ciò che è nascosto agli altri.'
      ]
    },
    courage: {
      type: 'courage',
      title: 'CORAGGIO',
      image: 'assets/img/Part7/memories/vision-courage.png',
      text: [
        'Non desideri una strada facile.',
        'Desideri la forza di affrontare qualsiasi ostacolo.',
        'Anche quando tutti gli altri avrebbero rinunciato.'
      ]
    },
    ambition: {
      type: 'ambition',
      title: 'AMBIZIONE',
      image: 'assets/img/Part7/memories/vision-ambition.png',
      text: [
        'Lo specchio mostra trionfi.',
        'Riconoscimenti.',
        'Applausi.',
        'Desideri lasciare il segno nel mondo.'
      ]
    },
    adventure: {
      type: 'adventure',
      title: 'AVVENTURA',
      image: 'assets/imgPart7/memories/vision-adventure.png',
      text: [
        'Il tuo viaggio è appena iniziato.',
        'Ci sono ancora innumerevoli luoghi da scoprire.',
        'E desideri vedere cosa si trova oltre l\'orizzonte.'
      ]
    }
  };

  constructor(private gameDataService: GameDataService) {
    console.log('MIRROR COMPONENT CREATO');
  }

  ngOnInit(): void {
    console.log('MIRROR ON INIT');

    this.profile = this.gameDataService.getPlayerProfile
      ? this.gameDataService.getPlayerProfile()
      : {};

    this.flags = this.gameDataService.getFlags
      ? this.gameDataService.getFlags()
      : {};

    console.log('[MIRROR] Player profile:', this.profile);
    console.log('[MIRROR] Flags:', this.flags);

    this.finalVision = this.determineVision();

    // 2. Prepara le diapositive
    this.prepareMemoryFragments();

    console.log('[MIRROR] Vision:', this.finalVision);
  }

  /* FASE 1: Entrata & Telo */

  approachMirror(): void {
    this.phase = 'covered';
  }

  removeCurtain(): void {
    if (this.curtainOpen) return;

    this.curtainOpen = true;

    const timer = setTimeout(() => {
      this.phase = 'revealing';
      this.mirrorGlow = true;
    }, 1500);

    this.timers.push(timer);
  }

  observeMirror(): void {
    this.startMagicalAnalysis();
  }

  private startMagicalAnalysis(): void {
    this.phase = 'memories';

    // Il Boccino d'Oro appare sempre o se elegibile come Easter Egg
    if (this.showEgg('isSeeker')) {
      this.triggerSnitchLoop();
    }

    if (this.memoryFragments.length === 0) {
      const timer = setTimeout(() => {
        this.showFinalVision();
      }, 2500);
      this.timers.push(timer);
      return;
    }

    this.currentMemoryIndex = 0;
    this.showMemory(this.currentMemoryIndex);
  }

  showMemory(index: number): void {
    if (index >= this.memoryFragments.length) {
      this.currentMemory = null;
      const timer = setTimeout(() => {
        this.showFinalVision();
      }, 1500);
      this.timers.push(timer);
      return;
    }

    this.currentMemory = this.memoryFragments[index];

    const timer = setTimeout(() => {
      this.currentMemory = null;
      const nextTimer = setTimeout(() => {
        this.currentMemoryIndex++;
        this.showMemory(this.currentMemoryIndex);
      }, 100);
      this.timers.push(nextTimer);
    }, 3500);

    this.timers.push(timer);
  }

  private triggerSnitchLoop(): void {
    const delay = Math.floor(Math.random() * 1000) + 800;

    const timer = setTimeout(() => {
      this.snitchActive = true;

      const resetTimer = setTimeout(() => {
        this.snitchActive = false;

        if (this.phase === 'memories') {
          this.triggerSnitchLoop();
        }
      }, 3500);

      this.timers.push(resetTimer);
    }, delay);

    this.timers.push(timer);
  }


  showEgg(eggKey: string): boolean {
    const vision = this.finalVision ? this.finalVision : this.determineVision();
    const visionType = vision.type;

    const profileFlagsMap: { [key in VisionType]?: string[] } = {
      friendship: [
        'hermioneRescued',
        'friendshipChoice',
        'protectFriends',
        'followedFriends'
      ],
      knowledge: [
        'studentManualRead',
        'knowledgeInterest',
        'examinedAllQuidditchObjects',
        'visited3HeadsDog'
      ],
      courage: [
        'riskTaker',
        'enteredRestrictedSection',
        'hermioneRescued'
      ],
      ambition: [
        'isSeeker',
        'wantsRecognition'
      ],
      adventure: []
    };

    const isEggEligibleForVision = (
      (eggKey === 'isSeeker' && ['friendship', 'knowledge', 'courage'].includes(visionType)) ||
      (eggKey === 'visited3HeadsDog' && ['friendship', 'courage', 'ambition'].includes(visionType)) ||
      (eggKey === 'hermioneRescued' && ['knowledge', 'courage', 'ambition'].includes(visionType)) ||
      (eggKey === 'enteredRestrictedSection' && ['knowledge', 'ambition'].includes(visionType))
    );

    if (!isEggEligibleForVision) {
      return false;
    }

    const currentProfileFlags = profileFlagsMap[visionType] || [];
    const belongsToCurrentProfile = currentProfileFlags.includes(eggKey);

    if (!belongsToCurrentProfile) {
      return true;
    }
    const hasUserFlag = this.flag(eggKey);
    return !hasUserFlag;
  }

  hasEasterEgg(flagName: string): boolean {
    return this.flag(flagName);
  }


  private prepareMemoryFragments(): void {
    const memories: MemoryFragment[] = [];
    const addedImages = new Set<string>();

    const addMemory = (imgPath: string) => {
      if (!addedImages.has(imgPath)) {
        addedImages.add(imgPath);
        memories.push({ image: imgPath });
      }
    };

    const vision = this.finalVision ? this.finalVision : this.determineVision();
    const visionType = vision.type;

    // Mappa esclusiva per ciascuna categoria (Solo immagini cartella memories/)
    const profileMemoriesMap: { [key in VisionType]?: { flag: string; image: string }[] } = {
      friendship: [
        { flag: 'friendshipChoice', image: 'assets/img/Part7/memories/friendshipChoice.png' },
        { flag: 'hermioneRescued', image: 'assets/img/Part7/memories/hermione-troll.png' },
        { flag: 'protectFriends', image: 'assets/img/Part7/memories/protectFriends.png' },
        { flag: 'followedFriends', image: 'assets/img/Part7/memories/followedFriends.png' }
      ],
      knowledge: [
        { flag: 'studentManualRead', image: 'assets/img/Part7/memories/manual.png' },
        { flag: 'knowledgeInterest', image: 'assets/img/Part7/memories/knowledgeInterest.png' },
        { flag: 'examinedAllQuidditchObjects', image: 'assets/img/Part7/memories/examinedAllQuidditchObjects.png' },
        { flag: 'visited3HeadsDog', image: 'assets/img/Part7/memories/visited3HeadsDog.png' }
      ],
      courage: [
        { flag: 'riskTaker', image: 'assets/img/Part7/memories/riskTaker.png' },
        { flag: 'enteredRestrictedSection', image: 'assets/img/Part7/memories/enteredRestrictedSection.png' },
        { flag: 'hermioneRescued', image: 'assets/img/Part7/memories/hermione-troll.png' }
      ],
      ambition: [
        { flag: 'isSeeker', image: 'assets/img/Part7/memories/quidditch.png' },
        { flag: 'wantsRecognition', image: 'assets/img/Part7/memories/wantsRecognition.png' }
      ],
      adventure: []
    };

    // 1. CARICA SOLO I RICORDI ESCLUSIVI DELLA CATEGORIA VINCENTE
    const currentCategoryMemories = profileMemoriesMap[visionType] || [];
    currentCategoryMemories.forEach(item => {
      if (this.flag(item.flag)) {
        addMemory(item.image);
      }
    });

    // 2. CARICA GLI EASTER EGGS DALLA CARTELLA easterEggs/
    if (this.showEgg('visited3HeadsDog')) {
      addMemory('assets/img/Part7/easterEggs/fuffy.png');
    }
    if (this.showEgg('hermioneRescued')) {
      addMemory('assets/img/Part7/easterEggs/troll.png');
    }
    if (this.showEgg('enteredRestrictedSection')) {
      addMemory('assets/img/Part7/easterEggs/forbidden-book.png');
    }

    this.memoryFragments = memories.slice(0, 10);

    console.log(`[MIRROR] Profilo vincente: ${visionType}`);
    console.log('[MIRROR] Diapositive caricate:', this.memoryFragments);
  }

  /*  DETERMINAZIONE VISIONE FINALE*/

  private determineVision(): MirrorVision {
    const scores = {
      friendship: this.countTrue([
        'hermioneRescued',
        'friendshipChoice',
        'protectFriends',
        'followedFriends'
      ]),
      knowledge: this.countTrue([
        'studentManualRead',
        'knowledgeInterest',
        'examinedAllQuidditchObjects',
        'visited3HeadsDog'
      ]),
      courage: this.countTrue([
        'riskTaker',
        'enteredRestrictedSection',
        'hermioneRescued'
      ]),
      ambition: this.countTrue([
        'isSeeker',
        'wantsRecognition'
      ])
    };

    console.log('[MIRROR] Scores:', scores);

    const candidates = [
      { type: 'friendship' as VisionType, score: scores.friendship },
      { type: 'knowledge' as VisionType, score: scores.knowledge },
      { type: 'courage' as VisionType, score: scores.courage },
      { type: 'ambition' as VisionType, score: scores.ambition }
    ].filter(candidate => candidate.score >= 2);

    if (candidates.length === 0) {
      return this.visions.adventure;
    }

    candidates.sort((a, b) => b.score - a.score);
    return this.visions[candidates[0].type];
  }

  private countTrue(flagNames: string[]): number {
    return flagNames.reduce((total, flagName) => {
      return total + (this.flag(flagName) ? 1 : 0);
    }, 0);
  }

  private flag(name: string): boolean {
    if (this.flags && this.flags[name] === true) {
      return true;
    }
    if (this.profile && this.profile[name] === true) {
      return true;
    }
    return false;
  }

  /* FASE 3: Visione Finale & Uscita*/

  private showFinalVision(): void {
    this.currentMemory = null;
    this.phase = 'vision';
    
    if (this.finalVision && this.finalVision.image) {
      this.gameDataService.setMirrorProfileImage(this.finalVision.image);
    }

    const timer = setTimeout(() => {
      this.visionReady = true;
    }, 300);
    this.timers.push(timer);
  }

  leaveMirror(): void {
    this.quizSolved.emit('dumbledore_mirror_speech');
  }

  ngOnDestroy(): void {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers = [];
  }
}
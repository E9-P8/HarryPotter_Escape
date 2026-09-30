import { Component, OnInit, OnDestroy,EventEmitter,Output } from '@angular/core';
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
export class MirrorRevealComponent implements OnInit , OnDestroy{

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

  private timers: any[] = [];
  
  /*
  * Immagini già viste durante l'avventura.
  */
  memoryFragments: MemoryFragment[] = [];
  
  visions: { [key: string]: MirrorVision } = {
  friendship: {
  type: 'friendship',
  title: 'AMICIZIA',
  image: 'assets/images/mirror/vision-friendship.jpg',
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
  image: 'assets/images/mirror/vision-knowledge.jpg',
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
  image: 'assets/images/mirror/vision-courage.jpg',
  text: [
  'Non desideri una strada facile.',
  'Desideri la forza di affrontare qualsiasi ostacolo.',
  'Anche quando tutti gli altri avrebbero rinunciato.'
  ]
  },
   
  ambition: {
  type: 'ambition',
  title: 'AMBIZIONE',
  image: 'assets/images/mirror/vision-ambition.jpg',
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
  image: 'assets/images/mirror/vision-adventure.jpg',
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
   
  this.prepareMemoryFragments();
   
  /*
  * Possiamo già determinare la visione,
  * ma non la mostriamo finché non termina la fase magica.
  */
  this.finalVision = this.determineVision();
   
  console.log('[MIRROR] Vision:', this.finalVision);
  }
   
  /* =========================================================
  FASE 1
  Entrata nella stanza
  ========================================================= */
   
  approachMirror(): void {
  this.phase = 'covered';
  }
   
  /* =========================================================
  FASE 2
  Rimozione del telo
  ========================================================= */
   
  removeCurtain(): void {
   
  if (this.curtainOpen) {
  return;
  }
   
  this.curtainOpen = true;
   
  const timer = setTimeout(() => {
  this.phase = 'revealing';
  this.mirrorGlow = true;
  }, 1500);
   
  this.timers.push(timer);
  }
   
  /*
  * Il giocatore clicca "Osserva".
  */
  observeMirror(): void {
  this.startMagicalAnalysis();
  }
   
   
  /* =========================================================
  FASE 3 / 4
  Analisi delle scelte + ricordi
  ========================================================= */
   
  private startMagicalAnalysis(): void {
   
  this.phase = 'memories';
   
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
   
   
  private showMemory(index: number): void {
   
  if (index >= this.memoryFragments.length) {
   
  this.currentMemory = null;
   
  const timer = setTimeout(() => {
  this.showFinalVision();
  }, 1500);
   
  this.timers.push(timer);
   
  return;
  }
   
  this.currentMemory = this.memoryFragments[index];
   
  /*
  * Ogni ricordo rimane nello specchio per circa 2 secondi.
  */
  const timer = setTimeout(() => {
   
  this.currentMemory = null;
   
  const nextTimer = setTimeout(() => {
   
  this.currentMemoryIndex++;
  this.showMemory(this.currentMemoryIndex);
   
  }, 500);
   
  this.timers.push(nextTimer);
   
  }, 2000);
   
  this.timers.push(timer);
  }
   
   
  /* =========================================================
  PREPARAZIONE DEI RICORDI
  ========================================================= */
   
  private prepareMemoryFragments(): void {
   
  const memories: MemoryFragment[] = [];
   
  /*
  * Questi sono esempi.
  * Collega qui le immagini effettivamente utilizzate
  * nelle parti 5, 6 e 7.
  */
   
  if (this.flag('visited3HeadsDog')) {
  memories.push({
  image: 'assets/images/mirror/memories/three-headed-dog.jpg'
  });
  }
   
  if (this.flag('hermioneRescued')) {
  memories.push({
  image: 'assets/images/mirror/memories/hermione-troll.jpg'
  });
  }
   
  if (this.flag('friendshipChoice')) {
  memories.push({
  image: 'assets/images/mirror/memories/friends.jpg'
  });
  }
   
  if (this.flag('isSeeker')) {
  memories.push({
  image: 'assets/images/mirror/memories/quidditch.jpg'
  });
  }
   
  if (this.flag('enteredRestrictedSection')) {
  memories.push({
  image: 'assets/images/mirror/memories/restricted-section.jpg'
  });
  }
   
  if (this.flag('followedFriends')) {
  memories.push({
  image: 'assets/images/mirror/memories/ron-harry.jpg'
  });
  }
   
  if (this.flag('studentManualRead')) {
  memories.push({
  image: 'assets/images/mirror/memories/manual.jpg'
  });
  }
   
  if (this.flag('knowledgeInterest')) {
  memories.push({
  image: 'assets/images/mirror/memories/knowledge.jpg'
  });
  }
   
  /*
  * Evitiamo una sequenza eccessivamente lunga.
  * 5 ricordi x ~2.5 secondi = circa 12 secondi.
  */
  this.memoryFragments = memories.slice(0, 5);
  }
   
   
  /* =========================================================
  DETERMINAZIONE DELLA VISIONE
  ========================================================= */
   
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
  'visited3HeadsDog',
  'followedCuriosity'
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
   
  /*
  * Un profilo è candidato solo se ha almeno 2 flag.
  */
  const candidates = [
  {
  type: 'friendship',
  score: scores.friendship
  },
  {
  type: 'knowledge',
  score: scores.knowledge
  },
  {
  type: 'courage',
  score: scores.courage
  },
  {
  type: 'ambition',
  score: scores.ambition
  }
  ].filter(candidate => candidate.score >= 2);
   
  /*
  * Nessun profilo raggiunge la soglia.
  */
  if (candidates.length === 0) {
  return this.visions.adventure;
  }
   
  /*
  * Ordiniamo solo per punteggio.
  *
  * In caso di pareggio rimane l'ordine originale:
  *
  * 1 Amicizia
  * 2 Conoscenza
  * 3 Coraggio
  * 4 Ambizione
  */
  candidates.sort((a, b) => b.score - a.score);
   
  return this.visions[candidates[0].type];
  }
   
   
  private countTrue(flagNames: string[]): number {
   
  return flagNames.reduce((total, flagName) => {
   
  return total + (this.flag(flagName) ? 1 : 0);
   
  }, 0);
  }
   
   
  /*
  * Cerchiamo il valore sia nei flags sia nel profile.
  *
  * In questo modo isSeeker, per esempio, può essere salvato
  * in uno dei due senza rompere lo Specchio.
  */
  private flag(name: string): boolean {
   
  if (
  this.flags &&
  this.flags[name] === true
  ) {
  return true;
  }
   
  if (
  this.profile &&
  this.profile[name] === true
  ) {
  return true;
  }
   
  return false;
  }
   
   
  /* =========================================================
  VISIONE FINALE
  ========================================================= */
   
  private showFinalVision(): void {
   
  this.currentMemory = null;
   
  this.phase = 'vision';
   
  const timer = setTimeout(() => {
  this.visionReady = true;
  }, 300);
   
  this.timers.push(timer);
  }
   
   
  /* =========================================================
  EASTER EGG
  ========================================================= */
   
  hasEasterEgg(flagName: string): boolean {
  return this.flag(flagName);
  }
 
  leaveMirror(): void {
    this.quizSolved.emit('dumbledore_mirror_speech');
  }

  ngOnDestroy(): void {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers = [];
  }

}

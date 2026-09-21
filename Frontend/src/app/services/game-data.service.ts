import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameState, GameStats } from '../models/game.models';


@Injectable({
  providedIn: 'root'
})



export class GameDataService {
  
  private readonly STORAGE_KEY = 'hp_game_save';
  private readonly STORAGE_KEY_DEMO = 'hp_demo_save';
  private readonly EXTRA_STORAGE_KEY = 'hp_extra_data';

  private _gameState$ = new BehaviorSubject<GameState>(this.loadGame());

  isManualOpen: boolean = false;
  wizardName: string = '';
 // isSeeker: boolean = false;
  currentWelcomeStep: number = 1;

  isDemoMode: boolean = false;

  private readonly initialState: GameState = {
    parte: 1,
    node: 'start',
    stats: { audacia: 0, reputazione: 0, sospetto: 0, sincerita: 0, amicizia : 0},
    flags: {},
    score: 0,
    choicesHistory: []
  };

  

 
  constructor() {
   this.loadExtraData();
  }

  private get currentStorageKey(): string {
    return this.isDemoMode ? this.STORAGE_KEY_DEMO : this.STORAGE_KEY;
  }

  get gameState$(): Observable<GameState> {
    return this._gameState$.asObservable();
  }
  initDemoSession(demoFlags: Record<string, boolean>): void {
    this.isDemoMode = true;

    // Nuovo stato pulito per la demo
    const demoState: GameState = {
      parte: 7,
      node: 'great_hall_dinner', 
      stats: { audacia: 0, reputazione: 0, sospetto: 0, sincerita: 0, amicizia: 0 },
      flags: { ...demoFlags },
      score: 0,
      choicesHistory: []
    };

    this._gameState$.next(demoState);
    localStorage.setItem(this.STORAGE_KEY_DEMO, JSON.stringify(demoState));
  }

  // --- METODO PER USCIRE DALLA DEMO ---
  exitDemoSession(): void {
    this.isDemoMode = false;
    this._gameState$.next(this.loadGame());
  }

  setWizardName(name: string): void {
      this.wizardName = name;
      this.saveExtraData();
  }

  getWizardName(): string {
    if (!this.wizardName) {
      this.loadExtraData();
    }
    return this.wizardName || 'Mago';
  }

  // --- GESTIONE FLAGS (isSeeker, ecc.) ---
  setFlag(flagName: string, value: boolean): void {
    const current = this._gameState$.getValue();
    this._gameState$.next({
      ...current,
      flags: { ...current.flags, [flagName]: value }
    });
    this.saveGame();
  }

  getFlag(flagName: string): boolean {
    if (typeof window !== 'undefined' && window.location.pathname.includes('demo')) {
      this.isDemoMode = true;
    }

    const flags = this._gameState$.getValue().flags;
    return !!(flags && flags[flagName]);
  }

  private saveGame(): void {
    localStorage.setItem(this.currentStorageKey, JSON.stringify(this._gameState$.getValue()));
  }

  private loadGame(): GameState {
    const isDemoUrl = window.location.pathname.includes('/demo');
    if (isDemoUrl) {
      this.isDemoMode = true;
    }

    //const saved = localStorage.getItem(this.STORAGE_KEY);
    const saved = localStorage.getItem(this.currentStorageKey);
    return saved ? JSON.parse(saved) : this.initialState;
  }

  private saveExtraData(): void {
    localStorage.setItem(this.EXTRA_STORAGE_KEY, JSON.stringify({ 
      wizardName: this.wizardName, 
      currentWelcomeStep: this.currentWelcomeStep 
    }));
  }

  private loadExtraData(): void {
    const savedExtra = localStorage.getItem(this.EXTRA_STORAGE_KEY);
    if (savedExtra) {
      const extra = JSON.parse(savedExtra);
      this.wizardName = extra.wizardName || '';
      this.currentWelcomeStep = extra.currentWelcomeStep || 1;
    }
  }

  updateStats(delta: Partial<GameStats>): void {
    const current = this._gameState$.getValue();
    this._gameState$.next({
      ...current,
      stats: { ...current.stats, ...delta }
    });
    this.saveGame();
  }
  setCurrentNode(nodeId: string, parteId?: number): void {
    const current = this._gameState$.getValue();
    this._gameState$.next({
      ...current,
      node: nodeId,
      parte: parteId !== undefined ? parteId : current.parte
    });
    this.saveGame(); // Salva su localStorage
  }
  getCurrentNodeId(): string {
    return this._gameState$.getValue().node;
  }
  getCurrentState() {
    return this._gameState$.getValue();
  }

  openManual(): void { this.isManualOpen = true; }
  closeManual(): void { this.isManualOpen = false; }

  getFlags(): Record<string, boolean> {
   return this._gameState$.getValue().flags;
  }

  getPlayerProfile() {

  const flags = this.getFlags();

  return {

    friendship:
      Number(flags.hermioneRescued) +
      Number(flags.friendshipChoice) +
      Number(flags.protectFriends),

    curiosity:
      Number(flags.studentManualRead) +
      Number(flags.visited3HeadsDog) +
      Number(flags.followedCuriosity),

    courage:
      Number(flags.riskTaker) +
      Number(flags.hermioneRescued) +
      Number(flags.enteredRestrictedSection),

    ambition:
      Number(flags.isSeeker) +
      Number(flags.wantsRecognition),

    knowledge:
      Number(flags.knowledgeInterest) +
      Number(flags.examinedAllQuidditchObjects)

  };

}
}

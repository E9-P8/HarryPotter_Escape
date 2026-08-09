import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameState, GameStats } from '../models/game.models';


@Injectable({
  providedIn: 'root'
})



export class GameDataService {
  
  private readonly STORAGE_KEY = 'hp_game_save';
  private readonly EXTRA_STORAGE_KEY = 'hp_extra_data';

  isManualOpen: boolean = false;
  wizardName: string = '';
 // isSeeker: boolean = false;
  currentWelcomeStep: number = 1;

  private readonly initialState: GameState = {
    parte: 1,
    node: 'start',
    stats: { audacia: 0, reputazione: 0, sospetto: 0, sincerita: 0, amicizia : 0},
    flags: {},
    score: 0,
    choicesHistory: []
  };

  private _gameState$ = new BehaviorSubject<GameState>(this.loadGame());

 
  constructor() {
   this.loadExtraData();
  }

  get gameState$(): Observable<GameState> {
    return this._gameState$.asObservable();
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
    return !!this._gameState$.getValue().flags[flagName];
  }

  // METODI DI SALVATAGGIO INTERNI
  private saveGame(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._gameState$.getValue()));
  }

  private loadGame(): GameState {
    const saved = localStorage.getItem(this.STORAGE_KEY);
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
}

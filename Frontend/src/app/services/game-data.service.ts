import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameState, GameStats } from '../models/game.models';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})



export class GameDataService {
  
  private readonly STORAGE_KEY = 'hp_game_save';
  isManualOpen: boolean = false;
  isSeeker: boolean = false;

  private readonly initialState: GameState = {
    parte: 1,
    node: 'start',
    stats: { audacia: 0, reputazione: 0, sospetto: 0, sincerita: 0 },
    flags: {},
    score: 0,
    choicesHistory: []
  };

  private _gameState$ = new BehaviorSubject<GameState>(this.loadGame());

  wizardName: string = '';
  currentWelcomeStep: number = 1;


  constructor() {
    const savedExtra = localStorage.getItem('hp_extra_data');
    if (savedExtra) {
      const extra = JSON.parse(savedExtra);
      this.wizardName = extra.wizardName;
      this.currentWelcomeStep = extra.currentWelcomeStep;
    }
   }

  get gameState$(): Observable<GameState> {
    return this._gameState$.asObservable();
  }

  updateStats(delta: Partial<GameStats>) {
    const current = this._gameState$.getValue();
    this._gameState$.next({
      ...current,
      stats: { ...current.stats, ...delta }
    });
    this.saveGame();
  }

  navigateTo(nodeId: string, parte: number) {
    const current = this._gameState$.getValue();
    this._gameState$.next({ ...current, node: nodeId, parte });
    this.saveGame();
  }

  private saveGame() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._gameState$.getValue()));
    localStorage.setItem('hp_extra_data', JSON.stringify({ 
      wizardName: this.wizardName, 
      currentWelcomeStep: this.currentWelcomeStep 
    }));
  }

  private loadGame(): GameState {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : this.initialState;
  }

  getWizardName(): string {
   return this.wizardName;
  }

setFlag(flagName: string, value: boolean) {
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

openManual() {
    this.isManualOpen = true;
    console.log('apri in game data')
  }

  closeManual() {
    this.isManualOpen = false;
  }
}

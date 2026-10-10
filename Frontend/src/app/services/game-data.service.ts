import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameState, GameStats } from '../models/game.models';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})



export class GameDataService {
  
  private readonly STORAGE_KEY = 'hp_game_save';
  private readonly STORAGE_KEY_DEMO = 'hp_demo_save';
  private readonly EXTRA_STORAGE_KEY = 'hp_extra_data';
  private readonly SESSION_ID_KEY = 'hp_supabase_session_id';

  private supabase: SupabaseClient;
  private currentSessionId: string | null = null;

  private _gameState$ = new BehaviorSubject<GameState>(this.loadGame());

  isManualOpen: boolean = false;
  wizardName: string = '';
  currentWelcomeStep: number = 1;

  isDemoMode: boolean = false;
  private mirrorProfileImage: string = '';

  public housePoints: number = 0;
  private readonly initialState: GameState = {
    parte: 1,
    node: 'start',
    stats: { audacia: 0, reputazione: 0, sospetto: 0, sincerita: 0, amicizia : 0},
    housePoints: 0,
    flags: {},
    score: 0,
    choicesHistory: []
  };

  

 
  constructor() {
   this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
   this.loadExtraData();
   
   if (typeof localStorage !== 'undefined') {
      this.currentSessionId = localStorage.getItem(this.SESSION_ID_KEY);
    }
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
      housePoints: 0,
      score: 0,
      choicesHistory: []
    };

    this._gameState$.next(demoState);
    localStorage.setItem(this.STORAGE_KEY_DEMO, JSON.stringify(demoState));
    this.saveGame();
  }

  exitDemoSession(): void {
    this.isDemoMode = false;
    this._gameState$.next(this.loadGame());
  }
  setMirrorProfileImage(imagePath: string): void {
    this.mirrorProfileImage = imagePath;
    localStorage.setItem('hp_demo_mirror_img', imagePath);
  }

  getMirrorProfileImage(): string {
    return this.mirrorProfileImage;
    return localStorage.getItem('hp_demo_mirror_img') || '';
  }
  setWizardName(name: string): void {
      this.wizardName = name;
      this.saveExtraData();
      this.saveGame();
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

  async saveGame(): Promise<void> {
    const state = this._gameState$.getValue();

    // 1. Salvataggio locale PWA
    localStorage.setItem(this.currentStorageKey, JSON.stringify(state));

    // 2. Preparazione payload per Supabase
    const payload = {
      wizard_name: this.getWizardName(),
      is_demo: this.isDemoMode || (typeof window !== 'undefined' && window.location.pathname.includes('demo')),
      current_node: state.node || 'start',
      house_points: state.housePoints || 0,
      stats: state.stats,
      flags: state.flags,
      updated_at: new Date().toISOString()
    };

    try {
      if (!this.currentSessionId) {
        // Se la sessione non esiste ancora su DB, crea la nuova riga
        const { data, error } = await this.supabase
          .from('game_sessions')
          .insert([payload])
          .select('id')
          .single();

        if (error) {
          console.error('Errore creazione sessione Supabase:', error);
        } else if (data) {
          this.currentSessionId = data.id;
          localStorage.setItem(this.SESSION_ID_KEY, data.id);
        }
      } else {
        // Se la sessione esiste già, aggiorna la riga esistente
        const { error } = await this.supabase
          .from('game_sessions')
          .update(payload)
          .eq('id', this.currentSessionId);

        if (error) {
          console.error('Errore update sessione Supabase:', error);
        }
      }
    } catch (err) {
      console.warn('Connessione Supabase non disponibile (modalità offline):', err);
    }
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

  updateStats(impact: Record<string, number>): void {
    const current = this._gameState$.getValue();
    const newStats: GameStats = { ...current.stats };

    let impactPointsSum = 0;

    if (impact) {
      Object.keys(impact).forEach((key) => {
        const val = impact[key] || 0;
        
        impactPointsSum += val;

       if (key !== 'gryffindor_points') {
          const k = key as keyof GameStats;
          if (newStats[k] !== undefined) {
            newStats[k] += val;
          } else {
            (newStats as any)[k] = val;
          }
        }
      });
    }

    // Somma algebrica dei punti casata attuali + l'impatto di questa scelta
    const totalHousePoints = (current.housePoints || 0) + impactPointsSum;

    this._gameState$.next({
      ...current,
      stats: newStats,
      housePoints: totalHousePoints
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

  async sendFeedback(rating: number, comment: string = ''): Promise<boolean> {
    if (!this.currentSessionId) {
      await this.saveGame();
    }

    if (!this.currentSessionId) {
      console.error('Impossibile inviare feedback: session_id non trovato.');
      return false;
    }

    try {
      const { error } = await this.supabase
        .from('feedbacks')
        .insert([{
          session_id: this.currentSessionId,
          wizard_name: this.getWizardName(),
          rating: rating,
          comment: comment,
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('Errore invio feedback a Supabase:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Errore di rete invio feedback:', err);
      return false;
    }
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

export interface GameStats {
  audacia: number;
  reputazione: number;
  sospetto: number;
  sincerita: number;
}

export interface GameState {
  parte: number;
  node: string; // identificativo del nodo corrente (es. "enigma_02")
  stats: GameStats;
  flags: Record<string, boolean>; //ex talkedWithPiton
  score: number;
  choicesHistory: string[]; 
}
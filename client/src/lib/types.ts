/**
 * Tipos compartilhados do sistema LOTO MASTER
 */

export interface Game {
  id: string;
  playerName: string;
  numbers: number[];
  gameNumber: number; // Ex: Jorge Farias | 01, Jorge Farias | 02
  timestamp: number;
}

export interface SavedGame extends Game {
  status: "pending" | "finished";
}

export interface GameResult {
  game: SavedGame;
  hits: number[];
  score: number;
}

export interface AppState {
  // Registro - jogos em construção (não salvos)
  currentPlayerName: string;
  currentNumbers: number[];
  gamesToAdd: Game[]; // Lista de jogos do mesmo apostador antes de salvar

  // Participantes - jogos salvos
  savedGames: SavedGame[];

  // Lista Atual - jogos após encerrar apostas
  currentGames: SavedGame[];
  drawnNumbers: number[];
}

// Статистика по игре

export interface IMoveInfo {
  row: number;
  col: number;
  isPlayer: boolean;
}

export type History = IMoveInfo[][];

export interface IStatistic {
  history: History;
  botWinCount: number;
  playerWinCount: number;
}

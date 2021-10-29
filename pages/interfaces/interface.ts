// Статистика по игре

export interface IMoveInfo {
  row: number;
  col: number;
  isPlayer: boolean;
}

export interface IStatistic {
  history: IMoveInfo[][];
  botWinCount: number;
  playerWinCount: number;
}

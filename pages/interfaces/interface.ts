// Статистика по игре
export interface IMoveInfo {
  game: number,
  row: number,
  col: number,
  isPlayer: boolean,
}

export interface IMovesInfo {
  moves: IMoveInfo[],
}

export interface IStatistic {
  playerWinCount: number,
  botWinCount: number,
  history: IMoveInfo[],
}

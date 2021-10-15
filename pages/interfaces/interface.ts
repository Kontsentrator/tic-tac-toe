// Статистика по игре
export interface IMoveInfo {
  game: number;
  row: number;
  col: number;
  isPlayer: boolean;
}

export interface IMovesInfo {
  data: IMoveInfo[]
}

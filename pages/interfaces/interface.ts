export interface IStaticProps {
  id: number;
  status: string;
}

export interface Datas {
  data: IStaticProps[];
}

// Статистика по игре
export interface IMoveInfo {
  game: number;
  row: number;
  col: number;
  isPlayer: boolean;
}

import { IMoveInfo, IStatistic } from "../interfaces/interface";

const history: IMoveInfo[] = [];
export const statistic: IStatistic = {playerWinCount: 0, botWinCount: 0, history: history};
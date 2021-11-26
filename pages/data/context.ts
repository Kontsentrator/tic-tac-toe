import React, { Dispatch, SetStateAction } from "react";

type Statistic = {
  player: number;
  bot: number;
};

type Context = {
  statistic: Statistic;
  setStatistic: Dispatch<SetStateAction<Statistic>>;
};

export const WinCountContext = React.createContext<Context>();

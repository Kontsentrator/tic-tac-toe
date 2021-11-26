import React, { useState } from "react";
import { Provider } from "react-redux";
import TicTacToe from "./components/Tictactoe";
import { store } from "./store/store";
import { initialStatistic } from "./data/statistic";
import { WinCountContext } from "./data/context";

export default function Home() {
  const [statistic, setStatistic] = useState({
    player: initialStatistic.playerWinCount,
    bot: initialStatistic.botWinCount,
  });

  return (
    <Provider store={store}>
      <WinCountContext.Provider value={{ statistic, setStatistic }}>
        <TicTacToe />
      </WinCountContext.Provider>
    </Provider>
  );
}

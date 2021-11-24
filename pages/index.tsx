import React from "react";
import { Provider } from "react-redux";
import TicTacToe from "./components/Tictactoe";
import { store } from "./store/store";
import { statistic } from "./data/statistic";
import { WinCountContext } from "./data/context";

export default function Home() {
  console.log(statistic);
  const winCount = {
    player: statistic.playerWinCount,
    bot: statistic.botWinCount,
  };

  return (
    <Provider store={store}>
      <WinCountContext.Provider value={winCount}>
        <TicTacToe />
      </WinCountContext.Provider>
    </Provider>
  );
}

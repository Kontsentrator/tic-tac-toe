import React from "react";
import { Provider } from "react-redux";
import TicTacToe from "./components/tictactoe";
import { store } from "./store/store";
import { GetStaticProps } from "next";
import { statistic } from "./data/statistic";
import { WinCountContext } from "./data/context";

const API_ENDPOINT = "http://localhost:3000/api";
const RESOURCE = "/board";

export default function Home() {
  console.log(statistic);
  const winCount = {
    player: statistic.playerWinCount,
    bot: statistic.botWinCount,
  }

  return (
    <div className="game__wrap">
      <Provider store={store}>
        <WinCountContext.Provider value={winCount}>
          <TicTacToe />
        </WinCountContext.Provider>
      </Provider>
    </div>
  );
}

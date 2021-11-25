import React, { useState } from "react";
import { Provider } from "react-redux";
import TicTacToe from "./components/tictactoe";
import { store } from "./store/store";
import { GetStaticProps } from "next";
import { initialStatistic } from "./data/statistic";
import { WinCountContext } from "./data/context";

const API_ENDPOINT = "http://localhost:3000/api";
const RESOURCE = "/board";

export default function Home() {
  // Создаем стейт контекст
  const [statistic, setStatistic] = useState({
    player: initialStatistic.playerWinCount,
    bot: initialStatistic.botWinCount,
  })

  return (
    <div className="game__wrap">
      <Provider store={store}>
        {/* Прокидываем через все наше приложение */}
        <WinCountContext.Provider value={{statistic, setStatistic}}>
          <TicTacToe />
        </WinCountContext.Provider>
      </Provider>
    </div>
  );
}

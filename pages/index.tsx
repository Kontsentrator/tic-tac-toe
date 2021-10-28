import React, { useState } from "react";
import { Provider } from "react-redux";
import TicTacToe from "./components/tictactoe";
import { store } from "./store/store";
import { GetStaticProps } from "next";
import { IMovesInfo } from "./interfaces/interface";

const API_ENDPOINT = "http://localhost:3000/api";
const RESOURCE = "/board";

export const getStaticProps: GetStaticProps = async (ctx) => {
  const moves = await fetch(API_ENDPOINT + RESOURCE)
    .then((res) => res.json())
    .catch((error) => {
      console.log(error);
      return [];
    });
  return { props: { moves } };
};

const MyContext = React.createContext({player: 0, bot: 0});

export default function Home({ moves }: IMovesInfo) {
  const winCount = {
    bot: 0,
    player: 0
  }

  return (
    <div className="game__wrap">
      <Provider store={store}>
        <MyContext.Provider value={winCount}>
          <TicTacToe moves={moves} />
        </MyContext.Provider>
      </Provider>
    </div>
  );
}

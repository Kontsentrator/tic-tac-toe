import React, { useState } from "react";
import { Provider } from "react-redux";
import TicTacToe from "./components/tictactoe";
import { store } from "./store/store";
import { GetStaticProps } from "next";
import { IMovesInfo } from "./interfaces/interface";

export const getStaticProps: GetStaticProps = async (ctx) => {
  const moves = await fetch("http://localhost:3000/api/boad")
    .then((res) => res.json())
    .catch((error) => {
      console.log(error);
      return [];
    });
  return { props: { moves } };
};

//const StatisticContext = React.createContext();

export default function Home({ moves }: IMovesInfo) {
  return (
    <div className="game__wrap">
      <Provider store={store}>
        <TicTacToe moves={moves} />
      </Provider>
    </div>
  );
}

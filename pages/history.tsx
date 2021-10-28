import React, { useState } from "react";
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

export default function History({ moves }: IMovesInfo) {
    console.log(moves);
  return (
    <div className="history">
      {moves.map((move, index) => (
          <div key={index} className="history__move">
              <div className="move__param">Игра № {move.game}</div>
              <div className="move__param">Ряд: {move.row}</div>
              <div className="move__param">Колонка: {move.col}</div>
              <div className="move__param">Ход игрока: {move.isPlayer ? "Да" : "Нет"}</div>
          </div>
      ))}
    </div>
  );
}

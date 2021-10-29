import React, { useState } from "react";
import { GetStaticProps } from "next";
import { IStatistic } from "./interfaces/interface";

const API_ENDPOINT = "http://localhost:3000/api";
const RESOURCE = "/board";

export const getStaticProps: GetStaticProps = async (ctx) => {
  const statistic = await fetch(API_ENDPOINT + RESOURCE)
    .then((res) => res.json())
    .catch((error) => {
      console.log(error);
      return [];
    });
  return { props: statistic };
};

export default function History(statistic: IStatistic) {
  return (
    <div className="history">
      {statistic.history.map((game, index) => (
        <div key={index} className="history__game">
          <p className="history__game-title">Игра № {index + 1}</p>

          {game.map((move, index) => (
            <div
              key={index}
              className={`history__move ${
                move.isPlayer ? "history__move_player" : "history__move_bot"
              }`}
            >
              <p className="move__param">Ряд: {move.row}</p>
              <p className="move__param">Колонка: {move.col}</p>
              <p className="move__param">
                Игрок: {move.isPlayer ? "да" : "нет"}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

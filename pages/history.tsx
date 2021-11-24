import React, { useState, memo } from "react";
import { GetStaticProps } from "next";
import { IStatistic } from "./interfaces/interface";

interface IHistoryProps {
  statistic: IStatistic;
}

const API_ENDPOINT = "http://localhost:3000/api";
const RESOURCE = "/board";

export const getStaticProps: GetStaticProps = async (ctx) => {
  const statistic = await fetch(API_ENDPOINT + RESOURCE)
    .then((res) => res.json())
    .catch((error) => {
      console.log(error);
    });
  return { props: {statistic} };
};

const History: React.FC<IHistoryProps> = ({ statistic }) => {
  return (
    <div className="history">
      {statistic && statistic.history.map((game, index) => (
        <div key={index} className="history__game">
          <p className="history__game-title">Игра № {index + 1}</p>

          {game.map((move, index) => (
            <div
              key={index}
              className={`history__move ${
                move.isPlayer ? "history__move_player" : "history__move_bot"
              }`}
            >
              <p className="history__param">Ряд: {move.row}</p>
              <p className="history__param">Колонка: {move.col}</p>
              <p className="history__param">
                Игрок: {move.isPlayer ? "да" : "нет"}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default memo(History);

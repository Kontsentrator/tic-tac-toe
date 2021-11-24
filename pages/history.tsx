import cn from "classnames";
import React, { useState, memo } from "react";
import { GetStaticProps } from "next";
import { IStatistic } from "./interfaces/interface";
import styles from "./history.module.scss";

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
  return { props: { statistic } };
};

const History: React.FC<IHistoryProps> = ({ statistic }) => {
  return (
    <div className={styles.history}>
      {statistic &&
        statistic.history.map((game, index) => (
          <div key={index} className={styles.history__game}>
            <p className={styles.history__gameTitle}>Игра № {index + 1}</p>

            {game.map((move, index) => (
              <div
                key={index}
                className={cn(styles.history__move, move.isPlayer 
                  ? styles.history__movePlayer : styles.history__moveBot)}
              >
                <p className={styles.history__param}>Ряд: {move.row}</p>
                <p className={styles.history__param}>Колонка: {move.col}</p>
                <p className={styles.history__param}>
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

import cn from "classnames";
import React, { memo } from "react";
import { GetStaticProps } from "next";
import { IStatistic } from "./interfaces/interface";
import styles from "./history.module.scss";

interface IHistoryProps {
  statistic: IStatistic;
  error?: string;
}

const API_ENDPOINT = "http://localhost:3000/api";
const RESOURCE = "/board";

export const getStaticProps: GetStaticProps = async (ctx) => {
  try {
    const statistic: IStatistic = await fetch(API_ENDPOINT + RESOURCE).then(
      (res) => res.json()
    );
    return { props: { statistic: statistic } };
  } catch (error) {
    return { props: { error: error.message } };
  }
};

const History: React.FC<IHistoryProps> = ({ statistic, error }) => {
  return (
    <div className={styles.history}>
      {error ? (
        <div className={styles.history__error}>{error}</div>
      ) : (
        statistic?.history.map(
          (game, index) =>
            game && (
              <div key={index} className={styles.history__game}>
                <p className={styles.history__gameTitle}>Игра № {index + 1}</p>

                {game.map((move, index) => (
                  <div
                    key={index}
                    className={cn(
                      styles.history__move,
                      move.isPlayer
                        ? styles.history__movePlayer
                        : styles.history__moveBot
                    )}
                  >
                    <p className={styles.history__param}>Ряд: {move.row}</p>
                    <p className={styles.history__param}>Колонка: {move.col}</p>
                    <p className={styles.history__param}>
                      Игрок: {move.isPlayer ? "да" : "нет"}
                    </p>
                  </div>
                ))}
              </div>
            )
        )
      )}
    </div>
  );
};

export default memo(History);

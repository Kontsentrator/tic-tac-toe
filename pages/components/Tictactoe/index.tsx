import React, {
  memo,
  useCallback,
  useEffect,
  useState,
  useContext,
} from "react";
import Link from "next/link";
import Cell from "../Cell";
import StatisticMenu from "../StatisticMenu";
import styles from "./tictactoe.module.scss";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  restart,
  setWinner,
  increaseBotWinCount,
  increasePlayerWinCount,
} from "../../store/boardSlice";
import { History, IStatistic } from "../../interfaces/interface";
import { statistic as dataStatistic } from "../../data/statistic";
import { WinCountContext } from "../../data/context";
import { checkWinner } from "./checkWinner";

const API_ENDPOINT = "http://localhost:3000/api";
const RESOURCE = "/board";

const TicTacToe = () => {
  // Состояния
  const [error, setError] = useState<Error>();

  // Метки полей
  const flags = { player: "x", bot: "o" };

  const { statistic, setStatistic } = useContext(WinCountContext);

  // Данный из стейта
  const currentMoveInfo = useAppSelector(
    (state) => state.boardReducer.currentMoveInfo
  );
  const gameNum = useAppSelector((state) => state.boardReducer.gameNum);
  const board = useAppSelector((state) => state.boardReducer.board);
  const nextTurn = useAppSelector((state) => state.boardReducer.nextTurn);
  const winner = useAppSelector((state) => state.boardReducer.winner);
  const history = useAppSelector(
    (state) => state.boardReducer.statistic.history
  );

  const dispatch = useAppDispatch();

  // -------------- Эффекты -------------

  useEffect(() => {
    console.log(error);
  }, [error]);

  useEffect(() => {
    dispatch({ type: "ADD_HISTORY" });
  }, [currentMoveInfo]);

  // Сохранение статистики
  useEffect(() => {
    if (!winner) {
      dataStatistic.history = history;
      dispatch({
        type: "SAVE_STATISTIC",
        payload: { statistic: dataStatistic, saveStatistic },
      });
    }
  }, [currentMoveInfo, gameNum, winner]);

  // Проверка победителя
  useEffect(() => {
    let flag = nextTurn ? flags.bot : flags.player;
    if (!winner && checkWinner(flag, board)) {
      dispatch({ type: setWinner.type, payload: flag });

      if (flag === flags.bot) dispatch({ type: increaseBotWinCount });
      else if (flag === flags.player)
        dispatch({ type: increasePlayerWinCount });
    }
  }, [board, nextTurn]);

  // Ход бота
  useEffect(() => {
    if (!winner) dispatch({ type: "BOT_MOVE", payload: { setStatistic } });
  }, [nextTurn, winner, board]);

  // -------------- Методы -------------

  // Обработка клика по клетке поля
  const handleCellClick = (row: number, col: number) => {
    if (!winner)
      dispatch({
        type: "PLAYER_MOVE",
        payload: {
          flag: flags.player,
          row: row,
          col: col,
          isPlayer: true,
          setStatistic,
        },
      });
  };

  // Cохранение информации о ходе
  const saveStatistic = async (stat: IStatistic) => {
    await fetch(API_ENDPOINT + RESOURCE, {
      method: "POST",
      body: JSON.stringify({ stat }),
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((err) => setError(err as Error));
  };

  // Перезапуск игры
  const restartGame = () => {
    dispatch({ type: restart.type });
  };

  return (
    <div className={styles.game}>
      {error && <div>{error.message}</div>}
      <p>Игра №{gameNum + 1}</p>
      <div className={styles.game__board}>
        {board.map((row, rowNum) => (
          <div className={styles.game__row} key={rowNum}>
            {row.map((col, colNum) => (
              <Cell
                key={colNum}
                className={styles.game__cell}
                row={rowNum}
                col={colNum}
                onClick={handleCellClick}
                value={col}
              />
            ))}
          </div>
        ))}
      </div>

      {winner == flags.bot ? (
        <div className={styles.game__botWin}>Проигрыш</div>
      ) : (
        winner == flags.player && (
          <div className={styles.game__playerWin}>Победа</div>
        )
      )}

      <button className={styles.game__buttonRestart} onClick={restartGame}>
        Начать заново
      </button>
      {error && <div className="error">{error}</div>}

      <Link href="/history">
        <a className={styles.game__nav} href="">
          История ходов
        </a>
      </Link>

      <StatisticMenu className={styles.game__statisticMenu} />
    </div>
  );
};

export default memo(TicTacToe);

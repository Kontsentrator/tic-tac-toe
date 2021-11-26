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
  initialState,
  restart,
  setWinner,
  addHistory,
  increaseBotWinCount,
  increasePlayerWinCount,
} from "../../store/boardSlice";
import { History, IStatistic } from "../../interfaces/interface";
import { statistic as dataStatistic } from "../../data/statistic";
import { WinCountContext } from "../../data/context";

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
  const rowsCount = useAppSelector(
    (state) => state.boardReducer.boardSize.rowsCount
  );
  const colsCount = useAppSelector(
    (state) => state.boardReducer.boardSize.colsCount
  );
  const history = useAppSelector(
    (state) => state.boardReducer.statistic.history
  );

  const dispatch = useAppDispatch();

  const checkWinner = (flag: string) => {
    if ((checkLines(flag) || checkDiagonals(flag)) && !winner) {
      return true;
    }
    return false;
  };

  // -------------- Эффекты -------------

  // Сохранение статистики
  useEffect(() => {
    if (
      currentMoveInfo &&
      currentMoveInfo.col !== initialState.currentMoveInfo.col &&
      currentMoveInfo.row !== initialState.currentMoveInfo.row &&
      !history[gameNum].find((el) => el === currentMoveInfo)
    ) {
      dispatch({ type: addHistory.type });
    }

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
    if (checkWinner(flag)) {
      dispatch({ type: setWinner.type, payload: flag });

      if (flag === flags.bot) dispatch({ type: increaseBotWinCount });
      else if (flag === flags.player)
        dispatch({ type: increasePlayerWinCount });
    }
  }, [board, nextTurn, checkWinner]);

  // Ход бота
  useEffect(() => {
    if (!winner) dispatch({ type: "BOT_MOVE", payload: { setStatistic } });
  }, [nextTurn, winner, board]);

  // -------------- Методы -------------
  const checkLines = (flag: string): boolean => {
    for (let row = 0; row < rowsCount; row++) {
      let rowCheck = true,
        colCheck = true;
      for (let col = 0; col < colsCount; col++) {
        rowCheck &&= board[row][col] === flag;
        colCheck &&= board[col][row] === flag;
      }

      if (rowCheck || colCheck) {
        return true;
      }
    }
    return false;
  };

  const checkDiagonals = (flag: string): boolean => {
    let toRight = true,
      toLeft = true;
    for (let row = 0; row < rowsCount; row++) {
      toRight &&= board[row][row] === flag;
      toLeft &&= board[rowsCount - 1 - row][row] === flag;
    }

    if (toRight || toLeft) {
      return true;
    }
    return false;
  };

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
    await fetch("http://localhost:3000/api/board", {
      method: "POST",
      body: JSON.stringify({ stat }),
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((err) => setError(err));
  };

  // Перезапуск игры
  const restartGame = () => {
    dispatch({ type: restart.type });
  };

  return (
    <div className={styles.game}>
      {error && <div>{error}</div>}
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

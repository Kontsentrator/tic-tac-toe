import React, { memo, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Observable, fromEvent, delay, fromEventPattern } from "rxjs";
import Cell from "./cell";
import StatisticMenu from "./statisticMenu";

import { useAppSelector, useAppDispatch } from "../store/hooks";
import {
  initialState,
  move,
  restart,
  setWinner,
  increasePlayerWinCount,
  increaseBotWinCount,
} from "../store/boardSlice";

import { IMoveInfo, IStatistic } from "../interfaces/interface";
import { statistic } from "../data/statistic";
import next from "next";

const TicTacToe = () => {
  // Метки полей
  const flags = { player: "x", bot: "o" };

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
  const playerWinCount = useAppSelector(
    (state) => state.boardReducer.playerWinCount
  );
  const botWinCount = useAppSelector((state) => state.boardReducer.botWinCount);

  // Данные о текущем ходе
  const [currentMoveInfo, setCurrentMoveInfo] = useState<IMoveInfo>();
  const [curWinner, setCurWinner] = useState<string>();

  statistic.botWinCount = botWinCount;
  statistic.playerWinCount = playerWinCount;

  while (statistic.history.length <= gameNum) {
    statistic.history.push([]);
  }

  const dispatch = useAppDispatch();

  const makeMove = (flag: string, row: number, col: number) => {
    console.log("Hod");
    dispatch({
      type: "MY_MOVE",
      payload: { flag: flag, row: row, col: col, isPlayer: nextTurn },
    });
    setCurrentMoveInfo({
      row: row,
      col: col,
      isPlayer: nextTurn,
    });
  };

  const checkWinner = (flag: string) => {
    if ((checkLines(flag) || checkDiagonals(flag)) && !winner) {
      return true;
    }
    return false;
  };
  

  // -------------- Эффекты -------------

  useEffect(() => {
    console.log(winner);
  }, [winner]);

  // Сохранение статистики
  useEffect(() => {
    if (currentMoveInfo) {
      statistic.history[gameNum].push(currentMoveInfo);
    }
    saveStatistic(statistic);
  }, [currentMoveInfo]);

  // Проверка победителя
  useEffect(() => {
    let flag = nextTurn ? flags.bot : flags.player;
    if (checkWinner(flag)) {
      console.log("est pobeditel");
      dispatch({ type: setWinner.type, payload: flag });

      if (flag == flags.player) {
        dispatch({ type: increasePlayerWinCount.type });
      } else {
        dispatch({ type: increaseBotWinCount.type });
      }
    }
  }, [board, nextTurn, checkWinner]);

  // Ход бота
  useEffect(() => {
    const botMove = () => {
      console.log("botMove winner", winner);
      if (!winner && !nextTurn && hasEmptyCells(board)) {
        console.log("Hod bota");
        let randRow, randCol;
        do {
          randRow = Math.round(random(0, rowsCount - 1));
          randCol = Math.round(random(0, colsCount - 1));
        } while (board[randRow][randCol] !== "");
        makeMove(flags.bot, randRow, randCol);
      }
    };

    botMove();
  }, [nextTurn, winner, board]);

  // -------------- Методы -------------

  // Проверка, что на поле остались пустые клетки
  const hasEmptyCells = (array: string[][]): boolean => {
    return !array.every((row) => row.every((el) => el !== ""));
  };

  // Вывод случайного числа
  const random = (min: number, max: number): number => {
    return min + Math.random() * (max - min);
  };

  const checkLines = (flag: string): boolean => {
    for (let row = 0; row < rowsCount; row++) {
      let rowCheck = true;
      let colCheck = true;
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
    let toRight = true;
    let toLeft = true;
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
  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (!winner && nextTurn && !board[row][col]) {
        makeMove(flags.player, row, col);
      }
    },
    [winner, nextTurn, board, makeMove, flags.player]
  );

  

  // Cохранение информации о ходе
  const saveStatistic = async (stat: IStatistic) => {
    await fetch("http://localhost:3000/api/board", {
      method: "POST",
      body: JSON.stringify({ stat }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  // Перезапуск игры
  const restartGame = () => {
    dispatch({ type: restart.type });
  };

  return (
    <div className="game">
      <p>{initialState.nextTurn ? "Вы ходите первым" : "Вы ходите вторым"}</p>
      <p>Игра №{gameNum + 1}</p>
      <div className="board">
        {board.map((row, rowNum) => (
          <div className="row" key={rowNum}>
            {row.map((col, colNum) => (
              <Cell
                key={colNum}
                row={rowNum}
                col={colNum}
                onClick={handleCellClick}
                value={col}
              />
            ))}
          </div>
        ))}
      </div>

      <button className="button__restart" onClick={restartGame}>
        Начать заново
      </button>

      <span>
        {winner == flags.bot ? "Проигрыш" : winner == flags.player && "Победа"}
      </span>

      <Link href="/history">
        <a href="">История ходов</a>
      </Link>

      <StatisticMenu />
    </div>
  );
}

export default memo(TicTacToe);

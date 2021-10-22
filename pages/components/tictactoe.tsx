import React, { memo, useCallback, useEffect, useState } from "react";
import Board from "./board";

import { useAppSelector, useAppDispatch } from "../store/hooks";
import { initialState, move, restart, setWinner } from "../store/boardSlice";

import { Observable, fromEvent } from "rxjs";
import { IMoveInfo, IMovesInfo } from "../interfaces/interface";

function TicTacToe({ moves }: IMovesInfo) {
  // Данные о текущем ходе
  const [currentMoveInfo, setCurrentMoveInfo] = useState<IMoveInfo>({
    game: initialState.gameNum,
    row: 0,
    col: 0,
    isPlayer: initialState.nextTurn,
  });

  // Метки полей
  const flags = { player: "x", bot: "o" };

  const board = useAppSelector((state) => state.boardReducer.board);
  const nextTurn = useAppSelector((state) => state.boardReducer.nextTurn);
  const winner = useAppSelector((state) => state.boardReducer.winner);
  const rowsNum = useAppSelector(
    (state) => state.boardReducer.boardSize.rowsNum
  );
  const colsNum = useAppSelector(
    (state) => state.boardReducer.boardSize.colsNum
  );
  const gameNum = useAppSelector((state) => state.boardReducer.gameNum);

  const dispatch = useAppDispatch();

  const makeMove = (flag: string, row: number, col: number) => {
    dispatch({ type: move.type, payload: { flag: flag, row: row, col: col } });
    setCurrentMoveInfo({ game: 0, row: row, col: col, isPlayer: nextTurn });
    saveMoveInfo(currentMoveInfo);
  };

  // -------------- Эффекты -------------

  // Проверка победителя
  // useEffect(() => {
  //   let flag = nextTurn ? flags.bot : flags.player;
  //   console.log("Проверка");
  //   if(checkWinner(flag)) {
  //     dispatch({ type: setWinner.type, payload: flag });
  //     console.log("Winner в useEffect", winner);
  //   }
  // }, [board, nextTurn]);

  // Ход бота
  // useEffect(() => {
  //   if (!winner) {
  //     if (!nextTurn && hasEmptyCells(board)) {
  //       let randRow, randCol;
  //       do {
  //         randRow = Math.round(random(0, rowsNum - 1));
  //         randCol = Math.round(random(0, colsNum - 1));
  //       } while (board[randRow][randCol] !== "");
  //       makeMove(flags.bot, randRow, randCol);
  //     }
  //   }
  // }, [nextTurn]);

  // Автоматическое сохранение информации о ходе

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
    for (let row = 0; row < rowsNum; row++) {
      let rowCheck = true;
      let colCheck = true;
      for (let col = 0; col < colsNum; col++) {
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
    for (let row = 0; row < rowsNum; row++) {
      toRight &&= board[row][row] === flag;
      toLeft &&= board[rowsNum - 1 - row][row] === flag;
    }

    if (toRight || toLeft) {
      return true;
    }
    return false;
  };

  const botMove = () => {
    if (!nextTurn && hasEmptyCells(board)) {
      let randRow, randCol;
      do {
        randRow = Math.round(random(0, rowsNum - 1));
        randCol = Math.round(random(0, colsNum - 1));
      } while (board[randRow][randCol] !== "");
      makeMove(flags.bot, randRow, randCol);
    }
  };

  // Обработка клика по клетке поля
  const handleCellClick = useCallback((row: number, col: number) => {
    if (!winner) {
      if (nextTurn && board[row][col] === "") {
        makeMove(flags.player, row, col);
      }
    }
  }, [winner, nextTurn, board]);

  const checkWinner = (flag: string) => {
    if ((checkLines(flag) || checkDiagonals(flag)) && !winner) {
      return true;
    }
    return false;
  };

  // Cохранение информации о ходе
  const saveMoveInfo = async (moveInfo: IMoveInfo) => {
    const response = await fetch("http://localhost:3000/api/board", {
      method: "POST",
      body: JSON.stringify({ moveInfo }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
  };

  // Перезапуск игры
  const restartGame = () => {
    dispatch({ type: restart.type });
  };

  // const cell = document.getElementsByClassName("cell");
  // const cellClick$ = fromEvent(cell, "click");
  // cellClick$.subscribe(
  //   x => console.log(x)
  // );

  const stream$ = new Observable((observer) => {
    observer.next();
  });
  stream$.subscribe(() => {
    console.log("После хода");
    let tempWinner = winner;
    console.log("Проверка игрока");
    if (checkWinner(flags.player)) {
      tempWinner = flags.player;
    }
    if (!tempWinner) {
      botMove();
    }
    console.log("Проверка бота");
    if (checkWinner(flags.bot)) {
      tempWinner = flags.bot;
    }
    dispatch({ type: setWinner.type, payload: tempWinner });
  });

  return (
    <div className="game">
      <p>{initialState.nextTurn ? "Вы ходите первым" : "Вы ходите вторым"}</p>
      <p>Игра №{gameNum}</p>
      <div className="board">
        <Board board={board} onClick={handleCellClick} />
      </div>

      <button className="button__restart" onClick={restartGame}>
        Начать заново
      </button>
      <span>
        {winner == flags.bot
          ? "Проигрыш"
          : winner == flags.player
          && "Победа"}
      </span>
      <button onClick={() => console.log(moves)}>Инфо</button>
    </div>
  );
}

export default memo(TicTacToe);

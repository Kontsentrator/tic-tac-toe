import React, { useEffect, useState } from "react";
import Cell from "./cell";

import { useAppSelector, useAppDispatch } from '../store/hooks';
import { initialState, move, restart } from '../store/boardSlice';

import { Observable } from "rxjs";
import { Datas, IMoveInfo } from '../interfaces/interface';

function TicTacToe({data}: Datas) {
    // Данные о текущем ходе
    const [currentMoveInfo, setCurrentMoveInfo] = useState<IMoveInfo>({game: 0, row: 0, col: 0, isPlayer: initialState.nextTurn});
    const [winner, setWinner] = useState<string>('');
    // Метки полей
    const flags = {player: "x", bot: "o"};
    const rowsNum = useAppSelector(state => state.boardReducer.board.length);
    const colsNum = 3;
    
    const board = useAppSelector(state => state.boardReducer.board);
    const nextTurn = useAppSelector(state => state.boardReducer.nextTurn);
    const dispatch = useAppDispatch();

    const makeMove = (flag: string, row: number, col: number) => {
        dispatch({type: move.type, payload: {flag: flag, row: row, col: col}});
        setCurrentMoveInfo({game: 0, row: row, col: col, isPlayer: nextTurn});
    }
    
    // const stream$ = new Observable(observer => {
    //     observer.next(board);
    // });
    // stream$.subscribe(
    //     () => {
    //         if(!nextTurn && hasEmptyCells(board)) {
    //             let rand;
    //             do {
    //                 rand = Math.round(random(0, 9));
    //             } while(board[rand] !== '');
    //             setMove("o", rand);
    //         }
    //     }
    // );

    // -------------- Эффекты -------------

    // Проверка победителя
    useEffect(() => {
        let flag = nextTurn ? flags.bot : flags.player;
        if(checkWinner(flag)) {
            setWinner(flag);
        }
    }, [board, nextTurn])

    // Ход бота
    useEffect(() => {
        if(!nextTurn && hasEmptyCells(board) && !winner) {
            let randRow, randCol;
            do {
                randRow = Math.round(random(0, 2));
                randCol = Math.round(random(0, 2));
            } while(board[randRow][randCol] !== '');
            makeMove(flags.bot, randRow, randCol);
        }
    }, [nextTurn]);

    // Автоматическое сохранение информации о ходе
    useEffect(() => {
        saveMoveInfo();
    }, [board, nextTurn]);

    // -------------- Методы -------------

    const checkLines = (flag: string): boolean => {
        for(let row = 0; row < rowsNum; row++) {
            let rowCheck = true;
            let colCheck = true;
            for(let col = 0; col < colsNum; col++) {
                rowCheck &&= (board[row][col] === flag);
                colCheck &&= (board[col][row] === flag);
            }
            
            if(rowCheck || colCheck) {
                return true;
            }
        }
        return false;
    }

    const checkDiagonals = (flag: string): boolean => {
        let toRight = true;
        let toLeft = true;
        for(let row = 0; row < rowsNum; row++) {
            toRight &&= (board[row][row] === flag);
            toLeft &&= (board[rowsNum - 1 - row][row] === flag);
        }

        if(toRight || toLeft) {
            return true;
        }
        return false;
    }

    const checkWinner = (flag: string): boolean => {
        if(checkLines(flag) || checkDiagonals(flag)) {
            return true;
        }
        return false;
    }

    // Cохранение информации о ходе
    const saveMoveInfo = async () => {
        const response = await fetch("http://localhost:3000/api/board", {
            method: 'POST',
            body: JSON.stringify({currentMoveInfo}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
    }

    // Вывод случайного числа
    const random = (min: number, max: number): number => {
        return min + (Math.random() * (max-min));
    }

    // Проверка, что на поле остались пустые клетки
    const hasEmptyCells = (array: string[][]): boolean => {
        return !array.every(row => row.every(el => el !== ''));
    }

    // Перезапуск игры
    const restartGame = () => {
        dispatch({type: restart.type});
        setWinner('');
    }

    // Обработка клика по клетке поля
    const handleCellClick = (row: number, col: number) => {
        if(nextTurn && board[row][col] === '') {
            makeMove(flags.player, row, col);
        }
    }

    // Создание поля для игры
    const createBoard = () => {
        let field = [];
        for(let row = 0; row < rowsNum; row++) {
            let rows = [];
            for(let col = 0; col < colsNum; col++) {
                rows.push(<Cell 
                    key={col} 
                    onClick={() => handleCellClick(row, col)} 
                    value={board[row][col]} 
                />);
            }
            field.push(<div className="row" key={row}>{rows}</div>);
        }
        return field;
    }

    return(
        <div className="game">
            <p>{initialState.nextTurn ? "Вы ходите первым" : "Вы ходите вторым"}</p>
            <div className="field">
                {createBoard()}
            </div>
            
            <button className="button__restart" onClick={restartGame}>Начать заново</button>
            <span>{
                winner == flags.bot ? "Проигрыш" : (winner == flags.player ? "Победа" : "") 
            }</span>
            <button onClick={() => console.log(data)}>Инфо</button>
        </div>
    );
}

export default TicTacToe;
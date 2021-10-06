import React, { useEffect } from "react";
import Cell from "./cell";

import { useAppSelector, useAppDispatch } from '../store/hooks';
import { move, restart } from '../store/boardSlice';

import { Observable } from "rxjs";
import { Datas } from '../interfaces/interface';

function TicTacToe({data}: Datas) {
    const board = useAppSelector(state => state.boardReducer.board);
    const nextTurn = useAppSelector(state => state.boardReducer.nextTurn);
    const dispatch = useAppDispatch();

    const setMove = (flag: string, col: number, row: number) => {
        dispatch({type: move.type, payload: {flag: flag, pos: [col, row]}});
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

    useEffect(() => {
        console.log("Проверка победителя");
        if(checkWinner()) {
            console.log("Победитель!");
        }
    }, [board, nextTurn])

    // Ход бота
    useEffect(() => {
        if(!nextTurn && hasEmptyCells(board)) {
            let rand1, rand2;
            do {
                rand1 = Math.round(random(0, 2));
                rand2 = Math.round(random(0, 2));
            } while(board[rand1][rand2] !== '');
            setMove("o", rand1, rand2);
        }
    }, [nextTurn]);

    // Автоматическое сохранение информации о ходе
    useEffect(() => {
        saveMove();
    }, [board, nextTurn]);

    // -------------- Методы -------------

    const checkWinner = (): boolean => {
        let check = true;
        let flag = "x";
        for(let row = 0; row < 3; row++) {
            check = check && board[row].every(el => el === flag);
            if(check) {
                return true;
            }
        }
        return false;
    }

    // Cохранение информации о ходе
    const saveMove = async () => {
        const response = await fetch("http://localhost:3000/api/board", {
            method: 'POST',
            body: JSON.stringify({board, nextTurn}),
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
    }

    // Обработка клика по клетке поля
    const handleCellClick = (row: number, col: number) => { 
        if(nextTurn && board[col][row] === '') {
            setMove("x", col, row);
        }
    }

    // Создание поля для игры
    const createBoard = () => {
        let field = [];
        for(let row = 0; row < 3; row++) {
            let rows = [];
            for(let col = 0; col < 3; col++) {
                rows.push(<Cell 
                    key={col} 
                    onClick={() => handleCellClick(col, row)} 
                    value={board[row][col]} 
                />);
            }
            field.push(<div className="row" key={row}>{rows}</div>);
        }
        return field;
    }

    return(
        <div className="game">
            <p>{nextTurn ? "Вы ходите первым" : "Вы ходите вторым"}</p>
            <div className="field">
                {createBoard()}
            </div>
            <button className="button__restart" onClick={restartGame}>Начать заново</button>
            <span>{hasEmptyCells(board) ? '' : 'Игра окончена'}</span>
            <button onClick={() => console.log(data)}>Инфо</button>
        </div>
    );
}

export default TicTacToe;
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Observable } from 'rxjs';
import Cell from "./cell";

import { IState } from "./store/store";

type TicTacToeProps = {
    playerFirst: boolean
}

const TicTacToe: React.FC<TicTacToeProps> = ({playerFirst}) => {
    const [board, setBoard] = useState<string[]>(Array(9).fill('')); // Поле игры
    const [playerNextTurn, setPlayerNextTurn] = useState<Boolean>(playerFirst); // Чей ход следующий
    const [restart, setRestart] = useState<boolean>(false);

    const dispatch = useDispatch();
    const board1 = useSelector((state: IState) => state.board);
    
    const move = () => {
        dispatch({type: "MOVE", payload: {flag: "x", pos: 5}})
    }

    // const stream$ = new Observable(observer => {
    //     observer.next(board);
    // });
    // stream$.subscribe(
    //     (v) => console.log(v)
    // );

    // -------------- Эффекты -------------

    // Перезапуск игры
    useEffect(() => {
        if(restart)
            restartGame();
    }, []);

    // Ход бота
    useEffect(() => {
        if(!playerNextTurn && hasEmptyCells(board)) {
            let tempBoard = board;
            let rand;
            do {
                rand = Math.round(random(0, 9));
            } while(tempBoard[rand] !== '');
            tempBoard[rand] = 'o';
            setBoard(tempBoard);
            setPlayerNextTurn(prev => !prev);
        }
    }, [playerNextTurn]);

    // Установка поля игры в localhost
    useEffect(() => {
        localStorage.setItem('board', JSON.stringify(board));
    }, [board.values(), board]);

    // Установка значения, кто ходит следующим
    useEffect(() => {
        localStorage.setItem('playerNextTurn', JSON.stringify(playerNextTurn));
    }, [playerNextTurn]);

    // Загрузка значений из localstorage
    useEffect(() => {
        if(localStorage.getItem('board'))
            setBoard(JSON.parse(localStorage.getItem('board') as string));
        
        if(localStorage.getItem('playerNextTurn'))
            setPlayerNextTurn(JSON.parse(localStorage.getItem('playerNextTurn') as string));
    }, []);

    // -------------- Методы -------------

    // Вывод случайного числа
    const random = (min: number, max: number): number => {
        return min + (Math.random() * (max-min));
    }

    // Проверка, что на поле остались пустые клетки
    const hasEmptyCells = (array: string[]): boolean => {
        return !array.every(item => item !== '');
    }

    // Перезапуск игры
    const restartGame = () => {
        console.log("Перезапуск");
        localStorage.clear();
        setBoard(Array(9).fill(''));
        setPlayerNextTurn(playerFirst);
    }

    // Обработка клика по клетке поля
    const handleCellClick = (id: number) => { 
        let tempBoard = board;
        if(playerNextTurn && tempBoard[id] === '') {
            tempBoard[id] = 'x';
            setBoard(tempBoard);
            setPlayerNextTurn(prev => !prev);
        }
    }

    return(
        <div className="game">
            <p>{playerFirst ? "Вы ходите первым" : "Вы ходите вторым"}</p>
            <div className="field">
                {board.map((value, index) =>
                    <Cell 
                        key={index} 
                        onClick={() => handleCellClick(index)} 
                        value={value} 
                    />
                )}
            </div>
            <button className="button__restart" onClick={restartGame}>Начать заново</button>
            <span>{hasEmptyCells(board) ? '' : 'Игра окончена'}</span>
        </div>
    );
}

export default TicTacToe;
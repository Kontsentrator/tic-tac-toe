import React, { useState, useEffect } from "react";
import Cell from "./cell";

type TicTacToeProps = {
    
}

const TicTacToe: React.FC<TicTacToeProps> = () => {
    const [board, setBoard] = useState<string[]>(Array(9).fill('')); // Поле игры
    const [playerNextTurn, setPlayerNextTurn] = useState<Boolean>(true); // Чей ход следующий
    const [restart, setRestart] = useState<boolean>(true);

    // -------------- Эффекты -------------
    // Проверка, что на поле остались пустые клетки
    const hasEmptyCells = (array: string[]): boolean => {
        return !array.every(item => item !== '');
    }
    useEffect(() => {
        console.log(hasEmptyCells(board));
    }, [hasEmptyCells]);

    // Перезапуск игры
    useEffect(() => {
        if(restart)
            restartGame();
    }, []);

    // Загрузка значений из localstorage
    useEffect(() => {
        if(localStorage.getItem('board'))
            setBoard(JSON.parse(localStorage.getItem('board') as string));
        
        if(localStorage.getItem('playerNextTurn'))
            setPlayerNextTurn(JSON.parse(localStorage.getItem('playerNextTurn') as string));
    }, []);

    // Установка поля игры в localhost
    useEffect(() => {
        localStorage.setItem('board', JSON.stringify(board));
    }, [board.values(), board]);

    // Установка значения, кто ходит следующим
    useEffect(() => {
        localStorage.setItem('playerNextTurn', JSON.stringify(playerNextTurn));
    }, [playerNextTurn]);

    // Ход бота
    useEffect(() => {
        if(!playerNextTurn) {
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

    // -------------- Методы -------------

    const random = (min: number, max: number): number => {
        return min + (Math.random() * (max-min));
    }

    

    const restartGame = () => {
        setBoard(Array(9).fill(''));
        setPlayerNextTurn(true);
    }

    // Обработка клика по клетке поля
    const handleCellClick = (id: number) => { 
        let tempBoard = board;
        if(playerNextTurn)
            tempBoard[id] = 'x';

        setBoard(tempBoard);
        setPlayerNextTurn(prev => !prev);
    }

    return(
        <div className="game">
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
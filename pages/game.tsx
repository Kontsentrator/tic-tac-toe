import React, { useState, useEffect } from "react";
import Cell from "./cell";

type TicTacToeProps = {
    
}

const TicTacToe: React.FC<TicTacToeProps> = () => {
    const [board, setBoard] = useState<string[]>(Array(9).fill('')); // Поле игры
    const [playerNextTurn, setPlayerNextTurn] = useState<Boolean>(true); // Чей ход следующий

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

    const handleCellClick = (id: number) => { 
        console.log("Зашли");
        let tempBoard = board;
        playerNextTurn ? tempBoard[id] = 'x' : tempBoard[id] = 'o';

        setBoard(tempBoard);
        setPlayerNextTurn(prev => !prev);
    }

    return(
        <div className="field">
            {board.map((value, index) =>
                <Cell 
                    key={index} 
                    onClick={() => handleCellClick(index)} 
                    value={value} 
                />
            )}
        </div>
    );
}

export default TicTacToe;
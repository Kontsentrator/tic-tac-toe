import React, { useState } from "react";
import Cell from "./cell";

type TicTacToeProps = {
    board: string[]
}

const TicTacToe: React.FC<TicTacToeProps> = ({board}) => {
    const [nextTurn, setNextTurn] = useState<Boolean>(true);

    const handleCellClick = (e: React.MouseEvent<HTMLElement>) => { 
        if((e.target as HTMLElement).innerHTML === '') {
            if(nextTurn)
                (e.target as HTMLElement).innerHTML = 'X';
            else {
                (e.target as HTMLElement).innerHTML = 'O';
            }
            setNextTurn(prev => !prev);
            localStorage.setItem('nextTurn', nextTurn + '');
        }
    }

    return(
        <div className="field">
            {board.map((value, index) =>
                <Cell 
                    key={index} 
                    onClick={handleCellClick} 
                    value={value} 
                />
            )}
        </div>
    );
}

export default TicTacToe;
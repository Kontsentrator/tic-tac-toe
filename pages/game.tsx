import React, { useState } from "react";
import Cell from "./cell";

type TicTacToeProps = {
    
}

const TicTacToe: React.FC<TicTacToeProps> = () => {
    const [board, setBoard] = useState<string[]>(Array(9).fill(null));
    const [nextTurn, setNextTurn] = useState<Boolean>(true);

    const handleCellClick = (e: React.MouseEvent<HTMLElement>) => { 
        console.log(e);
        setNextTurn(prev => !prev);
        localStorage.setItem('nextTurn', nextTurn + '');
        
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
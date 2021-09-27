import React, { EventHandler, ReactElement, useState } from "react";
import Cell from "./cell";

type TicTacToeProps = {
    field: string[]
}

const TicTacToe: React.FC<TicTacToeProps> = ({field}) => {
    const [nextTurn, setNextTurn] = useState<Boolean>(true);

    const handleCellClick = (e: React.MouseEvent<HTMLElement>) => { 
        (e.target as HTMLElement).innerHTML = "turn as string";
        setNextTurn(prev => !prev);
    }

    return(
        <div className="field">  
        {
            field.map((cell, index) => {
                <Cell key={index} onClick={handleCellClick} value={cell} />
            })
        }
        </div>
    );
}

export default TicTacToe;
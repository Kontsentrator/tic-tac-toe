import React from "react";

type SquareProps = {
    value: string,
    onClick(e: React.MouseEvent<HTMLElement>): void
}

const Cell: React.FC<SquareProps> = ({value, onClick}) => {
    return(
        <div className="cell" onClick={(e) => onClick(e)}>
            {value}
        </div>
    );
}

export default Cell;
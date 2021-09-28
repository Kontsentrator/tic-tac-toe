import React from "react";

type CellProps = {
    value: string,
    onClick(): void
}

const Cell: React.FC<CellProps> = ({value, onClick}) => {
    console.log();
    return(
        <div className="cell" onClick={onClick}>
            {value}
        </div>
    );
}

export default Cell;
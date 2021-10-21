import React, { memo } from "react";
import Cell from "./cell";

type BoardProps = {
  board: string[][];
  onClick(row: number, col: number): void;
};

const Board: React.FC<BoardProps> = ({ board, onClick }) => {
  return (
    <>
      {board.map((row, rowNum) => (
        <div className="row" key={rowNum}>
          {row.map((col, colNum) => (
            <Cell
              key={colNum}
              row={rowNum}
              col={colNum}
              onClick={onClick}
              value={col}
            />
          ))}
        </div>
      ))}
    </>
  );
};

export default Board;

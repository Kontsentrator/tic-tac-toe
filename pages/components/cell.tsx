import React, { memo } from "react";

type CellProps = {
  value: string;
  row: number;
  col: number;
  onClick(row: number, col: number): void;
};

const Cell: React.FC<CellProps> = ({ value, row, col, onClick }) => {
  console.log(row, col);
  return (
    <div className="cell" onClick={() => onClick(row, col)}>
      {value}
    </div>
  );
};

export default Cell;

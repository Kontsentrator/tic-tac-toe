import React, { memo } from "react";

type CellProps = {
  value: string;
  row: number;
  col: number;
  onClick(row: number, col: number): void;
};

const Cell: React.FC<CellProps> = ({ value, row, col, onClick }) => {
  return (
    <div className="cell" onClick={() => onClick(row, col)}>
      {value}
    </div>
  );
};

export default memo(Cell);

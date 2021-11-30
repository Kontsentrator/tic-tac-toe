import React, { memo } from "react";

type CellProps = {
  className: string;
  value: string;
  row: number;
  col: number;
  onClick(row: number, col: number): void;
};

const Cell: React.FC<CellProps> = ({ className, value, row, col, onClick }) => {
  return (
    <div className={className} onClick={() => onClick(row, col)}>
      {value}
    </div>
  );
};

export default memo(Cell);

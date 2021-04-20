import React, { useState } from "react";
import clsx from "clsx";

import "~/components/table-constructor/table-constructor.scss";

const template = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
];

type TableConstructorType = {
  onSelect?: (rowNum: number, colNum: number) => void | undefined;
};

export const TableConstructor: React.FC<TableConstructorType> = ({ onSelect }) => {
  const [numRows, setNumRows] = useState(0);
  const [numCols, setNumCols] = useState(0);

  function onHover(rowIndex: number, colIndex: number) {
    setNumRows(rowIndex);
    setNumCols(colIndex);
  }

  return (
    <div className="table-constructor" tabIndex={1}>
      {template.map((n, idx) => (
        <div className="table-con-row" key={idx}>
          {n.map((c, idx2) => (
            <div
              className={clsx(
                "table-con-cell",
                idx2 <= numCols && idx <= numRows ? "table-con-cell-active" : ""
              )}
              key={idx2}
              onMouseEnter={() => {
                onHover(idx, idx2);
              }}
              onClick={() => onSelect?.(numRows + 1, numCols + 1)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

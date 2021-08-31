import React from "react";
import ReactDataSheet from "react-datasheet";

import "react-datasheet/lib/react-datasheet.css";

export interface GridElement extends ReactDataSheet.Cell<GridElement, number> {
  value: number | null;
}

interface AppState {
  grid: GridElement[][];
}

const cellRenderer: ReactDataSheet.CellRenderer<GridElement, number> = (props) => {
  const backgroundStyle = props.cell.value && props.cell.value < 0 ? { color: "red" } : undefined;
  return (
    <td
      style={backgroundStyle}
      onMouseDown={props.onMouseDown}
      onMouseOver={props.onMouseOver}
      onDoubleClick={props.onDoubleClick}
      className="cell"
    >
      {props.children}
    </td>
  );
};

class CustomDataSheet extends ReactDataSheet<GridElement, number> {}

export const TableBlock: React.FC = () => {
  const [data, setData] = React.useState<AppState>({
    grid: [
      [{ value: 1 }, { value: -3 }],
      [{ value: -2 }, { value: 4 }],
    ],
  });

  return (
    <CustomDataSheet
      data={data.grid}
      valueRenderer={(cell) => cell.value}
      onCellsChanged={(changes) => {
        const grid = data.grid.map((row) => [...row]);
        changes.forEach(({ cell, row, col, value }) => {
          grid[row][col] = { ...grid[row][col], value };
        });
        setData({ grid });
      }}
      cellRenderer={cellRenderer}
    />
  );
};

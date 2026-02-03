import { type Cell } from "../tic-tac-toe";

type boxProps = {
  cell: Cell;
  handleMove: () => void;
};

const Box = ({ cell, handleMove }: boxProps) => {
  return (
    //invisible square. state can be null, or X, O.
    <th onClick={handleMove}> {cell} </th>
  );
};

export default Box;

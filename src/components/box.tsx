import { type Cell } from "../tic-tac-toe";

type boxProps = {
  cell: Cell;
  handleMove: () => void;
};

const Box = ({ cell, handleMove }: boxProps) => {
  return (
    //invisible square. state can be null, or X, O.
    <div onClick={handleMove}> cell {cell} </div>
  );
};

export default Box;

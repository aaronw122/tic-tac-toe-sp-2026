import { type Cell } from "../tic-tac-toe";

type boxProps = {
  cell: Cell;
  handleMove: () => void;
  className?: string;
};

const Box = ({ cell, handleMove, className }: boxProps) => {
  return (
    //invisible square. state can be null, or X, O.
    // replace with flexbox?
    <div className={className} onClick={handleMove}>
      {cell}
    </div>
  );
};

export default Box;

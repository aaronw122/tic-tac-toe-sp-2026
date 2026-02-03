import { type Cell } from "../tic-tac-toe";

const Box = ({ cell }: { cell: Cell }) => {
  return (
    //invisible square. state can be null, or X, O.
    <div> {cell} </div>
  );
};

export default Box;

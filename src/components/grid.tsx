import Box from "./box";
import type { Board } from "../tic-tac-toe";

const Grid = ({ board }: { board: Board }) => {
  return (
    <div>
      {board.map((el, i) => (
        <Box key={i} cell={el} />
      ))}
    </div>
  );
};

export default Grid;

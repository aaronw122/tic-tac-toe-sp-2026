import Box from "./box";
import type { GameState } from "../tic-tac-toe";

type handler = (state: GameState, position: number) => void;

type gridProps = {
  handleMove: handler;
  gameState: GameState;
};

const Grid = ({ handleMove, gameState }: gridProps) => {
  return (
    <div>
      <table>
        {gameState.board.map((el, i) => (
          <Box key={i} cell={el} handleMove={() => handleMove(gameState, i)} />
        ))}
      </table>
    </div>
  );
};

export default Grid;

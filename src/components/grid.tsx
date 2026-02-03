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
        <tr>
          <Box
            cell={gameState.board[0]}
            handleMove={() => handleMove(gameState, 0)}
          />
          <Box
            cell={gameState.board[1]}
            handleMove={() => handleMove(gameState, 1)}
          />
          <Box
            cell={gameState.board[2]}
            handleMove={() => handleMove(gameState, 2)}
          />
        </tr>
        <tr>
          <Box
            cell={gameState.board[3]}
            handleMove={() => handleMove(gameState, 3)}
          />
          <Box
            cell={gameState.board[4]}
            handleMove={() => handleMove(gameState, 4)}
          />
          <Box
            cell={gameState.board[5]}
            handleMove={() => handleMove(gameState, 5)}
          />
        </tr>
        <tr>
          <Box
            cell={gameState.board[6]}
            handleMove={() => handleMove(gameState, 6)}
          />
          <Box
            cell={gameState.board[7]}
            handleMove={() => handleMove(gameState, 7)}
          />
          <Box
            cell={gameState.board[8]}
            handleMove={() => handleMove(gameState, 8)}
          />
        </tr>
      </table>
    </div>
  );
};

export default Grid;

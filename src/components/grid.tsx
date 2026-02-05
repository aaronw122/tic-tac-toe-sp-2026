import Box from "./box";
import type { GameState, Player } from "../tic-tac-toe";

type handler = (player: Player, position: number) => void;

type gridProps = {
  handleMove: handler;
  gameState: GameState;
};

const Grid = ({ handleMove, gameState }: gridProps) => {
  return (
    <div>
      <div className="grid">
        <Box
          className="box box--bottom box--right"
          cell={gameState.board[0]}
          handleMove={() => handleMove(gameState.currentPlayer, 0)}
        />
        <Box
          className="box box--right box--bottom"
          cell={gameState.board[1]}
          handleMove={() => handleMove(gameState.currentPlayer, 1)}
        />
        <Box
          className="box box--bottom"
          cell={gameState.board[2]}
          handleMove={() => handleMove(gameState.currentPlayer, 2)}
        />
        <Box
          className="box box--right box--bottom"
          cell={gameState.board[3]}
          handleMove={() => handleMove(gameState.currentPlayer, 3)}
        />
        <Box
          className="box box--right box--bottom"
          cell={gameState.board[4]}
          handleMove={() => handleMove(gameState.currentPlayer, 4)}
        />
        <Box
          className="box box--bottom"
          cell={gameState.board[5]}
          handleMove={() => handleMove(gameState.currentPlayer, 5)}
        />
        <Box
          className="box box--right"
          cell={gameState.board[6]}
          handleMove={() => handleMove(gameState.currentPlayer, 6)}
        />
        <Box
          className="box box--right"
          cell={gameState.board[7]}
          handleMove={() => handleMove(gameState.currentPlayer, 7)}
        />
        <Box
          className="box"
          cell={gameState.board[8]}
          handleMove={() => handleMove(gameState.currentPlayer, 8)}
        />
      </div>
    </div>
  );
};

export default Grid;

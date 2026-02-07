import { useState, useEffect } from "react";

import {
  type GameState,
  type Player,
  type winnerAndState,
} from "../../types/types";
import Grid from "./grid";
import Message from "./topMessage";
import services from "../services/index";

const Game = ({ id }: { id: string }) => {
  const [topMessage, setTopMessage] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    services.getGame(id).then((r) => setGameState(r.gameState));
  }, [id]);

  console.log("gameState", gameState);

  const resetGame = async () => {
    setTopMessage(null);
    const newGame: winnerAndState = await services.newGame(id);
    setGameState(newGame.gameState);
  };

  const handleMove = async (player: Player, position: number) => {
    if (gameState!.board[position] !== null) {
      setTopMessage("error: position already taken");
      setTimeout(() => {
        setTopMessage(null);
      }, 1000);
      return;
    }

    const newState = await services.makeMove({ position, player }, id);

    setGameState(newState.gameState);

    if (newState.winner !== null) {
      setTopMessage(
        newState.winner === "CATS"
          ? `Cats game`
          : `${newState.winner} won the game!`,
      );
      setTimeout(() => {
        resetGame();
      }, 1000);
    }
  };

  return (
    <div>
      {gameState ? (
        <div className="app">
          <h1>Tic tac toe</h1>
          {topMessage ? (
            <Message msg={topMessage}></Message>
          ) : (
            <h3>current player: {gameState.currentPlayer}</h3>
          )}
          <Grid gameState={gameState} handleMove={handleMove}></Grid>
        </div>
      ) : (
        <div> loading</div>
      )}
    </div>
  );
};

export default Game;

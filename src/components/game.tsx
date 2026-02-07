import { useState, useEffect, useRef, useCallback } from "react";

import {
  type GameState,
  type Player,
  type winnerAndState,
  type switchState,
} from "../../types/types";
import Grid from "./grid";
import Message from "./topMessage";
import services from "../services/index";

type gameType = {
  id: string;
  switchState: switchState;
  currentView: string;
};

const Game = ({ id, switchState, currentView }: gameType) => {
  const [topMessage, setTopMessage] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const webSocket = useRef<WebSocket | null>(null);
  const [socketOn, setSocketOn] = useState<true | false>(false);

  const socketConnect = useCallback(() => {
    const ws = new WebSocket(`ws://localhost:5173/game/${id}/ws`);

    webSocket.current = ws;

    ws.onopen = () => {
      console.log("socket connected!");
    };

    //error handling, flesh
  }, [id]);

  useEffect(() => {
    socketConnect();
  }, [id, socketConnect]);

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
          <button onClick={() => switchState("lobby")}>back</button>
          <Grid gameState={gameState} handleMove={handleMove}></Grid>
        </div>
      ) : (
        <div> loading</div>
      )}
    </div>
  );
};

export default Game;

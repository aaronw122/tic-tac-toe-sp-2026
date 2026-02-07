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
  const [winner, setWinner] = useState<string | null>(null);

  const socketConnect = useCallback(() => {
    const ws = new WebSocket(`ws://localhost:5173/game/${id}/ws`);

    webSocket.current = ws;

    ws.onopen = () => {
      console.log("socket connected!");
      setSocketOn(true);
    };

    //on message, change gameState
    ws.onmessage = (event) => {
      try {
        //will receive the full winnerAndState prop, not just gameState
        const data = JSON.parse(event.data);
        if (data.type === "updateGame") {
          setGameState(data.winnerAndState.gameState);
          setWinner(data.winnerAndState.winner);
        }
      } catch (error) {
        console.error("failed to parse message", error);
      }
    };

    ws.onclose = (event) => {
      setSocketOn(false);
      console.log("websocket disconnected");

      if (event.code === 1008) {
        console.log("game not found");
        switchState("lobby");
      } else {
        setTimeout(socketConnect, 4000);
      }
    };

    ws.onerror = (error) => {
      console.log("websocket error:", error);
      setSocketOn(false);
    };
    //error handling, flesh. added switchState as dependency since it will impact connection
  }, [id, switchState]);

  useEffect(() => {
    services.getGame(id).then((r) => setGameState(r.gameState));
  }, [id]);

  console.log("winner check", winner);
  //place this below the useEffect where we fetchgame state

  useEffect(() => {
    socketConnect();

    // returns inside use effect always imply when
    return () => {
      if (webSocket.current) {
        webSocket.current.close();
        webSocket.current = null;
      }
    };
  }, [id, socketConnect]);

  //run when winner changes inside new useEffect
  useEffect(() => {
    if (winner !== null) {
      console.log("inside conditional");
      setTopMessage(
        winner === "CATS" ? `Cats game` : `${winner} won the game!`,
      );
      setTimeout(() => {
        setTopMessage(null);
        services.newGame(id);
      }, 1000);
    }
  }, [winner, id]);

  console.log("gameState", gameState);

  const checkWinner = () => {
    console.log("winner should be x", winner);
  };

  const handleMove = async (player: Player, position: number) => {
    if (gameState!.board[position] !== null) {
      setTopMessage("error: position already taken");
      setTimeout(() => {
        setTopMessage(null);
      }, 1000);
      return;
    }

    await services.makeMove({ position, player }, id);

    checkWinner();
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

import { useState } from "react";
import { createGame, makeMove, getWinner, type Winner } from "./tic-tac-toe";
import Grid from "./components/grid";
import Message from "./components/topMessage";
import "./app.css";
import services from "./services/index";

function App() {
  const [gameState, setGameState] = useState(createGame());
  const [winner, setWinner] = useState<Winner | null>(null);
  const [topMessage, setTopMessage] = useState<string | null>(null);

  const resetGame = () => {
    setTopMessage(null);
    setWinner(null);
    setGameState(createGame());
  };

  const handleMove = async (
    player: typeof gameState.currentPlayer,
    position: number,
  ) => {
    const newState = await services.makeMove({ position, player });
    console.log(newState);
    setGameState(newState);

    const winner = getWinner(newState);
    setWinner(winner);

    if (winner !== null) {
      setTopMessage(
        winner === "CATS" ? `Cats game` : `${winner} won the game!`,
      );

      setTimeout(() => {
        resetGame();
      }, 1);
    }
  };

  // TODO: display the gameState, and call `makeMove` when a player clicks a button
  return (
    <div className="app">
      <h1>Tic tac toe</h1>
      {winner ? (
        <Message msg={topMessage}></Message>
      ) : (
        <h3>current player: {gameState.currentPlayer}</h3>
      )}
      <Grid gameState={gameState} handleMove={handleMove}></Grid>
    </div>
  );
}

export default App;

import { useState } from "react";
import { createGame, makeMove, getWinner, type Winner } from "./tic-tac-toe";
import Grid from "./components/grid";
import Message from "./components/topMessage";
import "./app.css";

function App() {
  const [gameState, setGameState] = useState(getInitialGame());
  const [winner, setWinner] = useState<Winner | null>(null);
  const [topMessage, setTopMessage] = useState<string | null>(null);

  const handleMove = (state: typeof gameState, position: number) => {
    const newState = makeMove(state, position);
    setGameState(newState);
    const winner = getWinner(newState);
    if (winner === "O" || winner === "X") {
      setTopMessage(`${winner} won the game!`);
      setTimeout(() => {
        setTopMessage(null);
        setWinner(null);
        setGameState(createGame());
      }, 1500);
    }
    setWinner(winner);
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

function getInitialGame() {
  const initialGameState = createGame();
  return initialGameState;
}

export default App;

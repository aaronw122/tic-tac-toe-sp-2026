import { useState, useEffect } from "react";
import { createGame, makeMove, getWinner } from "./tic-tac-toe";
import Grid from "./components/grid";
import "./app.css";

function App() {
  const [gameState, setGameState] = useState(getInitialGame());
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    let win = getWinner(gameState);
  }, [gameState]);

  const handleMove = (state: typeof gameState, position: number) => {
    const newState = makeMove(state, position);
    setGameState(newState);
  };
  // TODO: display the gameState, and call `makeMove` when a player clicks a button
  return (
    <div>
      <h1>Tic tac toe</h1>
      <h3>current player: {gameState.currentPlayer}</h3>
      <Grid gameState={gameState} handleMove={handleMove}></Grid>
    </div>
  );
}

function getInitialGame() {
  const initialGameState = createGame();
  return initialGameState;
}

export default App;

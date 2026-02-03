import { useState, useEffect } from "react";
import { createGame, makeMove, getWinner } from "./tic-tac-toe";

function App() {
  let [gameState, setGameState] = useState(getInitialGame());

  useEffect(() => {
    getWinner(gameState);
  }, [gameState]);
  // TODO: display the gameState, and call `makeMove` when a player clicks a button
  return (
    <div>
      <h1>Tic tac toe</h1>
      <h3>current player: {gameState.currentPlayer}</h3>
    </div>
  );
}

function getInitialGame() {
  let initialGameState = createGame();
  initialGameState = makeMove(initialGameState, 3);
  initialGameState = makeMove(initialGameState, 0);
  return initialGameState;
}

export default App;

import { useState, useEffect } from "react";
import { type Winner, type GameState, type Player } from "./tic-tac-toe";
import Grid from "./components/grid";
import Message from "./components/topMessage";
import "./app.css";
import services from "./services/index";

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [winner, setWinner] = useState<Winner | null>(null);
  const [topMessage, setTopMessage] = useState<string | null>(null);

  useEffect(() => {
    services.getGame().then((r) => setGameState(r));
  }, []);

  const resetGame = async () => {
    setTopMessage(null);
    setWinner(null);
    const newGame = await services.newGame();
    setGameState(newGame);
  };

  const handleMove = async (player: Player, position: number) => {
    const newState = await services.makeMove({ position, player });
    console.log("new state full", newState);
    setGameState(newState.gameState);

    setWinner(newState.winner);

    if (newState.winner !== null) {
      console.log("inside");
      setTopMessage(
        winner === "CATS" ? `Cats game` : `${newState.winner} won the game!`,
      );
      setTimeout(() => {
        resetGame();
      }, 1000);
    }
  };

  // TODO: display the gameState, and call `makeMove` when a player clicks a button
  return (
    <div>
      {gameState ? (
        <div className="app">
          <h1>Tic tac toe</h1>
          {winner ? (
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
}

export default App;

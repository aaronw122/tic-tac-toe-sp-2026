import { useState, useEffect } from "react";
import "./app.css";
import services from "./services/index";
import { type ShortLobbyReact } from "../types/types";
import Lobby from "./components/lobby";
import Game from "./components/game";
import CreateGame from "./components/createGame";

function App() {
  const [currentView, setCurrentView] = useState<string>("lobby");
  const [lobby, setLobby] = useState<ShortLobbyReact | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [newGameName, setNewGameName] = useState<string>("");

  useEffect(() => {
    services.getLobby().then((r) => {
      console.log("response object", r);
      setLobby(r);
    });
  }, [currentView]);

  console.log("short lobby", lobby);

  const switchState = (view: string, id?: string) => {
    console.log("function fired");
    console.log("data sent", view);
    setCurrentView(view);

    if (view !== "game") {
      console.log("set id to null");
      setGameId(null);
    }
    //will this setter below be a problem?
    // we will need to set it to null when currentView switches
    if (id) {
      setGameId(id);
    }
  };

  const handleNameChange = (event: any) => {
    setNewGameName(event.target.value);
  };

  const addGame = async () => {
    const response = await services.addGame(newGameName);
    console.log("response", response);
    const id = response.id;
    //update setter with id. its fine since it will finish this first, then show the new view?
    setGameId(id);
    setCurrentView("game");
    setNewGameName("");
  };

  const appView = () => {
    if (currentView === "lobby") {
      return (
        <Lobby lobby={lobby!} switchState={switchState} addGame={addGame} />
      );
    } else if (currentView === "game") {
      return <Game id={gameId!} />;
    } else if (currentView === "createGame") {
      return (
        <CreateGame
          handleNameChange={handleNameChange}
          addGame={addGame}
          newGameName={newGameName}
        />
      );
    }
  };

  return <div className="app">{appView()}</div>;
}
export default App;

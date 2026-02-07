import type { ShortLobbyReact, switchState } from "../../types/types";

import GameView from "./gameView";

type LobbyComponent = {
  lobby: ShortLobbyReact;
  switchState: switchState;
  addGame: () => void;
};

//types for lobby

const Lobby = ({ lobby, switchState }: LobbyComponent) => {
  return (
    //fix styling here, don't use app at the top
    <div className="app">
      <h1>tic tac toe</h1>
      {lobby === null ? (
        <p> loading </p>
      ) : (
        <div>
          <h2 className="lobby">lobby</h2>
          <GameView lobby={lobby} switchState={switchState} />
        </div>
      )}
      <button onClick={() => switchState("createGame")}> add a new game</button>
    </div>
  );
};

//change state of current view property onClick

export default Lobby;

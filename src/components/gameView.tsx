import { type ShortLobbyReact, type switchState } from "../../types/types";
import GameCard from "./gameCard";

type gameView = {
  lobby: ShortLobbyReact;
  switchState: switchState;
};

//map over the object to show card
const GameView = ({ lobby, switchState }: gameView) => {
  const lobbyKeys = Object.keys(lobby);

  return (
    <div className="gameView">
      {lobbyKeys.map((el: string) => {
        const value = lobby[el];
        return (
          <GameCard key={el} name={value} id={el} switchState={switchState} />
        );
      })}
    </div>
  );
};

export default GameView;

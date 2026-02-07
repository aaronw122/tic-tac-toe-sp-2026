import type { switchState } from "../../types/types";

type card = {
  name: string;
  id: string;
  switchState: switchState;
};

const GameCard = ({ name, id, switchState }: card) => {
  return (
    <div className="card" onClick={() => switchState("game", id)}>
      <p>{name}</p>
    </div>
  );
};

export default GameCard;

//prop drill function into this
// onclick run addGame function, which takes name field and adds it
// sheet with input field, simple FSO stuff

type createGameTypes = {
  handleNameChange: (event: unknown) => void;
  addGame: () => void;
  newGameName: string;
};

const CreateGame = ({
  handleNameChange,
  addGame,
  newGameName,
}: createGameTypes) => {
  return (
    <div>
      <h2>Create a game</h2>
      <form onSubmit={() => addGame()}>
        <div className="createGame">
          <input onChange={handleNameChange} value={newGameName} />
          <button type="submit">create game</button>
        </div>
      </form>
    </div>
  );
};

export default CreateGame;

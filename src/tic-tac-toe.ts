export type Player = "X" | "O";

export type Cell = Player | null;

// Board is a 3x3 grid, represented as a 9-element array.
// Indices map to positions:
//  0 | 1 | 2
//  ---------
//  3 | 4 | 5
//  ---------
//  6 | 7 | 8
export type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];

export type GameState = {
  board: Board;
  currentPlayer: Player;
};

export type Winner = Player | 'CATS'

export function createGame(): GameState {
  return {
    board: [null, null, null, null, null, null, null, null, null],
    currentPlayer: "X",
  };
}

export function changePlayer(player: Player): Player {
  return (
    player === 'O' ? 'X': 'O'
  )
}

export function makeMove(state: GameState, position: number): GameState {

  console.log('move made', position)

  if (getWinner(state) !== null) {
    throw "Game is already over"
  }

  if (!Number.isInteger(position)) {
    throw "Position must be an integer"
  }

  if (position < 0 || position > 8) {
    throw "Position must be between 0 and 8"
  }

  if (state.board[position] !== null) {
    throw "Position is already occupied"
  }

  const newArr = state.board.map((item, i) => {
    if (i === position) {
      return state.currentPlayer
    }
    else {
      return item
    }
  }) as Board;

  console.log('new array', newArr)

  const firstNewState:GameState = { ...state, board: newArr }
  console.log('newgame state', firstNewState)

  let secondNewState: GameState = { ...firstNewState }

  console.log('second new state', secondNewState)

  if (getWinner(firstNewState) === null) {
    //change state if no winner
    secondNewState = {...firstNewState, currentPlayer: changePlayer(state.currentPlayer)}
  }

  console.log('should be updated', secondNewState)
  return secondNewState
}

export function getWinner(state: GameState): Winner | null {

  const win = state.currentPlayer.repeat(3)
  console.log('should be XXX', win)

  //for loop
  // whenever we find a null, store in another array
  // if any other combinations contain array, skip completely

  const potentialCombinations = ['012', '345', '678', '036', '147', '258', '246', '048']

  for (let i = 0; i < 8; i++) {
    const str: string = potentialCombinations[i]
    console.log(str.slice(0, 1))
    // create array with the 3 combinations, check if null. THEN see if all added up is good.
    const arr = [state.board[Number(str.slice(0, 1))], state.board[Number(str.slice(1, 2))], state.board[Number(str.slice(2))]]

    if (arr[0] === null || arr[1] === null ||arr[2] === null ) {
      continue
    }
    else {
      const check = arr[0] + arr[1] + arr[2]
      console.log('arr', arr)
      if (check === win) {
        console.log('winner!')
        return state.currentPlayer
      }
    }
  }
  if (!state.board.includes(null)) {
    return 'CATS'
  }
  return null;

}

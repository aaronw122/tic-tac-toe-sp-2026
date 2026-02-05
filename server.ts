import express, {type Request, type Response} from 'express';
import ViteExpress from 'vite-express';
import { type GameState, type Board, type Player, type Winner} from './src/tic-tac-toe';
import cors from 'cors';

const app = express()

app.use(express.json())

app.use(cors({origin: "http://localhost:5173"}))

let gameState: GameState = {
  board: [null, null, null, null, null, null, null, null, null],
  currentPlayer: "X",
}


const reversePlayer = () => {
  if (gameState.currentPlayer === 'X')
    return 'O'
  else
    return 'X'
}

const checkWinner = () => {

  const origPlayer = reversePlayer()

  const win = origPlayer.repeat(3)

  console.log('game state', gameState)

  const potentialCombinations = ['012', '345', '678', '036', '147', '258', '246', '048']

  for (let i = 0; i < 8; i++) {
    const str: string = potentialCombinations[i]
    // create array with the 3 combinations, check if null. THEN see if all added up is good.
    const arr = [gameState.board[Number(str.slice(0, 1))], gameState.board[Number(str.slice(1, 2))], gameState.board[Number(str.slice(2))]]

    if (arr[0] === null || arr[1] === null ||arr[2] === null ) {
      continue
    }
    else {
      const check = arr[0] + arr[1] + arr[2]
      console.log('arr', arr)
      if (check === win) {
        console.log('winner!', origPlayer )
        return origPlayer
      }
    }
  }

  if (!gameState.board.includes(null)) {
    return 'CATS'
  }
  console.log('null')
  return null;
}

app.get('/game', async (req: Request, res: Response) => {
  res.json(gameState)
})

app.post('/game', async (req: Request, res: Response) => {
  type Body = {
    position: number,
    player: Player
  }

  const body:Body = req.body

  //error handling
  if (gameState.board[body.position] !== null) {
    return res.status(400).json({error: "Position is already occupied"})
  }
  if (checkWinner() !== null) {
    return res.status(400).json({error: "Game is already over"})
  }

  if (!Number.isInteger(body.position)) {
    return res.status(400).json({error: "Position must be an integer"})
  }

  if (body.position < 0 || body.position > 8) {
    return res.status(400).json({error: "Position must be between 0 and 8"})
  }

  if (gameState.board[body.position] !== null) {
    return res.status(400).json({error: "Position is already occupied"})
  }
  //modify board at index position to be new value.
  // modify player to be other one

  const newBoard = gameState.board.map((item, i) => {
    if (i === body.position) {
      return body.player
    }
    else {
      return item
    }
  }) as Board;

  const newGameState: GameState = {
    board: newBoard,
    currentPlayer: reversePlayer()
  }

  gameState = newGameState

  const winner: Winner | null = checkWinner()

  const stateAndWinner = {
    gameState: gameState,
    winner: winner
  }
  res.json(stateAndWinner)
})

app.post('/newGame', async (req: Request, res: Response) => {

  gameState = {
    board: [null, null, null, null, null, null, null, null, null],
    currentPlayer: "X",
  }

  res.json(gameState)
})

const PORT = 5173

ViteExpress.listen(app, PORT, () => {
  console.log(`server is running on port ${PORT} `)
})

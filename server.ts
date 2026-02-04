import express, {type Request, type Response} from 'express';
import ViteExpress from 'vite-express';
import { type GameState, type Board, type Player} from './src/tic-tac-toe';

const app = express()

app.use(express.json())

app.use(express.static('dist'))

app.use(cors({origin: "https://localhost:5173"}))

let gameState: GameState = {
  board: [null, null, null, null, null, null, null, null, null],
  currentPlayer: "X",
}

type Winner = Player | 'CATS'


app.get('/game', async (req: Request, res: Response) => {
  res.json(gameState)
})

app.get('/winner', async (req: Request, res: Response) => {
  const body: GameState = req.body

  const win = body.currentPlayer.repeat(3)

  const potentialCombinations = ['012', '345', '678', '036', '147', '258', '246', '048']



})

app.post('/game', async (req: Request, res: Response) => {
  type Body = {
    position: number,
    player: Player
  }

  const body:Body = req.body

  //error handling

  console.log('state test', gameState.board[body.position])

  if (gameState.board[body.position] !== null) {
    return res.status(404).json({error: "position is taken"})
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
    currentPlayer: body.player,
  }

  gameState = newGameState

  res.json(gameState)
})

app.post('/newGame', async (req: Request, res: Response) => {

  gameState = {
    board: [null, null, null, null, null, null, null, null, null],
    currentPlayer: "X",
  }

  res.json(gameState)
})

const PORT = 3000

ViteExpress.listen(app, PORT, () => {
  console.log(`server is running on port ${PORT} `)
})

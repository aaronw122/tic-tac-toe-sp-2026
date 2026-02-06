import express, { type Request, type Response } from 'express';
import cors from 'cors';
import type { Player, Cell, Board, GameState, Winner, winnerAndState, Lobby, ShortLobby } from './types/types';
import {game1, game2, gameStateEmpty} from './utils/testHelper'

const app = express()

app.use(express.json())

app.use(cors({ origin: "http://localhost:5173" }))


const lobby: Lobby = new Map([
  ['1', game1],
  ['2', game2]
])

const shortLobby = new Map([]) as ShortLobby


for (const [key, value] of lobby) {
  shortLobby.set(key, value.name)
}

console.log('lobby object', lobby)

let WinnerAndState:winnerAndState = {
  gameState: {
    board: [null, null, null, null, null, null, null, null, null],
    currentPlayer: "X",
  },
  winner: null
}

const reversePlayer = () => {
  if (WinnerAndState.gameState.currentPlayer === 'X')
    return 'O'
  else
    return 'X'
}

const checkWinner = (newBoard: Board) => {

  console.log('newBoard', newBoard)

  const currentPlayer = WinnerAndState.gameState.currentPlayer

  const win = currentPlayer.repeat(3)

  const potentialCombinations = ['012', '345', '678', '036', '147', '258', '246', '048']

  for (let i = 0; i < 8; i++) {
    const str: string = potentialCombinations[i]
    // create array with the 3 combinations, check if null. THEN see if all added up is good.
    const arr = [newBoard[Number(str.slice(0, 1))], newBoard[Number(str.slice(1, 2))], newBoard[Number(str.slice(2))]]

    if (arr[0] === null || arr[1] === null ||arr[2] === null ) {
      continue
    }
    else {
      const check = arr[0] + arr[1] + arr[2]
      if (check === win) {
        console.log('winner!', currentPlayer )
        return currentPlayer
      }
    }
  }
  if (!newBoard.includes(null)) {
    return 'CATS'
  }
  console.log('null')
  return null;
}

app.get('/lobby', async (req: Request, res: Response) => {
  const toObject = Object.fromEntries(shortLobby)
  console.log('toArray, specific object', toObject['2'])
  res.json(toObject)
})

app.get('/game/:id', async (req: Request, res: Response) => {
  const id = req.params.id as string

  const game = lobby.get(id)

  //other error handling???
  if (game === undefined) {
    return res.status(400).json({error: 'Game does not exist'})
  }

  const toObject: winnerAndState = game

  res.json(toObject)
})

app.post('/lobby', async (req: Request, res: Response) => {

  //properly parse so i get the name
  //comes in as name, then updated here. does it need to be object?
  const name: string = req.body.name

  const newGame: winnerAndState = {
    name: name,
    gameState: gameStateEmpty,
    winner: null
  }

  const id: string = crypto.randomUUID()



  lobby.set(id, newGame)

  console.log('new lobby', lobby)

  res.json({id, newGame})

})

app.post('/game/:id', async (req: Request, res: Response) => {
  const id = req.params.ide as string

  type Body = {
    position: number,
    player: Player
  }

  const body: Body = req.body

  //error handling

  if (WinnerAndState.winner !== null) {
    return res.status(400).json({error: "Game is already over"})
  }
  if (WinnerAndState.gameState.board[body.position] !== null && WinnerAndState.gameState.board[body.position] !== undefined) {
    return res.status(400).json({ error: "Position is already occupied" })
  }
  if (!Number.isInteger(body.position)) {
    return res.status(400).json({error: "Position must be an integer"})
  }
  if (body.position < 0 || body.position > 8) {
    return res.status(400).json({error: "Position must be between 0 and 8"})
  }
  //modify board at index position to be new value.
  // modify player to be other one

  console.log('game state before change', WinnerAndState.gameState.board)

  const newBoard = WinnerAndState.gameState.board.map((item, i) => {
    if (i === body.position) {
      return body.player
    }
    else {
      return item
    }
  }) as Board;

  console.log('new board after', newBoard)

  //fix winner here. jsut update board, THEN change current player after checking for win.

  const winner: Winner = checkWinner(newBoard)
  console.log('should be CATS', winner)

  const newGameState: GameState = {
    board: newBoard,
    currentPlayer: reversePlayer()
  }

  const newState:winnerAndState = {
    gameState: newGameState,
    winner: winner
  }

  WinnerAndState = newState

  console.log('WinnerAndState', WinnerAndState)
  console.log('new state', newState)
  res.json(newState)
})

app.post('/newGame', async (req: Request, res: Response) => {

  const startingPoint:winnerAndState = {
    gameState : {
      board: [null, null, null, null, null, null, null, null, null],
      currentPlayer: "X",
    },
    winner: null
  }

  WinnerAndState = startingPoint

  res.json(startingPoint)
})

export default app

import express, { type Request, type Response } from 'express';
import cors from 'cors';
import type { Player, Board, GameState, Winner, winnerAndState, Lobby, ShortLobby } from './types/types';
import {game1, game2, gameStateEmpty} from './utils/testHelper'

const app = express()

app.use(express.json())

app.use(cors({ origin: "http://localhost:5173" }))


const lobby: Lobby = new Map([
  ['1', game1],
  ['2', game2]
])

const shortLobby: ShortLobby = new Map([]) as ShortLobby

for (const [key, value] of lobby) {
  shortLobby.set(key, value.name)
}

console.log('short lobby', shortLobby)

const reversePlayer = (id : string) => {
  const game = lobby.get(id)!

  if (game.gameState.currentPlayer === 'X')
    return 'O'
  else
    return 'X'
}

const checkWinner = (newBoard: Board, player: Player) => {

  console.log('newBoard', newBoard)

  const currentPlayer = player

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
  console.log('short lobby jsonified', toObject )
  console.log('specific lobby object', toObject[1])
  console.log('type for key', typeof Object.keys(toObject)[1])
  res.json(toObject)
})

app.get('/resetLobby', async (req: Request, res: Response) => {
  lobby.set('1', game1)
  lobby.set('2', game2)

  const toObject = Object.fromEntries(lobby)
  console.log('short lobby jsonified', toObject )
  console.log('specific lobby object', toObject[1])
  res.json(toObject)
})

app.post('/lobby', async (req: Request, res: Response) => {

  //properly parse so i get the name
  //comes in as name, then updated here. does it need to be object?
  //
  console.log('request body for express', req.body)
  const {name} = req.body

  console.log('name from lobby post', name)

  //check for erorrs
  // name duplicate

  const newGame: winnerAndState = {
    name: name,
    gameState: gameStateEmpty,
    winner: null
  }

  const id: string = crypto.randomUUID()

  lobby.set(id, newGame)

  shortLobby.set(id, name)

  console.log('new object in lobby', lobby.get(id))
  console.log('new object in shortLobby', shortLobby.get(id))

  console.log('new lobby', lobby)

  res.json({id, name})

})

app.get('/game/:id', async (req: Request, res: Response) => {
  const id = req.params.id as string

  //bc im only referencing one game object, i don't need to jsonify, already just an object
  const game = lobby.get(id)

  //other error handling???
  if (game === undefined) {
    return res.status(400).json({error: 'Game does not exist'})
  }

  console.log('game', game)

  res.json(game)
})

app.post('/game/:id', async (req: Request, res: Response) => {
  const id = req.params.id as string

  type Body = {
    position: number,
    player: Player
  }

  const body: Body = req.body

  const game: winnerAndState = lobby.get(id)!

  //error handling

  if (game.winner !== null) {
    return res.status(400).json({error: "Game is already over"})
  }
  if (game.gameState.board[body.position] !== null && game.gameState.board[body.position] !== undefined) {
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

  console.log('game state before change', game.gameState.board)

  const newBoard = game.gameState.board.map((item, i) => {
    if (i === body.position) {
      return body.player
    }
    else {
      return item
    }
  }) as Board;

  console.log('new board after', newBoard)

  //fix winner here. jsut update board, THEN change current player after checking for win.

  const winner: Winner = checkWinner(newBoard, body.player)

  const newGameState: GameState = {
    board: newBoard,
    currentPlayer: reversePlayer(id)
  }

  const newGame: winnerAndState = {
    name: game.name,
    gameState: newGameState,
    winner: winner
  }

  lobby.set(id, newGame)

  console.log('full lobby', lobby)
  console.log('new state', newGame)
  //sends back new game object
  res.json(newGame)
})

app.delete('/game/:id', async (req: Request, res: Response) => {
  const id = req.params.id as string

  //bc im only referencing one game object, i don't need to jsonify, already just an object
  lobby.delete(id)

  shortLobby.delete(id)

  console.log('new lobby without id', lobby)
  console.log('new shortlobby without id', shortLobby)

  return res.status(200).end()
})

app.post('/newGame/:id', async (req: Request, res: Response) => {
  const id = req.params.id as string

  const game = lobby.get(id)

  if (game === undefined) {
    return res.status(400).json({error: "gameId no longer valid"})
  }

  const newGame: winnerAndState = {
    name: game.name,
    gameState : {
      board: [null, null, null, null, null, null, null, null, null],
      currentPlayer: "X",
    },
    winner: null
  }

  lobby.set(id, newGame)

  console.log('full lobby', lobby)
  console.log('new state', newGame)

  res.json(newGame)
})

export default app

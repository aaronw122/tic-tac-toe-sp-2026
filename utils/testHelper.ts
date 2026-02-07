import type { Lobby, winnerAndState, GameState, ShortLobby } from '../types/types'

export const gameStateEmpty: GameState = {
  board: [null, null, null, null, null, null, null, null, null],
  currentPlayer: 'X'
}

const gameStateHalf: GameState = {
  board: [null, 'O', null, 'X', null, 'O', 'X', null, null],
  currentPlayer: 'X'
}

export const game1: winnerAndState = {
  name: "revenge tour",
  gameState: gameStateEmpty,
  winner: null
}

export const game2: winnerAndState = {
  name: "x vs o",
  gameState: gameStateHalf,
  winner: null
}

export const game2AfterClear: winnerAndState = {
  name: "x vs o",
  gameState: gameStateEmpty,
  winner: null
}

export const lobbyExample: Lobby = new Map([
  ['1', game1],
  ['2', game2]
  ]
)

export const shortLobbyAfterRes = {
  '1': 'revenge tour',
  '2': 'x vs o'
}

import axios from 'axios'
import {type GameState, type Player} from '../tic-tac-toe'


const baseURL = 'http://localhost:3000'



type Body = {
  position: number,
  player: Player
}

const getGame = async () => {
  const response = await axios.get(`${baseURL}/game`)
  return response.data
}

const makeMove = async (newObj: Body) => {
  const response = await axios.post(`${baseURL}/game`, newObj)
  return response.data
}

const getWinner = async () => {
  const response = await axios.get(`${baseURL}/winner`)
  return response.data
}

const newGame = async (): Promise<GameState> => {
  const response = await axios.post(`${baseURL}/newGame`)
  return response.data
}

export default {getGame, makeMove, getWinner, newGame}

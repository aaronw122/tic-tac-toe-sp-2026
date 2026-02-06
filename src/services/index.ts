import axios from 'axios'
import {type Player, type winnerAndState} from '../../types/types'


const baseURL = 'http://localhost:5173'

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

const newGame = async (): Promise<winnerAndState> => {
  const response = await axios.post(`${baseURL}/newGame`)
  return response.data
}

export default {getGame, makeMove, getWinner, newGame}

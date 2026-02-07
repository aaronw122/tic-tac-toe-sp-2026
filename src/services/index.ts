import axios from 'axios'
import {type Player, type winnerAndState} from '../../types/types'


const baseURL = 'http://localhost:5173'

type Body = {
  position: number,
  player: Player
}

const getLobby = async () => {
  const response = await axios.get(`${baseURL}/lobby`)
  return response.data
}

const addGame = async (name: string) => {
  const response = await axios.post(`${baseURL}/lobby`, { name })
  return response.data
}

const getGame = async (id: string) => {
  const response = await axios.get(`${baseURL}/game/${id}`)
  return response.data
}

const makeMove = async (newObj: Body, id:string) => {
  const response = await axios.post(`${baseURL}/game/${id}`, newObj)
  return response.data
}

const newGame = async (id: string): Promise<winnerAndState> => {
  const response = await axios.post(`${baseURL}/newGame/${id}`)
  return response.data
}

export default {getLobby, addGame, getGame, makeMove, newGame}

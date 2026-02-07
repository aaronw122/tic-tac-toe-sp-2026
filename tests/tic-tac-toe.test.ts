import { describe, it, expect, beforeEach, assert } from "vitest";
import { type winnerAndState } from "../types/types.ts";
import { gameStateEmpty, game2, shortLobbyAfterRes, game2AfterClear } from '../utils/testHelper.ts'
import app from '../app.ts'
import supertest from 'supertest'
const api = supertest(app)

// Helper: apply a sequence of moves to a fresh game
const playMoves = async (id:string, ...positions: number[]): Promise<winnerAndState> => {
  let state = await api.post(`/newGame/${id}`);
  for (const position of positions) {
    const player = state.body.gameState.currentPlayer
    state = await api
      .post(`/game/${id}`)
      .send({ player, position });
  }
  const newState = await api.get(`/game/${id}`)
  return newState.body;
}

beforeEach(async () => {
  await api.get('/resetLobby')
})

// ---------------------------------------------------------------------------
// createGame
// ---------------------------------------------------------------------------
describe("createGame", () => {
  it("returns an empty board", async  () => {
    const game = await api.post('/newGame/1');
    expect(game.body.gameState.board).toEqual([null, null, null, null, null, null, null, null, null]);
  });

  it("starts with X as the current player", async () => {
    const game = await api.post('/newGame/1');
    expect(game.body.gameState.currentPlayer).toBe("X");
  });
});

// ---------------------------------------------------------------------------
// makeMove
// ---------------------------------------------------------------------------
describe("makeMove", () => {
  it("places the current player's mark on the board", async () => {
    const currentState = await api.get('/game/1')
    const player = currentState.body.gameState.currentPlayer
    const position = 0;
    await api.post('/game/1').send({ player, position })
    const newState = await api.get('/game/1')
    expect(newState.body.gameState.board[0]).toBe("X");
  });

  it("switches the current player after a move", async () => {
    const currentState = await api.get('/game/1')
    const player = currentState.body.gameState.currentPlayer
    const position = 0;
    await api.post('/game/1').send({ player, position })
    const newState = await api.get('/game/1')
    expect(newState.body.gameState.currentPlayer).toBe("O");
  });

  it("alternates players across multiple moves", async () => {
    const state = await playMoves('1', 0, 1, 2);
    // X moved at 0, O moved at 1, X moved at 2
    expect(state.gameState.board[0]).toBe("X");
    expect(state.gameState.board[1]).toBe("O");
    expect(state.gameState.board[2]).toBe("X");
    expect(state.gameState.currentPlayer).toBe("O");
  });

  it("does not mutate the original state", async () => {
    const currentState = await api.get('/game/1')
    const player = currentState.body.gameState.currentPlayer
    const position = 4
    await api.post('/game/1').send({ player, position })
    const newState = await api.get('/game/1')
    expect(currentState.body.gameState.board[4]).toBeNull();
    expect(newState.body.gameState.board[4]).toBe("X");
  });

  it("throws when the position is already occupied", async () => {
    const currentState = await api.get('/game/1')
    const player = currentState.body.gameState.currentPlayer
    const position = 2
    await api.post('/game/1').send({ player, position })
    const post2 = await api.post('/game/1').send({ player, position })
    assert.deepStrictEqual(post2.body, { error: 'Position is already occupied' });
  });

  it("throws when the position is below 0", async () => {
    const currentState = await api.get('/game/1')
    const player = currentState.body.gameState.currentPlayer
    const position = -1
    const post = await api.post('/game/1').send({ player, position })
    assert.deepStrictEqual(post.body, { error: "Position must be between 0 and 8" },);
  });

  it("throws when the position is above 8", async () => {
    const currentState = await api.get('/game/1')
    const player = currentState.body.gameState.currentPlayer
    const position = 9
    const post = await api.post('/game/1').send({ player, position })
    assert.deepStrictEqual(post.body, { error: "Position must be between 0 and 8" },);
  });

  it("throws when the position is not an integer", async () => {
    const currentState = await api.get('/game/1')
    const player = currentState.body.gameState.currentPlayer
    const position = 2.5
    const post = await api.post('/game/1').send({ player, position })
    assert.deepStrictEqual(post.body, { error: "Position must be an integer" },);
  });

  it("throws when the game is already won", async () => {
    // X wins with top row: X(0), O(3), X(1), O(4), X(2)
    const state = await playMoves('1', 0, 3, 1, 4, 2);
    const player = state.gameState.currentPlayer
    const position = 2
    const post = await api.post('/game/1').send({ player, position })
    assert.deepStrictEqual(post.body, { error: "Game is already over" },);
  });
});

// ---------------------------------------------------------------------------
// getWinner
// ---------------------------------------------------------------------------
describe("getWinner", () => {

  it("returns null for an empty board", async () => {
    const state = await api.get('/game/1')
    assert.strictEqual(state.body.winner, null);
  });

  it("returns null when no one has won yet", async () => {
    // X(0), O(4)
    const state = await playMoves('1', 0, 4);
    assert.strictEqual(state.winner, null);
  });

  // --- Row wins ---
  it("detects X winning with the top row", async () => {
    // X(0), O(3), X(1), O(4), X(2)
    const state = await playMoves('1', 0, 3, 1, 4, 2);
    assert.strictEqual(state.winner, 'X');
  });

  it("detects O winning with the middle row", async () => {
    // X(0), O(3), X(1), O(4), X(6), O(5)
    const state = await playMoves('1', 0, 3, 1, 4, 6, 5);
    assert.strictEqual(state.winner, 'O');
  });

  it("detects X winning with the bottom row", async () => {
    // X(6), O(0), X(7), O(1), X(8)
    const state = await playMoves('1', 6, 0, 7, 1, 8);
    assert.strictEqual(state.winner, 'X');
  });

  // --- Column wins ---
  it("detects X winning with the left column", async () => {
    // X(0), O(1), X(3), O(4), X(6)
    const state = await playMoves('1', 0, 1, 3, 4, 6);
    assert.strictEqual(state.winner, 'X');
  });

  it("detects O winning with the middle column", async () => {
    // X(0), O(1), X(3), O(4), X(8), O(7)
    const state = await playMoves('1', 0, 1, 3, 4, 8, 7);
    assert.strictEqual(state.winner, 'O');
  });

  it("detects X winning with the right column", async () => {
    // X(2), O(0), X(5), O(1), X(8)
    const state = await playMoves('1', 2, 0, 5, 1, 8);
    assert.strictEqual(state.winner, 'X');
  });

  // --- Diagonal wins ---
  it("detects X winning with the main diagonal", async () => {
    // X(0), O(1), X(4), O(2), X(8)
    const state = await playMoves('1', 0, 1, 4, 2, 8);
    assert.strictEqual(state.winner, 'X');
  });

  it("detects O winning with the anti-diagonal", async () => {
    // X(0), O(2), X(1), O(4), X(8), O(6)
    const state = await playMoves('1', 0, 2, 1, 4, 8, 6);
    assert.strictEqual(state.winner, 'O');
  });

  // --- Draw / full board ---
  it("returns 'CATS' on a draw (full board, no winner)", async () => {
    // X O X
    // X X O
    // O X O
    // Moves: X(0), O(1), X(2), O(5), X(3), O(6), X(4), O(8), X(7)
    const state = await playMoves('1', 0, 1, 2, 5, 3, 6, 4, 8, 7);
    assert.strictEqual(state.winner, 'CATS');
    const fullBoard = [
      'X', 'O', 'X',
      'X', 'X', 'O',
      'O', 'X', 'O',
    ]
    const newState = await api.get('/game/1')
    // Also verify the board is full
    assert.deepStrictEqual(fullBoard, newState.body.gameState.board)
  });
});

// ---------------------------------------------------------------------------
// Full game sequences
// ---------------------------------------------------------------------------
describe("full game sequences", () => {
  it("plays a complete game where X wins", async () => {
    let state = await api.get('/game/1')

    let player = state.body.gameState.currentPlayer

    let position = 4

    state = await api.post('/game/1').send({ player, position })

    assert.strictEqual(state.body.gameState.currentPlayer, "O");

    player = state.body.gameState.currentPlayer

    position = 0

    state = await api.post('/game/1').send({ player, position })

    player = state.body.gameState.currentPlayer

    position = 1

    state = await api.post('/game/1').send({ player, position })

    player = state.body.gameState.currentPlayer

    position = 3

    state = await api.post('/game/1').send({ player, position })

    assert.strictEqual(state.body.winner, null)

    player = state.body.gameState.currentPlayer

    position = 7

    state = await api.post('/game/1').send({ player, position })

    assert.deepStrictEqual(state.body.winner, 'X')
  });

  it("plays a complete game ending in a draw", async () => {
    // X | O | X
    // O | X | X
    // O | X | O
    const state = await playMoves('1', 0, 1, 2, 3, 4, 6, 5, 8, 7);

    assert.strictEqual(state.winner, 'CATS')

    const fullBoard = [
      'X', 'O', 'X',
      'O', 'X', 'X',
      'O', 'X', 'O',
    ]
    // Also verify the board is full
    //
    const newState = await api.get('/game/1')

    assert
      .deepStrictEqual(fullBoard, newState.body.gameState.board)
  });

  it("preserves immutability through a full game", async () => {

    // X(4), O(0), X(1), O(3), X(7) — X wins middle column

    let start = await api.get('/game/1')

    const moves = [4, 0, 1, 3, 7];

    const arr = [];

    arr.push(start.body)
    for (const position of moves) {
      const player = start.body.gameState.currentPlayer
      await api
        .post('/game/1')
        .send({ position, player });
      start = await api.get('/game/1')
      arr.push(start.body)
    }

    // Verify each intermediate state is unchanged
    const nullBoard = [null, null, null, null, null, null, null, null, null]
    assert.deepStrictEqual(arr[0].gameState.board, nullBoard)
    assert.deepStrictEqual(arr[1].gameState.board[4], 'X')
    assert.deepStrictEqual(arr[2].gameState.board[0], 'O')
    assert.deepStrictEqual(arr[0].gameState.board[4], null) // original still untouched
  });
})
describe('lobby tests', () => {
  it('lobby returns the right number of games, and in the right shape', async () => {
    const lobby = await api.get('/lobby');
    //by default will return two games in lobby
    const testData = shortLobbyAfterRes;

    assert.deepStrictEqual(lobby.body, testData)
  });

  it('lobby can create a new game', async () => {
    const lobby = await api.get('/lobby');

    const gameName = 'big lebowski'

    const newGame = await api.post('/lobby').send({ name: gameName })

    //how lobbyId will look in response to client
    const id = newGame.body.id

    const lobbyAfterPost = await api.get('/lobby');

    //this is how lobby id looks in server
    assert.deepStrictEqual(lobby.body[id], undefined)
    assert.deepStrictEqual(lobbyAfterPost.body[id], newGame.body.name)
  })

  it('lobby doesnt mutate', async () => {

    const lobby = await api.get('/lobby');

    const lobbyName = 'blazing saddles'

    const newGame = await api.post('/lobby').send({ name: lobbyName })

    const id = newGame.body.id

    const lobbyAfterPost = await api.get('/lobby');

    assert.deepStrictEqual(lobby.body[id], undefined)
    assert.deepStrictEqual(lobbyAfterPost.body[id], lobbyName)
  })

  it('properly fetches individual game', async () => {

    const game = await api.get('/game/2');

    assert.deepStrictEqual(game.body, game2)
  })

  it('throws an error when gameId doesnt exist', async () => {

    await api.get('/lobby');

    const game10 = await api.get('/game/10');

    assert.deepStrictEqual(game10.body, { error: "Game does not exist" })
  })

  it('properly refreshes game', async () => {

    const initialGame = await api.get('/game/2')

    await api.post('/newGame/2')

    const postGame = await api.get('/game/2')

    assert.deepStrictEqual(initialGame.body, game2)
    assert.deepStrictEqual(postGame.body, game2AfterClear)
  })

  it('delete game works', async () => {

    const lobby = await api.get('/lobby');

    await api.delete('/game/2')

    const lobbyAfter = await api.get('/lobby')

    //is available in initial map
    assert.deepStrictEqual(lobby.body[2], shortLobbyAfterRes['2'])

    //not available in second
    assert.deepStrictEqual(lobbyAfter.body[2], undefined)

    //game1 still here
    assert.deepStrictEqual(lobbyAfter.body[1], shortLobbyAfterRes['1'])
  })
})

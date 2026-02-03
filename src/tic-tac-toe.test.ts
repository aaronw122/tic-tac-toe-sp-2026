import { describe, it, expect } from "vitest";
import { createGame, makeMove, getWinner, type GameState, type Board } from "./tic-tac-toe";

// Helper: apply a sequence of moves to a fresh game
function playMoves(...positions: number[]): GameState {
  let state = createGame();
  for (const pos of positions) {
    state = makeMove(state, pos);
  }
  return state;
}

// ---------------------------------------------------------------------------
// createGame
// ---------------------------------------------------------------------------
describe("createGame", () => {
  it("returns an empty board", () => {
    const game = createGame();
    expect(game.board).toEqual([null, null, null, null, null, null, null, null, null]);
  });

  it("starts with X as the current player", () => {
    const game = createGame();
    expect(game.currentPlayer).toBe("X");
  });
});

// ---------------------------------------------------------------------------
// makeMove
// ---------------------------------------------------------------------------
describe("makeMove", () => {
  it("places the current player's mark on the board", () => {
    const state = makeMove(createGame(), 0);
    expect(state.board[0]).toBe("X");
  });

  it("switches the current player after a move", () => {
    const state = makeMove(createGame(), 0);
    expect(state.currentPlayer).toBe("O");
  });

  it("alternates players across multiple moves", () => {
    const state = playMoves(0, 1, 2);
    // X moved at 0, O moved at 1, X moved at 2
    expect(state.board[0]).toBe("X");
    expect(state.board[1]).toBe("O");
    expect(state.board[2]).toBe("X");
    expect(state.currentPlayer).toBe("O");
  });

  it("does not mutate the original state", () => {
    const original = createGame();
    const next = makeMove(original, 4);
    expect(original.board[4]).toBeNull();
    expect(next.board[4]).toBe("X");
  });

  it("throws when the position is already occupied", () => {
    const state = makeMove(createGame(), 0);
    expect(() => makeMove(state, 0)).toThrow("Position is already occupied");
  });

  it("throws when the position is below 0", () => {
    expect(() => makeMove(createGame(), -1)).toThrow("Position must be between 0 and 8");
  });

  it("throws when the position is above 8", () => {
    expect(() => makeMove(createGame(), 9)).toThrow("Position must be between 0 and 8");
  });

  it("throws when the position is not an integer", () => {
    expect(() => makeMove(createGame(), 1.5)).toThrow("Position must be an integer");
  });

  it("throws when the game is already won", () => {
    // X wins with top row: X(0), O(3), X(1), O(4), X(2)
    const state = playMoves(0, 3, 1, 4, 2);
    expect(() => makeMove(state, 8)).toThrow("Game is already over");
  });
});

// ---------------------------------------------------------------------------
// getWinner
// ---------------------------------------------------------------------------
describe("getWinner", () => {
  it("returns null for an empty board", () => {
    expect(getWinner(createGame())).toBeNull();
  });

  it("returns null when no one has won yet", () => {
    // X(0), O(4)
    const state = playMoves(0, 4);
    expect(getWinner(state)).toBeNull();
  });

  // --- Row wins ---
  it("detects X winning with the top row", () => {
    // X(0), O(3), X(1), O(4), X(2)
    const state = playMoves(0, 3, 1, 4, 2);
    expect(getWinner(state)).toBe("X");
  });

  it("detects O winning with the middle row", () => {
    // X(0), O(3), X(1), O(4), X(6), O(5)
    const state = playMoves(0, 3, 1, 4, 6, 5);
    expect(getWinner(state)).toBe("O");
  });

  it("detects X winning with the bottom row", () => {
    // X(6), O(0), X(7), O(1), X(8)
    const state = playMoves(6, 0, 7, 1, 8);
    expect(getWinner(state)).toBe("X");
  });

  // --- Column wins ---
  it("detects X winning with the left column", () => {
    // X(0), O(1), X(3), O(4), X(6)
    const state = playMoves(0, 1, 3, 4, 6);
    expect(getWinner(state)).toBe("X");
  });

  it("detects O winning with the middle column", () => {
    // X(0), O(1), X(3), O(4), X(8), O(7)
    const state = playMoves(0, 1, 3, 4, 8, 7);
    expect(getWinner(state)).toBe("O");
  });

  it("detects X winning with the right column", () => {
    // X(2), O(0), X(5), O(1), X(8)
    const state = playMoves(2, 0, 5, 1, 8);
    expect(getWinner(state)).toBe("X");
  });

  // --- Diagonal wins ---
  it("detects X winning with the main diagonal", () => {
    // X(0), O(1), X(4), O(2), X(8)
    const state = playMoves(0, 1, 4, 2, 8);
    expect(getWinner(state)).toBe("X");
  });

  it("detects O winning with the anti-diagonal", () => {
    // X(0), O(2), X(1), O(4), X(8), O(6)
    const state = playMoves(0, 2, 1, 4, 8, 6);
    expect(getWinner(state)).toBe("O");
  });

  // --- Draw / full board ---
  it("returns null on a draw (full board, no winner)", () => {
    // X O X
    // X X O
    // O X O
    // Moves: X(0), O(1), X(2), O(5), X(3), O(6), X(4), O(8), X(7)
    const state = playMoves(0, 1, 2, 5, 3, 6, 4, 8, 7);
    expect(getWinner(state)).toBeNull();
    // Also verify the board is full
    expect(state.board.every((cell) => cell !== null)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Full game sequences
// ---------------------------------------------------------------------------
describe("full game sequences", () => {
  it("plays a complete game where X wins", () => {
    let state = createGame();

    state = makeMove(state, 4); // X center
    expect(state.currentPlayer).toBe("O");

    state = makeMove(state, 0); // O top-left
    state = makeMove(state, 1); // X top-middle
    state = makeMove(state, 3); // O middle-left

    // X hasn't won yet
    expect(getWinner(state)).toBeNull();

    state = makeMove(state, 7); // X bottom-middle

    // X wins: positions 1, 4, 7 (middle column)
    expect(getWinner(state)).toBe("X");
  });

  it("plays a complete game ending in a draw", () => {
    // X | O | X
    // O | X | X
    // O | X | O
    const state = playMoves(0, 1, 2, 3, 4, 6, 5, 8, 7);
    expect(getWinner(state)).toBeNull();
    expect(state.board.every((cell) => cell !== null)).toBe(true);
  });

  it("preserves immutability through a full game", () => {
    const states: GameState[] = [createGame()];
    // X(4), O(0), X(1), O(3), X(7) — X wins middle column
    const moves = [4, 0, 1, 3, 7];

    for (const move of moves) {
      states.push(makeMove(states[states.length - 1], move));
    }

    // Verify each intermediate state is unchanged
    expect(states[0].board.every((cell) => cell === null)).toBe(true);
    expect(states[1].board[4]).toBe("X");
    expect(states[2].board[0]).toBe("O");
    expect(states[0].board[4]).toBeNull(); // original still untouched
  });
});

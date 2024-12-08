import { Chess } from "chess.js";

const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

const POSITIONAL_SCORES: Record<string, number[][]> = {
  p: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  n: [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50],
  ],
  b: [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 10, 10, 10, 10, 0, -10],
    [-10, 10, 10, 10, 10, 10, 10, -10],
    [-10, 5, 0, 0, 0, 0, 5, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20],
  ],
  r: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, 10, 10, 10, 10, 5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [0, 0, 0, 5, 5, 0, 0, 0],
  ],
  q: [
    [-20, -10, -10, -5, -5, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 5, 5, 5, 0, -10],
    [-5, 0, 5, 5, 5, 5, 0, -5],
    [0, 0, 5, 5, 5, 5, 0, -5],
    [-10, 5, 5, 5, 5, 5, 0, -10],
    [-10, 0, 5, 0, 0, 0, 0, -10],
    [-20, -10, -10, -5, -5, -10, -10, -20],
  ],
  k: [
    [20, 30, 10, 0, 0, 10, 30, 20],
    [20, 20, 0, 0, 0, 0, 20, 20],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [-20, -30, -30, -40, -40, -30, -30, -20],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
  ],
};

const CENTER_SQUARES = new Set(["d4", "e4", "d5", "e5"]);

function evaluateBoard(chess: Chess): number {
  let evaluation = 0;
  const board = chess.board();

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = board[row][col];
      if (square) {
        const pieceValue = PIECE_VALUES[square.type];
        const positionalValue = POSITIONAL_SCORES[square.type][row][col];
        evaluation +=
          square.color === "w"
            ? pieceValue + positionalValue
            : -(pieceValue + positionalValue);

        const squareName = String.fromCharCode(97 + col) + (8 - row);
        if (CENTER_SQUARES.has(squareName)) {
          evaluation += square.color === "w" ? 10 : -10;
        }
      }
    }
  }
  return evaluation;
}

const transpositionTable: Record<string, number> = {};

function minimax(
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizingPlayer: boolean
): number {
  const boardKey = chess.fen();
  if (transpositionTable[boardKey] !== undefined) {
    return transpositionTable[boardKey];
  }

  if (depth === 0 || chess.isGameOver()) {
    return evaluateBoard(chess);
  }

  const moves = chess.moves();
  let bestEval: number;

  if (isMaximizingPlayer) {
    bestEval = -Infinity;
    for (const move of moves) {
      chess.move(move);
      const evaluation = minimax(chess, depth - 1, alpha, beta, false);
      chess.undo();
      bestEval = Math.max(bestEval, evaluation);
      alpha = Math.max(alpha, evaluation);

      if (beta <= alpha) {
        break;
      }
    }
  } else {
    bestEval = Infinity;
    for (const move of moves) {
      chess.move(move);
      const evaluation = minimax(chess, depth - 1, alpha, beta, true);
      chess.undo();
      bestEval = Math.min(bestEval, evaluation);
      beta = Math.min(beta, evaluation);

      if (beta <= alpha) {
        break;
      }
    }
  }

  transpositionTable[boardKey] = bestEval;

  return bestEval;
}

function getBestMove(
  chess: Chess,
  depth: number,
  isWhite: boolean
): string | null {
  const moves = chess.moves();
  let bestMove: string | null = null;
  let bestValue = isWhite ? -Infinity : Infinity;
  const alpha = -Infinity;
  const beta = Infinity;

  for (const move of moves) {
    chess.move(move);
    const boardValue = minimax(chess, depth - 1, alpha, beta, !isWhite);
    chess.undo();

    if (isWhite && boardValue > bestValue) {
      bestValue = boardValue;
      bestMove = move;
    } else if (!isWhite && boardValue < bestValue) {
      bestValue = boardValue;
      bestMove = move;
    }
  }

  return bestMove;
}

export default getBestMove;

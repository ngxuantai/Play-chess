import {Chess} from "chess.js";

const PAWN_TABLE = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5, 5, 10, 25, 25, 10, 5, 5],
  [0, 0, 0, 20, 20, 0, 0, 0],
  [5, -5, -10, 0, 0, -10, -5, 5],
  [5, 10, 10, -20, -20, 10, 10, 5],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const KNIGHT_TABLE = [
  [-50, -40, -30, -30, -30, -30, -40, -50],
  [-40, -20, 0, 0, 0, 0, -20, -40],
  [-30, 0, 10, 15, 15, 10, 0, -30],
  [-30, 5, 15, 20, 20, 15, 5, -30],
  [-30, 0, 15, 20, 20, 15, 0, -30],
  [-30, 5, 10, 15, 15, 10, 5, -30],
  [-40, -20, 0, 5, 5, 0, -20, -40],
  [-50, -40, -30, -30, -30, -30, -40, -50],
];

const BISHOP_TABLE = [
  [-20, -10, -10, -10, -10, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 10, 10, 5, 0, -10],
  [-10, 5, 5, 10, 10, 5, 5, -10],
  [-10, 0, 10, 10, 10, 10, 0, -10],
  [-10, 10, 10, 10, 10, 10, 10, -10],
  [-10, 5, 0, 0, 0, 0, 5, -10],
  [-20, -10, -10, -10, -10, -10, -10, -20],
];

const ROOK_TABLE = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [5, 10, 10, 10, 10, 10, 10, 5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [0, 0, 0, 5, 5, 0, 0, 0],
];

const QUEEN_TABLE = [
  [-20, -10, -10, -5, -5, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 5, 5, 5, 0, -10],
  [-5, 0, 5, 5, 5, 5, 0, -5],
  [0, 0, 5, 5, 5, 5, 0, -5],
  [-10, 5, 5, 5, 5, 5, 0, -10],
  [-10, 0, 5, 0, 0, 0, 0, -10],
  [-20, -10, -10, -5, -5, -10, -10, -20],
];

const KING_TABLE = [
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-20, -30, -30, -40, -40, -30, -30, -20],
  [-10, -20, -20, -20, -20, -20, -20, -10],
  [20, 20, 0, 0, 0, 0, 20, 20],
  [20, 30, 10, 0, 0, 10, 30, 20],
];

const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

const getPositionValue = (
  piece: string,
  row: number,
  col: number,
  isWhite: boolean
): number => {
  const adjustedRow = isWhite ? 7 - row : row;
  switch (piece.toLowerCase()) {
    case "p":
      return PAWN_TABLE[adjustedRow][col];
    case "n":
      return KNIGHT_TABLE[adjustedRow][col];
    case "b":
      return BISHOP_TABLE[adjustedRow][col];
    case "r":
      return ROOK_TABLE[adjustedRow][col];
    case "q":
      return QUEEN_TABLE[adjustedRow][col];
    case "k":
      return KING_TABLE[adjustedRow][col];
    default:
      return 0;
  }
};

const evaluateBoard = (chess: Chess): number => {
  let evaluation = 0;

  if (chess.isCheckmate()) {
    return chess.turn() === "w" ? -100000 : 100000;
  }
  if (chess.isDraw() || chess.isStalemate() || chess.isThreefoldRepetition()) {
    return 0;
  }

  const board = chess.board();

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = board[row][col];
      if (square) {
        const pieceValue = PIECE_VALUES[square.type];
        const positionValue = getPositionValue(
          square.type,
          row,
          col,
          square.color === "w"
        );
        const value = pieceValue + positionValue;
        evaluation += square.color === "w" ? value : -value;
      }
    }
  }

  const currentMoves = chess.moves().length;
  chess.turn() === "w"
    ? (evaluation += currentMoves)
    : (evaluation -= currentMoves);

  if (!chess.isCheck()) {
    const castling = chess.fen().split(" ")[2];
    if (castling.includes("K") || castling.includes("Q")) evaluation += 30;
    if (castling.includes("k") || castling.includes("q")) evaluation -= 30;
  }

  const whiteKingSquare = chess
    .board()
    .flat()
    .findIndex((square) => square?.type === "k" && square.color === "w");
  const blackKingSquare = chess
    .board()
    .flat()
    .findIndex((square) => square?.type === "k" && square.color === "b");
  if (whiteKingSquare < 48) evaluation -= 50;
  if (blackKingSquare >= 16) evaluation += 50;

  return evaluation;
};

const isPawnAdvanceMove = (chess: Chess, move: string): boolean => {
  const startSquare = move.slice(0, 2);
  const endSquare = move.slice(-2);
  const piece = chess.get(startSquare);

  if (piece?.type === "p") {
    const startRow = parseInt(startSquare[1], 10);
    const endRow = parseInt(endSquare[1], 10);

    return (
      (piece.color === "w" && endRow > startRow) ||
      (piece.color === "b" && endRow < startRow)
    );
  }

  return false;
};

const orderMoves = (chess: Chess, moves: string[]): string[] => {
  return moves.sort((a, b) => {
    const isPawnAdvanceA = isPawnAdvanceMove(chess, a);
    const isPawnAdvanceB = isPawnAdvanceMove(chess, b);

    if (isPawnAdvanceA && !isPawnAdvanceB) return -1;
    if (!isPawnAdvanceA && isPawnAdvanceB) return 1;

    const captureValueA = isCaptureMove(chess, a);
    const captureValueB = isCaptureMove(chess, b);
    if (captureValueA !== captureValueB) {
      return captureValueB - captureValueA;
    }

    return 0;
  });
};

const isCaptureMove = (chess: Chess, move: string): number => {
  const targetSquare = move.slice(-2);
  const targetPiece = chess.get(targetSquare);
  if (targetPiece) {
    return PIECE_VALUES[targetPiece.type];
  }
  return 0;
};

const minimax = (
  chess: Chess,
  depth: number,
  isMaximizingPlayer: boolean,
  alpha: number,
  beta: number,
  isRoot: boolean = false
): {evaluation: number; bestMove?: string} => {
  if (depth === 0 || chess.isGameOver()) {
    return {evaluation: evaluateBoard(chess)};
  }

  let bestMove: string | undefined;
  const moves = orderMoves(chess, chess.moves());

  if (isMaximizingPlayer) {
    let maxEval = -Infinity;
    for (const move of moves) {
      chess.move(move);
      const evaluation = minimax(
        chess,
        depth - 1,
        false,
        alpha,
        beta
      ).evaluation;
      chess.undo();

      if (evaluation > maxEval) {
        maxEval = evaluation;
        if (isRoot) bestMove = move;
      }
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return {evaluation: maxEval, bestMove};
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      chess.move(move);
      const evaluation = minimax(
        chess,
        depth - 1,
        true,
        alpha,
        beta
      ).evaluation;
      chess.undo();

      if (evaluation < minEval) {
        minEval = evaluation;
        if (isRoot) bestMove = move;
      }
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return {evaluation: minEval, bestMove};
  }
};

export const getBestMove = (
  chess: Chess,
  depth: number = 3,
  isWhite: boolean = true
): string | null => {
  const {bestMove} = minimax(chess, depth, isWhite, -Infinity, Infinity, true);
  return bestMove || null;
};

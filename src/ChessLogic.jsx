function findKing(board, color) {
    const target = color === 'white' ? '♔' : '♚'
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col]
            if (piece && piece.type === target && piece.color === color) {
                return { row, col }
            }
        }
    }
    throw new Error("King not found on the board")
}

export function isChecked(board, color, moveHistory) {
    const kingPos = findKing(board, color)
    const king = board[kingPos.row][kingPos.col]
    if (!king || (king.type !== '♔' && king.type !== '♚')) {
        return false
    }

    const boardSize = 8

    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const piece = board[row][col]
            if (piece && piece.color !== color) {
                const moves = validMoves({ row, col }, board, piece.color, moveHistory)
                if (moves.length > 0 && moves.some(move => move.row === kingPos.row && move.col === kingPos.col)) {
                    return true
                }
            }
        }
    }
    return false
}
function validateRange(source, target, board, rowStep, colStep) {
    const sourcePiece = board[source.row][source.col]

    const rowShift = target.row - source.row
    const colShift = target.col - source.col

    let result = [];
    let i = 1

    for (const value of boardWalk(board, source, rowStep, colStep, Math.max(Math.abs(rowShift), Math.abs(colShift)))) {
        if (!value) {
            result.push({ row: source.row + rowStep * i, col: source.col + colStep * i })
        } else {
            if (value.color !== sourcePiece.color)
                result.push({ row: source.row + rowStep * i, col: source.col + colStep * i })
            break
        }
        i += 1
    }
    return result
}

function* boardWalk(board, source, rowStep, colStep, count) {
    let rowOffset = 0
    let colOffset = 0

    for (let i = 0; i < count; i++) {
        rowOffset += rowStep
        colOffset += colStep

        const element = board[source.row + rowOffset][source.col + colOffset]
        yield element
    }
    return "Done"
}

function isValidPawnMove(source, target, board, history) {
    const lastMove = history.length > 0 ? history[history.length - 1] : null;
    const sourcePiece = board[source.row][source.col]
    const targetPiece = board[target.row][target.col]
    const rowShift = target.row - source.row
    const colShift = Math.abs(target.col - source.col)

    const direction = sourcePiece.color === 'white' ? -1 : 1

    // Forward movement
    if (colShift === 0 && !targetPiece) {
        // Move one step forward
        if (rowShift === direction) {
            return true
        }
        // Move two steps forward from initial position
        const initialRow = sourcePiece.color === 'white' ? 6 : 1
        if (source.row === initialRow && rowShift === 2 * direction) {
            // Check if path is clear
            return !board[source.row + direction][source.col]
        }
    }

    if (colShift === 1 && rowShift === direction) {
        // Capture
        if (targetPiece)
            return true
        // En passant
        if (lastMove) {
            const lastPiece = board[lastMove.target.row][lastMove.target.col]
            if ((lastPiece.type == '♙' || lastPiece.type == '♟')
                && lastMove.source.col === target.col
                && lastMove.target.col === target.col
                && Math.abs(lastMove.source.row - target.row) === 1
                && Math.abs(lastMove.target.row - target.row) === 1) {
                return true
            }
        }

        return false
    }
}

function isValidRookMove(source, target, board) {
    const rowShift = target.row - source.row
    const colShift = target.col - source.col

    if (rowShift !== 0 && colShift !== 0) {
        return false
    }

    const rowStep = rowShift === 0 ? 0 : rowShift > 0 ? 1 : -1
    const colStep = colShift === 0 ? 0 : colShift > 0 ? 1 : -1

    const sourcePiece = board[source.row][source.col]
    let result = true

    for (const value of boardWalk(board, source, rowStep, colStep, Math.max(Math.abs(rowShift), Math.abs(colShift)))) {
        if (value) {
            result = sourcePiece.color !== value.color
            break
        }
    }

    return result
}

function isValidKnightMove(source, target) {
    const rowShift = Math.abs(target.row - source.row)
    const colShift = Math.abs(target.col - source.col)

    return (rowShift === 2 && colShift === 1) || (rowShift === 1 && colShift === 2)
}

function isValidBishopMove(source, target, board) {
    const rowShift = target.row - source.row
    const colShift = target.col - source.col

    if (Math.abs(rowShift) !== Math.abs(colShift)) {
        return false
    }

    const rowStep = rowShift > 0 ? 1 : -1
    const colStep = colShift > 0 ? 1 : -1

    const sourcePiece = board[source.row][source.col]

    let result = true

    for (const value of boardWalk(board, source, rowStep, colStep, Math.abs(rowShift))) {
        if (value) {
            result = sourcePiece.color !== value.color
            break
        }
    }
    return result
}

function isValidQueenMove(source, target, board) {
    return isValidRookMove(source, target, board) || isValidBishopMove(source, target, board)
}

function isSquareAttacked(board, row, col, attackerColor) {
    const boardSize = 8;

    // Check for sliding attacks (rooks, bishops, queens)
    const directions = [
        { r: -1, c: 0, types: ['♖', '♜', '♕', '♛'] }, { r: 1, c: 0, types: ['♖', '♜', '♕', '♛'] },
        { r: 0, c: -1, types: ['♖', '♜', '♕', '♛'] }, { r: 0, c: 1, types: ['♖', '♜', '♕', '♛'] },
        { r: -1, c: -1, types: ['♗', '♝', '♕', '♛'] }, { r: -1, c: 1, types: ['♗', '♝', '♕', '♛'] },
        { r: 1, c: -1, types: ['♗', '♝', '♕', '♛'] }, { r: 1, c: 1, types: ['♗', '♝', '♕', '♛'] }
    ];

    for (const dir of directions) {
        for (let i = 1; i < boardSize; i++) {
            const newRow = row + i * dir.r;
            const newCol = col + i * dir.c;

            if (newRow < 0 || newRow >= boardSize || newCol < 0 || newCol >= boardSize) {
                break; // Off board
            }

            const piece = board[newRow][newCol];
            if (piece) {
                if (piece.color === attackerColor && dir.types.includes(piece.type)) {
                    return true;
                }
                break; // Path is blocked by a piece
            }
        }
    }

    // Check for knight attacks
    const knightMoves = [
        { r: -2, c: -1 }, { r: -2, c: 1 }, { r: -1, c: -2 }, { r: -1, c: 2 },
        { r: 1, c: -2 }, { r: 1, c: 2 }, { r: 2, c: -1 }, { r: 2, c: 1 }
    ];
    const knightTypes = ['♘', '♞'];
    for (const move of knightMoves) {
        const newRow = row + move.r;
        const newCol = col + move.c;
        if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
            const piece = board[newRow][newCol];
            if (piece && piece.color === attackerColor && knightTypes.includes(piece.type)) {
                return true;
            }
        }
    }

    // Check for pawn attacks
    const pawnSourceRow = row + (attackerColor === 'white' ? 1 : -1);
    if (pawnSourceRow >= 0 && pawnSourceRow < 8) {
        const pawnTypes = attackerColor === 'white' ? ['♙'] : ['♟'];
        if (col > 0) {
            const p = board[pawnSourceRow][col - 1];
            if (p && p.color === attackerColor && pawnTypes.includes(p.type)) return true;
        }
        if (col < 7) {
            const p = board[pawnSourceRow][col + 1];
            if (p && p.color === attackerColor && pawnTypes.includes(p.type)) return true;
        }
    }


    // Check for king attacks
    const kingTypes = ['♔', '♚'];
    for (let r_off = -1; r_off <= 1; r_off++) {
        for (let c_off = -1; c_off <= 1; c_off++) {
            if (r_off === 0 && c_off === 0) continue;
            const newRow = row + r_off;
            const newCol = col + c_off;
            if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                const piece = board[newRow][newCol];
                if (piece && piece.color === attackerColor && kingTypes.includes(piece.type)) {
                    return true;
                }
            }
        }
    }

    return false;
}

function isValidCastling(source, target, board, player, history) {
    const rowShift = Math.abs(target.row - source.row)
    const colShift = Math.abs(target.col - source.col)

    if (rowShift !== 0 || colShift !== 2) {
        return false
    }

    const kingRow = player === 'white' ? 7 : 0;
    if (source.row !== kingRow || source.col !== 4) {
        return false;
    }

    // Check if king has moved
    if (history.some(move => move.type === (player === 'white' ? '♔' : '♚'))) {
        return false;
    }

    const isKingside = target.col === 6;
    const rookCol = isKingside ? 7 : 0;
    const rook = board[kingRow][rookCol];

    // Check if rook is in place and is the correct type
    if (!rook || (rook.type !== (player === 'white' ? '♖' : '♜'))) {
        return false;
    }

    // Check if rook has moved
    if (history.some(move => move.source.row === kingRow && move.source.col === rookCol)) {
        return false;
    }

    // Check for pieces between king and rook
    const pathStart = Math.min(source.col, rookCol) + 1;
    const pathEnd = Math.max(source.col, rookCol);
    for (let col = pathStart; col < pathEnd; col++) {
        if (board[kingRow][col]) {
            return false;
        }
    }

    const opponentColor = player === 'white' ? 'black' : 'white';

    // Check if king is currently in check
    if (isSquareAttacked(board, kingRow, 4, opponentColor)) {
        return false;
    }

    // Check if king passes through an attacked square
    const intermediateCol = isKingside ? 5 : 3;
    if (isSquareAttacked(board, kingRow, intermediateCol, opponentColor)) {
        return false;
    }

    // Check if the king would castle into check
    if (isSquareAttacked(board, kingRow, target.col, opponentColor)) {
        return false;
    }

    return true;
}

function isValidKingMove(source, target, board, player, history) {
    const rowShift = Math.abs(target.row - source.row)
    const colShift = Math.abs(target.col - source.col)

    if (rowShift <= 1 && colShift <= 1) {
        return true
    }

    // Castling
    return isValidCastling(source, target, board, player, history)
}


export function isValidMove(source, target, board, player, history) {
    // Out of bounds
    if (!(0 <= source.row <= 7) ||
        !(0 <= source.col <= 7) ||
        !(0 <= target.row <= 7) ||
        !(0 <= target.col <= 7)) {
        console.log("// Out of bounds")
        return false
    }

    const sourcePiece = board[source.row][source.col]
    const targetPiece = board[target.row][target.col]

    // No piece to move
    if (!sourcePiece) {
        console.log("// No piece to move")
        return false
    }

    // Not player's turn
    if (sourcePiece.color !== player) {
        console.log("// Not player's turn")
        return false
    }

    // Can't capture own piece
    if (targetPiece && targetPiece.color === sourcePiece.color) {
        console.log("// Can't capture own piece")
        return false
    }

    // No movement
    if (source.row === target.row && source.col === target.col) {
        console.log("// No movement")
        return false
    }

    const currentlyInCheck = isChecked(board, player, history)
    console.log("Currently in check: ", currentlyInCheck)

    const hypotheticalBoard = JSON.parse(JSON.stringify(board))
    hypotheticalBoard[target.row][target.col] = hypotheticalBoard[source.row][source.col]
    hypotheticalBoard[source.row][source.col] = null

    const futurelyInCheck = isChecked(hypotheticalBoard, player, history)
    console.log("Futurely in check: ", futurelyInCheck)

    if (futurelyInCheck) {
        const msg = currentlyInCheck ? "// Must move out of check" : "// Cannot move into check"
        console.log(msg)
        return false
    }

    switch (sourcePiece.type) {
        case '♙':
        case '♟':
            return isValidPawnMove(source, target, board, history)

        case '♖':
        case '♜':
            return isValidRookMove(source, target, board)

        case '♘':
        case '♞':
            return isValidKnightMove(source, target, board)

        case '♗':
        case '♝':
            return isValidBishopMove(source, target, board)

        case '♕':
        case '♛':
            return isValidQueenMove(source, target, board)

        case '♔':
        case '♚':
            return isValidKingMove(source, target, board, player, history)

        default:
            return false
    }
}


//-----------------------------------------------------------------------------------------------------------------------------//


function validPawnMoves(source, board, history) {
    const lastMove = history.length > 0 ? history[history.length - 1] : null;
    const sourcePiece = board[source.row][source.col]
    const direction = sourcePiece.color === 'white' ? -1 : 1

    const result = []

    const initialRow = sourcePiece.color === 'white' ? 6 : 1
    if (source.row === initialRow && !board[source.row + 2 * direction][source.col]) {
        result.push({ row: source.row + 2 * direction, col: source.col })
    }

    const target = board[source.row + direction][source.col]

    if (!target) {
        result.push({ row: source.row + direction, col: source.col })
    }

    // En passant
    if (lastMove && lastMove.target) {
        console.log("lastMove", lastMove)
        console.log("target", target)
        const lastPiece = board[lastMove.target.row][lastMove.target.col]
        if ((lastPiece.type == '♙' || lastPiece.type == '♟')
            && Math.abs(lastMove.source.row - source.row) === 2
            && Math.abs(lastMove.target.row - source.row) === 0
            && Math.abs(lastMove.source.col - source.col) === 1) {
            result.push({ row: source.row + direction, col: lastMove.source.col })
        }
    }

    const leftTarget = board[source.row + direction][source.col - 1]
    if (leftTarget && leftTarget.color !== sourcePiece.color) {
        result.push({ row: source.row + direction, col: source.col - 1 })
    }

    const rightTarget = board[source.row + direction][source.col + 1]
    if (rightTarget && rightTarget.color !== sourcePiece.color) {
        result.push({ row: source.row + direction, col: source.col + 1 })
    }

    return result
}

function validRookMoves(source, board) {
    let result = [];

    // up
    if (source.row > 0) {
        result = [...result, ...validateRange(source, { row: 0, col: source.col }, board, -1, 0)]
    }
    // down
    if (source.row < 7) {
        result = [...result, ...validateRange(source, { row: 7, col: source.col }, board, 1, 0)]
    }
    // left
    if (source.col > 0) {
        result = [...result, ...validateRange(source, { row: source.row, col: 0 }, board, 0, -1)]
    }
    // right
    if (source.col < 7) {
        result = [...result, ...validateRange(source, { row: source.row, col: 7 }, board, 0, 1)]
    }

    return result
}

function validKnightMoves(source, board) {
    const candidates = [
        { row: source.row - 2, col: source.col - 1 },
        { row: source.row - 2, col: source.col + 1 },
        { row: source.row - 1, col: source.col - 2 },
        { row: source.row - 1, col: source.col + 2 },
        { row: source.row + 1, col: source.col - 2 },
        { row: source.row + 1, col: source.col + 2 },
        { row: source.row + 2, col: source.col - 1 },
        { row: source.row + 2, col: source.col + 1 }
    ]

    const result = []

    for (const candidate of candidates) {
        // Out of bounds
        if (candidate.row < 0 || candidate.row > 7 ||
            candidate.col < 0 || candidate.col > 7) {
            continue
        }

        const targetPiece = board[candidate.row][candidate.col]
        const sourcePiece = board[source.row][source.col]

        // Can't capture own piece
        if (targetPiece && sourcePiece && targetPiece.color === sourcePiece.color) {
            continue
        }

        result.push(candidate)
    }
    return result
}

function validBishopMoves(source, board) {
    let result = [];

    // up left
    if (source.row > 0 && source.col > 0) {
        const rowStep = -1
        const colStep = -1

        const displacement = Math.min(Math.abs(0 - source.row), Math.abs(0 - source.col))
        const target = { row: source.row + rowStep * displacement, col: source.col + colStep * displacement }
        result = [...result, ...validateRange(source, target, board, rowStep, colStep)]
    }

    // down left
    if (source.row < 7 && source.col > 0) {
        const rowStep = 1
        const colStep = -1

        const displacement = Math.min(Math.abs(-7 + source.row), Math.abs(0 - source.col))
        const target = { row: source.row + rowStep * displacement, col: source.col + colStep * displacement }
        result = [...result, ...validateRange(source, target, board, rowStep, colStep)]
    }

    // up right
    if (source.row > 0 && source.col < 7) {
        const rowStep = -1
        const colStep = 1

        const displacement = Math.min(Math.abs(0 - source.row), Math.abs(-7 + source.col))
        const target = { row: source.row + rowStep * displacement, col: source.col + colStep * displacement }
        result = [...result, ...validateRange(source, target, board, rowStep, colStep)]
    }

    // down right
    if (source.row < 7 && source.col < 7) {
        const rowStep = 1
        const colStep = 1

        const displacement = Math.min(Math.abs(-7 + source.row), Math.abs(-7 + source.col))
        const target = { row: source.row + rowStep * displacement, col: source.col + colStep * displacement }
        result = [...result, ...validateRange(source, target, board, rowStep, colStep)]
    }

    return result
}

function validQueenMoves(source, board) {
    let result = [];

    result = [...result, ...validRookMoves(source, board)]
    result = [...result, ...validBishopMoves(source, board)]

    return result
}

function validKingMoves(source, board, player, history) {
    const candidates = [
        { row: source.row + 1, col: source.col },
        { row: source.row - 1, col: source.col },
        { row: source.row, col: source.col + 1 },
        { row: source.row, col: source.col - 1 },
        { row: source.row + 1, col: source.col + 1 },
        { row: source.row + 1, col: source.col - 1 },
        { row: source.row - 1, col: source.col + 1 },
        { row: source.row - 1, col: source.col - 1 }
    ]

    const result = []

    for (const candidate of candidates) {
        // Out of bounds
        if (candidate.row < 0 || candidate.row > 7 ||
            candidate.col < 0 || candidate.col > 7) {
            continue
        }

        const targetPiece = board[candidate.row][candidate.col]
        const sourcePiece = board[source.row][source.col]

        // Can't capture own piece
        if (targetPiece && sourcePiece && targetPiece.color === sourcePiece.color) {
            continue
        }

        result.push(candidate)
    }

    // Castling
    if (isValidCastling(source, { row: source.row, col: 6 }, board, player, history)) {
        result.push({ row: source.row, col: 6 })
    }
    if (isValidCastling(source, { row: source.row, col: 2 }, board, player, history)) {
        result.push({ row: source.row, col: 2 })
    }

    return result
}


export function validMoves(source, board, turn, history) {
    let validMoveset = [];
    // Out of bounds
    if (!(0 <= source.row <= 7) ||
        !(0 <= source.col <= 7)) {
        return validMoveset
    }

    const sourcePiece = board[source.row][source.col]

    // No piece to move
    if (!sourcePiece) {
        return validMoveset
    }

    // Not player's turn
    if (sourcePiece.color !== turn) {
        return validMoveset
    }

    switch (sourcePiece.type) {
        case '♙':
        case '♟':
            validMoveset = validPawnMoves(source, board, history)
            break
        case '♖':
        case '♜':
            validMoveset = validRookMoves(source, board)
            break
        case '♘':
        case '♞':
            validMoveset = validKnightMoves(source, board)
            break
        case '♗':
        case '♝':
            validMoveset = validBishopMoves(source, board)
            break
        case '♕':
        case '♛':
            validMoveset = validQueenMoves(source, board)
            break
        case '♔':
        case '♚':
            validMoveset = validKingMoves(source, board, turn, history)
            break
        default:
            break;
    }

    return validMoveset
}

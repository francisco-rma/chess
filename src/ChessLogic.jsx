function validateRange(source, target, board, rowStep, colStep) {
    const sourcePiece = board[source.row][source.col]

    const rowShift = target.row - source.row
    const colShift = target.col - source.col

    if (rowShift !== 0 && colShift !== 0) {
        return result
    }

    let result = [];
    let i = 1

    for (const value of iterate(board, source, rowStep, colStep, Math.max(Math.abs(rowShift), Math.abs(colShift)))) {
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

function* iterate(board, source, rowStep, colStep, count) {
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

function isValidPawnMove(source, target, board, lastMove) {
    const sourcePiece = board[source.row][source.col]
    const targetPiece = board[target.row][target.col]
    const rowShift = target.row - source.row
    const colShift = Math.abs(target.col - source.col)

    const direction = sourcePiece.color === 'white' ? 1 : -1

    // Forward movement
    if (colShift === 0 && !targetPiece) {
        // Move one step forward
        if (rowShift === direction) {
            return true
        }
        // Move two steps forward from initial position
        const initialRow = sourcePiece.color === 'white' ? 1 : 6
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
        console.log('checking en passant')
        const lastPiece = board[lastMove.target.row][lastMove.target.col]
        if ((lastPiece.type == '♙' || lastPiece.type == '♟')
            && lastMove.source.col === target.col
            && lastMove.target.col === target.col
            && Math.abs(lastMove.source.row - target.row) === 1
            && Math.abs(lastMove.target.row - target.row) === 1
        ) {
            console.log('en passant')
            return true
        }
        // En passant
        if (colShift === 1 && rowShift === direction && targetPiece) {
            return true
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

    let result = true

    for (const value of iterate(board, source, rowStep, colStep, Math.max(Math.abs(rowShift), Math.abs(colShift)))) {
        if (value) {
            result = false
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

    let result = true

    for (const value of iterate(board, source, rowStep, colStep, Math.abs(rowShift))) {
        if (value) {
            result = false
            break
        }
    }

    return result
}

function isValidQueenMove(source, target, board) {
    return isValidRookMove(source, target, board) || isValidBishopMove(source, target, board)
}

function isValidKingMove(source, target) {
    const rowShift = Math.abs(target.row - source.row)
    const colShift = Math.abs(target.col - source.col)

    return rowShift <= 1 && colShift <= 1
}


export function isValidMove(source, target, board, turn, lastMove) {
    // Out of bounds
    if (!(0 <= source.row <= 7) ||
        !(0 <= source.col <= 7) ||
        !(0 <= target.row <= 7) ||
        !(0 <= target.col <= 7)) {
        return false
    }

    const sourcePiece = board[source.row][source.col]
    const targetPiece = board[target.row][target.col]

    // No piece to move
    if (!sourcePiece) {
        return false
    }

    // Not player's turn
    if (sourcePiece.color !== turn) {
        return false
    }

    // Can't capture own piece
    if (targetPiece && targetPiece.color === sourcePiece.color) {
        return false
    }

    // No movement
    if (source.row === target.row && source.col === target.col) {
        return false
    }

    switch (sourcePiece.type) {
        case '♙':
        case '♟':
            return isValidPawnMove(source, target, board, lastMove)

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
            return isValidKingMove(source, target, board)

        default:
            return false
    }
}


//-----------------------------------------------------------------------------------------------------------------------------//


function validPawnMoves(source, board, lastMove) {
}

function validRookMoves(source, board) {
    let result = [];
    return result
}

function validKnightMoves(source, board) {
}

function validBishopMoves(source, board) {
}

function validQueenMoves(source, board) {
}

function validKingMoves(source, board) {
}


export function validMoves(source, board, turn, lastMove) {
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
            validMoveset = validPawnMoves(source, board, lastMove)
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
            validMoveset = validKingMoves(source, board)
            break
        default:
            break;
    }

    console.log('result: ', validMoveset)
    return validMoveset
}

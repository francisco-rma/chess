import { useState } from 'react'

function Square({ piece, color, rowIdx, colIdx, onClick, onMouseDown, onMouseUp, isSelected }) {
    return (
        <div className={`square ${color}-square ${isSelected ? 'selected-square' : ''}`}
            onClick={() => onClick?.(rowIdx, colIdx)}
            onMouseDown={() => onMouseDown?.(rowIdx, colIdx)}
            onMouseUp={() => onMouseUp?.(rowIdx, colIdx)}>
            {piece ? `${piece.type[0]}` : ''}
        </div>
    )
}

function Board() {
    const initialBoard = [
        [{ type: 'rook', color: 'white' }, { type: 'knight', color: 'white' }, { type: 'bishop', color: 'white' }, { type: 'queen', color: 'white' }, { type: 'king', color: 'white' }, { type: 'bishop', color: 'white' }, { type: 'knight', color: 'white' }, { type: 'rook', color: 'white' }],
        [{ type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }, { type: 'pawn', color: 'white' }],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [{ type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }, { type: 'pawn', color: 'black' }],
        [{ type: 'rook', color: 'black' }, { type: 'knight', color: 'black' }, { type: 'bishop', color: 'black' }, { type: 'queen', color: 'black' }, { type: 'king', color: 'black' }, { type: 'bishop', color: 'black' }, { type: 'knight', color: 'black' }, { type: 'rook', color: 'black' }],
    ]

    const boardSize = 8
    const [board, setBoard] = useState(initialBoard)
    console.log('board: ', board)

    const [selectedSquare, setSelectedSquare] = useState(null)

    const onClick = (rowIdx, colIdx) => {
        console.log(`Click at (${rowIdx},${colIdx}):${board[rowIdx][colIdx]} `)
        if (selectedSquare) {
            const target = { row: rowIdx, col: colIdx }
            const isValid = isValidMove(selectedSquare, target, board)
            console.log('isValid: ', isValid)
            if (isValid) {
                board[rowIdx][colIdx] = board[selectedSquare.row][selectedSquare.col]
                board[selectedSquare.row][selectedSquare.col] = null
                setBoard([...board])
            }
            setSelectedSquare(null)
        }
        else {
            setSelectedSquare({ row: rowIdx, col: colIdx })
            setBoard([...board])
        }
    }
    const onMouseDown = (rowIdx, colIdx) => {
        console.log('MouseDown')
    }
    const onMouseUp = (rowIdx, colIdx) => {
        console.log('MouseUp')
    }
    const isSquareSelected = (rowIdx, colIdx) => {
        return selectedSquare && selectedSquare.row === rowIdx && selectedSquare.col === colIdx
    }

    return (
        <div className="chess-board">
            {board.map((row, idx) => {
                return row.map((_, colIdx) => {
                    return (
                        <Square
                            onClick={onClick}
                            onMouseDown={onMouseDown}
                            onMouseUp={onMouseUp}
                            piece={row[colIdx]}
                            color={(idx + colIdx) % 2 === 0 ? 'white' : 'black'}
                            rowIdx={idx}
                            colIdx={colIdx}
                            isSelected={isSquareSelected(idx, colIdx)}
                            key={idx * boardSize + colIdx} />
                    )
                })
            })}
        </div>
    )
}
function isValidMove(sourceCoordinates, targetCoordinates, board) {
    console.log('source: ', sourceCoordinates)
    console.log('target: ', targetCoordinates)
    console.log('board: ', board)
    // Out of bounds
    if (!(0 <= sourceCoordinates.row < 8) ||
        !(0 <= sourceCoordinates.col < 8) ||
        !(0 <= targetCoordinates.row < 8) ||
        !(0 <= targetCoordinates.col < 8)) {
        return false
    }

    // No movement
    if (sourceCoordinates.row === targetCoordinates.row && sourceCoordinates.col === targetCoordinates.col) {
        return false
    }

    console.log(`board[${sourceCoordinates.row}][${sourceCoordinates.col}]: `, board[sourceCoordinates.row][sourceCoordinates.col])
    console.log(`board[${targetCoordinates.row}][${targetCoordinates.col}]: `, board[targetCoordinates.row][targetCoordinates.col])
    let sourcePiece = board[sourceCoordinates.row][sourceCoordinates.col]
    let targetPiece = board[targetCoordinates.row][targetCoordinates.col]

    // No piece to move
    if (!sourcePiece) {
        console.log('No piece to move')
        return false
    }

    // Can't capture own piece
    if (targetPiece && targetPiece.color === sourcePiece.color) {
        return false
    }

    const rowShift = targetCoordinates.row - sourceCoordinates.row
    const colShift = targetCoordinates.col - sourceCoordinates.col

    switch (sourcePiece.type) {
        case 'pawn':
            if (Math.abs(rowShift) > 1 || Math.abs(colShift) > 1) {
                return false
            }
            if ((colShift === 0 && targetPiece) || (colShift === 1 && !targetPiece)) {
                return false
            }
            if (sourcePiece.color === 'white') {
                return rowShift > 0
            }
            if (sourcePiece.color === 'black') {
                return rowShift < 0
            }
            break
        case 'rook':
            if (rowShift !== 0 && colShift !== 0)
                return false

            if (targetPiece && targetPiece.color === sourcePiece.color)
                return false

            const isRowShift = Math.abs(rowShift) > 0
            let start = (isRowShift ? sourceCoordinates.row : sourceCoordinates.col)
            let end = isRowShift ? targetCoordinates.row : targetCoordinates.col
            const padding = start > end ? -1 : 1
            start = start + padding
            console.log('start ', start)
            console.log('end ', end)
            console.log('padding ', padding)
            
            for (let i = start; i < end; padding == -1 ? i-- : i++) {
                console.log(i)
                console.log(isRowShift ? board[i][sourceCoordinates.col] : board[sourceCoordinates.row][i])
                if ((isRowShift && board[i][sourceCoordinates.col]) ||
                    !isRowShift && board[sourceCoordinates.row][i]) {
                    return false
                }
            }
            break
    }
    return true
}

export default function Chess() {
    return (
        <Board />
    )
}
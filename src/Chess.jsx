import { useState } from 'react'
import { isValidMove } from './ChessLogic'

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

    const [turn, setTurn] = useState('white')
    const [selectedSquare, setSelectedSquare] = useState(null)

    const onClick = (rowIdx, colIdx) => {
        console.log(`${turn}(${rowIdx},${colIdx}):${board[rowIdx][colIdx]} `)
        if (selectedSquare) {
            const target = { row: rowIdx, col: colIdx }
            const isValid = isValidMove(selectedSquare, target, board, turn)
            if (isValid) {
                board[rowIdx][colIdx] = board[selectedSquare.row][selectedSquare.col]
                board[selectedSquare.row][selectedSquare.col] = null
                setBoard([...board])
                setTurn(turn === 'white' ? 'black' : 'white')
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

export default function Chess() {
    return (
        <Board />
    )
}
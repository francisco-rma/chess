import { useState } from 'react'
import { isValidMove } from './ChessLogic'

function Square({ piece, color, rowIdx, colIdx, onClick, onMouseDown, onMouseUp, isSelected }) {
    return (
        <div className={`square ${color}-square ${isSelected ? 'selected-square' : ''}`}
            onClick={() => onClick?.(rowIdx, colIdx)}>
            {piece ? `${piece.type}` : ''}
        </div>
    )
}

function Board() {
    const initialBoard = [
        [{ type: '♖', color: 'white' }, { type: '♘', color: 'white' }, { type: '♗', color: 'white' }, { type: '♕', color: 'white' }, { type: '♔', color: 'white' }, { type: '♗', color: 'white' }, { type: '♘', color: 'white' }, { type: '♖', color: 'white' }],
        [{ type: '♙', color: 'white' }, { type: '♙', color: 'white' }, { type: '♙', color: 'white' }, { type: '♙', color: 'white' }, { type: '♙', color: 'white' }, { type: '♙', color: 'white' }, { type: '♙', color: 'white' }, { type: '♙', color: 'white' }],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [{ type: '♟', color: 'black' }, { type: '♟', color: 'black' }, { type: '♟', color: 'black' }, { type: '♟', color: 'black' }, { type: '♟', color: 'black' }, { type: '♟', color: 'black' }, { type: '♟', color: 'black' }, { type: '♟', color: 'black' }],
        [{ type: '♜', color: 'black' }, { type: '♞', color: 'black' }, { type: '♝', color: 'black' }, { type: '♛', color: 'black' }, { type: '♚', color: 'black' }, { type: '♝', color: 'black' }, { type: '♞', color: 'black' }, { type: '♜', color: 'black' }],
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
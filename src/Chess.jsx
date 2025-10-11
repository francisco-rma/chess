import { useState } from 'react'
import { isValidMove } from './ChessLogic'

function Square({ piece, color, rowIdx, colIdx, onClick, onMouseDown, onMouseUp, isSelected }) {
    return (
        <div className={`square ${color}-square ${isSelected ? 'selected-square' : ''} ${piece ? piece.color === 'white' ? 'white-piece' : 'black-piece' : ''}`}
            onClick={() => onClick?.(rowIdx, colIdx)}>
            {piece ? `${piece.type}` : ''}
        </div>
    )
}

function Board({ my_color }) {
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

    const [lastMove, setlastMove] = useState(null)

    const onClick = (rowIdx, colIdx) => {
        if (turn !== my_color) {
            // console.log('not your turn')
            // return;
        }
        console.log(`${turn}(${rowIdx},${colIdx}):${board[rowIdx][colIdx]} `)
        if (selectedSquare) {
            const target = { row: rowIdx, col: colIdx }
            const isValid = isValidMove(selectedSquare, target, board, turn, lastMove)
            if (isValid) {
                // En passant
                if (lastMove && target) {
                    const lastPiece = board[lastMove.target.row][lastMove.target.col]
                    if ((lastPiece.type == '♙' || lastPiece.type == '♟')
                        && lastMove.source.col === target.col
                        && lastMove.target.col === target.col
                        && Math.abs(lastMove.source.row - target.row) === 1
                        && Math.abs(lastMove.target.row - target.row) === 1
                    ) {
                        board[lastMove.target.row][lastMove.target.col] = null
                    }
                }
                setlastMove({ source: selectedSquare, target: target })
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

export default function Chess({ color }) {
    console.log('my color is ' + color)
    return (
        <Board
            my_color={color} />
    )
}
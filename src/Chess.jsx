import { useState } from 'react'
import { isValidMove, validMoves } from './ChessLogic'

function Square({ piece, color, rowIdx, colIdx, onClick, onMouseDown, onMouseUp, isSelected, isValid }) {
    const className = `square ${color}-square ${isSelected ? 'selected-square' : ''}  ${isValid ? 'valid-square' : ''} ${piece ? piece.color === 'white' ? 'white-piece' : 'black-piece' : ''}`
    return (
        <div className={className}
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
    const [validMoveList, setValidMoveList] = useState([])
    const [lastMove, setlastMove] = useState(null)

    const onClick = (rowIdx, colIdx) => {
        if (turn !== my_color) {
            // console.log('not your turn')
            // return;
        }
        console.log(`Turn: ${turn}`)
        if (selectedSquare) {
            const sourcePiece = board[selectedSquare.row][selectedSquare.col]
            console.log('source piece: ', sourcePiece)
            
            const target = { row: rowIdx, col: colIdx }
            const targetPiece = board[target.row][target.col]
            console.log('target piece: ', targetPiece)
            const isValid = isValidMove(selectedSquare, target, board, turn, lastMove)
            console.log('isValid: ', isValid)
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
            setValidMoveList([])
        }
        else {
            const newSelectedSquare = { row: rowIdx, col: colIdx }
            const moves = validMoves(newSelectedSquare, board, turn, lastMove)
            console.log('moves: ', moves)
            setSelectedSquare(newSelectedSquare)
            setValidMoveList(moves)
            setBoard([...board])
        }
    }

    const isSquareSelected = (rowIdx, colIdx) => {
        return selectedSquare && selectedSquare.row === rowIdx && selectedSquare.col === colIdx
    }

    const isSquareValid = (rowIdx, colIdx) => {
        return validMoveList && validMoveList.some(move => move.row === rowIdx && move.col === colIdx)
    }

    const showValidMoves = () => { console.log("Valid moves: ", validMoveList) }
    return (
        <div>
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
                                isValid={isSquareValid(idx, colIdx)}
                                key={idx * boardSize + colIdx} />
                        )
                    })
                })}
            </div >
            <div>
                <button onClick={showValidMoves}>Show valid moves</button>
            </div>
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
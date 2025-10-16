import { useState } from 'react'
import { isValidMove, validMoves } from './ChessLogic'
import { PGNtoMovelist } from './OpeningEngine'

const colMapping = new Map()
colMapping.set(0, 'a')
colMapping.set(1, 'b')
colMapping.set(2, 'c')
colMapping.set(3, 'd')
colMapping.set(4, 'e')
colMapping.set(5, 'f')
colMapping.set(6, 'g')
colMapping.set(7, 'h')

const rowMapping = new Map()
rowMapping.set(0, '8')
rowMapping.set(1, '7')
rowMapping.set(2, '6')
rowMapping.set(3, '5')
rowMapping.set(4, '4')
rowMapping.set(5, '3')
rowMapping.set(6, '2')
rowMapping.set(7, '1')

function History({ moves }) {
    const result = []
    let moveCount = 0
    for (let index = 0; index < moves.length; index++) {
        const currentMove = Math.floor(index / 2) + 1
        if (currentMove !== moveCount) {
            result.push(`${currentMove}. `)
        }
        moveCount = currentMove
        const move = moves[index]
        result[moveCount - 1] += `${move.type}${colMapping.get(move.target.col)}${rowMapping.get(move.target.row)} `
    }

    return (
        <div className="move-history">
            <h3>History</h3>
            <ol>
                {result.map((move, idx) => {
                    return <li key={idx}>{move}</li>
                })}
            </ol>
        </div>
    )
}


function Square({ piece, color, rowIdx, colIdx, onClick, onMouseDown, onMouseUp, isSelected, isValid }) {
    const className = `square ${color}-square ${isSelected ? 'selected-square' : ''}  ${isValid ? 'valid-square' : ''} ${piece ? piece.color === 'white' ? 'white-piece' : 'black-piece' : ''}`
    return (
        <div className={className}
            onClick={() => onClick?.(rowIdx, colIdx)}>
            {piece ? `${piece.type}` : ''}
        </div>
    )
}

function Game({ my_color }) {
    const initialBoard = [
        [{ type: '♜', color: 'black' }, { type: '♞', color: 'black' }, { type: '♝', color: 'black' }, { type: '♛', color: 'black' }, { type: '♚', color: 'black' }, { type: '♝', color: 'black' }, { type: '♞', color: 'black' }, { type: '♜', color: 'black' }],
        [{ type: '♟', color: 'black' }, { type: '♟', color: 'black' }, { type: '♟', color: 'black' }, { type: '♟', color: 'black' }, { type: '♟', color: 'black' }, { type: '♟', color: 'black' }, { type: '♟', color: 'black' }, { type: '♟', color: 'black' }],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [{ type: '♙', color: 'white' }, { type: '♙', color: 'white' }, { type: '♙', color: 'white' }, { type: '♙', color: 'white' }, { type: '♙', color: 'white' }, { type: '♙', color: 'white' }, { type: '♙', color: 'white' }, { type: '♙', color: 'white' }],
        [{ type: '♖', color: 'white' }, { type: '♘', color: 'white' }, { type: '♗', color: 'white' }, { type: '♕', color: 'white' }, { type: '♔', color: 'white' }, { type: '♗', color: 'white' }, { type: '♘', color: 'white' }, { type: '♖', color: 'white' }]
    ]


    const boardSize = 8
    const [board, setBoard] = useState(initialBoard)
    const [turn, setTurn] = useState('white')
    const [selectedSquare, setSelectedSquare] = useState(null)
    const [validMoveList, setValidMoveList] = useState([])
    const [moveList, setMovelist] = useState([])

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

            const lastMove = moveList[moveList.length - 1]
            console.log('last move: ', lastMove)


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
                        && Math.abs(lastMove.target.row - target.row) === 1) {
                        board[lastMove.target.row][lastMove.target.col] = null
                    }
                }
                board[rowIdx][colIdx] = board[selectedSquare.row][selectedSquare.col]
                board[selectedSquare.row][selectedSquare.col] = null
                setMovelist([...moveList, { type: sourcePiece.type, source: selectedSquare, target: target }])
                console.log('movelist: ', moveList)
                setlastMove({ source: selectedSquare, target: target })
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
        <div className="board-container">
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
            <History moves={moveList} />
        </div>
    )
}

export default function Chess({ color }) {
    console.log('my color is ' + color)
    console.log('row mapping: ', rowMapping)
    console.log('col mapping: ', colMapping)
    return (
        <div>
            <Game my_color={color} />
        </div>
    )
}
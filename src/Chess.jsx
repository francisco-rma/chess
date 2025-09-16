import { useState } from 'react';

function Square({ piece, color, rowIdx, colIdx, onClick, onMouseDown, onMouseUp }) {
    return (
        <div className={`square ${color}-square`}
            onClick={() => onClick?.(rowIdx, colIdx)}
            onMouseDown={() => onMouseDown?.(rowIdx, colIdx)}
            onMouseUp={() => onMouseUp?.(rowIdx, colIdx)}>
            {piece ? `${piece.type}` : ''}
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
    ];

    const boardSize = 8;
    const [board, setBoard] = useState(initialBoard);
    console.log('board: ', board)

    const [selectedSquare, setSelectedSquare] = useState(null);
    const onClick = (rowIdx, colIdx) => {
        console.log(`Click at (${rowIdx},${colIdx}):${board[rowIdx][colIdx]} `)
        if (!board[rowIdx][colIdx])
            return;

        if (selectedSquare) {
            const target = { row: rowIdx, col: colIdx }
            const isValid = isValidMove(selectedSquare, target, board);
            console.log('isValid: ', isValid)
            if (isValid) {
            }
        }
        else {
            setSelectedSquare({ row: rowIdx, col: colIdx })
        }
    }
    const onMouseDown = (rowIdx, colIdx) => {
        console.log('MouseDown')
    }
    const onMouseUp = (rowIdx, colIdx) => {
        console.log('MouseUp')
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
                            key={idx * boardSize + colIdx} />
                    )
                })
            })}
        </div>
    )
}
function isValidMove(source, target, board) {
    // Out of bounds
    if (!(0 <= source.row < 8) ||
        !(0 <= source.col < 8) ||
        !(0 <= target.row < 8) ||
        !(0 <= target.col < 8)) {
        return false;
    }

    // No movement
    if (source.row === target.row && source.col === target.col) {
        return false;
    }

    console.log(`board[${source.row}][${source.col}]: `, board[source.row][source.col])
    let piece = board[source.row][source.col];

    // No piece to move
    if (!piece) {
        console.log('No piece to move');
        return false;
    }

    target = board[target.row][target.col];

    // Can't capture own piece
    if (target && target.color === piece.color) {
        return false;
    }

    const rowShift = target.row - source.row;
    const colShift = target.col - source.col;

    switch (piece.type) {
        case 'pawn':
            if (rowShift > 1 || colShift > 1) return false; // Pawns can only move one square forward or capture diagonally
            if ((colShift === 0 && target) || (colShift === 1 && !target)) return false; // Can't move forward into an occupied square
            if (piece.color === 'white') return rowShift < 0; // White pawns can't move backward
            if (piece.color === 'black') return rowShift > 0; // Black pawns can't move forward
            break;
        case 'rook':
            if (rowShift !== 0 && colShift !== 0) return false; // Rooks move in straight lines
            if (target) {
                const isRowShift = rowShift > 0
                let start = (isRowShift ? source.row : source.col) + 1;
                let end = isRowShift ? target.row : target.col;
                if (start > end) [start, end] = [end, start];

                for (let i = start; i < end; i++) {
                    if ((isRowShift && board[i][source.col] !== null) ||
                        !isRowShift && board[source.row][i] !== null) {
                        return false
                    };
                }
            }
            break
    }
}

export default function Chess() {
    return (
        <Board />
    )
}
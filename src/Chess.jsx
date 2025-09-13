function Square(event) {
    console.log('piece: ', event.piece)
    console.log('color: ', event.color)
    return (
        <div className={`square ${event.color}-square`}
            onClick={() => console.log('click')}>
            {event.piece}
        </div>
    )
}

function BoardRow(boardRow) {
    const row = boardRow.row;
    const rowIndex = boardRow.rowIndex;
    return (
        <div className="board-row">
            {row.map((_, colIndex) => {
                const isWhiteSquare = (rowIndex + colIndex) % 2 === 0;
                let piece = null;
                return (
                    <Square piece={piece} color={isWhiteSquare ? 'white' : 'black'} key={colIndex} />
                )
            })}
        </div>
    )
}
function Board() {
    const boardSize = 8;
    const board = Array(boardSize).fill(null).map(() => Array(boardSize).fill(null));

    const whitePieces = ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖', '♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'];
    const blackPieces = ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜', '♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'];

    return (
        <div className="chess-board">
            {board.map((row, idx) => {
                return (
                    <BoardRow row={row} rowIndex={idx} key={idx} />
                )
            })}
        </div>
    )
}

export default function Chess() {
    return (
        <Board />
    )
}
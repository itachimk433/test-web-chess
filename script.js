document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('board');
    const statusElement = document.getElementById('status');
    const resetBtn = document.getElementById('reset-btn');

    let board = [];
    let turn = 'white';
    let selectedSquare = null;

    const piecesMap = {
        white: { p: '♙', r: '♖', n: '♘', b: '♗', q: '♕', k: '♔' },
        black: { p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚' }
    };

    function initBoard() {
        board = [
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
        ];
        turn = 'white';
        selectedSquare = null;
        render();
    }

    function render() {
        boardElement.innerHTML = '';
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const square = document.createElement('div');
                square.className = `square ${(r + c) % 2 === 0 ? 'light' : 'dark'}`;
                if (selectedSquare && selectedSquare.r === r && selectedSquare.c === c) {
                    square.classList.add('selected');
                }
                
                const pieceCode = board[r][c];
                if (pieceCode) {
                    const isWhite = pieceCode === pieceCode.toUpperCase();
                    const type = pieceCode.toLowerCase();
                    square.textContent = piecesMap[isWhite ? 'white' : 'black'][type];
                    square.style.color = isWhite ? '#fff' : '#000';
                    square.style.textShadow = isWhite ? '0 0 2px #000' : '0 0 2px #fff';
                }
                
                square.onclick = () => handleSquareClick(r, c);
                boardElement.appendChild(square);
            }
        }
        statusElement.textContent = `${turn.charAt(0).toUpperCase() + turn.slice(1)}'s Turn`;
    }

    function handleSquareClick(r, c) {
        const piece = board[r][c];
        const isWhitePiece = piece && piece === piece.toUpperCase();
        
        if (selectedSquare) {
            if (selectedSquare.r === r && selectedSquare.c === c) {
                selectedSquare = null;
            } else {
                const targetPiece = board[r][c];
                const isTargetWhite = targetPiece && targetPiece === targetPiece.toUpperCase();
                
                if (targetPiece && ((turn === 'white' && isTargetWhite) || (turn === 'black' && !isTargetWhite))) {
                    selectedSquare = { r, c };
                } else {
                    board[r][c] = board[selectedSquare.r][selectedSquare.c];
                    board[selectedSquare.r][selectedSquare.c] = null;
                    turn = turn === 'white' ? 'black' : 'white';
                    selectedSquare = null;
                }
            }
        } else if (piece) {
            if ((turn === 'white' && isWhitePiece) || (turn === 'black' && !isWhitePiece)) {
                selectedSquare = { r, c };
            }
        }
        render();
    }

    resetBtn.addEventListener('click', initBoard);
    initBoard();
});
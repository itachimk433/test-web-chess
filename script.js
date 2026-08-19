document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('board');
    const statusElement = document.getElementById('status');
    const resetBtn = document.getElementById('reset-btn');

    let board = [];
    let squares = []; // Cache square elements
    let turn = 'white';
    let selectedSquare = null;
    let isAnimating = false;

    const piecesMap = {
        white: { p: '♙', r: '♖', n: '♘', b: '♗', q: '♕', k: '♔' },
        black: { p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚' }
    };

    function createBoard() {
        boardElement.innerHTML = '';
        squares = [];
        for (let r = 0; r < 8; r++) {
            squares[r] = [];
            for (let c = 0; c < 8; c++) {
                const square = document.createElement('div');
                square.className = `square ${(r + c) % 2 === 0 ? 'light' : 'dark'}`;
                square.onclick = () => handleSquareClick(r, c);
                boardElement.appendChild(square);
                squares[r][c] = square;
            }
        }
    }

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
        isAnimating = false;
        render();
    }

    function render() {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const square = squares[r][c];
                square.innerHTML = '';
                square.classList.remove('selected');
                
                if (selectedSquare && selectedSquare.r === r && selectedSquare.c === c) {
                    square.classList.add('selected');
                }
                
                const pieceCode = board[r][c];
                if (pieceCode) {
                    const pieceEl = document.createElement('span');
                    pieceEl.className = 'piece';
                    const isWhite = pieceCode === pieceCode.toUpperCase();
                    const type = pieceCode.toLowerCase();
                    pieceEl.textContent = piecesMap[isWhite ? 'white' : 'black'][type];
                    pieceEl.style.color = isWhite ? '#fff' : '#000';
                    pieceEl.style.textShadow = isWhite ? '0 0 2px #000' : '0 0 2px #fff';
                    square.appendChild(pieceEl);
                }
            }
        }
        statusElement.textContent = `${turn.charAt(0).toUpperCase() + turn.slice(1)}'s Turn`;
    }

    function handleSquareClick(r, c) {
        if (isAnimating) return;

        const piece = board[r][c];
        const isWhitePiece = piece && piece === piece.toUpperCase();
        
        if (selectedSquare) {
            if (selectedSquare.r === r && selectedSquare.c === c) {
                selectedSquare = null;
                render();
            } else {
                const targetPiece = board[r][c];
                const isTargetWhite = targetPiece && targetPiece === targetPiece.toUpperCase();
                
                if (targetPiece && ((turn === 'white' && isTargetWhite) || (turn === 'black' && !isTargetWhite))) {
                    selectedSquare = { r, c };
                    render();
                } else {
                    animateMove(selectedSquare.r, selectedSquare.c, r, c);
                }
            }
        } else if (piece) {
            if ((turn === 'white' && isWhitePiece) || (turn === 'black' && !isWhitePiece)) {
                selectedSquare = { r, c };
                render();
            }
        }
    }

    function animateMove(fromR, fromC, toR, toC) {
        isAnimating = true;
        const squareFrom = squares[fromR][fromC];
        const pieceEl = squareFrom.querySelector('.piece');
        
        if (!pieceEl) {
            finalizeMove(fromR, fromC, toR, toC);
            return;
        }

        const squareTo = squares[toR][toC];
        const rectFrom = squareFrom.getBoundingClientRect();
        const rectTo = squareTo.getBoundingClientRect();
        
        const deltaX = rectTo.left - rectFrom.left;
        const deltaY = rectTo.top - rectFrom.top;

        pieceEl.style.zIndex = "10";
        pieceEl.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

        setTimeout(() => {
            finalizeMove(fromR, fromC, toR, toC);
        }, 250); // Match CSS transition duration
    }

    function finalizeMove(fromR, fromC, toR, toC) {
        board[toR][toC] = board[fromR][fromC];
        board[fromR][fromC] = null;
        turn = turn === 'white' ? 'black' : 'white';
        selectedSquare = null;
        isAnimating = false;
        render();
    }

    createBoard();
    initBoard();
    resetBtn.addEventListener('click', initBoard);
});
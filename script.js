function createPlayer(symbol) {
    const playerSymbol = symbol;

    let playerName;
    let victories = 0;

    const getName = () => playerName;
    const setName = (name) => playerName = name;
    const getVictories = () => victories;
    const addVictory = () => victories++;
    const placePiece = (x, y) => {
        const positionChosen = board.getPosition(x, y);
        let hasBeenFilled = positionChosen.fillPosition(playerSymbol);
        if (hasBeenFilled) checkWinCondition();
    };
    const checkWinCondition = () => {
        let result = board.checkWinCondition(playerSymbol);

        switch (result) {
            case true:
                addVictory();
                console.log(`${getName()} wins!`)
                break;
            case false:
                board.switchActivePlayer();
                return;
            default:
                console.log("ITSA A DRAW")
                break;
        }
        board.switchActivePlayer();
        board.resetBoard();
    }

    return { playerSymbol, getName, setName, getVictories, addVictory, placePiece, checkWinCondition };
}

function createPosition(x, y, filled = '') {
    const positionX = x;
    const positionY = y;
    let fill = filled;

    const getFill = () => fill;
    const canBeFilled = () => !fill;
    const fillPosition = (symbol) => {
        if (!canBeFilled()) return false;
        fill = symbol;
        return true;
    }
    const resetFill = () => fill = '';

    return { positionX, positionY, getFill, canBeFilled, fillPosition, resetFill };
}

const board = (() => {
    const player1 = createPlayer('O');
    const player2 = createPlayer('X');

    let positions = [];
    let activePlayer = player1;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            positions.push(createPosition(i, j));
        }
    }

    const getActivePlayer = () => activePlayer;
    const switchActivePlayer = () => activePlayer = activePlayer === player1 ? player2 : player1;
    const getPosition = (x, y) => positions.find(position => position.positionX == x && position.positionY == y);
    const resetBoard = () => positions.forEach(position => position.resetFill());
    const isBoardFull = () => {
        let arePositionsEmpty = true;
        positions.forEach(position => {
            if (position.canBeFilled()) arePositionsEmpty = false;
        });
        return arePositionsEmpty;
    }
    const checkWinCondition = (symbol) => {
        const positionsToCheck = [
            [[0, 0], [0, 1], [0, 2]],
            [[1, 0], [1, 1], [1, 2]],
            [[2, 0], [2, 1], [2, 2]],
            [[0, 0], [1, 0], [2, 0]],
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],
            [[0, 0], [1, 1], [2, 2]],
            [[0, 2], [1, 1], [2, 0]],
        ]

        const hasWinningLine = positionsToCheck.some(line =>
            line.every(position => {
                const currentPosition = getPosition(position[0], position[1]);
                return !currentPosition.canBeFilled() && currentPosition.getFill() === symbol;
            }
            ));

        let result = hasWinningLine ? true : isBoardFull() ? "Draw" : false;

        return result;
    }

    return { positions, getActivePlayer, switchActivePlayer, getPosition, resetBoard, isBoardFull, checkWinCondition };
})();

function createViewController() {
    const boardElement = document.querySelector(".board");

    boardElement.addEventListener("click", (event) => {
        const postitionView = event.target.closest(".position");
        if (!postitionView) return;
        console.log("la posisao", JSON.parse(postitionView.dataset.position))

    });

    const updateScreen = () => {
        boardElement.innerHTML = "";
        board.positions.forEach(position => {
            const positionElement = document.createElement("div");
            positionElement.classList.add("position");
            positionElement.dataset.position = `[${position.positionX},${position.positionY}]`;
            positionElement.textContent = position.getFill();

            boardElement.appendChild(positionElement);
        });
    }

    return { updateScreen }
}

const showBtnElem = document.querySelector(".open-add-book-dialog-button");
const dialogElem1 = document.getElementById("dialog");
const dialogElem2 = document.getElementById("dialog2");
const addBookButtonElem = document.getElementById("set-player-name-button");

showBtnElem.addEventListener("click", () => {
    dialogElem2.showModal();
});

addBookButtonElem.addEventListener("click", () => {
    event.preventDefault();
    dialogElem2.close();
});



const boardView2 = createViewController();

// let product = document.getElementById("test").dataset.position;
// console.log("bruh", JSON.parse(product))


//   <div class="book-card">
//       <div class="book-id">${book.id}</div>
//       <div class="book-info">
//           <div class="book-title">${book.title}</div>
//           <div class="book-author">${book.author}</div>
//       </div>
//       <div class="book-pages">${book.pages} pages</div>
//       <div class="book-button-list">
//           <button class="mark-book-button ${book.read ? 'read' : ''}"><img src="./assets/check-bold.svg" alt="check"><span>${book.read ? 'Read' : 'Mark as read'}</span></button>
//           <button class="delete-book-button"><img src="./assets/delete.svg" alt="trash"><span>Delete</span></button>
//       </div>
//   </div>
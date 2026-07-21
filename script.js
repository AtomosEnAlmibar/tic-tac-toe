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
                break;
            case false:
                board.switchActivePlayer();
                return;
            default:
                break;
        }
        viewController.showRestartGameDialog(result);
    }

    return { playerSymbol, getName, setName, getVictories, placePiece };
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

    const restartGame = () => {
        switchActivePlayer();
        resetBoard();
    };
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

    return { player1, player2, positions, restartGame, getActivePlayer, switchActivePlayer, getPosition, resetBoard, isBoardFull, checkWinCondition };
})();

const viewController = (() => {
    const boardElement = document.querySelector(".board");
    const turnMessageElement = document.querySelector(".turn-message");
    const setPlayerNameDialog = document.getElementById("set-player-name-dialog");
    const restartGameDialog = document.getElementById("restart-game-dialog");
    const setPlayerNameButton = document.getElementById("set-player-name-button");
    const formElem = document.querySelector('form');

    const updateBoard = () => {
        boardElement.innerHTML = "";
        board.positions.forEach(position => {
            const positionElement = document.createElement("div");
            positionElement.classList.add("position");
            positionElement.dataset.position = `[${position.positionX},${position.positionY}]`;
            positionElement.textContent = position.getFill();

            boardElement.appendChild(positionElement);
        });
    }

    const updateMessageTurn = () => {
        turnMessageElement.innerHTML = `${board.getActivePlayer().getName()}'s Turn!`;
    }

    const showSetPlayerNameDialog = () => {
        setPlayerNameDialog.showModal();
    }

    const showRestartGameDialog = (result) => {
        restartGameDialog.showModal();
                restartGameDialog.innerHTML = `
        <div class="dialog-flex">
            <span class="dialog-main-title">${result === true ? `${board.getActivePlayer().getName()} wins!` : "It's a draw!"}</span>
            <div class="player-scores-list">
                <div class="player-score-block">
                    <span class="player-name">${board.player1.getName()}</span>
                    <span class="player-score">${board.player1.getVictories()}</span>
                </div>
                <div class="player-score-block">
                    <span class="player-name">${board.player2.getName()}</span>
                    <span class="player-score">${board.player2.getVictories()}</span>
                </div>
            </div>
            <button class="dialog-confirm-button" id="restart-game">Restart</button>
        </div>
        `;

        const restartGameButton = document.getElementById("restart-game");

        restartGameButton.addEventListener("click", () => {
            event.preventDefault();
            
            board.restartGame();
            updateBoard();

            restartGameDialog.close();
        });
    }

    boardElement.addEventListener("click", (event) => {
        const postitionView = event.target.closest(".position");
        if (!postitionView) return;
        const positionCoordinates = JSON.parse(postitionView.dataset.position);
        board.getActivePlayer().placePiece(positionCoordinates[0], positionCoordinates[1]);
        updateBoard();

    });

    setPlayerNameButton.addEventListener("click", () => {
        event.preventDefault();

        const formData = new FormData(formElem);
        if (formData.values().some(value => !value)) return;

        const { player1Name, player2Name } = Object.fromEntries(formData.entries());
        board.player1.setName(player1Name);
        board.player2.setName(player2Name);

        setPlayerNameDialog.close();
    });

    return { updateBoard, updateMessageTurn, showSetPlayerNameDialog, showRestartGameDialog }
})();

viewController.updateBoard();
viewController.showSetPlayerNameDialog();
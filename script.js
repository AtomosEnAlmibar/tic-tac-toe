function createPlayer(name, symbol) {
    const playerSymbol = symbol;
    const playerName = name;

    let itsTurn = false;
    let victories = 0;
    let opponent;

    const getVictories = () => victories;
    const addVictory = () => victories++;
    const changeTurn = () => !itsTurn;
    const endTurn = () => itsTurn = false;
    const placePiece = (x, y) => {
        const positionChosen = board.getPosition(x, y);
        positionChosen.fillPosition();
    };
    const checkWinCondition = () => {
        let result = board.checkWinCondition();
        if (result === false) {
            endTurn();
            opponent.changeTurn();
            return;
        }
        if (result === true) addVictory();
        endTurn();
        opponent.endTurn();
        board.resetBoard();
    }

    return { playerName, playerSymbol, opponent, getVictories, addVictory, changeTurn, endTurn, placePiece, checkWinCondition };
}

function createPosition(x, y, filled = '') {
    const positionX = x;
    const positionY = y;
    let fill = filled;

    const getFill = () => fill;
    const canBeFilled = () => !fill;
    const fillPosition = (symbol) => {
        if (canBeFilled()) fill = symbol;
    }
    const resetFill = () => fill = '';

    return { positionX, positionY, getFill, canBeFilled, fillPosition, resetFill };
}

const board = (() => {
    let positions = [];

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            positions.push(createPosition(i, j));
        }
    }

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

    return { positions, getPosition, resetBoard, isBoardFull, checkWinCondition };
})();
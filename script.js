function createPlayer(symbol) {
    const playerSymbol = symbol;

    let playerName;
    let opponent;
    let itsTurn = false;
    let victories = 0;

    const getName = () => playerName;
    const setName = (name) => playerName = name;
    const setOpponent = (opponentChosen) => opponent = opponentChosen;
    const getVictories = () => victories;
    const addVictory = () => victories++;
    const getTurn = () => itsTurn;
    const changeTurn = () => itsTurn = !itsTurn;
    const endTurn = () => itsTurn = false;
    const placePiece = (x, y) => {
        if (!itsTurn) return;
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
                endTurn();
                opponent.changeTurn();
                return;
            default:
                console.log("ITSA A DRAW")
                break;            
        }
        endTurn();
        opponent.endTurn();
        board.resetBoard();
    }

    return { playerSymbol, getName, setName, setOpponent, getVictories, addVictory, getTurn, changeTurn, endTurn, placePiece, checkWinCondition };
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

let player1 = createPlayer('O');
let player2 = createPlayer('X');

player1.setOpponent(player2);
player2.setOpponent(player1);
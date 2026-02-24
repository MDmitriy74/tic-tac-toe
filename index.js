const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

let winnDemention = 3;
let dimension = 3;
let field = [];
let curPlayer = CROSS;
let isGameOver = false;
let filledCells = 0;

startGame();
addResetListener();

function inputFieldDimension(){
    dimension = +prompt("Введите размер поля:",  3)
    winnDemention = dimension;
    if (dimension <= 1){
        alert("Неиграбельное поле")
        inputFieldDimension()
    }
    return dimension;
}

function startGame () {
    dimension = inputFieldDimension();
    field = [];
    for (let i = 0; i < dimension; ++i) {
        field[i] = new Array(dimension).fill(EMPTY);
    }
    isGameOver = false;
    filledCells = 0;
    curPlayer = CROSS;
    renderGrid(dimension);
}

function renderGrid (previous = []) {
    container.innerHTML = '';
    field = []
    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        field[i] = new Array(dimension).fill(EMPTY);
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            console.log(i, j, dimension - 1, previous);
            if (i < previous.length && j < previous.length) {
                cell.textContent = previous[i][j];
                field[i][j] = previous[i][j];
            } else {
                cell.textContent = EMPTY;
            }
            cell.addEventListener('click', () => MakeOneStep(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function makeAIStep() {
    let empties = [];
    for (let i = 0; i < dimension; ++i) {
        for (let j = 0; j < dimension; j++) {
            if (field[i][j] == EMPTY) {
                empties.push([i, j]);
            }
        }
    }

    let chousen = empties[Math.floor(Math.random() * empties.length)];
    renderSymbolInCell(curPlayer, chousen[0], chousen[1]);
    let winningCels = getWinningCells();
    console.log(winningCels);
    if (winningCels.length !== 0) {
        for (let i = 0; i < winningCels.length; i++) {
            renderSymbolInCell(curPlayer, winningCels[i][0], winningCels[i][1], 'red');
        }
        isGameOver = true;
        alert(`Выиграл: ${curPlayer}`)
        return;
    }
    if (dimension * dimension === filledCells) {
        alert(`А игра то закончилась ничьей`)
        return;
    }
    curPlayer = curPlayer == CROSS ? ZERO : CROSS;

}

function MakeOneStep(row, col)
{
    celClickHandler(row, col);
    if (filledCells * 2 + 1 > dimension * dimension)
    {
        dimension += 1;
        renderGrid(field);
    }

     if (!isGameOver) {
         makeAIStep();
     }

}

function celClickHandler (row, col) {
    if (isGameOver || field[row][col] !== EMPTY) {
        return;
    }

    renderSymbolInCell(curPlayer, row, col);

    let winningCels = getWinningCells();
    console.log(winningCels);
    if (winningCels.length !== 0) {
        for (let i = 0; i < winningCels.length; i++) {
            renderSymbolInCell(curPlayer, winningCels[i][0], winningCels[i][1], 'red');
        }
        isGameOver = true;
        alert(`Выиграл: ${curPlayer}`)
        return;
    }
    if (dimension * dimension === filledCells) {
        alert(`А игра то закончилась ничьей`)
        return;
    }
    curPlayer = curPlayer == CROSS ? ZERO : CROSS;
}

function getWinningCells() {
    for (let line = 0; line < dimension; line++) {
        if (field[line].every(v => v === curPlayer)) {
            return field[line].map((_, c) => [line, c]);
        }
    }

    for (let stolb = 0; stolb < dimension; stolb++) {
        let colItems = [];
        for (let r = 0; r < dimension; r++) {
            colItems.push(field[r][stolb]);
        }
        if (colItems.every(v => v === curPlayer)) {
            return colItems.map((_, r) => [r, stolb]);
        }
    }

    let mDiag = [];
    for (let i = 0; i < dimension; i++) {
        mDiag.push([i, i]);
    }
    if (mDiag.every(([r, c]) => field[r][c] === curPlayer)) {
        return mDiag;
    }

    let nDiag = [];
    for (let i = 0; i < dimension; i++) {
        nDiag.push([i, dimension - i - 1]);
    }
    if (nDiag.every(([r, c]) => field[r][c] === curPlayer)) {
        return nDiag;
    }
    return [];
}

function renderSymbolInCell (symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);
    filledCells += 1;
    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell (row, col) {
    field[row][col] = curPlayer;
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}

function addResetListener () {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler () {
    console.log('reset!');
    startGame()
}


/* Test Function */
/* Победа первого игрока */
function testWin () {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

/* Ничья */
function testDraw () {
    clickOnCell(2, 0);
    clickOnCell(1, 0);
    clickOnCell(1, 1);
    clickOnCell(0, 0);
    clickOnCell(1, 2);
    clickOnCell(1, 2);
    clickOnCell(0, 2);
    clickOnCell(0, 1);
    clickOnCell(2, 1);
    clickOnCell(2, 2);
}

function clickOnCell (row, col) {
    findCell(row, col).click();
}
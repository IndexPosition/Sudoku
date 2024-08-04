function displayGrid() {
  const BOARD_SIZE = 9;

  const sudokuBoard = document.getElementById("sudoku-board");

  const cells = [];
  for (let k = 0; k < 3; k++) {
    const tbody = document.createElement("tbody");
    sudokuBoard.appendChild(tbody);
    for (let i = 0; i < 3; i++) {
      const row = document.createElement("tr");
      cells.push([]);
      for (let j = 0; j < BOARD_SIZE; j++) {
        const cell = document.createElement("td");
        cell.contentEditable = true;
        cells[cells.length - 1].push(cell);
        row.appendChild(cell);
      }
      tbody.appendChild(row);
    }
  }

  sudokuBoard.addEventListener("input", (event) => {
    const cell = event.target;
    const validInput = /[1-9]/.test(cell.textContent)
      ? cell.textContent[0]
      : "";
    cell.textContent = validInput;
  });

  for (let m = 0; m < 3; m++) {
    const colgroup = document.createElement("colgroup");
    colgroup.innerHTML = "<col>".repeat(3);
    sudokuBoard.appendChild(colgroup);
  }
}

function generateSudoku(difficulty) {
    const cells = document.querySelectorAll("#sudoku-board td");
  
    cells.forEach((cell) => {
      cell.textContent = "";
      cell.contentEditable = true;
    });
  
    const solution = generateSolution();
  
    let removeCount;
    switch (difficulty) {
      case "easy":
        removeCount = 60;
        break;
      case "medium":
        removeCount = 51;
        break;
      case "hard":
        removeCount = 42;
        break;
      case "extreme":
        removeCount = 81;
        break;
      default:
        removeCount = 51;
    }
    const cellsToKeep = new Set();
    while (cellsToKeep.size < 81 - removeCount) {
      cellsToKeep.add(Math.floor(Math.random() * 81));
    }
  
    cells.forEach((cell, index) => {
      const row = Math.floor(index / 9);
      const col = index % 9;
      if (cellsToKeep.has(index)) {
        cell.textContent = solution[row][col];
        //cell.contentEditable = false;
      }
    });
  }
  
  function generateSolution() {
    const board = new Array(9).fill().map(() => new Array(9).fill(0));
    solveBoard(board, 0, 0);
    return board;
  }
  
  function solveBoard(board, row, col) {
    if (row === 9) {
      return true;
    }
  
    const nextCol = (col + 1) % 9;
    const nextRow = nextCol === 0 ? row + 1 : row;
  
    if (board[row][col] !== 0) {
      return solveBoard(board, nextRow, nextCol);
    }
  
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffleArray(values);
    for (let i = 0; i < 9; i++) {
      const value = values[i];
      if (isValidValue(board, row, col, value)) {
        board[row][col] = value;
        if (solveBoard(board, nextRow, nextCol)) {
          return true;
        }
        board[row][col] = 0;
      }
    }
  
    return false;
  }
  

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function isValidValue(board, row, col, value) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === value) {
      return false;
    }
  }
  for (let i = 0; i < 9; i++) {
    if (board[i][col] === value) {
      return false;
    }
  }

  const boxStartRow = Math.floor(row / 3) * 3;
  const boxStartCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[boxStartRow + i][boxStartCol + j] === value) {
        return false;
      }
    }
  }

  return true;
}

const easyButton = document.querySelector("#easy");
easyButton.addEventListener("click", () => generateSudoku("easy"));

const mediumButton = document.querySelector("#medium");
mediumButton.addEventListener("click", () => generateSudoku("medium"));

const hardButton = document.querySelector("#hard");
hardButton.addEventListener("click", () => generateSudoku("hard"));

const extremeButton = document.querySelector("#extreme");
extremeButton.addEventListener("click", () => generateSudoku("extreme"));

const solveButton = document.querySelector("#solve");
solveButton.addEventListener("click", () => solveSudoku());
function solveSudoku() {
  const board = getCurrentBoard();
  solveBoard(board, 0, 0);
  setCurrentBoard(board);
}
function getCurrentBoard() {
    const board = new Array(9).fill().map(() => new Array(9).fill(0));
    const cells = document.querySelectorAll("#sudoku-board td");
    cells.forEach((cell, index) => {
      const row = Math.floor(index / 9);
      const col = index % 9;
      board[row][col] = parseInt(cell.textContent) || 0;
    });
    return board;
  }
  
  function setCurrentBoard(board) {
    const cells = document.querySelectorAll("#sudoku-board td");
    cells.forEach((cell, index) => {
      const row = Math.floor(index / 9);
      const col = index % 9;
      cell.textContent = board[row][col] || "";
    });
  }

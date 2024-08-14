document.addEventListener("DOMContentLoaded", () => {
  let originalBoard = [];
  let solutionBoard = [];
  let hintCount = 0;
  let maxHints = 50;

  displayGrid();

  document.getElementById("easy").addEventListener("click", () => generateSudoku("easy"));
  document.getElementById("medium").addEventListener("click", () => generateSudoku("medium"));
  document.getElementById("hard").addEventListener("click", () => generateSudoku("hard"));
  document.getElementById("extreme").addEventListener("click", () => generateSudoku("extreme"));
  document.getElementById("solve").addEventListener("click", solveSudoku);
  document.getElementById("clear").addEventListener("click", clearSudoku);
  const hintButton = document.getElementById("hint");
  hintButton.addEventListener("click", provideHint);
  
  document.getElementById("clear-input").addEventListener("click", clearUserInput);

  function displayGrid() {
    const BOARD_SIZE = 9;
    const sudokuBoard = document.getElementById("sudoku-board");
    sudokuBoard.innerHTML = "";
    const cells = [];

    for (let k = 0; k < 3; k++) {
      const tbody = document.createElement("tbody");
      sudokuBoard.appendChild(tbody);
      for (let i = 0; i < 3; i++) {
        const row = document.createElement("tr");
        cells.push([]);
        for (let j = 0; j < BOARD_SIZE; j++) {
          const cell = document.createElement("td");
          const input = document.createElement("input");
          input.type = "text";
          input.maxLength = "1";
          input.addEventListener("input", handleInput);
          input.addEventListener("keydown", handleKeyDown);
          input.addEventListener("click", handleCellClick);
          input.addEventListener("contextmenu", handleRightClick);
          cell.appendChild(input);
          cells[cells.length - 1].push(cell);
          row.appendChild(cell);
        }
        tbody.appendChild(row);
      }
    }

    for (let m = 0; m < 3; m++) {
      const colgroup = document.createElement("colgroup");
      colgroup.innerHTML = "<col>".repeat(3);
      sudokuBoard.appendChild(colgroup);
    }
  }

  function handleInput(event) {
    const input = event.target;
    const value = input.value;
    const row = input.parentNode.parentNode.rowIndex;
    const col = input.parentNode.cellIndex;

    if (!/^[1-9]$/.test(value)) {
      input.value = "";
    }

    const board = getCurrentBoard();
    highlightConflicts(board, row, col);
  }

  function handleKeyDown(event) {
    const input = event.target;
    if (event.key === "Backspace" || event.key === "Delete") {
      const row = input.parentNode.parentNode.rowIndex;
      const col = input.parentNode.cellIndex;
      input.value = "";
      const board = getCurrentBoard();
      highlightConflicts(board, row, col);
    }
  }

  function handleRightClick(event) {
    event.preventDefault();
    const input = event.target;
    if (input.parentNode.classList.contains("pre-filled")) {
      return;
    }
    input.value = "";
    const row = input.parentNode.parentNode.rowIndex;
    const col = input.parentNode.cellIndex;
    const board = getCurrentBoard();
    highlightConflicts(board, row, col);
  }

  function handleCellClick(event) {
    const input = event.target;

    document.querySelectorAll(".selected").forEach(cell => {
      cell.classList.remove("selected");
    });

    if (input.tagName === "INPUT") {
      input.classList.add("selected");
      highlightSelectedBlock(input);
      highlightSameNumber(input.value);
    }
  }

  function highlightSelectedBlock(input) {
    const cells = document.querySelectorAll("#sudoku-board td input");
    cells.forEach(cell => {
      cell.parentNode.classList.remove("selected-block", "highlight-row", "highlight-col", "highlight-same-number");
    });

    const row = input.parentNode.parentNode.rowIndex;
    const col = input.parentNode.cellIndex;

    const boxStartRow = Math.floor(row / 3) * 3;
    const boxStartCol = Math.floor(col / 3) * 3;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const cellRow = boxStartRow + i;
        const cellCol = boxStartCol + j;
        cells[cellRow * 9 + cellCol].parentNode.classList.add("selected-block");
      }
    }

    for (let i = 0; i < 9; i++) {
      cells[row * 9 + i].parentNode.classList.add("highlight-row");
    }

    for (let i = 0; i < 9; i++) {
      cells[i * 9 + col].parentNode.classList.add("highlight-col");
    }
  }

  function highlightSameNumber(value) {
    if (!value) return;
    const cells = document.querySelectorAll("#sudoku-board td input");
    cells.forEach(cell => {
      if (cell.value === value) {
        cell.parentNode.classList.add("highlight-same-number");
      }
    });
  }

  function highlightConflicts(board, row, col) {
    const cells = document.querySelectorAll("#sudoku-board td input");
    cells.forEach(cell => cell.parentNode.classList.remove("incorrect"));

    if (board[row][col] === 0) return;

    for (let i = 0; i < 9; i++) {
      if (board[row][i] === board[row][col] && i !== col) {
        cells[row * 9 + i].parentNode.classList.add("incorrect");
        cells[row * 9 + col].parentNode.classList.add("incorrect");
      }
      if (board[i][col] === board[row][col] && i !== row) {
        cells[i * 9 + col].parentNode.classList.add("incorrect");
        cells[row * 9 + col].parentNode.classList.add("incorrect");
      }
    }

    const boxStartRow = Math.floor(row / 3) * 3;
    const boxStartCol = Math.floor(col / 3) * 3;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const cellRow = boxStartRow + i;
        const cellCol = boxStartCol + j;
        if (board[cellRow][cellCol] === board[row][col] && (cellRow !== row || cellCol !== col)) {
          cells[cellRow * 9 + cellCol].parentNode.classList.add("incorrect");
          cells[row * 9 + col].parentNode.classList.add("incorrect");
        }
      }
    }
  }

  function generateSudoku(difficulty) {
    clearSudoku();
    const solution = generateSolution();
    let removeCount;

    switch (difficulty) {
      case "easy":
        removeCount = Math.random() * (43 - 37) + 37;
        maxHints = 50;
        break;
      case "medium":
        removeCount = Math.random() * (56 - 46) + 46;
        maxHints = 45;
        break;
      case "hard":
        removeCount = Math.random() * (68 - 60) + 60;
        maxHints = 40;
        break;
      case "extreme":
        removeCount = Math.random() * (79 - 74) + 74;
        maxHints = 3;
        break;
      default:
        removeCount = 51;
    }

    const cellsToKeep = new Set();
    while (cellsToKeep.size < 81 - removeCount) {
      cellsToKeep.add(Math.floor(Math.random() * 81));
    }

    const cells = document.querySelectorAll("#sudoku-board td input");
    cells.forEach((input, index) => {
      const row = Math.floor(index / 9);
      const col = index % 9;
      if (cellsToKeep.has(index)) {
        input.value = solution[row][col];
        input.disabled = true;
        input.parentNode.classList.add("pre-filled");
      }
    });

    originalBoard = getCurrentBoard();
    solutionBoard = solution;
    hintCount = 0;
    hintButton.disabled = false;
  }

  function generateSolution() {
    const board = Array.from({ length: 9 }, () => Array(9).fill(0));
    solveBoard(board, 0, 0);
    return board;
  }

  function solveBoard(board, row, col) {
    if (row === 9) return true;
    const nextCol = (col + 1) % 9;
    const nextRow = col === 8 ? row + 1 : row;

    if (board[row][col] !== 0) return solveBoard(board, nextRow, nextCol);

    const nums = Array.from({ length: 9 }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
    for (const num of nums) {
      if (isSafe(board, row, col, num)) {
        board[row][col] = num;
        if (solveBoard(board, nextRow, nextCol)) return true;
        board[row][col] = 0;
      }
    }

    return false;
  }

  function isSafe(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num || board[i][col] === num) return false;
    }

    const boxStartRow = Math.floor(row / 3) * 3;
    const boxStartCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[boxStartRow + i][boxStartCol + j] === num) return false;
      }
    }

    return true;
  }

  function solveSudoku() {
    const board = getCurrentBoard();
    if (solveBoard(board, 0, 0)) {
      fillBoard(board);
    }
  }

  function fillBoard(board) {
    const cells = document.querySelectorAll("#sudoku-board td input");
    cells.forEach((input, index) => {
      const row = Math.floor(index / 9);
      const col = index % 9;
      input.value = board[row][col];
    });
  }

  function getCurrentBoard() {
    const cells = document.querySelectorAll("#sudoku-board td input");
    const board = Array.from({ length: 9 }, () => Array(9).fill(0));
    cells.forEach((input, index) => {
      const row = Math.floor(index / 9);
      const col = index % 9;
      board[row][col] = input.value === "" ? 0 : parseInt(input.value, 10);
    });
    return board;
  }

  function clearSudoku() {
    const cells = document.querySelectorAll("#sudoku-board td input");
    cells.forEach(input => {
      input.value = "";
      input.disabled = false;
      input.parentNode.classList.remove("pre-filled");
      input.parentNode.classList.remove("selected", "selected-block", "highlight-row", "highlight-col", "highlight-same-number", "incorrect");
    });
    originalBoard = [];
    solutionBoard = [];
    hintCount = 0;
    
  }

  function provideHint() {
    if (!solutionBoard.length) return;
  
    const selectedCell = document.querySelector("#sudoku-board td input.selected");
    
    if (!selectedCell || selectedCell.disabled) return;
    
    const index = Array.from(document.querySelectorAll("#sudoku-board td input")).indexOf(selectedCell);
    const row = Math.floor(index / 9);
    const col = index % 9;
  
    if (selectedCell.value === "") {
      selectedCell.value = solutionBoard[row][col];
      selectedCell.disabled = true;
      selectedCell.parentNode.classList.add("pre-filled");
      hintCount++;
  
      // Update hint button status based on remaining hints
      if (hintCount >= maxHints) {
        hintButton.disabled = true;
      }
    }
  }
  

  function clearUserInput() {
    const cells = document.querySelectorAll("#sudoku-board td input");
    
    cells.forEach(input => {
      if (!input.disabled) {
        input.value = "";
        input.parentNode.classList.remove(
          "selected", 
          "selected-block", 
          "highlight-row", 
          "highlight-col", 
          "highlight-same-number", 
          "incorrect"
        );
      }
    });
    console.log("User input cleared");
  }
  
});

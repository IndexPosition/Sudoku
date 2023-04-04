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
  const validInput = /[1-9]/.test(cell.textContent) ? cell.textContent[0] : "";
  cell.textContent = validInput;
});

for (let m = 0; m < 3; m++) {
  const colgroup = document.createElement("colgroup");
  colgroup.innerHTML = '<col>'.repeat(3);
  sudokuBoard.appendChild(colgroup);
}

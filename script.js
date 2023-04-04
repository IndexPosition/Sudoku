const sudokuBoard = document.getElementById("sudoku-board");

const cells = new Array(9);
for (let i = 0; i < cells.length; i++) {
  cells[i] = new Array(9);
}
for (let m = 0; m < 3; m++) {
    const colgroup = document.createElement("colgroup");
    for (let n = 0; n < 3; n++) {
      colgroup.appendChild(document.createElement("col"));
    }
    sudokuBoard.appendChild(colgroup);
  }
  
for (let k = 0; k < 3; k++) {
  const tbody = document.createElement("tbody");
  for (let i = 0; i < 3; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < 9; j++) {
      const cell = document.createElement("td");
      cell.contentEditable = true;
      cell.addEventListener("input", () => {
        const validInput = /[1-9]/.test(cell.textContent)? cell.textContent[0]: "";
        cell.textContent = validInput;
      });
      cells[k*3+i][j] = cell; 
      row.appendChild(cell);
    }
    tbody.appendChild(row); 
  }
  sudokuBoard.appendChild(tbody);   
}

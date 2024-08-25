let rows = 10;
let columns = 10;
let bombs = 20;
let flags = 20;
let isGameOver = false;

const messege = document.getElementById("messege-box");
const board = document.querySelector(".game-board");
const restartButton = document.getElementById("restart-btn");
const formError = document.querySelector(".form-error");

let form = document.getElementById("form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const rowsInput = event.target["rows-input"].value;
  const columnsInput = event.target["columns-input"].value;
  const bombsInput = event.target["bombs-input"].value;
  let hasError = false;
  if (rowsInput > 20 || rowsInput < 8) {
    formError.innerHTML = "Rows should be 8-20!";
    hasError = true;
  } else if (columnsInput > 20 || columnsInput < 8) {
    formError.innerHTML = "Columns shoud be 8-12!";
    hasError = true;
  } else if (bombsInput > rowsInput * columnsInput - 1) {
    formError.innerHTML = `Bombs should be less than ${
      rowsInput * columnsInput
    }!`;
    hasError = true;
  }
  if (hasError) {
    return;
  }
  rows = Number(event.target["rows-input"].value) || 10;
  columns = Number(event.target["columns-input"].value) || 10;
  bombs = Number(event.target["bombs-input"].value) || 40;
  formError.innerHTML = "";
  document.getElementById("restart-btn").removeAttribute("hidden");
  document.getElementById("start-btn").disabled = true;
  createCells(rows, columns, bombs);
});

function createCells(rows, columns, bombs) {
  let gameArray = [];
  flags = bombs;
  board.innerHTML = "";
  messege.innerHTML = `Flags:${bombs}`;

  for (let j = 0; j < bombs; j++) {
    gameArray.push("Bomb");
  }
  for (let i = 0; i < rows * columns - bombs; i++) {
    gameArray.push("Vacant");
  }
  gameArray.sort(() => Math.random() - 0.5);

  for (let index = 0; index < rows * columns; index++) {
    let cell = document.createElement("div");
    cell.id = index;
    cell.className = "cell";
    cell.dataset.content = `${gameArray[index]}`;
    cell.addEventListener("click", () => leftClick(cell));
    cell.addEventListener("contextmenu", (event) => rigthClick(cell, event));
    board.appendChild(cell);
  }

  let style = {
    gridTemplateColumns: `repeat(${columns},2rem)`,
    gridTemplateRows: `repeat(${rows},2rem)`,
  };
  Object.assign(board.style, style);
}
createCells(rows, columns, bombs);

restartButton.addEventListener("click", () => {
  form.reset();
  rows = 10;
  columns = 10;
  bombs = 20;
  isGameOver = false;
  messege.classList.remove("color-3");
  messege.classList.remove("color-2");
  document.getElementById("restart-btn").setAttribute("hidden", true);
  createCells(rows, columns, bombs);
  document.getElementById("start-btn").disabled = false;
});

function leftClick(cell) {
  if (isGameOver) {
    return;
  }
  document.getElementById("restart-btn").removeAttribute("hidden");
  if (cell.dataset.content == "Bomb") {
    cell.classList.add("bomb");
    cell.innerHTML = '<img src="/assets/bomb-svg.svg">';
    gameOver();
  } else {
    countBombsAroud(cell.id);
  }
}

function rigthClick(cell, event) {
  event.preventDefault();
  if (isGameOver) {
    return false;
  }
  if (cell.dataset.content !== "checked" && 0 < flags <= bombs) {
    if (!cell.classList.contains(".flag")) {
      cell.classList.add(".flag");
      flags--;
      cell.innerHTML = `<img src="./assets/flag-svg.svg">`;
    } else {
      cell.classList.remove(".flag");
      flags++;
      cell.innerHTML = "";
    }
    messege.innerHTML = `Flags:${flags}`;
  }
}

function countBombsAroud(id) {
  const cellId = Number(id);
  const currentCell = document.getElementById(cellId);
  if (currentCell.dataset.content != "checked") {
    currentCell.dataset.content = "checked";
    let bombsAround = 0;
    let cellsAroundId = [];
    // row before
    if (cellId > columns - 1) {
      //cell 1
      if (cellId % columns != 0) {
        cellsAroundId.push(cellId - columns - 1);
        if (
          document.getElementById(cellId - columns - 1).dataset.content ==
          "Bomb"
        ) {
          bombsAround++;
        }
      }
      //cell 2
      cellsAroundId.push(cellId - columns);

      if (document.getElementById(cellId - columns).dataset.content == "Bomb") {
        bombsAround++;
      }
      //cell 3
      if (cellId % columns != columns - 1) {
        cellsAroundId.push(cellId - columns + 1);
        if (
          document.getElementById(cellId - columns + 1).dataset.content ==
          "Bomb"
        ) {
          bombsAround++;
        }
      }
    }
    //cell 4
    if (cellId % columns != 0) {
      cellsAroundId.push(cellId - 1);
      if (document.getElementById(cellId - 1).dataset.content == "Bomb") {
        bombsAround++;
      }
    }
    //cell 5
    if (cellId % columns != columns - 1) {
      cellsAroundId.push(cellId + 1);
      if (document.getElementById(cellId + 1).dataset.content == "Bomb") {
        bombsAround++;
      }
    }
    // next row
    if (cellId < (columns - 1) * rows) {
      //cell 6
      if (cellId % columns != 0) {
        cellsAroundId.push(cellId + columns - 1);
        if (
          document.getElementById(cellId + columns - 1).dataset.content ==
          "Bomb"
        ) {
          bombsAround++;
        }
      }
      //cell 7
      cellsAroundId.push(cellId + columns);
      if (document.getElementById(cellId + columns).dataset.content == "Bomb") {
        bombsAround++;
      }
      //cell 8
      if (cellId % columns != columns - 1) {
        cellsAroundId.push(cellId + columns + 1);
        if (
          document.getElementById(cellId + columns + 1).dataset.content ==
          "Bomb"
        ) {
          bombsAround++;
        }
      }
    }

    currentCell.classList.add("checked");
    checkWin();
    if (bombsAround == 0) {
      //call countBombsAround for each cell that we have
      cellsAroundId.forEach((i) => {
        countBombsAroud(i);
      });
    } else {
      //change class and view bombsAround in div
      currentCell.innerHTML = bombsAround;
      currentCell.classList.add(`color-${bombsAround}`);
    }
  }
}

function checkWin() {
  let countForWin = 0;
  const checkedCells = document.querySelectorAll(".checked");
  for (let i = 0; i < checkedCells.length; i++) {
    countForWin++;
  }
  if (countForWin === rows * columns - bombs) {
    showAllBoms();
    messege.innerHTML = "Yaay, You Win!";
    messege.classList.add("color-2");
  }
}

function gameOver() {
  isGameOver = true;
  showAllBoms();
  messege.innerHTML = "Oops, Game Over!";
  messege.classList.add("color-3");
}

function showAllBoms() {
  const allCells = document.querySelectorAll(".cell");
  allCells.forEach((cell) => {
    if (cell.dataset.content === "Bomb") {
      cell.classList.add("bomb");
      cell.innerHTML = '<img class="bomb-svg" src="/assets/bomb-svg.svg">';
    }
  });
}

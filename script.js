// Game board setup
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const board = [];
let rotatedShape;

// init board
for (let row = 0; row < BOARD_HEIGHT; row++) {
  board[row] = [];
  for (let col = 0; col < BOARD_WIDTH; col++) {
    board[row][col] = 0;
  }
}

// Tetrises
const tetrises = [
  {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "#ffd800",
  },
  {
    shape: [
      [0, 2, 0],
      [2, 2, 2],
    ],
    color: "#7925DD",
  },
  {
    shape: [
      [0, 3, 3],
      [3, 3, 0],
    ],
    color: "orange",
  },
  {
    shape: [
      [4, 4, 0],
      [0, 4, 4],
    ],
    color: "red",
  },
  {
    shape: [
      [5, 0, 0],
      [5, 5, 5],
    ],
    color: "green",
  },
  {
    shape: [
      [0, 0, 6],
      [6, 6, 6],
    ],
    color: "#ff6400 ",
  },
  { shape: [[7, 7, 7, 7]], color: "#00b5ff" },
];

// Randomizer
function randomTetris() {
  const index = Math.floor(Math.random() * tetrises.length);
  const tetris = tetrises[index];
  return {
    shape: tetris.shape,
    color: tetris.color,
    row: 0,
    col: Math.floor(Math.random() * (BOARD_WIDTH - tetris.shape[0].length + 1)),
  };
}

// Current tetris
let currentTetris = randomTetris();
let currentGhostTetris;

// Draw tetris
function drawTetris() {
  const shape = currentTetris.shape;
  const color = currentTetris.color;
  const row = currentTetris.row;
  const col = currentTetris.col;

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        const block = document.createElement("div");
        block.classList.add("block");
        block.style.backgroundColor = color;
        block.style.top = (row + r) * 24 + "px";
        block.style.left = (col + c) * 24 + "px";
        block.setAttribute("id", `block-${row + r}-${col + c}`);
        document.getElementById("game_board").appendChild(block);
      }
    }
  }
}

// Erase tetris from board
function eraseTetris() {
  for (let i = 0; i < currentTetris.shape.length; i++) {
    for (let j = 0; j < currentTetris.shape[i].length; j++) {
      if (currentTetris.shape[i][j] !== 0) {
        let row = currentTetris.row + i;
        let col = currentTetris.col + j;
        let block = document.getElementById(`block-${row}-${col}`);

        if (block) {
          document.getElementById("game_board").removeChild(block);
        }
      }
    }
  }
}

// Check if tetris can move in the specified direction
function canTetrisMove(rowOffset, colOffset) {
  for (let i = 0; i < currentTetris.shape.length; i++) {
    for (let j = 0; j < currentTetris.shape[i].length; j++) {
      if (currentTetris.shape[i][j] !== 0) {
        let row = currentTetris.row + i + rowOffset;
        let col = currentTetris.col + j + colOffset;

        if (
          row >= BOARD_HEIGHT ||
          col < 0 ||
          col >= BOARD_WIDTH ||
          (row >= 0 && board[row][col] !== 0)
        ) {
          return false;
        }
      }
    }
  }
  return true;
}

// Check if tetris can move in the specified direction
function canTetrisRotate() {
  for (let i = 0; i < rotatedShape.length; i++) {
    for (let j = 0; j < rotatedShape[i].length; j++) {
      if (rotatedShape[i][j] !== 0) {
        let row = currentTetris.row + i;
        let col = currentTetris.col + j;

        if (
          row >= BOARD_HEIGHT ||
          col < 0 ||
          col >= BOARD_WIDTH ||
          (row >= 0 && board[row][col] !== 0)
        ) {
          return false;
        }
      }
    }
  }
  return true;
}

// Lock the tetris in place
function lockTetris() {
  // Add the tetris to the board
  for (let i = 0; i < currentTetris.shape.length; i++) {
    for (let j = 0; j < currentTetris.shape[i].length; j++) {
      if (currentTetris.shape[i][j] !== 0) {
        let row = currentTetris.row + i;
        let col = currentTetris.col + j;
        board[row][col] = currentTetris.color;
      }
    }
  }

  // Check if any rows need to be cleared
  let rowsCleared = clearRows();
  if (rowsCleared > 0) {
    // updateScore(rowsCleared);
  }

  // Create a new tetris
  // Current tetris
  currentTetris = randomTetris();
}

function clearRows() {
  let rowsCleared = 0;

  for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
    let rowFilled = true;

    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (board[y][x] === 0) {
        rowFilled = false;
        break;
      }
    }

    if (rowFilled) {
      rowsCleared++;

      for (let yy = y; yy > 0; yy--) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
          board[yy][x] = board[yy - 1][x];
        }
      }

      for (let x = 0; x < BOARD_WIDTH; x++) {
        board[0][x] = 0;
      }
      document.getElementById("game_board").innerHTML = "";
      for (let row = 0; row < BOARD_HEIGHT; row++) {
        for (let col = 0; col < BOARD_WIDTH; col++) {
          if (board[row][col]) {
            const block = document.createElement("div");
            block.classList.add("block");
            block.style.backgroundColor = board[row][col];
            block.style.top = row * 24 + "px";
            block.style.left = col * 24 + "px";
            block.setAttribute("id", `block-${row}-${col}`);
            document.getElementById("game_board").appendChild(block);
          }
        }
      }

      y++;
    }
  }

  return rowsCleared;
}

// Rotate the tetris
function rotateTetris() {
  rotatedShape = [];
  for (let i = 0; i < currentTetris.shape[0].length; i++) {
    let row = [];
    for (let j = currentTetris.shape.length - 1; j >= 0; j--) {
      row.push(currentTetris.shape[j][i]);
    }
    rotatedShape.push(row);
  }

  // Check if the rotated tetris can be placed
  if (canTetrisRotate()) {
    eraseTetris();
    currentTetris.shape = rotatedShape;
    drawTetris();
  }

  moveGhostTetris();
}

// Move the tetris
function moveTetris(direction) {
  let row = currentTetris.row;
  let col = currentTetris.col;
  if (direction === "left") {
    if (canTetrisMove(0, -1)) {
      eraseTetris();
      col -= 1;
      currentTetris.col = col;
      currentTetris.row = row;
      drawTetris();
    }
  } else if (direction === "right") {
    if (canTetrisMove(0, 1)) {
      eraseTetris();
      col += 1;

      currentTetris.col = col;
      currentTetris.row = row;
      drawTetris();
    }
  } else {
    if (canTetrisMove(1, 0)) {
      eraseTetris();
      row++;
      currentTetris.col = col;
      currentTetris.row = row;
      drawTetris();
    } else {
      lockTetris();
    }
  }

  moveGhostTetris();
}

drawTetris();
setInterval(moveTetris, 500);

document.addEventListener("keydown", handleKeyPress);

function handleKeyPress(event) {
  switch (event.keyCode) {
    case 37: // left arrow
      moveTetris("left");
      break;
    case 39: // right arrow
      moveTetris("right");
      break;
    case 40: // down arrow
      moveTetris("down");
      break;
    case 38: // up arrow
      rotateTetris();
      break;
    case 32: // up arrow
      dropTetris();
      break;
    default:
      break;
  }
}

// sound init

function dropTetris() {
  let row = currentTetris.row;
  let col = currentTetris.col;

  while (canTetrisMove(1, 0)) {
    eraseTetris();
    row++;
    currentTetris.col = col;
    currentTetris.row = row;
    drawTetris();
  }
  lockTetris();
}

// Draw Ghost tetris
function drawGhostTetris() {
  const shape = currentGhostTetris.shape;
  const color = "rgba(255,255,255,0.5)";
  const row = currentGhostTetris.row;
  const col = currentGhostTetris.col;

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        const block = document.createElement("div");
        block.classList.add("ghost");
        block.style.backgroundColor = color;
        block.style.top = (row + r) * 24 + "px";
        block.style.left = (col + c) * 24 + "px";
        block.setAttribute("id", `ghost-${row + r}-${col + c}`);
        document.getElementById("game_board").appendChild(block);
      }
    }
  }
}

function eraseGhostTetris() {
  const ghost = document.querySelectorAll(".ghost");
  for (let i = 0; i < ghost.length; i++) {
    ghost[i].remove();
  }
}

// Check if tetris can move in the spec direction
function canGhostTetrisMove(rowOffset, colOffset) {
  for (let i = 0; i < currentGhostTetris.shape.length; i++) {
    for (let j = 0; j < currentGhostTetris.shape[i].length; j++) {
      if (currentGhostTetris.shape[i][j] !== 0) {
        let row = currentGhostTetris.row + i + rowOffset;
        let col = currentGhostTetris.col + j + colOffset;

        if (
          row >= BOARD_HEIGHT ||
          col < 0 ||
          col >= BOARD_WIDTH ||
          (row >= 0 && board[row][col] !== 0)
        ) {
          return false;
        }
      }
    }
  }
  return true;
}

function moveGhostTetris() {
  eraseGhostTetris();

  currentGhostTetris = { ...currentTetris };
  while (canGhostTetrisMove(1, 0)) {
    currentGhostTetris.row++;
  }

  drawGhostTetris();
}

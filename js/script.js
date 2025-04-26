let active = 0; // 0 or 1
let number = 1; // 1 ~ 'count'
let count = 3; // Count of numbers that will appear on grid
let level = 1; // Count - 2, adjusted in start()
let highestLevel = 0; // Highest Level reached by user
let startTime = 0; // Time when tiles are covered
let endTime = 0; // Time when last tile is clicked

const delay = 1000; // Gets multiplied to level to create delay before game begins
const pageLoadDelay = 1000 * 0.7; // Delay before moving to win/loss screen

// Timing Events initialized
let coverGrid = null; 
let loadWinPage = null;
let loadLossPage = null;

// Grid Array 0 ~ 34
let gridArray = Array(35).fill(null);

//On Load - Add event click listeners to all tiles on grid
window.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".tile").forEach(tile => {
    tile.addEventListener("click", handleClick);
  });
});
// Start - Resets settings, loads game page, and start a delay
function start() {
  clearData();
  loadPage("grid");
  level = count - 2;
  populateLevel();
  populateNum();
  let startDelay = delay * (level);
  coverGrid = setTimeout (() => {
    coverNum();
  }, startDelay);
}
// Clear Data - Empty all grids of numbers, clear animations and highlights from squares
function clearData() {
  number = 1;
  active = 0;
  gridArray = Array(35).fill(null);
  if (loadWinPage) clearTimeout(loadWinPage);
  if (loadLossPage) clearTimeout(loadLossPage);
  document.querySelectorAll(".num").forEach(num => {
    num.textContent = "";
  });
  document.querySelectorAll(".tile").forEach(tile => {
    clearSquare(tile);
  });
}
// Load Page - Hides the current page and reveals the next one. Also updates UI for next page
function loadPage(page) {
  document.getElementById("start-page").classList.add("hidden");
  document.getElementById("grid-page").classList.add("hidden");
  document.getElementById("win-page").classList.add("hidden");
  document.getElementById("loss-page").classList.add("hidden");

  if (page === "grid") {
    document.getElementById("grid-page").classList.remove("hidden");
  } else if (page === "win") {
    document.getElementById("win-page").classList.remove("hidden");
  } else if (page === "loss") {
    document.getElementById("loss-text4").textContent = "LEVEL " + level;
    document.getElementById("loss-page").classList.remove("hidden");
  } else if (page === "start") {
    updateHighest();
    document.getElementById("start-page").classList.remove("hidden");
  }
  document.querySelectorAll(".page").forEach(text => {
    text.classList.add("fadeUp");
  });
  document.querySelectorAll(".row").forEach(row => {
    row.classList.add("fadeUp");
  });
}
// Updates Highest - Changes highest level reached if last level was higher
function updateHighest() {
  if (highestLevel < level) {
    highestLevel = level;
    const highestText = document.getElementById("highest");
    if (highestText) {
      highestText.textContent = "HIGHEST: LEVEL " + highestLevel;
    }
  }
  count = 3;
}
// Populate Level
function populateLevel() {
  const levelText = document.getElementById("level");
  levelText.textContent = "LEVEL " + level;
}
// Populate Numers - Geta a random number from the size of the grid, then populatea the square with that index
function populateNum() {
  let i = 0;
  while (i < count) {
    let randTile = Math.floor(Math.random() * 35);
    if (gridArray[randTile] === null) {
      gridArray[randTile] = i + 1;
      const numElement = document.querySelector(`.num[data-index="${randTile}"]`);
      numElement.textContent = i + 1;
      i++;
    }
  }
}
// Cover Numbers - Covers all non-empty grid tile on screen
function coverNum() {
  document.querySelectorAll(".num").forEach(num => {
    const text = parseInt(num.textContent);
    if (isNaN(text) === false) {
      const index = parseInt(num.dataset.index);
      const tile = document.querySelector(`.tile[data-index="${index}"]`);
      tile.classList.add("tile-covered");
      num.textContent = "";
    }
  })
  active = 1;
  startTime = Date.now();
}
// Handle Click //
function handleClick(event) {
  const targetTile = event.currentTarget.closest(".tile");
  const index = parseInt(targetTile.dataset.index);
  const targetNum = document.querySelector(`.num[data-index="${index}"]`);
  const clickedNum = gridArray[index];

  if (active === 0) return;
  if (clickedNum < number) return;
  pop(targetTile);

  if (clickedNum === number) {
    removeSquare(targetTile, targetNum, index);
  } else {
    wrongSquare(targetTile);
    if (loadWinPage) clearTimeout(loadWinPage);
    loadLossPage = setTimeout (() => {
      loadPage("loss");
    }, pageLoadDelay);

    active = 0;
    return;
  }
}
// Remove Square - Reveal the number and continue
function removeSquare(target, num, i) {
  target.classList.add("tile-covered");
  void target.offsetWidth;
  target.classList.remove("tile-covered");
  num.textContent = gridArray[i];
  // Win condition check
  if (number === count) {
    victory(target);
  }
  number++;
}
// Victory - Generate and record time took to complete, and load win page
function victory(target) {
  endTime = Date.now();
  let userTime = Math.round(((endTime - startTime) / 1000)*10)/10;
  let timeText = document.getElementById("win-text4")
  timeText.textContent = "Time: " + userTime + " s"
  lastSquare(target)

  if (loadLossPage) clearTimeout(loadLossPage);
  loadWinPage = setTimeout (() => {
    loadPage("win");
  }, pageLoadDelay);
  active = 0;
  count++;
}
// Animations //
function pop(target) {
  target.classList.remove("pop");
  void target.offsetWidth;
  target.classList.add("pop");
}
function wrongSquare(target) {
  target.classList.add("tile-covered");
  void target.offsetWidth;
  target.classList.remove("tile-covered");
  
  target.classList.remove("tile-wrong");
  void target.offsetWidth;
  target.classList.add("tile-wrong");
}
function lastSquare(target) {
  target.classList.add("tile-covered");
  void target.offsetWidth;
  target.classList.remove("tile-covered");
  
  target.classList.remove("tile-last");
  void target.offsetWidth;
  target.classList.add("tile-last");
}
function clearSquare(target) {
  target.classList.remove("tile-covered", "tile-wrong", "tile-last");
}

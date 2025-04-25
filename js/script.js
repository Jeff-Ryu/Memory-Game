let active = 0; // 0 or 1
let number = 1; // 1 ~ 'count'
let count = 3; // Count of numbers that will appear on grid
let level = 1;
let highestLevel = 0;

let delay = 1000;
let pageLoadDelay = 1000 * 0.7;

let startTime = 0; // Time when tiles are covered
let endTime = 0; // Time when last tile is clicked

let coverGrid = null;
let loadWinPage = null;
let loadLossPage = null;

window.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".tile").forEach(tile => {
    tile.addEventListener("click", handleClick);
  });
});

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

function clearData() {
  number = 1;
  active = 0;
  if (loadWinPage) clearTimeout(loadWinPage);
  if (loadLossPage) clearTimeout(loadLossPage);
  document.querySelectorAll(".num").forEach(num => {
    num.textContent = "";
  });
  document.querySelectorAll(".tile").forEach(tile => {
    clearSquare(tile);
  });
}

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

function populateLevel() {
  const levelText = document.getElementById("level");
  levelText.textContent = "LEVEL " + level;
}

function populateNum() {
  let i = 0;
  while (i < count) {
    let randTile = Math.floor(Math.random() * 35);
    let targetTile = document.querySelector(`.num[data-index="${randTile}"]`);
    let currentText = parseInt(targetTile.textContent);

    if (isNaN(currentText)) {
      targetTile.textContent = i + 1;
      i++;
    }
  }
}

function coverNum() {
  document.querySelectorAll(".num").forEach(num => {
    const text = parseInt(num.textContent);
    if (isNaN(text) === false) {
      const index = parseInt(num.dataset.index);
      const tile = document.querySelector(`.tile[data-index="${index}"]`);
      tile.classList.add("tile-covered");
    }
  })
  active = 1;
  startTime = Date.now();
}

function handleClick(event) {
  const target = event.currentTarget.closest(".tile");
  const index = parseInt(target.dataset.index);
  const clickedNum = document.querySelector(`.num[data-index="${index}"]`);
  const text = parseInt(clickedNum.textContent);

  if (active === 0) return;
  if (isNaN(text)) return;
  if (text < number) return;
  pop(target);

  if (text === number) {
    removeSquare(target);
  } else {
    wrongSquare(target);
    if (loadWinPage) clearTimeout(loadWinPage);
    loadLossPage = setTimeout (() => {
      loadPage("loss");
    }, pageLoadDelay);

    active = 0;
    return;
  }
}

function removeSquare(target) {
  target.classList.add("tile-covered");
  void target.offsetWidth;
  target.classList.remove("tile-covered");
  if (number === count) {
    victory(target);
  }
  number++;
}

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

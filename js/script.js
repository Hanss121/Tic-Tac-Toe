document.addEventListener("DOMContentLoaded", () => {
  const cells = document.querySelectorAll(".cell");
  const restartBtn = document.getElementById("restartBtn");
  const startGameBtn = document.getElementById("startGameBtn");
  const backBtn = document.getElementById("backBtn");
  const winLine = document.getElementById("winLine");
  const menu = document.getElementById("menu");
  const game = document.getElementById("game");
  const symbolButtons = document.querySelectorAll(".symbol-btn");
  const difficultyButtons = document.querySelectorAll(".difficulty-btn");

  let currentPlayer = "X";
  let gameBoard = ["", "", "", "", "", "", "", "", ""];
  let gameActive = true;
  let playerSymbol = "X";
  let aiSymbol = "O";
  let difficulty = "easy";

  const playerImages = {
    X: "img/x.png",
    O: "img/o.png",
  };

  const winningConditions = [
    [0, 1, 2], // Horizontal atas
    [3, 4, 5], // Horizontal tengah
    [6, 7, 8], // Horizontal bawah
    [0, 3, 6], // Vertikal kiri
    [1, 4, 7], // Vertikal tengah
    [2, 5, 8], // Vertikal kanan
    [0, 4, 8], // Diagonal dari kiri atas ke kanan bawah
    [2, 4, 6], // Diagonal dari kanan atas ke kiri bawah
  ];

  const handleCellPlayed = (clickedCell, clickedCellIndex) => {
    gameBoard[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = `<img src="${playerImages[currentPlayer]}" alt="${currentPlayer}" class="w-[50px] h-[50px] object-contain" />`;
  };

  const handlePlayerChange = () => {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
  };

  const handleResultValidation = () => {
    let roundWon = false;
    let winningConditionIndex;

    for (let i = 0; i < winningConditions.length; i++) {
      const winCondition = winningConditions[i];
      let a = gameBoard[winCondition[0]];
      let b = gameBoard[winCondition[1]];
      let c = gameBoard[winCondition[2]];

      if (a === "" || b === "" || c === "") {
        continue;
      }
      if (a === b && b === c) {
        roundWon = true;
        winningConditionIndex = i;
        break;
      }
    }

    if (roundWon) {
      displayWinLine(winningConditionIndex);
      gameActive = false;

      // Putar suara kemenangan
      var winSound = document.getElementById("win-sound");
      winSound.play();

      setTimeout(() => {
        alert(`Player ${currentPlayer} has won!`);
      }, 600); // Delay untuk memastikan garis kemenangan muncul terlebih dahulu
      return;
    }

    let roundDraw = !gameBoard.includes("");
    if (roundDraw) {
      alert("Game ended in a draw!");
      gameActive = false;
      return;
    }

    handlePlayerChange();
    if (currentPlayer === aiSymbol) {
      setTimeout(handleAIMove, 500);
    }
  };

  const displayWinLine = (index) => {
    const lineTransforms = [
      "translateY(50px) translateX(15px) scaleX(1)", // Horizontal atas
      "translateY(160px) translateX(15px) scaleX(1)", // Horizontal tengah
      "translateY(260px) translateX(15px) scaleX(1)", // Horizontal bawah
      "translateX(60px) translateY(10px) rotate(90deg) scaleX(1)", // Vertikal kiri
      "translateX(160px) translateY(10px) rotate(90deg) scaleX(1)", // Vertikal tengah
      "translateX(270px) translateY(10px) rotate(90deg) scaleX(1)", // Vertikal kanan
      "translate(10px, 10px) rotate(45deg) scaleX(1.414)", // Diagonal kiri atas ke kanan bawah
      "translate(10px, 305px) rotate(-45deg) scaleX(1.414)", // Diagonal kanan atas ke kiri bawah
    ];
    winLine.style.transform = lineTransforms[index];
  };

  const handleCellClick = (event) => {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute("data-index"));

    if (gameBoard[clickedCellIndex] !== "" || !gameActive) {
      return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
  };

  const handleRestartGame = () => {
    gameActive = true;
    currentPlayer = playerSymbol;
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    cells.forEach((cell) => (cell.innerHTML = ""));
    winLine.style.transform = "scaleX(0)";
  };

  const handleAIMove = () => {
    let move;
    if (difficulty === "easy") {
      move = getRandomMove();
    } else if (difficulty === "medium") {
      move = Math.random() > 0.5 ? getBestMove() : getRandomMove();
    } else {
      move = getBestMove();
    }
    handleCellPlayed(cells[move], move);
    handleResultValidation();
  };

  const getBestMove = () => {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < gameBoard.length; i++) {
      if (gameBoard[i] === "") {
        gameBoard[i] = aiSymbol;
        let score = minimax(gameBoard, 0, false);
        gameBoard[i] = "";
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  };

  const getRandomMove = () => {
    const availableMoves = gameBoard.map((cell, index) => (cell === "" ? index : null)).filter((index) => index !== null);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  };

  const minimax = (board, depth, isMaximizing) => {
    let scores = {
      [aiSymbol]: 1,
      [playerSymbol]: -1,
      tie: 0,
    };

    let result = checkWinner();
    if (result !== null) {
      return scores[result];
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
          board[i] = aiSymbol;
          let score = minimax(board, depth + 1, false);
          board[i] = "";
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
          board[i] = playerSymbol;
          let score = minimax(board, depth + 1, true);
          board[i] = "";
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const checkWinner = () => {
    let winner = null;
    for (let i = 0; i < winningConditions.length; i++) {
      const winCondition = winningConditions[i];
      let a = gameBoard[winCondition[0]];
      let b = gameBoard[winCondition[1]];
      let c = gameBoard[winCondition[2]];

      if (a === "" || b === "" || c === "") {
        continue;
      }
      if (a === b && b === c) {
        winner = a;
        break;
      }
    }

    if (winner === null && !gameBoard.includes("")) {
      return "tie";
    } else {
      return winner;
    }
  };

  const handleSymbolSelection = (event) => {
    symbolButtons.forEach((btn) => btn.classList.remove("active"));
    event.target.classList.add("active");
    playerSymbol = event.target.getAttribute("data-symbol");
    aiSymbol = playerSymbol === "X" ? "O" : "X";
    currentPlayer = playerSymbol;
  };

  const handleDifficultySelection = (event) => {
    difficultyButtons.forEach((btn) => btn.classList.remove("active"));
    event.target.classList.add("active");
    difficulty = event.target.getAttribute("data-difficulty");
  };

  const handleStartGame = () => {
    menu.style.display = "none";
    game.style.display = "block";
    handleRestartGame();
  };

  symbolButtons.forEach((btn) => btn.addEventListener("click", handleSymbolSelection));
  difficultyButtons.forEach((btn) => btn.addEventListener("click", handleDifficultySelection));
  startGameBtn.addEventListener("click", handleStartGame);
  restartBtn.addEventListener("click", handleRestartGame);
  backBtn.addEventListener("click", () => {
    game.style.display = "none";
    menu.style.display = "block";
  });

  cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
});
function playClickSound1() {
  var sound = document.getElementById("click-sound1");
  sound.play();
}
function playClickSound() {
  var sound = document.getElementById("click-sound");
  sound.play();
}
function toggleMusic() {
  var music = document.getElementById("background-music");
  var button = document.getElementById("speaker-button");
  if (music.paused) {
    music.play();
    button.textContent = "🔊"; // Ikon untuk suara hidup
  } else {
    music.pause();
    button.textContent = "🔇"; // Ikon untuk suara mati
  }
}
window.addEventListener("load", function () {
  var music = document.getElementById("background-music");
  var button = document.getElementById("speaker-button");
  music.play().catch(() => {
    button.textContent = "🔇"; // Ikon untuk suara mati jika autoplay dicegah
  });
});

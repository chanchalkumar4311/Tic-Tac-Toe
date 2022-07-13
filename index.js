const globalGameState = {
    boardArray: [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""]
    ],
    currentPlayer: "player1",
    isGameOver: false,
    winner: null,
    matchedWinnerCells: []
  };
  
  const playerDetails = {
    player1: {
      symbol: "X",
      name: "Arpan"
    },
    player2: {
      symbol: "O",
      name: "Rituraj"
    }
  };
  
  const boardUIMap = {
    cell1: [0, 0],
    cell2: [0, 1],
    cell3: [0, 2],
    cell4: [1, 0],
    cell5: [1, 1],
    cell6: [1, 2],
    cell7: [2, 0],
    cell8: [2, 1],
    cell9: [2, 2]
  };
  
  const togglePlayer = () => {
    if (globalGameState.currentPlayer === "player1") {
      globalGameState.currentPlayer = "player2";
    } else {
      globalGameState.currentPlayer = "player1";
    }
    displayCurrentPlayer();
  };
  
  const matchCells = (gameState, ...cells) => {
    if (!cells) return null;
  
    const positionOfPlayerFirst = boardUIMap[cells[0]]; // [0, 0]
    const firstEncounteredPlayer =
      gameState.boardArray[positionOfPlayerFirst[0]][positionOfPlayerFirst[1]];
  
    // [ "cell1", "cell2", "cell3" ]
    for (let cell of cells) {
      const [row, col] = boardUIMap[cell];
      if (gameState.boardArray[row][col] !== firstEncounteredPlayer) {
        return null;
      }
    }
  
    return { winningPlayer: firstEncounteredPlayer, cells };
  };
  
  function updateGameState(
    lastClickedRow,
    lastClickedCol,
    lastPlayer,
    gameState = globalGameState
  ) {
    const renderUI = () => {
      const arrOfKeys = Object.keys(boardUIMap);
      arrOfKeys.forEach((cell) => {
        const [row, col] = boardUIMap[cell];
        const tempPlayer = gameState.boardArray[row][col];
        if (tempPlayer) {
          document.getElementById(cell).innerHTML =
            playerDetails[tempPlayer].symbol;
        }
      });
  
      if (gameState.isGameOver && gameState.matchedWinnerCells) {
        gameState.matchedWinnerCells.forEach((cell) => {
          document.getElementById(cell).classList.add("winning-cell");
        });
      }
    };
  
    gameState.boardArray[lastClickedRow][lastClickedCol] = lastPlayer;
  
    const { winningPlayer, cells } = matchCells(
      gameState,
      "cell1",
      "cell2",
      "cell3"
    ) ??
      matchCells(gameState, "cell4", "cell5", "cell6") ??
      matchCells(gameState, "cell7", "cell8", "cell9") ??
      matchCells(gameState, "cell1", "cell4", "cell7") ??
      matchCells(gameState, "cell2", "cell5", "cell8") ??
      matchCells(gameState, "cell3", "cell6", "cell9") ??
      matchCells(gameState, "cell1", "cell5", "cell9") ??
      matchCells(gameState, "cell3", "cell5", "cell7") ?? {
        winningPlayer: null,
        cells: []
      };
  
    if (winningPlayer) {
      gameState.winner = winningPlayer;
      gameState.isGameOver = true;
      gameState.matchedWinnerCells = cells;
    } else {
      togglePlayer();
    }
  
    renderUI();
  }
  
  function displayCurrentPlayer(gameState = globalGameState) {
    const { currentPlayer } = gameState;
    document.getElementById("currentPlayerDisp").innerHTML =
      playerDetails[currentPlayer].name;
  }
  
  function handleCellClick(e) {
    const { boardArray, currentPlayer, isGameOver, winner } = globalGameState;
  
    const domNode = e.target;
    const { id } = domNode;
    const [row, col] = boardUIMap[id];
  
    if (isGameOver || boardArray[row][col]) return;
  
    updateGameState(row, col, currentPlayer, globalGameState);
  }
  
  displayCurrentPlayer();
  
function Cell(){
    let value = "";

    const addMarker = (playerMarker) => {
        value = playerMarker;
    }

    const resetCell = () => value = "";

    const getValue = () => value;

    return {addMarker, getValue, resetCell};
}

function Gameboard() {
    const board = [];
    
    const rows = 3;
    const columns = 3;
    
    for(let i = 0; i < rows; i++){
        board[i] = [];
        for(let j = 0; j < columns; j++){
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const placeMarker = (row, column, marker) => {
       if(board[row][column].getValue()){
        return false;
       } else {
        board[row][column].addMarker(marker);
         return true;
       }
         
    };

    const resetBoard = () => {
        for(let i = 0; i < rows; i++){
            board[i].forEach((cell) => {
                cell.resetCell();
            });
        };
    };

    return {
        getBoard,
        placeMarker,
        resetBoard
    };
}




function gameController(PlayerOneName = "Player One", PlayerTwoName = "Player Two"){
    const board = Gameboard();

    const players = [
        {name: PlayerOneName, marker: "X"},
        {name: PlayerTwoName, marker: "O"}
    ];

    let activePlayer = players[0];

    const switchPlayers = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer;

    const checkWinner = () => {
        const currentBoard = board.getBoard();


        for(let row = 0; row < 3; row++){
            if(
                currentBoard[row][0].getValue() === activePlayer.marker &&
                currentBoard[row][1].getValue() === activePlayer.marker &&
                currentBoard[row][2].getValue() === activePlayer.marker
            ) {
                return true;
            } 
        }
        
        for(let column = 0; column < 3; column++){
            if(
                currentBoard[0][column].getValue() === activePlayer.marker &&
                currentBoard[1][column].getValue() === activePlayer.marker &&
                currentBoard[2][column].getValue() === activePlayer.marker
            ) {
                return true;
            } 
        }

        if(
            currentBoard[0][2].getValue() === activePlayer.marker &&
            currentBoard[1][1].getValue() === activePlayer.marker &&
            currentBoard[2][0].getValue() === activePlayer.marker

        ) {
            return true;
        }

        if(
            currentBoard[0][0].getValue() === activePlayer.marker &&
            currentBoard[1][1].getValue() === activePlayer.marker &&
            currentBoard[2][2].getValue() === activePlayer.marker

        ) {
            return true;
        }
        
        return false;
    };

    const checkDraw = () => {
        const currentBoard = board.getBoard();

        return currentBoard.every((row) => {
            return row.every((cell) => {
                return cell.getValue() !== "";
            });
        });
    };

    const defaultAnnouncement = `It's ${activePlayer.name}'s turn`
    let gameOver = false;
    let gameResults = defaultAnnouncement;

    const getGameResults = () => gameResults;
    const getGameOver = () => gameOver;

    const playRound = (row, column) => {
        if(gameOver){
            console.log('Game is over.')
            return
        }

        const move = board.placeMarker(row, column, activePlayer.marker);
    

        if(!move){ 
            return false;
        } else if(checkWinner()) {
            gameOver = true;
            gameResults = `${activePlayer.name} wins!`;
            return true;
        } else if(checkDraw()) {
            gameOver = true;
            gameResults = "It's a draw!";
            return true;
        } else {
            switchPlayers();
            gameResults = `It's ${activePlayer.name}'s turn`;
            return true;
        }  
    };

    const resetGame = () =>{
        board.resetBoard();
        gameOver = false;
        activePlayer = players[0];
        gameResults = defaultAnnouncement;
    };

    return {
        getActivePlayer,
        getBoard: board.getBoard,
        playRound,
        getGameOver,
        resetGame,
        getGameResults
    }
}

function screenController() {

    const boardDiv = document.createElement("div");
    const gameText = document.createElement("p");

    const game = gameController();

    gameText.classList.add("gameText");
    gameText.textContent = game.getGameResults();
    document.body.append(gameText);
   

    boardDiv.classList.add("gameboard");
    document.body.append(boardDiv);

    


    const renderBoard = () => {

        boardDiv.replaceChildren();

        game.getBoard().forEach((row, rowIndex) => {
            row.forEach((cell, index) => {
                const cellBtn = document.createElement("button");
                cellBtn.classList.add("cell");
                cellBtn.classList.add("active");
                cellBtn.dataset.column = index;
                cellBtn.dataset.row = rowIndex;
                cellBtn.textContent = cell.getValue();
                
                boardDiv.appendChild(cellBtn);               
            });
        });
    }

    renderBoard();

    const resetBtn = document.createElement("button");
    resetBtn.classList.add("reset-btn");
    resetBtn.textContent = "Restart Game";
    document.body.append(resetBtn);


    const updateBoard = (row, column, target) => {
        const currentBoard = game.getBoard();

        target.textContent = currentBoard[row][column].getValue();
        
    }
    
    const updateAnnouncement = () => {
        gameText.textContent = game.getGameResults();
    }

  boardDiv.addEventListener("click", (e) => {
        const clickedCell = e.target;

        if(!clickedCell.classList.contains("cell") || game.getGameOver()){
            return;
        };

       const row = Number(clickedCell.dataset.row);
       const column = Number(clickedCell.dataset.column);

       const successfulMove = game.playRound(row, column);

       if(successfulMove){
            updateBoard(row, column, clickedCell);
            updateAnnouncement();
            clickedCell.classList.remove("active");
            clickedCell.classList.add("inactive");
       }

    });

    resetBtn.addEventListener("click", () => {
        game.resetGame();
        renderBoard();
        updateAnnouncement();
    });

}

screenController();
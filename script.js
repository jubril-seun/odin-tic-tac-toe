function Cell(){
    let value = ".";

    const addMarker = (playerMarker) => {
        value = playerMarker;
    }

    const resetCell = () => value = ".";

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
        {name: PlayerOneName, marker: 1},
        {name: PlayerTwoName, marker: 2}
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

    let gameOver = false;

    const getGameOver = () => gameOver;

    const playRound = (row, column) => {
        if(gameOver){
            console.log('Game is over.')
            return
        }

        const move = board.placeMarker(row, column, activePlayer.marker);
    

        if(!move){
            console.log("invalid move. Cell is taken");
            console.log(`It's ${activePlayer.name}'s turn`);  
            return
        } else if(checkWinner()) {
            gameOver = true;
            console.log(`${activePlayer.name} wins`);
            return;
        } else if(checkDraw()) {
            gameOver = true;
            console.log("It's a draw!");
            return;
        } else {
            switchPlayers();
            console.log(`It's ${activePlayer.name}'s turn`);
        }  
    };

    const resetGame = () =>{
        board.resetBoard();
        gameOver = false;
        activePlayer = players[0]
    };

    return {
        getActivePlayer,
        getBoard: board.getBoard,
        playRound,
        getGameOver,
        resetGame
    }
}

function screenController() {

    const boardDiv = document.createElement("div");
    const game = gameController();


    const renderBoard = () => {
        boardDiv.classList.add("gameboard");
        document.body.append(boardDiv);

        game.getBoard().forEach((row, rowIndex) => {
            row.forEach((cell, index) => {
                const cellBtn = document.createElement("button");
                cellBtn.classList.add("cell");
                cellBtn.dataset.column = index;
                cellBtn.dataset.row = rowIndex;
                cellBtn.textContent = cell.getValue();
                
                boardDiv.appendChild(cellBtn);               
            });
        })
    }

    const updateScreen = () => {

    }

  boardDiv.addEventListener("click", (e) => {
        console.log(e.target);
    })

    renderBoard();

}

screenController();
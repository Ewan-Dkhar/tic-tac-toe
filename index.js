
class humanPlayer {
    constructor(letter) {
        this.letter = letter;
    }

    get_move(cellNumber) {
        try {
            if(CELLS[cellNumber].dataset.state === " " && run){
                return true;
            }
            else{
                return false;
            }
        } catch (error) {
            return false;
        }
    }
}

class randomComputerPlayer {
    constructor(letter) {
        this.letter = letter;
    }

    get_move(){
        let randomNumber = Math.floor(Math.random()*9);
        if(availableCellCount !== 0 && run) {
            while(CELLS[randomNumber].dataset.state !== " "){
                randomNumber = Math.floor(Math.random()*9);
            }
            return randomNumber;
        } else{
            return -1;
        }
    }
}

class smartComputerPlayer {
    constructor(letter) {
        this.letter = letter;
        this.scores = {
                        X: 1,
                        O: -1,
                        tie: 0
                    };
    }

    get_move(){
        if(availableCellCount === 8 && run){
            let randomNumber = Math.floor(Math.random()*9);
            while(CELLS[randomNumber].dataset.state !== " "){
                randomNumber = Math.floor(Math.random()*9);
            }
            return randomNumber;
        }
        else{
            let bestScore = Infinity;
            let bestMove;
            let minLetter = this.letter;

            for (let i = 0; i < 9; i++) {
                    if(gameBoard[i] === ''){
                        gameBoard[i] = minLetter;
                        let score = this.minmax(true)
                        gameBoard[i] = '';

                        if(score < bestScore){
                            bestScore = score;
                            bestMove = i;
                        }
                    }
                    
            }
            console.log("your best move is ", bestMove, typeof(bestMove))
            console.log("your best score is ", bestScore)
            return `${bestMove}`; // passing this as a string cause it doesn't execute when 0 is passed as a number
        }
    }

    

    minmax(isMaximizing){
        let result = this.checkWinner()
        if(result !== null){
            return this.scores[result]
        }
        else{
            if(isMaximizing){
                let bestScore = -Infinity;
                let maxLetter;
                let minLetter = this.letter;

                if(minLetter === 'O'){
                    maxLetter = 'X'
                } else {
                    maxLetter = "O"
                }

                for (let i = 0; i < 9; i++) {
                    if(gameBoard[i] === ''){
                        gameBoard[i] = maxLetter;
                        let score = this.minmax(false)
                        gameBoard[i] = '';

                        if(score > bestScore){
                            bestScore = score;
                        }
                    }
                    
                }
                console.log(bestScore)
                return bestScore;
            }
            else{
                let bestScore = Infinity;
                let minLetter = this.letter;

                for (let i = 0; i < 9; i++) {
                    if(gameBoard[i] === ''){
                        gameBoard[i] = minLetter;
                        let score = this.minmax(true)
                        gameBoard[i] = '';

                        if(score < bestScore){
                            bestScore = score;                        
                        }
                    }
                    
                }
                console.log(bestScore)
                return bestScore;
            }
        }
    }

    checkWinner(){
        // check winner from gameBoard
        let winner = null;

        // horizontal
        for (let i = 0; i < 3; i++) {
            let horizontalMatchedCount = 0;
            for(let j = 1; j < 3; j++){
                if(gameBoard[3*i] === gameBoard[j+(3*i)] && gameBoard[3*i] !== ''){
                    horizontalMatchedCount++;
                }
            }
            if(horizontalMatchedCount === 2){
                winner = gameBoard[3*i]    
            }
        }

        // vertical
        for (let i = 0; i < 3; i++) {
            if(gameBoard[i] === gameBoard[3+i] && gameBoard[i] === gameBoard[6+i] && gameBoard[i] !== ''){
                winner = gameBoard[i];    
            }
        }

        // diagonal
        if(gameBoard[0] === gameBoard[4] && gameBoard[0] === gameBoard[8] && gameBoard[0] !== ''){
            winner = gameBoard[0];
        }
        if(gameBoard[2] === gameBoard[4] && gameBoard[2] === gameBoard[6] && gameBoard[2] !== ''){
            winner = gameBoard[2];
        }
    

        let openSpots = 0;
        for(let i=0; i<9; i++){
            if(gameBoard[i]===''){
                openSpots++
            }
        }

        if(winner === null && openSpots === 0){
            return 'tie';
        } else {
            return winner;
        }

    }
}

const makeMove = (cellNumber, player) => {
    if(player.get_move(cellNumber)){
        gameBoard[cellNumber] = player.letter;
        CELLS[cellNumber].setAttribute("data-state", `${player.letter}`)

        const img = document.createElement("img");
        img.src = `icons\\${player.letter}.svg`
        img.classList.add("img-X")
        CELLS[cellNumber].appendChild(img)

        availableCellCount -= 1;

        winner(cellNumber, player)

        return true;
    }
    else{
        return false;
    }
}

const winner = (cellNumber, player) => {
    // Matching rows
    let row_index = Math.floor(cellNumber/3);
    let row_matched_count = 0;
    for(let i=0; i < 3; i++){
        if(CELLS[cellNumber].dataset.state === CELLS[(i+(3*row_index))].dataset.state){
            row_matched_count++
        }
    }
    if(row_matched_count === 3){
        console.log(`${player.letter} wins`)
        document.querySelector("h1").innerHTML = `${player.letter} wins!`
        document.querySelector("h1").setAttribute("class", `h-${player.letter}`)
        run = false;
    }

    // Matching columns
    let col_index = cellNumber%3;
    if(CELLS[col_index].dataset.state === CELLS[col_index+3].dataset.state && CELLS[col_index].dataset.state === CELLS[col_index+6].dataset.state && CELLS[col_index+3].dataset.state === CELLS[col_index+3].dataset.state){
        console.log(`${player.letter} wins`)
        document.querySelector("h1").innerHTML = `${player.letter} wins!`
        document.querySelector("h1").setAttribute("class", `h-${player.letter}`)
        run = false;
    }

    // Matching diagonals
    if(cellNumber%2 === 0){
        if(CELLS[cellNumber].dataset.state === CELLS[0].dataset.state && CELLS[cellNumber].dataset.state === CELLS[4].dataset.state && CELLS[cellNumber].dataset.state === CELLS[8].dataset.state){
            console.log(`${player.letter} wins`)
            document.querySelector("h1").innerHTML = `${player.letter} wins!`
            document.querySelector("h1").setAttribute("class", `h-${player.letter}`)
            run = false;
        }
        if(CELLS[cellNumber].dataset.state === CELLS[2].dataset.state && CELLS[cellNumber].dataset.state === CELLS[4].dataset.state && CELLS[cellNumber].dataset.state === CELLS[6].dataset.state){
            console.log(`${player.letter} wins`)
            document.querySelector("h1").innerHTML = `${player.letter} wins!`
            document.querySelector("h1").setAttribute("class", `h-${player.letter}`)
            run = false;
        }
    }

    if(!run){
        button.classList.remove("hidden")
        gameBoard = {
                    0:'',
                    1:'',
                    2:'',
                    3:'',
                    4:'',
                    5:'',
                    6:'',
                    7:'',
                    8:'',
                }
    }
}

const CELLS = document.querySelectorAll(".cell")
const player1 = new humanPlayer("X")
const player2 = new smartComputerPlayer("O")
const button =document.querySelector(".btn");
let run = true;

let gameBoard = {
    0:'',
    1:'',
    2:'',
    3:'',
    4:'',
    5:'',
    6:'',
    7:'',
    8:'',
}

let availableCellCount = 9;

CELLS.forEach((cell) => {
    cell.addEventListener("click", (e) => {
        // Player 1's turn
        hasMoved = makeMove(parseInt(e.target.id), player1);

        // Player 2's(computer) turn
        if(hasMoved){
            if(run){
                let move = player2.get_move()
                move = parseInt(move);
                if(move>=0 && availableCellCount !== 0){
                    makeMove(move, player2)
                }
                else{
                    if(availableCellCount === 0 && run){
                        console.log("No more empty cells")
                        document.querySelector("h1").innerHTML = "Draw!"
                    }
                    button.classList.remove("hidden")
                    gameBoard = {
                        0:'',
                        1:'',
                        2:'',
                        3:'',
                        4:'',
                        5:'',
                        6:'',
                        7:'',
                        8:'',
                    }
                }
            }
        }
        else{
            console.log("Invalid move")
        }

    })
})

button.addEventListener("click", () => {
    console.log("200")
    run = true;
    availableCellCount = 9;
    CELLS.forEach((cell) => {
        // remove all images and data-state set to ' '
        cell.innerHTML = "";
        cell.setAttribute("data-state", " ")
        button.classList.add("hidden")
        document.querySelector("h1").innerHTML = "Tic Tac Toe"
        document.querySelector("h1").setAttribute("class", "h-X")
    })
})

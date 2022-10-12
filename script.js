const { body } = document;

document.createElement('canvas');
var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');

const width = 500;
const height = 700;

const isMobile = window.matchMedia('(max-width: 600px)');
const gameOverEl= document.createElement('div')

const paddleHeight = 10;
const paddleWidth = 50;
const paddleDiff = 25;
const paddleDistance = 10;
let paddleBottomX = 225;
let paddleTopX = 225;
let playerMoved = false;
let paddleContact = false;

let ballX = 250;
let ballY = 350;
const ballRadius = 5;

let speedY;
let speedX;
let trajectoryX;
let computerSpeed;

let playerScore = 0;
let computerScore = 0;
const winningScore = 7;
let isGameOver = true;
let isNewGame = true;

if (isMobile.matches) {
    speedY = -2;
    speedX = speedY;
    computerSpeed = 4;
} else {
    speedY = -1;
    speedX = speedY;
    computerSpeed = 3;
}

function createCanvas() {
    canvas.width = width;
    canvas.height = height;
    body.appendChild(canvas);
    renderCanvas();
}

function renderCanvas() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height)
    context.fillStyle = 'white';
    context.fillRect(paddleBottomX, height - (paddleDistance + paddleHeight), paddleWidth, paddleHeight);
    context.fillRect(paddleTopX, 10, paddleWidth, paddleHeight);
    context.beginPath();
    context.setLineDash([4])
    context.moveTo(0, height/2);
    context.lineTo(width, height/2)
    context.strokeStyle = 'grey'
    context.stroke()

    context.beginPath();
    context.arc(ballX, ballY, ballRadius, 2 * Math.PI, 0)
    context.fillStyle = 'white';
    context.fill()

    context.font = '32px Courier New';
    context.fillText(playerScore, 20, canvas.height/2 + 50)
    context.fillText(computerScore, 20, canvas.height/2 - 30)
}

function ballMove() {
    ballY += - speedY;
    if (playerMoved && paddleContact) {
        ballX += speedX;
    }
}

function ballBoundaries() {
    if (ballX < 0 && speedX < 0) {
        speedX = -speedX;
    }
    if (ballX > width && speedX > 0) {
        speedX = -speedX;
    }
    if (ballY > height - paddleDiff) {
        if (ballX > paddleBottomX && ballX < paddleBottomX + paddleWidth) {
            paddleContact = true;
            if (playerMoved) {
                speedY -= 1;

                if (speedY < -5) {
                    speedY = -5;
                    computerSpeed = 6;
                }
            }
            speedY = -speedY;
            trajectoryX = ballX - (paddleBottomX + paddleDiff);
            speedX = trajectoryX * 0.3;
        } else if (ballY > height) {
            ballReset();
            computerScore++;
        }
    }
    if (ballY < paddleDiff) {
        if (ballX > paddleTopX && ballX < paddleTopX + paddleWidth) {
            if (playerMoved) {
                speedY += 1;
                if (speedY > 5) {
                    speedY = 5;
                }
            }
            speedY = -speedY;
        } else if (ballY < 0) {
            ballReset()
            playerScore++;
        }
    }
}

function animate() {
    renderCanvas();
    ballMove();
    ballBoundaries()
    if (!isGameOver) {
        window.requestAnimationFrame(animate);
    }
}

function ballReset() {
    ballX = width / 2;
    ballY = height / 2;
    speedY = -3;
    paddleContact = false;
}

function showGameOverEl(winner) {
    canvas.hidden = true;
    gameOverEl.textContent = '';
    gameOverEl.classList.add('game-over-container');
    const title = document.createElement('h1');
    title.textContent = `${winner} Wins!`;
    const playAgainBtn = document.createElement('button');
    playAgainBtn.setAttribute('onclick', 'startGame()');
    playAgainBtn.textContent = 'Play again';
    gameOverEl.append(title, playAgainBtn)
    body.appendChild(gameOverEl)
}

function startGame() {
    isGameOver = false;
    isNewGame = false;
    playerScore = 0;
    computerScore = 0;
    ballReset()
    createCanvas()
    animate()
    canvas.addEventListener('mousemove', (e) => {
        console.log(e.clientX);
    })
}

startGame()
import EnemyController from "./EnemyController.js";
import Player from "./Player.js";
import BulletController from "./BulletController.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");


canvas.width = 700;
canvas.height = 600;


const background = new Image();
background.src = 'images/space.png';
background.onload = menu;

const logoImage = new Image();
logoImage.src = 'icon.png';
logoImage.onload = menu;


const playerBulletController = new BulletController(canvas, 10, "red", true);
const enemyBulletController = new BulletController(canvas, 5, "white", false);
const enemyController = new EnemyController(canvas, enemyBulletController, playerBulletController);
const player = new Player(canvas, 3, playerBulletController);


let isGameOver = false;
let didwin = false;
let life = 3;
let seconds = 0;
let fps = 90;
let gameInterval;


function drawButton(text, xPos, yPos, width, height) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(xPos, yPos, width, height);

    ctx.strokeStyle = "red";
    ctx.strokeRect(xPos, yPos, width, height);

    ctx.fillStyle = "#39ff14";
    ctx.font = "30px sans-serif";
    ctx.fillText(text, xPos + 125 , yPos + height / 2 + 10);
}

function drawMenuButtons() {
    drawButton("Start Game", 225, 350, 255, 50);
    drawButton("Description", 225, 400, 255, 50);
    drawButton("Options", 225, 450, 255, 50);
    drawButton("Customization", 225, 500, 255, 50);
}

function drawButtonBack() {
    ctx.fillStyle = 'red';
    ctx.fillRect(600, 20, 80, 40); 

    ctx.fillStyle = "white";
    ctx.font = "20px sans-serif";
    ctx.fillText("Back", 640, 45); 
}


function menu() {
    if (!background.complete || !logoImage.complete) {
        return;
    }

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(logoImage, canvas.width/3 - logoImage.width/2, canvas.height/4 - logoImage.height/2 - 50, 350, 300);

    ctx.font = '30px sans-serif';
    ctx.fillStyle = '#39FF14';
    ctx.textAlign = 'center';

    drawMenuButtons();

    canvas.addEventListener('click', function(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        if (x >= 225 && x <= 480 && y >= 350 && y <= 400) {
            startGame();
        }
        else if(x >= 225 && x <= 480 && y >= 400 && y <= 450){
            description();
        }
        else if(x >= 225 && x <= 480 && y >= 450 && y <= 500){
            console.log("options");
        }
        else if(x >= 225 && x <= 480 && y >= 500 && y <= 550){
            console.log("custumization");
        }
    });

}

function startGame() {
    clearInterval(gameInterval);
    gameInterval = setInterval(game, 1000 / fps);
}

function game() {
    checkGameOver();
    lifeLosing();
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    displayGameOver();
    if (!isGameOver) {
        enemyController.draw(ctx);
        player.draw(ctx);
        playerBulletController.draw(ctx);
        enemyBulletController.draw(ctx);

        ctx.fillStyle = '#333333';
        ctx.fillRect(0, 0, canvas.width, 30);

        ctx.fillStyle = 'white';
        ctx.font = '20px sans-serif';
        ctx.fillText('Score: 0', 125, 23);
        ctx.fillText('Life: ' + life, canvas.width - 125, 23);
        ctx.fillText('Time: ' + updateTime(), canvas.width - 350, 23);
    } else {
        clearInterval(gameInterval); 
    }
}

function description() {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    drawButtonBack();

    canvas.addEventListener('click', function(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        if (x >= 600 && x <= 680 && y >= 20 && y <= 60) {
            menu();
        }
    });
    
    var text = 'Space Invaders, released in 1978, is an iconic arcade game known for its addictive gameplay and pixelated graphics. Players control a laser cannon at the bottom of the screen, tasked with defending Earth from descending waves of alien invaders. As the game progresses, the aliens move faster and descend more aggressively, adding to the challenge. Despite its simplicity, Space Invaders has had a significant cultural impact, inspiring numerous adaptations and homages across various media. Its enduring popularity is a testament to its timeless appeal and status as a classic in video game history.';
    var maxWidth = 400;
    var lineHeight = 30;
    var x = 350;
    var y = 100;

    drawWrappedText(ctx, text, x, y, maxWidth, lineHeight);

}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';
    var lines = [];

    words.forEach(function(word) {
        var testLine = line + word + ' ';
        var metrics = ctx.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth) {
            lines.push(line);
            line = word + ' ';
        } else {
            line = testLine;
        }
    });
    lines.push(line);

    lines.forEach(function(line, index) {
        ctx.font = "25px Arial"; 
        ctx.fillStyle = "white";
        ctx.fillText(line, x, y + (index * lineHeight));
    });
}

function displayGameOver(){
    if(isGameOver) {
        let text = didwin ? "You win" : "Game Over";

        ctx.fillStyle = "#39ff14";
        ctx.font = "70px Arial";
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    }
}

function lifeLosing(){
    if(enemyBulletController.collideWith(player)){
        life--;
    }

    if(enemyController.collideWith(player)){
        life--;
    }
}

function checkGameOver(){
    if(life === 0){
        isGameOver = true;
    }

    if(enemyController.enemyRows.length === 0){
        didwin = true;
        isGameOver = true;
    }
}

function updateTime() {
    seconds++;
    const formattedTime = formatTime(seconds);
    return formattedTime;
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${formattedHours}:${formattedMinutes}`;
}
document.addEventListener("DOMContentLoaded", function() {
    var startScreen = document.getElementById("startScreen");
    var startButton = document.getElementById("startButton");
    var gameContainer = document.getElementById("game-container");
    var player = document.getElementById("player");
    var scoreText = document.getElementById("score");

    gameContainer.style.display = "none";

    startButton.addEventListener("click", function() {
        startScreen.style.display = "none";
        gameContainer.style.display = "block";
    });

    var tileSize = 40;
    var playerX = 60;
    var playerY = 60;
    var speed = 5;
    var score = 0;
    var dots = [];

    player.style.left = playerX + "px";
    player.style.top = playerY + "px";

    var maze = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,1,0,1,0,0,0,1,0,0,0,1],
        [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
        [1,0,1,0,0,0,0,0,1,0,0,0,1,0,1],
        [1,0,1,1,1,1,1,0,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,1,0,0,0,1,0,0,0,1],
        [1,1,1,1,1,0,1,1,1,0,1,1,1,1,1],
        [1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
        [1,0,1,0,1,1,1,0,1,1,1,1,1,0,1],
        [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
        [1,0,1,1,1,1,1,1,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];

    // Build maze tiles
    for (var y = 0; y < maze.length; y++) {
        for (var x = 0; x < maze[y].length; x++) {
            var tile = document.createElement("div");
            tile.style.width = tileSize + "px";
            tile.style.height = tileSize + "px";
            tile.style.position = "absolute";
            tile.style.left = x * tileSize + "px";
            tile.style.top = y * tileSize + "px";
            tile.style.backgroundColor = maze[y][x] === 1 ? "#000" : "#222";
            tile.classList.add(maze[y][x] === 1 ? "wall" : "floor");
            gameContainer.appendChild(tile);
        }
    }

    // Place dots
    for (var y = 0; y < maze.length; y++) {
        for (var x = 0; x < maze[y].length; x++) {
            if (maze[y][x] === 0 && Math.random() < 0.6) {
                var dot = document.createElement("div");
                dot.className = "dot";
                dot.style.width = "12px";
                dot.style.height = "12px";
                dot.style.position = "absolute";
                dot.style.left = x * tileSize + tileSize/2 - 6 + "px";
                dot.style.top = y * tileSize + tileSize/2 - 6 + "px";
                gameContainer.appendChild(dot);
                dots.push(dot);
            }
        }
    }

    function canMove(newX, newY) {
        var gridX = Math.floor(newX / tileSize);
        var gridY = Math.floor(newY / tileSize);
        if (gridY < 0 || gridY >= maze.length || gridX < 0 || gridX >= maze[0].length) return false;
        return maze[gridY][gridX] === 0;
    }

    document.addEventListener("keydown", function(e) {
        var nextX = playerX;
        var nextY = playerY;
        if (e.key === "ArrowUp") nextY -= speed;
        if (e.key === "ArrowDown") nextY += speed;
        if (e.key === "ArrowLeft") nextX -= speed;
        if (e.key === "ArrowRight") nextX += speed;

        if (canMove(nextX, nextY)) {
            playerX = nextX;
            playerY = nextY;
            player.style.left = playerX + "px";
            player.style.top = playerY + "px";
        }
    });

    setInterval(function() {
        for (var i = 0; i < dots.length; i++) {
            var dot = dots[i];
            var dotX = parseInt(dot.style.left);
            var dotY = parseInt(dot.style.top);
            if (playerX < dotX + 12 && playerX + 20 > dotX && playerY < dotY + 12 && playerY + 20 > dotY) {
                dot.remove();
                dots.splice(i, 1);
                i--;
                score++;
                scoreText.innerHTML = score;
            }
        }
    }, 50);
// ---- GLITCH SEQUENCES ----
var done10 = false;
var done15 = false;
var done20 = false;

function mildGlitch(duration) {
    var overlay = document.getElementById("gameOverlay");
    var start = Date.now();
    var interval = setInterval(function() {
        gameContainer.style.transform = `translate(${randInt(-4,4)}px,${randInt(-4,4)}px)`;
        gameContainer.style.filter = `hue-rotate(${randInt(0,360)}deg)`;
        overlay.style.backgroundColor = `rgba(${randInt(0,255)},${randInt(0,255)},${randInt(0,255)},${Math.random()*0.3})`;
        spawnGlitchBoxes(6);
        if (Date.now() - start >= duration) {
            clearInterval(interval);
            gameContainer.style.transform = "";
            gameContainer.style.filter = "";
            overlay.style.backgroundColor = "rgba(0,0,0,0)";
        }
    }, 80);
}

function strongerGlitch(duration) {
    var overlay = document.getElementById("gameOverlay");
    var start = Date.now();
    var interval = setInterval(function() {
        gameContainer.style.transform = `translate(${randInt(-8,8)}px,${randInt(-8,8)}px)`;
        gameContainer.style.filter = `hue-rotate(${randInt(0,360)}deg) saturate(3)`;
        overlay.style.backgroundColor = `rgba(${randInt(0,255)},${randInt(0,255)},${randInt(0,255)},${Math.random()*0.5})`;
        spawnGlitchBoxes(12);
        if (Date.now() - start >= duration) {
            clearInterval(interval);
            gameContainer.style.transform = "";
            gameContainer.style.filter = "";
            overlay.style.backgroundColor = "rgba(0,0,0,0)";
        }
    }, 80);
}

function intenseCrash(duration, callback) {
    var overlay = document.getElementById("gameOverlay");
    var start = Date.now();
    var interval = setInterval(function() {
        gameContainer.style.transform = `translate(${randInt(-16,16)}px,${randInt(-16,16)}px)`;
        gameContainer.style.filter = `hue-rotate(${randInt(0,360)}deg) saturate(4)`;
        overlay.style.backgroundColor = `rgba(${randInt(0,255)},${randInt(0,255)},${randInt(0,255)},${Math.random()*0.7})`;
        spawnGlitchBoxes(20);
        if (Date.now() - start >= duration) {
            clearInterval(interval);
            if (callback) callback();
        }
    }, 80);
}

function checkGlitchTriggers() {
    if (score >= 10 && !done10) {
        done10 = true;
        mildGlitch(1200);
    }
    if (score >= 15 && !done15) {
        done15 = true;
        strongerGlitch(1800);
    }
    if (score >= 20 && !done20) {
        done20 = true;
        intenseCrash(5000, function() {
            // AFTER INTENSE CRASH => show final screen
            gameContainer.style.display = "none";
            document.body.innerHTML = ""; // clear everything
            var errDiv = document.createElement("div");
            errDiv.style.cssText = "width:100vw;height:100vh;background:black;color:white;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:48px;";
            errDiv.innerText = "FILE DOES NOT EXIST";
            document.body.appendChild(errDiv);

            var btn = document.createElement("button");
            btn.innerText = "REPLAY";
            btn.style.cssText = "margin-top:30px;padding:12px 40px;font-size:24px;cursor:pointer;";
            errDiv.appendChild(btn);

            setTimeout(function() {
                btn.style.display = "block";
            }, 5000);

            btn.addEventListener("click", function() { location.reload(); });
        });
    }
}

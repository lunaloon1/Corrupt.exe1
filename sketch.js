document.addEventListener("DOMContentLoaded", function() {
    var startScreen = document.getElementById("startScreen");
    var startButton = document.getElementById("startButton");
    var instructions = document.getElementById("instructions");
    var gameContainer = document.getElementById("game-container");
    var scoreText = document.getElementById("score");
    var player = document.getElementById("player");
    var errorScreen = document.getElementById("errorScreen");
    var replayButton = document.getElementById("replayButton");
    var floatingBackground = document.getElementById("floating-background");

    var tileSize = 40;
    var playerX = 60;
    var playerY = 60;
    var speed = 5;
    var score = 0;
    var dots = [];
    var glitching = false;
    var gameOver = false;

    gameContainer.style.display = "none";
    errorScreen.style.display = "none";
    replayButton.style.display = "none";
    instructions.style.display = "none";
    document.body.style.backgroundColor = "black";

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

    function createMaze() {
        gameContainer.style.position = "relative";
        gameContainer.style.width = tileSize * maze[0].length + "px";
        gameContainer.style.height = tileSize * maze.length + "px";
        gameContainer.style.margin = "50px auto";
        gameContainer.style.backgroundColor = "#000";

        for (var y = 0; y < maze.length; y++) {
            for (var x = 0; x < maze[y].length; x++) {
                var tile = document.createElement("div");
                tile.style.width = tileSize + "px";
                tile.style.height = tileSize + "px";
                tile.style.position = "absolute";
                tile.style.left = x * tileSize + "px";
                tile.style.top = y * tileSize + "px";
                tile.style.backgroundColor = maze[y][x] === 1 ? "#424141" : "#000";
                gameContainer.appendChild(tile);
            }
        }

        for (var y = 0; y < maze.length; y++) {
            for (var x = 0; x < maze[y].length; x++) {
                if (maze[y][x] === 0 && Math.random() < 0.5) {
                    var dot = document.createElement("div");
                    dot.className = "dot";
                    dot.style.width = "10px";
                    dot.style.height = "10px";
                    dot.style.position = "absolute";
                    dot.style.left = x * tileSize + tileSize / 2 - 5 + "px";
                    dot.style.top = y * tileSize + tileSize / 2 - 5 + "px";
                    dot.style.backgroundColor = "white";
                    dot.style.borderRadius = "50%";
                    gameContainer.appendChild(dot);
                    dots.push(dot);
                }
            }
        }
    }

    player.style.position = "absolute";
    player.style.left = playerX + "px";
    player.style.top = playerY + "px";

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

    var floatingDots = [];
    function createFloatingDots(count){
        for(var i=0;i<count;i++){
            var dot = document.createElement("div");
            dot.classList.add("floating-dot");
            dot.style.width = "6px";
            dot.style.height = "6px";
            dot.style.borderRadius = "50%";
            dot.style.position = "absolute";
            dot.style.left = Math.random()*window.innerWidth + "px";
            dot.style.top = Math.random()*window.innerHeight + "px";
            dot.style.backgroundColor = "rgb("+randColor()+","+randColor()+","+randColor()+")";
            floatingBackground.appendChild(dot);
            floatingDots.push({el:dot, x:parseFloat(dot.style.left), y:parseFloat(dot.style.top), vx:(Math.random()*2-1)*0.5, vy:(Math.random()*2-1)*0.5});
        }
    }
    function animateFloatingDots(){
        floatingDots.forEach(function(dot){
            dot.x += dot.vx;
            dot.y += dot.vy;
            if(dot.x<0||dot.x>window.innerWidth-6) dot.vx*=-1;
            if(dot.y<0||dot.y>window.innerHeight-6) dot.vy*=-1;
            dot.el.style.left = dot.x + "px";
            dot.el.style.top = dot.y + "px";
        });
        requestAnimationFrame(animateFloatingDots);
    }
    function randColor(){return Math.floor(Math.random()*256);}
    createFloatingDots(50);
    animateFloatingDots();

    var overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.pointerEvents = "none";
    overlay.style.zIndex = 999;
    document.body.appendChild(overlay);

    startButton.addEventListener("click", function() {
        startScreen.style.display = "none";
        instructions.style.display = "flex";
        setTimeout(function(){
            instructions.style.display = "none";
            gameContainer.style.display = "block";
            createMaze();
        }, 2000);
    });

    setInterval(function(){
        for(var i=0;i<dots.length;i++){
            var dot=dots[i];
            var dotX=parseInt(dot.style.left);
            var dotY=parseInt(dot.style.top);
            if(playerX<dotX+10 && playerX+20>dotX && playerY<dotY+10 && playerY+20>dotY){
                dot.style.display="none";
                dots.splice(i,1);
                i--;
                score++;
                scoreText.innerHTML = score;

                if(score === 10 || score === 15){
                    triggerGlitch(false);
                }

                if(score === 20){
                    finalGlitch();
                }
            }
        }
    },50);

    function triggerGlitch(strong = false) {
        var duration = strong ? 400 : 900;
        var intensity = strong ? 70 : 20;

        for (var i = 0; i < gameContainer.children.length; i++) {
            var c = gameContainer.children[i];
            if (!c.classList.contains("dot") && c.id !== "player") {
                var offsetX = Math.random() * intensity - intensity / 2;
                var offsetY = Math.random() * intensity - intensity / 2;
                c.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            }
        }

        overlay.style.backgroundColor = `rgba(${randColor()},${randColor()},${randColor()},${Math.random() * 0.6})`;

        if (strong) {
            var newX = playerX + (Math.random() * intensity - intensity / 2);
            var newY = playerY + (Math.random() * intensity - intensity / 2);
            playerX = Math.max(0, Math.min(newX, gameContainer.offsetWidth - 20));
            playerY = Math.max(0, Math.min(newY, gameContainer.offsetHeight - 20));
            player.style.left = playerX + "px";
            player.style.top = playerY + "px";
        }

        if (!strong) {
            setTimeout(function () {
                overlay.style.backgroundColor = "rgba(0,0,0,0)";
                for (var i = 0; i < gameContainer.children.length; i++) {
                    var c = gameContainer.children[i];
                    if (!c.classList.contains("dot") && c.id !== "player") {
                        c.style.transform = "translate(0,0)";
                    }
                }
            }, duration);
        }
    }

    function finalGlitch() {
        var flashDuration = 5000;
        var flashInterval = setInterval(function() {
            overlay.style.backgroundColor = "rgba("+randColor()+","+randColor()+","+randColor()+","+(Math.random()*0.8+0.2)+")";

            for(var j=0;j<gameContainer.children.length;j++){
                var c = gameContainer.children[j];
                if(Math.random()>0.5){
                    var offsetX = Math.random()*100-50;
                    var offsetY = Math.random()*100-50;
                    c.style.left = Math.max(0, Math.min(parseInt(c.style.left||0)+offsetX, gameContainer.offsetWidth-40))+"px";
                    c.style.top = Math.max(0, Math.min(parseInt(c.style.top||0)+offsetY, gameContainer.offsetHeight-40))+"px";
                    c.style.backgroundColor="rgb("+randColor()+","+randColor()+","+randColor()+")";
                }
            }

            var newX = playerX + (Math.random()*50-25);
            var newY = playerY + (Math.random()*50-25);
            playerX = Math.max(0, Math.min(newX, gameContainer.offsetWidth-20));
            playerY = Math.max(0, Math.min(newY, gameContainer.offsetHeight-20));
            player.style.left = playerX + "px";
            player.style.top = playerY + "px";

        },50);

        setTimeout(function(){
            clearInterval(flashInterval);
            overlay.style.backgroundColor = "rgba(0,0,0,0)";
            gameOver = true;

            document.body.innerHTML="";
            var errorMsg = document.createElement("div");
            errorMsg.style.width="50vw";
            errorMsg.style.height="50vh";
            errorMsg.style.backgroundColor="black";
            errorMsg.style.color="white";
            errorMsg.style.display="flex";
            errorMsg.style.flexDirection="column";
            errorMsg.style.alignItems="center";
            errorMsg.style.justifyContent="center";
            errorMsg.style.fontSize="48px";
            errorMsg.innerText="Error. Code 101: Unexpected Glitch Detected.";
            document.body.appendChild(errorMsg);

            setTimeout(function(){
                var replayBtn = document.createElement("button");
                replayBtn.innerText = "REPLAY";
                replayBtn.style.marginTop = "40px";
                replayBtn.style.padding = "10px 40px";
                replayBtn.style.fontSize = "24px";
                replayBtn.style.cursor = "pointer";
                replayBtn.style.backgroundColor = "white";
                replayBtn.style.color = "black";
                replayBtn.style.border = "none";
                errorMsg.appendChild(replayBtn);

                replayBtn.addEventListener("click",function(){location.reload();});
            },5000);

        }, flashDuration);
    }
});

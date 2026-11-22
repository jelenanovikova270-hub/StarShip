
const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;

const player = {
    x: width / 2 - 16,
    y: height - 64,
    w: 32,
    h: 32,
    speed: 280
};
const keys = {};
let lastTime = 0;
let bullets = [];
let shotTimer = 0;

let enemies = [];
let enemyTimer = 0;

let score = 0;

let lives = 3;
let gameOver = false;
let paused = false;

function overlaps(a, b) {
    return a.x < b.x + b.w &&
           a.x + a.w > b.x &&
           a.y < b.y + b.h &&
           a.y + a.h > b.y;
}


// Joonistame tausta
function drawSpace() {
    ctx.fillStyle = "#080d22";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#7185ad";
    for (let i = 0; i < 65; i++) {
        const x = (i * 137 + 23) % width;
        const y = (i * 97 + 41) % height;
        ctx.fillRect(x, y, 2, 2);
    }
}

// Joonistame kosmoselaeva
function drawPlayer() 
{
    ctx.fillStyle = "#73eed8";
    ctx.fillRect(player.x + 12, player.y, 8, 8);
    ctx.fillRect(player.x + 8, player.y + 8, 16, 16);
    ctx.fillRect(player.x, player.y + 20, 32, 12);

    ctx.fillStyle = "#e7fbff";
    ctx.fillRect(player.x + 12, player.y + 10, 8, 10);

    ctx.fillStyle = "#ffbd69";
    ctx.fillRect(player.x + 4, player.y + 32, 6, 8);
    ctx.fillRect(player.x + 22, player.y + 32, 6, 8);
}

function draw() {
    drawSpace();
    drawPlayer();
ctx.fillStyle = "#ffdc83";
for (const bullet of bullets) {
    ctx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h);

}

for (const enemy of enemies) {
    ctx.fillStyle = "#ff6888";
    ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h - 6);
    ctx.fillRect(enemy.x - 3, enemy.y + 5, 34, 8);

    ctx.fillStyle = "#080d22";
    ctx.fillRect(enemy.x + 5, enemy.y + 8, 5, 5);
    ctx.fillRect(enemy.x + 18, enemy.y + 8, 5, 5);
}

ctx.fillStyle = "#e4f7ff";
ctx.font = "18px monospace";
ctx.fillText("PUNKTID: " + score, 18, 30);

ctx.fillText("ELUD: " + lives, 18, 55);

if (gameOver) {
    ctx.fillStyle = "#ffffff";
    ctx.font = "36px monospace";
    ctx.textAlign = "center";
    ctx.fillText("MÄNG LÄBI!", width / 2, height / 2);
    ctx.textAlign = "left";
}

if (paused && !gameOver) {
    ctx.fillStyle = "#ffffff";
    ctx.font = "36px monospace";
    ctx.textAlign = "center";
    ctx.fillText("PAUS", width / 2, height / 2);
    ctx.textAlign = "left";
}

}

document.addEventListener("keydown", (event) => {
    if (["ArrowLeft", "ArrowRight", "Space"].includes(event.code)) {
        event.preventDefault();
    }


if (event.code === "KeyP" && !event.repeat && !gameOver) {
    paused = !paused;
}
if (event.code === "KeyR" && gameOver && !event.repeat) {
    score = 0;
    lives = 3;
    gameOver = false;
    paused = false;
    bullets = [];
    enemies = [];
    shotTimer = 0;
    enemyTimer = 0;
    player.x = width / 2 - player.w / 2;
    player.y = height - 64;
}

    keys[event.code] = true;
});

document.addEventListener("keyup", (event) => {
    keys[event.code] = false;
});

window.addEventListener("blur", () => {
    for (const code in keys) keys[code] = false;
});


function update(dt) {
    if (keys.ArrowLeft || keys.KeyA) {
        player.x -= player.speed * dt;
}
    if (keys.ArrowRight || keys.KeyD) {
        player.x += player.speed * dt;
    }

    player.x = Math.max(
        0,
        Math.min(width - player.w, player.x)
);

shotTimer -= dt;

if (keys.Space && shotTimer <= 0) {
    bullets.push({
        x: player.x + 14,
        y: player.y,
        w: 4,
        h: 14
    });
    shotTimer = 0.22;
}

for (const bullet of bullets) {
    bullet.y -= 430 * dt;
}

bullets = bullets.filter(
    (bullet) => bullet.y + bullet.h > 0
);
 
enemyTimer -= dt;

if (enemyTimer <= 0) {
    enemies.push({
        x: Math.random() * (width - 28),
        y: -28,
        w: 28,
        h: 28
    });
    enemyTimer = 0.9;
}

for (const enemy of enemies) {
    enemy.y += 110 * dt;
}

enemies = enemies.filter(
    (enemy) => enemy.y < height
);

for (let i = enemies.length - 1; i >= 0; i--) {
    for (let j = bullets.length - 1; j >= 0; j--) {
        if (overlaps(enemies[i], bullets[j])) {
            enemies.splice(i, 1);
            bullets.splice(j, 1);
            score += 10;
            break;
        }
    }
}

for (let i = enemies.length - 1; i >= 0; i--) {
    if (overlaps(player, enemies[i])) {
        enemies.splice(i, 1);
        lives -= 1;

        if (lives <= 0) {
            gameOver = true;
        }
    }
}
  
}


function loop(time) {
    const dt = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;

   
if (!gameOver && !paused) {
    update(dt);
}
 
    draw();

    requestAnimationFrame(loop);

}

requestAnimationFrame(loop);


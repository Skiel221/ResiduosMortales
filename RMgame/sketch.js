// Variables globales
let player;
let platforms = [];
let enemies = [];
let gameState = "playing"; // playing, paused, gameOver

// Precarga de assets
function preload() {
    // Cargar imágenes
    playerSprite = loadImage('assets/images/characters/player.png');
    enemySprite = loadImage('assets/images/characters/enemy.png');
    platformSprite = loadImage('assets/images/tiles/platform.png');
    
    // Cargar sonidos
    jumpSound = loadSound('assets/sounds/sfx/jump.wav');
    backgroundMusic = loadSound('assets/sounds/music/theme.mp3');
}

// Configuración inicial
function setup() {
    createCanvas(800, 600);
    
    // Inicializar jugador
    player = new Player(width / 2, height / 2, playerSprite);
    
    // Crear plataformas
    platforms.push(new Platform(100, 500, 200, 30, platformSprite));
    platforms.push(new Platform(400, 400, 200, 30, platformSprite));
    
    // Crear enemigos
    enemies.push(new Enemy(300, 470, enemySprite));
    
    // Iniciar música
    SoundManager.playBackgroundMusic();
}

// Bucle principal
function draw() {
    background(135, 206, 235); // Color de cielo
    
    // Actualizar y dibujar plataformas
    for (let platform of platforms) {
        platform.update();
        platform.draw();
    }
    
    // Actualizar y dibujar enemigos
    for (let enemy of enemies) {
        enemy.update();
        enemy.draw();
        
        // Detectar colisiones con jugador
        if (player.collidesWith(enemy)) {
            gameState = "gameOver";
        }
    }
    
    // Actualizar y dibujar jugador
    player.update();
    player.draw();
    
    // Aplicar gravedad y verificar colisiones con plataformas
    player.applyGravity();
    for (let platform of platforms) {
        if (player.collidesWith(platform)) {
            player.onCollision(platform);
        }
    }
    
    // Dibujar UI
    drawUI();
}

// Dibujar interfaz de usuario
function drawUI() {
    push();
    fill(0);
    textSize(20);
    text(`Puntuación: ${player.score}`, 20, 30);
    
    if (gameState === "gameOver") {
        textSize(40);
        textAlign(CENTER, CENTER);
        text("GAME OVER", width / 2, height / 2);
        textSize(20);
        text("Presiona R para reiniciar", width / 2, height / 2 + 50);
    }
    pop();
}

// Manejo de teclas
function keyPressed() {
    InputManager.keyPressed(keyCode);
    
    if (keyCode === 82 && gameState === "gameOver") { // Tecla R
        resetGame();
    }
}

function keyReleased() {
    InputManager.keyReleased(keyCode);
}

// Reiniciar juego
function resetGame() {
    player.reset();
    gameState = "playing";
    
    // Reiniciar enemigos
    for (let enemy of enemies) {
        enemy.reset();
    }
}
// Variables globales
let player;
let platforms = [];
let playerSprite;
let platformSprite;

// Precarga de assets
function preload() {
    // Cargar imágenes
    playerSprite = loadImage('assets/images/characters/player.png');
    platformSprite = loadImage('assets/images/tiles/platform.png');
}

// Configuración inicial
function setup() {
    createCanvas(1000, 600);
    
    // Inicializar jugador
    player = new Player(width / 2, height / 2, playerSprite);
    
    // Crear un piso plano en la parte inferior
    platforms.push(new Platform(0, height - 50, width, 50, platformSprite));
}

// Bucle principal
function draw() {
    background(135, 206, 235); // Color de cielo
    
    // Actualizar y dibujar plataformas
    for (let platform of platforms) {
        platform.update();
        platform.draw();
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
}

// Manejo de teclas
function keyPressed() {
    // Flecha arriba para saltar
    if (keyCode === UP_ARROW) {
        if (player.isGrounded) {
            player.jump();
        }
    }
    
    // Tecla R para reiniciar (si lo necesitas)
    if (keyCode === 82) { // Tecla R
        player.reset();
    }
    
    // Guardar el estado de la tecla para movimiento continuo
    if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
        InputManager.keyPressed(keyCode);
    }
}

function keyReleased() {
    // Liberar el estado de la tecla
    if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
        InputManager.keyReleased(keyCode);
    }
}
// Variables globales
let player;
let platforms = [];
let playerSprite;
let platformSprite;
let enemy;
let enemySprite;


// Matter.js variables
let Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Body = Matter.Body;

let engine;
let world;

// Precarga de assets
function preload() {
    // Cargar imágenes
    playerSprite = loadImage('assets/images/characters/player.png');
    platformSprite = loadImage('assets/images/tiles/platform.png');
    enemySprite = loadImage('assets/images/characters/enemy.png');
}

// Configuración inicial
function setup() {
    createCanvas(800, 600);
    
    // Crear motor de Matter.js
    engine = Engine.create();
    world = engine.world;
    
    // Configurar gravedad más baja para un salto más controlable
    engine.world.gravity.y = 1.2;
    
    // Inicializar jugador con Matter.js
    player = new Player(width / 2, 300, playerSprite);
    
    // Crear plataformas con Matter.js
    platforms.push(new Platform(0, height - 25, width, 50, platformSprite, true)); // piso estático
    platforms.push(new Platform(100, 400, 200, 30, platformSprite, true));
    platforms.push(new Platform(400, 300, 200, 30, platformSprite, true));

    enemy = new Enemy(500, 250, enemySprite, { width: 50, height: 70, speed: 1.6, patrolRange: 100 });
    
    // Ejecutar el motor
    Runner.run(engine);
}

// Bucle principal
function draw() {
    background(135, 206, 235); // Color de cielo
    
    // Actualizar el jugador (para manejar input)
    player.update();
    
    // Dibujar plataformas
    for (let platform of platforms) {
        platform.draw();
    }
    
    // Dibujar jugador
    player.draw();

    if (enemy) {
        enemy.update();
        enemy.draw();
    }   
    
    // Dibujar información de depuración
    drawDebugInfo();
}

// Dibujar información de depuración
function drawDebugInfo() {
    push();
    fill(0);
    textSize(16);
    text(`Posición: (${Math.round(player.body.position.x)}, ${Math.round(player.body.position.y)})`, 10, 20);
    text(`Velocidad: (${Math.round(player.body.velocity.x)}, ${Math.round(player.body.velocity.y)})`, 10, 40);
    text(`En suelo: ${player.isGrounded()}`, 10, 60);
    pop();
}

// Manejo de teclas
function keyPressed() {
    // Flecha arriba para saltar
    if (keyCode === UP_ARROW && player.isGrounded()) {
        player.jump();
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

function keyPressed() {
    // Flecha arriba para saltar
    if (keyCode === UP_ARROW && player.isGrounded()) {
        player.jump();
    }

    // Dash con C (mayúscula o minúscula)
    if (key === 'c' || key === 'C') {
        player.dash();
    }

    // Guardar el estado de la tecla para movimiento continuo
    if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
        InputManager.keyPressed(keyCode);
    }
}

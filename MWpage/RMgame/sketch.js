// Variables globales
let player;
let platforms = [];
let playerSprite;
let platformSprite;
let enemy;
let enemySprite;
let gasMask;
let gasMaskSprite;
let keyItem;
let keyItemSprite;
let finalDoor;
let finalDoorSprite;
let score;

// Variables de cámara
let camera = {
    x: 0,
    y: 0
};

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
    backgroundSprite = loadImage('assets/images/backgrounds/fondo1.png');
    gasMaskSprite = loadImage('assets/images/items/gas-mask.png');
    keyItemSprite = loadImage('assets/images/items/ItemPrimary.png');
    finalDoorSprite = loadImage('assets/animations/FinalDoor.gif');
}

// Configuración inicial
function setup() {
    createCanvas(800, 600);

    // Crear motor de Matter.js
    engine = Engine.create();
    world = engine.world;

    // Configurar gravedad más baja para un salto más controlable
    engine.world.gravity.y = 1.2;

    // Inicializar jugador con Matter.js en el centro del nivel
    player = new Player(LEVEL_WIDTH / 2, 300, playerSprite);

    // Crear plataformas con Matter.js
    platforms.push(new Platform(0, LEVEL_HEIGHT - 25, LEVEL_WIDTH, 50, platformSprite, true)); // piso estático que cubre todo el nivel
    platforms.push(new Platform(100, 400, 200, 30, platformSprite, true));
    platforms.push(new Platform(400, 300, 200, 30, platformSprite, true));
    platforms.push(new Platform(800, 350, 200, 30, platformSprite, true));
    platforms.push(new Platform(1200, 250, 200, 30, platformSprite, true));
    platforms.push(new Platform(1600, 400, 200, 30, platformSprite, true));
    platforms.push(new Platform(2000, 300, 200, 30, platformSprite, true));

    enemy = new Enemy(500, 250, enemySprite, { width: 65, height: 90, speed: 1.6, patrolRange: 100 });

    // Crear la máscara después de crear el jugador
    gasMask = new GasMask(
        LEVEL_WIDTH/3,     // x: un tercio del nivel
        LEVEL_HEIGHT-50,  // y: un poco arriba del suelo
        gasMaskSprite, 
        {
            width: 44,
            height: 44,
            effectDuration: 12,    // duración del efecto en segundos
            drainMultiplier: 0.2   // reduce el drain rate al 20%
        }
    );

    keyItem = new ItemPrimary(
        Math.min(LEVEL_WIDTH - 200, 900),
        LEVEL_HEIGHT - 90,
        keyItemSprite,
        { width: 44, height: 44 }
    );

    finalDoor = new Final(
        LEVEL_WIDTH - 180,
        LEVEL_HEIGHT - 125,
        finalDoorSprite,
        { width: 80, height: 100 }
    );

    score = new Score(0);
    score.start();

    // Ejecutar el motor    
    Runner.run(engine);
}

// Bucle principal
function draw() {
    // Actualizar la cámara para seguir al jugador
    updateCamera();
    
    // Aplicar transformación de cámara
    push();
    translate(-camera.x, -camera.y);
    
    // Dibujar fondo con repetición para cubrir todo el nivel
    for (let x = 0; x < LEVEL_WIDTH; x += 1000) {
        image(backgroundSprite, x, 0, 1000, LEVEL_HEIGHT);
    }

    player.update();

    // Dibujar plataformas
    for (let platform of platforms) {
        platform.draw();
    }

    if (gasMask) {
        gasMask.update(player);
        gasMask.draw();
    }

    if (keyItem) {
        keyItem.update(player);
        keyItem.draw();
    }

    // Dibujar jugador
    player.draw();

    if (enemy) {
        enemy.update();
        enemy.draw();
    }

    if (finalDoor) {
        finalDoor.update(player, keyItem && keyItem.collected, score);
        finalDoor.draw(score);
    }
    
    // Restablecer transformación para UI
    pop();

    // Dibujar información de depuración (sin transformación de cámara)
    drawDebugInfo();
}

// Actualizar cámara para seguir al jugador
function updateCamera() {
    // Seguir al jugador horizontalmente
    camera.x = player.body.position.x - width / 2;
    
    // Limitar la cámara para no salir de los límites del nivel
    camera.x = constrain(camera.x, 0, LEVEL_WIDTH - width);
    camera.y = 0; // No seguir verticalmente por ahora
}

// Dibujar información de depuración
function drawDebugInfo() {
    push();
    fill(255, 255, 255, 200);
    rect(10, 10, 200, 80);
    fill(0);
    textSize(14);
    text(`Posición: (${Math.round(player.body.position.x)}, ${Math.round(player.body.position.y)})`, 15, 30);
    text(`Velocidad: (${Math.round(player.body.velocity.x)}, ${Math.round(player.body.velocity.y)})`, 15, 50);
    text(`En suelo: ${player.isGrounded()}`, 15, 70);
    text(`Cámara X: ${Math.round(camera.x)}`, 15, 90);
    pop();
}

// Manejo de teclas
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

function keyReleased() {
    // Liberar el estado de la tecla
    if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
        InputManager.keyReleased(keyCode);
    }
}

// Variables globales
let player;
let platforms = [];
let playerSprite;
let platformSprite;
let enemy;
let enemySprite;
let gasMask;
let gasMask2;
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

    // Inicializar jugador según boceto: bloque verde al inicio (suelo)
    // Altura: colocar al borde superior del suelo (suelo ~ y=550, player alto=64 => centro ~518)
    player = new Player(40, 520, playerSprite);

    // Segmentos de suelo (centros y tamaños)
    //(Posicion Eje X, Posicion Eje Y, Ancho, Alto, Sprite, Es Movible)
    platforms.push(new Platform(0, (LEVEL_HEIGHT - 25), 300, 50, platformSprite, true));
    platforms.push(new Platform(550, (LEVEL_HEIGHT - 25), 180, 50, platformSprite, true));
    platforms.push(new Platform(1000, (LEVEL_HEIGHT - 25), 220, 50, platformSprite, true));
    platforms.push(new Platform(1150, (LEVEL_HEIGHT - 25), 160, 50, platformSprite, true));
    platforms.push(new Platform(1500, (LEVEL_HEIGHT - 25), 220, 50, platformSprite, true));
    platforms.push(new Platform(1900, (LEVEL_HEIGHT - 25), 250, 50, platformSprite, true));
    platforms.push(new Platform(2250, (LEVEL_HEIGHT - 140), 360, 50, platformSprite, true));
    // Escalón cerca de la puerta
    platforms.push(new Platform(1820, (LEVEL_HEIGHT - 25) - 60, 80, 20, platformSprite, true));
    // Plataformas elevadas
    platforms.push(new Platform(550, 320, 180, 30, platformSprite, true));
    platforms.push(new Platform(1550, 320, 220, 30, platformSprite, true));
    platforms.push(new Platform(2000, 320, 240, 30, platformSprite, true));

    // Enemy según boceto (bloque rojo en suelo, zona media)
    enemy = new Enemy(1100, 505, enemySprite, { width: 65, height: 90, speed: 1.6, patrolRange: 120 });

    // Crear la máscara después de crear el jugador
    // GasMask según boceto: dos círculos amarillos sobre plataformas elevadas
    gasMask = new GasMask(
        600,     // centro de plataforma elevada izquierda
        300,     // un poco por encima de la plataforma
        gasMaskSprite,
        {
            width: 44,
            height: 44,
            effectDuration: 12,
            drainMultiplier: 0.2
        }
    );
    gasMask2 = new GasMask(
        2000,   // plataforma elevada derecha
        280,
        gasMaskSprite,
        {
            width: 44,
            height: 44,
            effectDuration: 12,
            drainMultiplier: 0.2
        }
    );

    // ItemPrimary (círculo violeta) sobre plataforma elevada central
    keyItem = new ItemPrimary(
        1550,
        260,
        keyItemSprite,
        { width: 44, height: 44 }
    );

    // Puerta final (bloque azul) en el suelo hacia la derecha
    finalDoor = new Final(
        1800,
        450, // suelo (top ~550) menos altura puerta (100)
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
    if (gasMask2) {
        gasMask2.update(player);
        gasMask2.draw();
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

// Manejo de clic del mouse para el botón "Ver Puntuación"
function mousePressed() {
    if (finalDoor && typeof finalDoor.handleMousePressed === 'function') {
        finalDoor.handleMousePressed(mouseX, mouseY);
    }
}

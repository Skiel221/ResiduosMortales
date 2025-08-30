// Constantes del juego
const GRAVITY = 0.5;
const PLAYER_SPEED = 5;
const PLAYER_JUMP_FORCE = 15;

// Estados del juego
const GAME_STATES = {
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'gameOver'
};

// Capas para orden de dibujado
const LAYERS = {
    BACKGROUND: 0,
    PLATFORMS: 1,
    PLAYER: 2,
    ENEMIES: 3,
    UI: 4
};
class InputManager {
    static keyPressed(keyCode) {
        this.keys[keyCode] = true;
    }
    
    static keyReleased(keyCode) {
        this.keys[keyCode] = false;
    }
    
    static isKeyDown(keyCode) {
        return this.keys[keyCode] || false;
    }
}

// Inicializar objeto de teclas
InputManager.keys = {};
class Player {
    constructor(x, y, sprite) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.width = 50;
        this.height = 50;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 5;
        this.jumpForce = 15;
        this.isGrounded = false;
        this.facing = 1; // 1 derecha, -1 izquierda
    }
    
    update() {
        // Movimiento horizontal con flechas
        if (InputManager.isKeyDown(LEFT_ARROW)) {
            this.velocityX = -this.speed;
            this.facing = -1;
        } else if (InputManager.isKeyDown(RIGHT_ARROW)) {
            this.velocityX = this.speed;
            this.facing = 1;
        } else {
            this.velocityX = 0;
        }
        
        // Aplicar movimiento
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Limitar al área de juego (horizontalmente)
        this.x = constrain(this.x, 0, width - this.width);
        
        // Prevenir que salga por debajo de la pantalla
        if (this.y > height) {
            this.y = 0; // Teletransportar arriba (o puedes reiniciar)
        }
    }
    
    applyGravity() {
        if (!this.isGrounded) {
            this.velocityY += 0.5; // Gravedad
        }
        
        // Limitar velocidad de caída
        this.velocityY = constrain(this.velocityY, -this.jumpForce, 20);
    }
    
    jump() {
        this.velocityY = -this.jumpForce;
        this.isGrounded = false;
    }
    
    draw() {
        // Dibujar el sprite del jugador
        if (this.sprite) {
            push();
            // Voltear sprite según dirección
            if (this.facing === -1) {
                scale(-1, 1);
                image(this.sprite, -this.x - this.width, this.y, this.width, this.height);
            } else {
                image(this.sprite, this.x, this.y, this.width, this.height);
            }
            pop();
        } else {
            // Dibujo simple si no hay sprite
            fill(255, 0, 0);
            rect(this.x, this.y, this.width, this.height);
        }
    }
    
    collidesWith(object) {
        return (
            this.x < object.x + object.width &&
            this.x + this.width > object.x &&
            this.y < object.y + object.height &&
            this.y + this.height > object.y
        );
    }
    
    onCollision(platform) {
        // Colisión desde arriba
        if (this.y + this.height <= platform.y + 10 && this.velocityY > 0) {
            this.y = platform.y - this.height;
            this.velocityY = 0;
            this.isGrounded = true;
        }
    }
    
    reset() {
        this.x = width / 2;
        this.y = height / 2;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isGrounded = false;
    }
}
class Player {
    constructor(x, y, sprite) {
        this.sprite = sprite;
        this.width = 32;
        this.height = 64;

        // Crear el cuerpo físico con Matter.js
        this.body = Bodies.rectangle(x, y, this.width, this.height, {
            friction: 0,
            restitution: 0, // Reducir rebote
            density: 0.1,     // Aumentar densidad para menos flotabilidad
            inertia: Infinity, // Prevenir rotación
            frictionAir: 0 // Muy poca fricción en el aire para mejor control
        });

        // Añadir el cuerpo al mundo
        Composite.add(engine.world, this.body);

        this.speed = .6;    // Velocidad reducida para mejor control
        this.jumpForce = 8;   // Fuerza de salto reducida
        this.facing = 1;      // 1 derecha, -1 izquierda
        this.canJump = true;
        this.jumpCooldown = 0;
    }

    update() {
        // Movimiento horizontal con flechas
        if (InputManager.isKeyDown(LEFT_ARROW)) {
            Body.applyForce(this.body, this.body.position, {
                x: -this.speed,
                y: 0
            });
            this.facing = -1;
        } else if (InputManager.isKeyDown(RIGHT_ARROW)) {
            Body.applyForce(this.body, this.body.position, {
                x: this.speed,
                y: 0
            });
            this.facing = 1;
        }

        // Limitar velocidad horizontal para mejor control
        if (Math.abs(this.body.velocity.x) > 5) {
            Body.setVelocity(this.body, {
                x: 5 * Math.sign(this.body.velocity.x),
                y: this.body.velocity.y
            });
        }

        // Controlar el enfriamiento del salto
        if (this.jumpCooldown > 0) {
            this.jumpCooldown--;
        } else if (!this.isGrounded()) {
            this.canJump = false;
        } else {
            this.canJump = true;
        }

        // Prevenir que el jugador salga de los límites horizontales
        if (this.body.position.x < this.width / 2) {
            Body.setPosition(this.body, {
                x: this.width / 2,
                y: this.body.position.y
            });
        } else if (this.body.position.x > width - this.width / 2) {
            Body.setPosition(this.body, {
                x: width - this.width / 2,
                y: this.body.position.y
            });
        }
        if (InputManager.isKeyDown(LEFT_ARROW)) {
            Body.applyForce(this.body, this.body.position, { x: -this.speed, y: 0 });
            this.facing = -1;
        } else if (InputManager.isKeyDown(RIGHT_ARROW)) {
            Body.applyForce(this.body, this.body.position, { x: this.speed, y: 0 });
            this.facing = 1;
        } else {
            // Si no hay teclas, frenar
            Body.setVelocity(this.body, {
                x: 0,
                y: this.body.velocity.y
            });
        }
    }

    jump() {
        if (this.canJump) {
            // Aplicar un impulso vertical controlado
            Body.setVelocity(this.body, {
                x: this.body.velocity.x,
                y: -this.jumpForce
            });
            this.canJump = false;
            this.jumpCooldown = 10; // Pequeño cooldown para evitar saltos múltiples
        }
    }

    isGrounded() {
        // Verificar si el jugador está cerca del suelo
        return this.body.position.y > height - 100;
    }

    draw() {
        // Obtener la posición del cuerpo
        let pos = this.body.position;

        // Dibujar el sprite del jugador
        push();
        translate(pos.x, pos.y);

        // Voltear sprite según dirección
        if (this.facing === -1) {
            scale(-1, 1);
            image(this.sprite, -this.width / 2, -this.height / 2, this.width, this.height);
        } else {
            image(this.sprite, -this.width / 2, -this.height / 2, this.width, this.height);
        }
        pop();

        // Dibujar hitbox para depuración (puedes eliminar esto después)
        noFill();
        stroke(255, 0, 0);
        rectMode(CENTER);
        rect(pos.x, pos.y, this.width, this.height);
        rectMode(CORNER);
    }
}
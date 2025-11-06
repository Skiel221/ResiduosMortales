class Enemy {
    /**
     * @param {number} x - posición inicial x
     * @param {number} y - posición inicial y
     * @param {p5.Image} sprite - imagen del enemigo
     * @param {object} opts - opciones: width, height, speed, patrolRange, isStatic
     */
    constructor(x, y, sprite, opts = {}) {
        this.sprite = sprite;
        this.width = opts.width || 32;
        this.height = opts.height || 48;
        this.speed = opts.speed || 1.2; // velocidad de patrulla
        this.patrolRange = opts.patrolRange || 150; // distancia desde x inicial
        this.startX = x;
        this.facing = 1; // 1 = derecha, -1 = izquierda

        // Límites de patrulla
        this.minX = this.startX - this.patrolRange / 2;
        this.maxX = this.startX + this.patrolRange / 2;

        // Crear cuerpo físico (dinámico por defecto; si querés estático pasá isStatic: true)
        this.body = Bodies.rectangle(x, y, this.width, this.height, {
            friction: 0.2,
            restitution: 0,
            density: 0.001,
            inertia: Infinity, // no rotar
            frictionAir: 0.02,
            isStatic: !!opts.isStatic
        });

        Composite.add(engine.world, this.body);

        // Para controlar el "patrol" suavemente
        this._targetVel = this.speed;
    }

    update() {
        // Si es estático no hacemos update de movimiento
        if (this.body.isStatic) return;

        // Patrulla: si alcanza límites, invertir dirección
        const posX = this.body.position.x;
        if (posX <= this.minX + 1) {
            this.facing = 1;
        } else if (posX >= this.maxX - 1) {
            this.facing = -1;
        }

        // Forzar velocidad horizontal pequeña (no usar applyForce para control directo)
        Body.setVelocity(this.body, {
            x: this.facing * this.speed,
            y: this.body.velocity.y
        });

        // Evitar que salga del canvas
        if (this.body.position.x < this.width / 2) {
            Body.setPosition(this.body, { x: this.width / 2, y: this.body.position.y });
            this.facing = 1;
        } else if (this.body.position.x > width - this.width / 2) {
            Body.setPosition(this.body, { x: width - this.width / 2, y: this.body.position.y });
            this.facing = -1;
        }
    }

    draw() {
        const pos = this.body.position;

        push();
        translate(pos.x, pos.y);

        // Voltear sprite según facing
        if (this.facing === -1) {
            scale(-1, 1);
            image(this.sprite, -this.width / 2, -this.height / 2, this.width, this.height);
        } else {
            image(this.sprite, -this.width / 2, -this.height / 2, this.width, this.height);
        }

        pop();

        // Hitbox para debug
        noFill();
        stroke(0, 0, 255);
        rectMode(CENTER);
        rect(pos.x, pos.y, this.width, this.height);
        rectMode(CORNER);
    }

    // opcional: método para hacer daño, morir, etc.
    takeDamage(amount) {
        // placeholder
        console.log('Enemy hit:', amount);
    }
}

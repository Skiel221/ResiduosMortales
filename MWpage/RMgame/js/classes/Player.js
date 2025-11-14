class Player {
    constructor(x, y, sprite) {
        this.sprite = sprite;
        this.width = 32;
        this.height = 64;

        // Crear el cuerpo físico con Matter.js
        this.body = Bodies.rectangle(x, y, this.width, this.height, {
            friction: .08,
            restitution: 0,
            density: 0.1,
            inertia: Infinity,
            frictionAir: 0,
            collisionFilter: { category: 0x0001, mask: 0x0002 }
        });
        this.body.label = 'player';
        this.footSensor = Bodies.rectangle(x, y + this.height / 2 + 4, this.width * 0.9, 6, { isSensor: true, collisionFilter: { category: 0x0004, mask: 0x0002 } });
        this.footSensor.label = 'player_foot_sensor';

        // Añadir el cuerpo al mundo
        Composite.add(engine.world, this.body);
        Composite.add(engine.world, this.footSensor);

        // Parámetros originales tuyos (no tocados)
        this.speed = .6; // mantenido para compatibilidad
        this.runVelocity = 5;
        this.jumpForce = 10;
        this.facing = 1;
        this.canJump = true;
        this.jumpCooldown = 0;

        // --- Propiedades del dash (añadidas) ---
        this.isDashing = false;
        this.dashSpeed = 12;
        this.dashDurationMs = 10 * (1000 / 60);
        this.dashTimerMs = 0;
        this.dashCooldownMs = 30 * (1000 / 60);
        this.dashCooldownTimerMs = 0;
        this.onlyGroundDash = false;
        this._savedFrictionAir = this.body.frictionAir;

        // --- Sistema de vida ---
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.healthDrainRate = 2; // puntos por segundo
        this.alive = true;

        // Opcional: callback para cuando muere (puedes sobrescribirlo)
        this.onDeath = () => {
            // por defecto dejamos el cuerpo estático y lo "congelamos"
            try {
                Body.setVelocity(this.body, { x: 0, y: 0 });
                Body.setStatic(this.body, true);
            } catch (e) {
                // si Body no está disponible por alguna razón, ignorar
            }
        };
        this.groundContacts = 0;
    }

    update() {
        // Si está muerto no procesamos inputs ni físicas (puedes cambiar esto)
        if (!this.alive) {
            // aún dibujaremos la barra de vida en draw()
            return;
        }

        Body.setPosition(this.footSensor, { x: this.body.position.x, y: this.body.position.y + this.height / 2 + 2 });

        // Reducir cooldowns
        const dt = (typeof deltaTime !== 'undefined') ? deltaTime : (1000 / 60);
        if (this.jumpCooldownMs > 0) this.jumpCooldownMs = Math.max(0, this.jumpCooldownMs - dt);
        if (this.dashCooldownTimerMs > 0) this.dashCooldownTimerMs = Math.max(0, this.dashCooldownTimerMs - dt);

        // --- Drenado de vida por tiempo ---
        // deltaTime es el tiempo en ms desde el último frame (p5)
        // restamos healthDrainRate * segundos transcurridos
        if (typeof deltaTime !== 'undefined') {
            this.health -= this.healthDrainRate * (deltaTime / 1000);
        } else {
            // fallback si no existe deltaTime (no debería pasar)
            this.health -= this.healthDrainRate / 60;
        }
        if (this.health <= 0 && this.alive) {
            this.health = 0;
            this.alive = false;
            this.handleDeath();
        }
        if (this.health > this.maxHealth) this.health = this.maxHealth;

        // Si estamos en dash, forzamos la velocidad y manejamos el timer
        if (this.isDashing) {
            Body.setVelocity(this.body, {
                x: this.facing * this.dashSpeed,
                y: this.body.velocity.y
            });

            this.dashTimerMs -= dt;
            if (this.dashTimerMs <= 0) {
                this.endDash();
            }

        } else {
            // Movimiento horizontal con flechas (normal)
            if (InputManager.isKeyDown(LEFT_ARROW)) {
                Body.setVelocity(this.body, {
                    x: -this.runVelocity,
                    y: this.body.velocity.y
                });
                this.facing = -1;
            } else if (InputManager.isKeyDown(RIGHT_ARROW)) {
                Body.setVelocity(this.body, {
                    x: this.runVelocity,
                    y: this.body.velocity.y
                });
                this.facing = 1;
            } else {
                // Si no hay teclas, frenar (comportamiento que tenías)
                Body.setVelocity(this.body, {
                    x: 0,
                    y: this.body.velocity.y
                });
            }

            // Limitar velocidad horizontal para mejor control (no durante dash)
            if (Math.abs(this.body.velocity.x) > 5) {
                Body.setVelocity(this.body, {
                    x: 5 * Math.sign(this.body.velocity.x),
                    y: this.body.velocity.y
                });
            }
        }

        // Controlar el enfriamiento del salto / estado grounded
        if (this.jumpCooldownMs > 0) {
            // ya decrementado arriba
        } else if (!this.isGrounded()) {
            this.canJump = false;
        } else {
            this.canJump = true;
        }

        // Prevenir que el jugador salga de los límites horizontales del nivel
        if (this.body.position.x < this.width / 2) {
            Body.setPosition(this.body, {
                x: this.width / 2,
                y: this.body.position.y
            });
        } else if (this.body.position.x > LEVEL_WIDTH - this.width / 2) {
            Body.setPosition(this.body, {
                x: LEVEL_WIDTH - this.width / 2,
                y: this.body.position.y
            });
        }
    }

    jump() {
        if (this.canJump && this.alive) {
            Body.setVelocity(this.body, {
                x: this.body.velocity.x,
                y: -this.jumpForce
            });
            this.canJump = false;
            this.jumpCooldownMs = 10 * (1000 / 60);
        }
    }

    dash() {
        if (this.dashCooldownTimerMs > 0 || this.isDashing || !this.alive) return;
        if (this.onlyGroundDash && !this.isGrounded()) return;

        this.isDashing = true;
        this.dashTimerMs = this.dashDurationMs;
        this.dashCooldownTimerMs = this.dashCooldownMs;

        this._savedFrictionAir = this.body.frictionAir;
        this.body.frictionAir = 0;

        Body.setVelocity(this.body, {
            x: this.facing * this.dashSpeed,
            y: this.body.velocity.y
        });
    }

    endDash() {
        this.isDashing = false;
        this.body.frictionAir = this._savedFrictionAir;

        const maxAfterDash = 8;
        if (Math.abs(this.body.velocity.x) > maxAfterDash) {
            Body.setVelocity(this.body, {
                x: maxAfterDash * Math.sign(this.body.velocity.x),
                y: this.body.velocity.y
            });
        }
    }

    isGrounded() {
        const platforms = this.platformsRef || [];
        if (platforms.length === 0) return false;
        const bodies = platforms.map(p => p.body);
        const pairs = Matter.Query.collides(this.footSensor, bodies);
        return pairs.length > 0;
    }

    setPlatforms(platforms) {
        this.platformsRef = platforms;
    }
    attachGroundSensor(engine) {
        const Events = Matter.Events;
        const isFoot = (b) => b === this.footSensor;
        const isPlatform = (b) => b && b.label === 'platform';
        Events.on(engine, 'collisionStart', (evt) => {
            const pairs = evt.pairs || [];
            for (let i = 0; i < pairs.length; i++) {
                const a = pairs[i].bodyA;
                const b = pairs[i].bodyB;
                if ((isFoot(a) && isPlatform(b)) || (isFoot(b) && isPlatform(a))) {
                    this.groundContacts++;
                }
            }
        });
        Events.on(engine, 'collisionEnd', (evt) => {
            const pairs = evt.pairs || [];
            for (let i = 0; i < pairs.length; i++) {
                const a = pairs[i].bodyA;
                const b = pairs[i].bodyB;
                if ((isFoot(a) && isPlatform(b)) || (isFoot(b) && isPlatform(a))) {
                    this.groundContacts = Math.max(0, this.groundContacts - 1);
                }
            }
        });
    }

    // --- VIDA: métodos públicos ---
    takeDamage(amount) {
        if (!this.alive) return;
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.alive = false;
            this.handleDeath();
        }
    }

    heal(amount) {
        if (!this.alive) return;
        this.health += amount;
        if (this.health > this.maxHealth) this.health = this.maxHealth;
    }

    isAlive() {
        return this.alive;
    }

    handleDeath() {
        // Llamamos al callback y hacemos algunas cosas por defecto
        this.onDeath();
        // puedes añadir aquí animación de muerte, reproducir sonido, etc.
    }

    draw() {
        // Obtener la posición del cuerpo
        let pos = this.body.position;

        // Dibujar el sprite del jugador (si está vivo o no, lo mostramos diferente)
        push();
        translate(pos.x, pos.y);

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

        // --- HUD: barra de vida arriba a la izquierda ---
        this.drawHealthBar();
    }

    drawHealthBar() {
        // Usar coordenadas de cámara para que la barra siga la vista
        const camX = (typeof camera !== 'undefined') ? camera.x : 0;
        const camY = (typeof camera !== 'undefined') ? camera.y : 0;
        const x = camX + 12;
        const y = camY + 12;
        const barW = 200;
        const barH = 18;
        const padding = 2;
        // fondo de la barra
        push();
        noStroke();
        fill(50); // fondo oscuro
        rect(x - padding, y - padding, barW + padding * 2, barH + padding * 2, 4);

        // color según % vida
        const pct = this.health / this.maxHealth;
        if (pct > 0.5) {
            fill(0, 200, 0);
        } else if (pct > 0.25) {
            fill(230, 180, 0);
        } else {
            fill(200, 40, 40);
        }

        // barra de vida
        rect(x, y, Math.max(0, barW * pct), barH, 4);

        // borde
        noFill();
        stroke(0);
        strokeWeight(1);
        rect(x, y, barW, barH, 4);

        // puntos d e salud
        noStroke();
        fill(255);
        textSize(12);
        textAlign(RIGHT, CENTER);
        text(Math.round(this.health) + " / " + this.maxHealth, x + barW - 6, y + barH / 2);
        pop();
    }
}

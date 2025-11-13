class GasMask {
    constructor(x, y, sprite, options = {}) {
        this.sprite = sprite;
        this.width = options.width || 40;
        this.height = options.height || 40;

        this.effectDuration = options.effectDuration || 10; // segundos
        this.drainMultiplier = options.drainMultiplier || 0.2; // reduce a 20% del original

        // Cuerpo físico estático y sensor para detectar si querés usar colisiones de Matter
        this.body = Bodies.rectangle(x, y, this.width, this.height, {
            isStatic: true,
            isSensor: true
        });

        Composite.add(engine.world, this.body);

        this.collected = false;

        // Efecto sobre el jugador
        this.effectActive = false;
        this.effectEndTime = 0;
        this._originalDrainRate = null;

        // Para mostrar icono en HUD
        this.hudIconSize = 28;
        this.hudPadding = 8;
    }

    update(player) {
        // Si ya fue recogida y efecto expiró, no necesitamos actualizar más
        if (this.collected && !this.effectActive) return;

        // Si aún no se recogió, comprobar pickup por distancia simple
        if (!this.collected) {
            // aseguramos que player exista
            if (!player || !player.body) return;

            let dx = player.body.position.x - this.body.position.x;
            let dy = player.body.position.y - this.body.position.y;
            let distSq = dx * dx + dy * dy;
            // radio de pickup basado en tamaño de objetos
            let radius = (this.width + player.width) / 2 + 8; // +8 margen
            if (distSq < radius * radius) {
                this._onCollect(player);
            }
        } else {
            // si fue recogida y efecto activo, chequear expiración
            if (this.effectActive) {
                if (millis() >= this.effectEndTime) {
                    this._endEffect(player);
                }
            }
        }
    }

    _onCollect(player) {
        this.collected = true;

        // Curar completamente (comportamiento que ya tenías)
        if (player && typeof player.heal === 'function') {
            player.heal(player.maxHealth);
        }

        // Quitar cuerpo físico del mundo (ya en tu versión también lo hacías)
        try {
            Composite.remove(engine.world, this.body);
        } catch (e) {
            // si falla, no rompemos el juego
            // console.warn("No se pudo remover body de la mask:", e);
        }

        // Aplicar efecto: reducir healthDrainRate mientras dure
        if (player) {
            // Guardar valor original (si existe)
            this._originalDrainRate = (typeof player.healthDrainRate === 'number') ? player.healthDrainRate : null;

            if (this._originalDrainRate !== null) {
                player.healthDrainRate = this._originalDrainRate * this.drainMultiplier;
                player._maskApplied = true; // flag opcional
            } else {
                // Si no hay property, crearla (fallback)
                player.healthDrainRate = 0.0;
                player._maskApplied = true;
            }

            // activar efecto por tiempo
            this.effectActive = true;
            this.effectEndTime = millis() + this.effectDuration * 1000;
        }
    }

    _endEffect(player) {
        this.effectActive = false;

        // Restaurar drain rate si lo guardamos
        if (player && this._originalDrainRate !== null) {
            player.healthDrainRate = this._originalDrainRate;
            delete player._maskApplied;
        } else if (player) {
            // si no había original, establecer un valor por defecto razonable
            player.healthDrainRate = 2; // valor por defecto parecido al que tenías
            delete player._maskApplied;
        }
    }

    draw() {
        // Si no fue recogida, dibujar en el mapa
        if (!this.collected) {
            let pos = this.body.position;
            push();
            imageMode(CENTER);
            if (this.sprite) {
                image(this.sprite, pos.x, pos.y, this.width, this.height);
            } else {
                // fallback: dibujar un rect si no hay sprite
                noStroke();
                fill(120, 200, 255);
                rectMode(CENTER);
                rect(pos.x, pos.y, this.width, this.height, 6);
            }
            pop();

            // Opcional: hitbox debug
            // noFill(); stroke(255,255,0); rectMode(CENTER); rect(pos.x,pos.y,this.width,this.height); rectMode(CORNER);
        }

        // Si el efecto está activo, dibujar ícono y contador en HUD
        if (this.effectActive) {
            this._drawHUD();
        }
    }

    _drawHUD() {
        // icono arriba a la derecha - usar coordenadas de cámara
        push();
        imageMode(CORNER);
        textAlign(LEFT, CENTER);
        textSize(14);

        // posición HUD (derecha superior) - ajustada a cámara
        const camX = (typeof camera !== 'undefined') ? camera.x : 0;
        const camY = (typeof camera !== 'undefined') ? camera.y : 0;
        const x = camX + width - (this.hudIconSize + this.hudPadding) - 12;
        const y = camY + 12;

        // icon background
        noStroke();
        fill(0, 0, 0, 180);
        rect(x - 8, y - 8, this.hudIconSize + 16, this.hudIconSize + 16, 6);

        // imagen (si existe)
        if (this.sprite) {
            image(this.sprite, x, y, this.hudIconSize, this.hudIconSize);
        } else {
            // fallback
            fill(180); rect(x, y, this.hudIconSize, this.hudIconSize, 4);
        }

        // contador (segundos restantes)
        let remainingMs = Math.max(0, this.effectEndTime - millis());
        let remainingSec = Math.ceil(remainingMs / 1000);
        fill(255);
        textSize(12);
        text(`${remainingSec}s`, x - 8 - 40, y + this.hudIconSize / 2);

        pop();
    }
}

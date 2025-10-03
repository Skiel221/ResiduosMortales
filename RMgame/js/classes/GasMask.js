class GasMask {
    constructor(x, y, sprite) {
        this.sprite = sprite;
        this.width = 40;
        this.height = 40;

        // Cuerpo físico estático para detección con Matter.js
        this.body = Bodies.rectangle(x, y, this.width, this.height, {
            isStatic: true,
            isSensor: true // 👈 no colisiona, solo detecta
        });

        Composite.add(engine.world, this.body);

        this.collected = false;
    }

    update(player) {
        if (this.collected) return;

        // Distancia simple para "pickup"
        let dx = player.body.position.x - this.body.position.x;
        let dy = player.body.position.y - this.body.position.y;
        let distSq = dx * dx + dy * dy;
        let radius = (this.width + player.width) / 2;

        if (distSq < radius * radius) {
            // Jugador tocó la máscara
            player.heal(player.maxHealth); // 👈 restaurar vida al 100%
            this.collected = true;

            // Opcional: remover del mundo de Matter
            Composite.remove(engine.world, this.body);
        }
    }

    draw() {
        if (this.collected) return;

        let pos = this.body.position;
        push();
        imageMode(CENTER);
        image(this.sprite, pos.x, pos.y, this.width, this.height);
        pop();
    }
}

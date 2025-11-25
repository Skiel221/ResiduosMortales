class DeathZone {
    constructor(x, y, width, height, opts = {}) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.instantKill = opts.instantKill !== undefined ? opts.instantKill : true;
        this.body = Bodies.rectangle(x + width / 2, y + height / 2, width, height, {
            isStatic: true,
            isSensor: true
        });
        this.body.label = 'deathzone';
        Composite.add(engine.world, this.body);
    }

    update(player) {
        if (!player || !player.body || !player.isAlive || !player.isAlive()) return;
        const pos = player.body.position;
        const pl = pos.x - player.width / 2;
        const pt = pos.y - player.height / 2;
        const pr = pos.x + player.width / 2;
        const pb = pos.y + player.height / 2;

        const dl = this.x;
        const dt = this.y;
        const dr = this.x + this.width;
        const db = this.y + this.height;

        const overlap = pl < dr && pr > dl && pt < db && pb > dt;
        if (overlap) {
            if (this.instantKill) {
                player.takeDamage(player.health);
            } else {
                player.takeDamage(1000);
            }
        }
    }

    draw() {
        const pos = this.body.position;
        noFill();
        stroke(255, 0, 0);
        rectMode(CENTER);
        rect(pos.x, pos.y, this.width, this.height);
        rectMode(CORNER);
    }
}
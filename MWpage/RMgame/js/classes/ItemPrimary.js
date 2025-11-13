class ItemPrimary {
    constructor(x, y, sprite, options = {}) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.width = options.width || 44;
        this.height = options.height || 44;
        this.collected = false;
        this.visible = true;
    }

    update(player) {
        if (this.collected) return;
        const pos = player.body.position;
        const pl = pos.x - player.width / 2;
        const pt = pos.y - player.height / 2;
        const pr = pos.x + player.width / 2;
        const pb = pos.y + player.height / 2;
        const il = this.x;
        const it = this.y;
        const ir = this.x + this.width;
        const ib = this.y + this.height;
        const overlap = pl < ir && pr > il && pt < ib && pb > it;
        if (overlap) {
            this.collected = true;
        }
    }

    draw() {
        if (!this.collected && this.visible && this.sprite) {
            image(this.sprite, this.x, this.y, this.width, this.height);
        }
    }
}

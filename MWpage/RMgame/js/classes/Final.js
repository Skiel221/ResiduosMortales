class Final {
    constructor(x, y, sprite, options = {}) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.width = options.width || 80;
        this.height = options.height || 120;
        this.completed = false;
        this.messageTimer = 0;
        this.messageText = "Encuentra el objeto clave para pasar el nivel";
        this._btnBounds = null;
        this._formShown = false;
        this._nameInput = null;
        this._submitBtn = null;
        this._cancelBtn = null;
    }

    update(player, hasKey, score) {
        if (this.completed) return;
        const pos = player.body.position;
        const pl = pos.x - player.width / 2;
        const pt = pos.y - player.height / 2;
        const pr = pos.x + player.width / 2;
        const pb = pos.y + player.height / 2;
        const dl = this.x;
        const dt = this.y;
        const dr = this.x + this.width;
        const db = this.y + this.height;
        const touch = pl < dr && pr > dl && pt < db && pb > dt;
        if (touch) {
            if (hasKey) {
                this.completed = true;
                if (score) score.finish();
            } else {
                this.messageTimer = 60;
            }
        }
        if (this.messageTimer > 0) this.messageTimer--;
    }

    draw(score) {
        image(this.sprite, this.x, this.y, this.width, this.height);
        if (this.messageTimer > 0) {
            const mx = this.x + this.width / 2;
            const my = this.y - 20;
            push();
            textAlign(CENTER, BOTTOM);
            fill(255);
            stroke(0);
            strokeWeight(2);
            text(this.messageText, mx, my);
            pop();
        }
        if (this.completed) {
            const camX = typeof camera !== 'undefined' ? camera.x : 0;
            const camY = typeof camera !== 'undefined' ? camera.y : 0;
            const cx = camX + width / 2;
            const cy = camY + height / 2;
            const w = 360;
            const h = 160;
            push();
            rectMode(CENTER);
            noStroke();
            fill(0, 0, 0, 150);
            rect(cx, cy, w, h, 8);
            fill(255);
            textAlign(CENTER, TOP);
            textSize(20);
            text("Felicidades, completaste el nivel", cx, cy - h / 2 + 16);
            textSize(16);
            const secs = score ? score.getElapsedSeconds() : 0;
            const pts = score ? score.getFinalScore() : 0;
            text("Tiempo: " + secs + "s", cx, cy - h / 2 + 48);
            text("Puntuación: " + pts, cx, cy - h / 2 + 74);

            // Botón "Ver Puntuación" debajo de la puntuación
            const btnW = 180;
            const btnH = 36;
            const btnX = cx - btnW / 2;
            const btnY = cy - h / 2 + 106; // debajo de la línea de puntuación

            // Guardar bounds para manejo de clic (coordenadas de mundo)
            this._btnBounds = { x: btnX, y: btnY, w: btnW, h: btnH };

            // Dibujar botón
            noStroke();
            fill(30, 144, 255);
            rectMode(CORNER);
            rect(btnX, btnY, btnW, btnH, 6);
            fill(255);
            textAlign(CENTER, CENTER);
            textSize(16);
            text("Ver Puntuación", btnX + btnW / 2, btnY + btnH / 2);
            pop();

            
        }
    }

    handleMousePressed(mx, my) {
        // Detectar clic en el botón convirtiendo a coordenadas de mundo
        if (!this.completed || !this._btnBounds) return false;
        const camX = typeof camera !== 'undefined' ? camera.x : 0;
        const camY = typeof camera !== 'undefined' ? camera.y : 0;
        const wx = mx + camX;
        const wy = my + camY;
        const b = this._btnBounds;
        const inside = wx >= b.x && wx <= b.x + b.w && wy >= b.y && wy <= b.y + b.h;
        if (inside) {
            if (!this._formShown) {
                this._formShown = true;
                const cx = width / 2;
                const cy = height / 2;
                this._nameInput = createInput('');
                this._nameInput.attribute('placeholder', 'Tu nombre');
                this._nameInput.position(cx - 140, cy - 10);
                this._nameInput.size(200);
                this._submitBtn = createButton('Enviar');
                this._submitBtn.position(cx + 70, cy - 12);
                this._submitBtn.mousePressed(() => {
                    const n = (this._nameInput && this._nameInput.value()) || '';
                    const s = (typeof score !== 'undefined' && score) ? score.getFinalScore() : 0;
                    const t = (typeof score !== 'undefined' && score) ? score.getElapsedSeconds() : 0;
                    const body = new URLSearchParams({ name: n, score: String(s), time: String(t) }).toString();
                    fetch('../model/viewScore.php', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body })
                        .then(r => r.json()).then(j => {
                            this._cleanupForm();
                            window.location.href = '../index.php';
                        }).catch(() => {
                            this._cleanupForm();
                            window.location.href = '../index.php';
                        });
                });
                this._cancelBtn = createButton('Cancelar');
                this._cancelBtn.position(cx + 70, cy + 18);
                this._cancelBtn.mousePressed(() => {
                    this._cleanupForm();
                    window.location.href = '../index.php';
                });
            }
            return true;
        }
        return false;
    }

    _cleanupForm() {
        if (this._nameInput) { this._nameInput.remove(); this._nameInput = null; }
        if (this._submitBtn) { this._submitBtn.remove(); this._submitBtn = null; }
        if (this._cancelBtn) { this._cancelBtn.remove(); this._cancelBtn = null; }
        this._formShown = false;
    }
}

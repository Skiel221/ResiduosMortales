class Platform {
    constructor(x, y, width, height, sprite = null) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.sprite = sprite;
    }

    update() {
        // Las plataformas estáticas no necesitan actualización
    }

    draw() {
        if (this.sprite) {
            image(this.sprite, this.x, this.y, this.width, this.height);
        } else {
            // Dibujar un rectángulo simple si no hay sprite
            fill(139, 69, 19); // Color marrón para plataformas
            rect(this.x, this.y, this.width, this.height);
        }
    }
}
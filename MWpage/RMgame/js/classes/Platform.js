class Platform {
    constructor(x, y, width, height, sprite = null, isStatic = true) {
        this.sprite = sprite;
        this.width = width;
        this.height = height;
        this.body = Bodies.rectangle(x + width/2, y + height/2, width, height, {
            isStatic: isStatic,
            friction: 0.5,
            collisionFilter: { category: 0x0002, mask: 0x0001 | 0x0004 }
        });
        this.body.label = 'platform';
        Composite.add(engine.world, this.body);
    }

    draw() {
        let pos = this.body.position;
        
        push();
        translate(pos.x, pos.y);
        
        if (this.sprite) {
            imageMode(CENTER);
            image(this.sprite, 0, 0, this.width, this.height);
            imageMode(CORNER);
        } else {
            // Dibujar un rectángulo simple si no hay sprite
            fill(139, 69, 19); // Color marrón para plataformas
            rectMode(CENTER);
            rect(0, 0, this.width, this.height);
            rectMode(CORNER);
        }
        pop();
        
        // Dibujar hitbox para depuración (puedes eliminar esto después)
        noFill();
        stroke(0, 255, 0);
        rectMode(CENTER);
        rect(pos.x, pos.y, this.width, this.height);
        rectMode(CORNER);
    }
}

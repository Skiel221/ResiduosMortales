class Platform {
    constructor(x, y, width, height, sprite = null, isStatic = true) {
        this.sprite = sprite;
        this.width = width;
        this.height = height;
        
        // Crear el cuerpo físico con Matter.js
        this.body = Bodies.rectangle(x + width/2, y + height/2, width, height, {
            isStatic: isStatic, // si es estático no se moverá
            friction: 0.5       // Aumentar fricción para mejor tracción
        });
        
        // Añadir el cuerpo al mundo
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
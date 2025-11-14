## Objetivo
Guardar la puntuación calculada en `Score` en la tabla `marcadores` (SQL) y, al pulsar "Ver Puntuación", mostrar un mini formulario para capturar `name` y enviar los datos antes de redirigir al índice.

## Cambios Frontend (JS/p5)
1. **Final.js**
- Añadir estado para el formulario: `showForm`, `nameInputEl`, `submitBtnEl`, `cancelBtnEl`.
- `draw(score)`: cuando `completed`, dibujar botón "Ver Puntuación"; si `showForm`, mostrar overlay.
- `handleMousePressed(x, y)`: si se clickea el botón, crear con p5 DOM `createInput()` y `createButton()` posicionados al centro de la cámara.
- `submit`: recoger `name`, `finalScore`, `elapsedSeconds` y hacer `fetch('model/viewScore.php', { method: 'POST', headers: {'Content-Type':'application/x-www-form-urlencoded'}, body: new URLSearchParams({ name, score: finalScore, time: elapsedSeconds }).toString() })`; al éxito, `window.location.href = '../index.php'` (o `../index.html` si no existe PHP).
- Limpiar los elementos DOM tras enviar o cancelar.

2. **sketch.js**
- Ya llama `finalDoor.handleMousePressed(mouseX, mouseY)`; mantener y, si falta, ajustar coordenadas con cámara.

## Backend (PHP)
1. **model/viewScore.php**
- Leer `$_POST['name']`, `$_POST['score']`, `$_POST['time']`.
- Validar: `name` no vacío, `score` y `time` enteros >= 0.
- Conectar a BD con `require_once('../controller/conex.php')` (usar el conector existente).
- Insertar en `marcadores` con prepared statements (`mysqli`/`PDO`). Columnas sugeridas: `id`, `name`, `score`, `time`, `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP).
- Responder JSON `{ ok: true }` o `{ ok: false, error: '...' }` con `header('Content-Type: application/json')`.

## Tabla `marcadores` (si necesitas crearla)
```sql
CREATE TABLE marcadores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  score INT NOT NULL,
  time INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Seguridad y Robustez
- Usar prepared statements para evitar SQL injection.
- Sanitizar `name` con `trim`, limitar longitud; castear `score`/`time` a `int`.
- Manejar errores de BD y devolver JSON claro.

## Flujo de Usuario
1. Completa el nivel → ventana de final.
2. Clic "Ver Puntuación" → overlay solicita `name`.
3. Enviar → guarda en `marcadores` → redirige a `../index.php` para visualizar.

¿Aplico estos cambios en `Final.js` y `model/viewScore.php` (y creo la tabla si falta)? Puedo ajustar la redirección a `index.html` si prefieres no usar PHP en esa página. 
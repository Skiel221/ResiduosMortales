## Problema
El jugador se detiene sobre las plataformas pero `isGrounded()` no detecta suelo de forma fiable, por lo que `jump()` queda bloqueado. Necesitamos una detección de suelo robusta y que el jugador caiga cuando no haya plataforma debajo.

## Enfoque Técnico
1. **Filtros de colisión consistentes**
- `Platform`: `collisionFilter.category = 0x0002`, `mask = 0x0001`.
- `Player`: `collisionFilter.category = 0x0001`, `mask = 0x0002`.
- `FootSensor` del jugador: `isSensor: true`, `collisionFilter.category = 0x0004`, `mask = 0x0002`.

2. **Sensor de suelo por eventos**
- Crear `footSensor` como un rectángulo del ancho del jugador (`0.9 * width`) y altura 6.
- Actualizar su posición cada frame: bajo los pies del jugador (apenas 1–2 px dentro de la plataforma).
- Registrar listeners en `engine`:
  - `collisionStart`: si el par involucra `footSensor` y una `platform`, incrementar `groundContacts`.
  - `collisionEnd`: si el par involucra `footSensor` y una `platform`, decrementar `groundContacts`.
- `isGrounded()` devuelve `groundContacts > 0`.

3. **Lógica de salto simplificada**
- `jump()`: mantiene la verificación `this.canJump && this.alive`, y `canJump` se actualiza con `isGrounded()`.
- En `keyPressed` eliminar el chequeo previo `player.isGrounded()` y llamar a `player.jump()`; el método decide si salta.

4. **Integración**
- `Player`: añadir `footSensor`, `groundContacts`, `attachGroundSensor(engine)` y actualizar `update()` para reposicionar el sensor.
- `Platform`: asegurar categoría/máscara y `label = 'platform'`.
- `sketch.js`: después de crear plataformas y jugador, llamar `player.attachGroundSensor(engine)` y `player.setPlatforms(platforms)` (para Query si se requiere respaldo).

5. **Verificación**
- Probar:
  - El jugador salta cuando está sobre cualquier plataforma.
  - En huecos del suelo, el jugador cae (no hay contacto → `groundContacts = 0`).
  - No se producen falsos positivos en bordes; si fuese necesario, ajustar ancho/altura del sensor.

## Ajustes Fino (opcionales)
- Tolerancia en bordes: aumentar ancho del sensor a `1.1 * width` y altura 8 si hay falsos negativos en el borde.
- Unificar categorías en `constants.js` (ej. `COL_PLAYER`, `COL_PLATFORM`, `COL_SENSOR`) para mantener consistencia.

¿Te parece bien que implemente estos cambios ahora? Puedo realizar las modificaciones en `Player.js`, `Platform.js` y `sketch.js` para activar el salto solo sobre plataformas y la caída cuando no se detecte plataforma bajo los pies.
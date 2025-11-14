## Diagnóstico
El `footSensor` del jugador usa `category: 0x0004` y la plataforma tiene `mask: 0x0001`. Esto impide que la plataforma detecte colisiones con el sensor (categoría 0x0004), por eso nunca se disparan los eventos y `isGrounded()` permanece falso.

## Cambios Propuestos
1. **Platform.js**
- Ajustar `collisionFilter` del cuerpo de plataforma a: `category: 0x0002`, `mask: 0x0001 | 0x0004` (aceptar colisiones de jugador y su sensor de pies). Mantener `label = 'platform'`.

2. **Player.js (verificación)**
- Mantener `body.collisionFilter: { category: 0x0001, mask: 0x0002 }`.
- Mantener `footSensor` con `isSensor: true`, `collisionFilter: { category: 0x0004, mask: 0x0002 }` y `label = 'player_foot_sensor'`.
- Asegurar `Body.setPosition(footSensor, ...)` se ejecuta en cada `update()` (ya está) y que `attachGroundSensor(engine)` está siendo llamado (ya lo hicimos en `sketch.js`).

3. **Opcional (si fuese necesario)**
- Escuchar también `collisionActive` para borrar falsos negativos en bordes.
- Definir constantes de categorías en `constants.js` (`COL_PLAYER`, `COL_PLATFORM`, `COL_SENSOR`) para legibilidad.

## Verificación
- Sobre una plataforma, `groundContacts > 0` y `player.canJump = true`; el salto funciona.
- En el aire o huecos, `groundContacts = 0`; el jugador cae y no puede saltar.

¿Aplico estos cambios en `Platform.js` y verifico el salto inmediatamente?
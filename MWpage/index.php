
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Panel - Juego</title>
  <link rel="stylesheet" href="view/styles/panel.css">
  
</head>
<body>

  <!-- HEADER -->
  <header class="header">
    <a class="brand" href="#">
      <img src="RMgame/assets/images/logo/logo-icon.png" alt="Logo del juego" class="brand-logo">
      <div class="brand-text">
        <strong>Residuos Mortales</strong>
        <span class="subtitle">Aventura pixelada</span>
      </div>
    </a>

    <nav class="navbar">
      <ul class="nav-list">
        <li><a href="#inicio" class="nav-link">Inicio</a></li>
        <li><a href="./RMgame/game.html" class="nav-link">Juego</a></li>
        <li><a href="#manual" class="nav-link">Manual</a></li>
        <li><a href="view/login.php" class="nav-link">Login</a></li>
      </ul>
    </nav>
  </header>

  <!-- MAIN -->
  <main class="main-content" id="inicio">

    <!-- SECCIÓN PANEL PRINCIPAL -->
    <section class="panel-section" id="panel">
      <img class="panel-background" src="view/img/fondo-pag.png" alt="Panel del juego">
      
      <article class="panel-card" aria-label="Invitación a jugar">
        <div class="panel-thumbnail">
          <img src="view/img/logo-text.png" alt="Logo del juego">
        </div>

        <div class="panel-details">
          <h2 class="panel-title">¡Jugá ahora!</h2>
          <p class="panel-description">
            Sumergite en una aventura rápida: enfrenta desafíos, recoge objetos y limpia la zona contaminada.
            Partidas cortas, dinámicas y llenas de acción.
          </p>

          <div class="panel-actions">
            <button class="btn btn-play" onclick="location.href='./RMgame/game.html'">Jugar</button>
            <button class="btn btn-info" onclick="location.href='#manual'">Ver manual</button>
          </div>
        </div>
      </article>
    </section>

    <!-- SECCIÓN MANUAL DEL JUEGO -->
    <section class="manual-section" id="manual">
      <div class="manual-container">
        <h2 class="manual-title">Manual del Juego</h2>
        <p class="manual-intro">
          En "Residuos Mortales", tu misión es limpiar el área contaminada mientras evitas los residuos peligrosos. 
          Mantenete en movimiento y no dejes que los enemigos te alcancen.
        </p>

        <div class="manual-controls">
          <h3>Controles del juego</h3>
          <ul class="controls-list">
            <li><strong> / ←/ →:</strong> Mover al personaje</li>
            <li><strong>↑</strong> Saltar</li>
            <li><strong>Enter:</strong> Disparar</li>
          </ul>
        </div>

        <div class="manual-tips">
          <h3>Consejos útiles</h3>
          <ul class="tips-list">
            <li>Recoge los objetos verdes para sumar puntos extra.</li>
            <li>Completá cada nivel antes de que se acabe el tiempo.</li>
          </ul>
        </div>
      </div>
    </section>

  </main>

  <!-- INVITACIÓN FLOTANTE -->
  <div class="floating-invite">
    <p class="invite-text">¿Listo para jugar?</p>
    <button class="btn btn-play" onclick="location.href='./RMgame/game.html'">Ir al juego</button>
  </div>


</body>
</html>

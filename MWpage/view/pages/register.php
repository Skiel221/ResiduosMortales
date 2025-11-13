<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registrarse</title>
  <link rel="stylesheet" href="../styles/register.css">
</head>
<body>

  <div class="register-container">
    <div class="register-card">

      <h2 class="register-title">Crear cuenta</h2>

      <form class="register-form" action="../../model/register.php" method="POST">

        <div class="form-group">
          <label for="email" class="form-label">Correo electrónico</label>
          <input type="email" id="email" name="email" class="form-input" placeholder="Ej: usuario@email.com" required>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Contraseña</label>
          <input type="password" id="password" name="password" class="form-input" placeholder="Mínimo 8 caracteres" required>
        </div>

        <div class="form-group">
          <label for="password2" class="form-label">Repetir contraseña</label>
          <input type="password" id="password2" name="password2" class="form-input" placeholder="Reingresá la contraseña" required>
        </div>

        <button type="submit" class="btn-register">Registrarse</button>
      </form>

      <p class="login-text">
        ¿Ya tenés cuenta?
        <a href="../login.php" class="login-link">Iniciá sesión</a>
      </p>
    </div>
  </div>

</body>
</html>

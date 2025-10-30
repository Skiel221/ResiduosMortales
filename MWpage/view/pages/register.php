<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registro - Mortal Wastes</title>
  <link rel="stylesheet" href="../view/styles/global.css">
</head>
<body>
  <div class="conteiner">
    <div class="form-conteiner">
      <h2>Crear cuenta</h2>
      <form action="../model/register.php" method="post" class="form">
        <input type="email" name="email" placeholder="Correo electrónico" class="input" required>
        <input type="password" name="password" placeholder="Contraseña" class="input" required>
        <button type="submit" class="start-btn">Registrarse</button>
      </form>
      <p>¿Ya tienes cuenta? <a href="../index.php">Inicia sesión</a></p>
    </div>
  </div>
</body>
</html>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registrarse</title>
</head>
<body>
  <h2>Registro</h2>
  <form action="../../model/register.php" method="POST">
    <label>Email:</label><br>
    <input type="email" name="email" required><br><br>

    <label>Contraseña:</label><br>
    <input type="password" name="password" required><br><br>

    <label>Repetir contraseña:</label><br>
    <input type="password" name="password2" required><br><br>

    <button type="submit">Registrarse</button>
  </form>

  <p>¿Ya tenés cuenta? <a href="login.php">Iniciá sesión</a></p>
</body>
</html>

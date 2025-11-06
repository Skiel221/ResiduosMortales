
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mortal Wastes || Login</title>
  <link rel="stylesheet" href="view/styles/global.css">
  <link rel="stylesheet" href="view/styles/index.css">
</head>
<body>
  <div class="conteiner">
    <div class="form-conteiner">
      <div class="logo" id="logo">
        <img src="view/img/logo-move.avif" alt="">
      </div>
      <form action="../model/login.php" method="post" class="form">
        <input type="email" name="email" placeholder="Email" class="input" required>
        <input type="password" name="password" placeholder="Password" class="input" required>
        <button type="submit" name="ingresar" class="start-btn">Iniciar</button>
      </form>
      <p>¿No tienes cuenta? <a href="pages/register.php">Registrate aquí</a></p>
    </div>
  </div>
  <script src="view/javascript/logoMove.js"></script>
    <?php 
    include("../controller/conex.php");
    include("../model/login.php");
    ?>
</body>
</html>

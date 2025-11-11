<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
include('../controller/conex.php');

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = trim($_POST["email"]);
    $password = trim($_POST["password"]);

    if ($email != "" && $password != "") {
        // Buscar usuario existente
        $stmt = $conn->prepare("SELECT id, email, password FROM usuarios WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $resultado = $stmt->get_result();

        if ($resultado->num_rows > 0) {
            $usuario = $resultado->fetch_assoc();

            // Verificar contraseña
            if (password_verify($password, $usuario["password"])) {
                // Crear sesión
                $_SESSION["user_id"] = $usuario["id"];
                $_SESSION["email"] = $usuario["email"];

                // Redirigir al panel o dashboard
                header("Location: ../index.php");
                exit;
            } else {
                echo "❌ Contraseña incorrecta.";
            }
        } else {
            echo "⚠️ No existe una cuenta con ese email.";
        }
        $stmt->close();
    } else {
        echo "⚠️ Todos los campos son obligatorios.";
    }
}
$conn->close();
?>

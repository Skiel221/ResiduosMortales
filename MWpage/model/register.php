<?php
include_once("../controller/conex.php");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = trim($_POST["email"]);
    $password = trim($_POST["password"]);

    // Validaciones básicas
    if (empty($email) || empty($password)) {
        die("⚠️ Todos los campos son obligatorios.");
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die("⚠️ El email no es válido.");
    }

    if (strlen($password) < 6) {
        die("⚠️ La contraseña debe tener al menos 6 caracteres.");
    }

    // Verificar si el usuario ya existe
    $stmt = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows > 0) {
        echo "⚠️ Este usuario ya existe. <a href='../view/pages/index.php'>Iniciá sesión</a>";
    } else {
        // Insertar nuevo usuario
        $password_hash = password_hash($password, PASSWORD_DEFAULT);
        $insert = $conn->prepare("INSERT INTO usuarios (email, password) VALUES (?, ?)");
        $insert->bind_param("ss", $email, $password_hash);
        $insert->execute();

        if ($insert->affected_rows > 0) {
            // Redirige automáticamente al login
            header("Location: ../view/pages/index.php");
            exit;
        } else {
            echo "❌ Error al registrar el usuario.";
        }
        $insert->close();
    }

    $stmt->close();
}
$conn->close();
?>

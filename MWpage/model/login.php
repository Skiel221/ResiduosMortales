<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

include("../controller/conex.php");

if (!empty($_POST["ingresar"])) { 
    if (!empty($_POST["email"]) && !empty($_POST["password"])) {
        $email = $_POST["email"];
        $password = $_POST["password"];

        $stmt = $conexion->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $resultado = $stmt->get_result();

        if ($usuario = $resultado->fetch_object()) {
            if (password_verify($password, $usuario->password)) {
                $_SESSION["usuario"] = $usuario->email;
                header("Location: ../pages/viewScore.php");
                exit();
            } else {
                echo "<script>alert('Contraseña incorrecta'); window.location='../index.php';</script>";
            }
        } else {
            echo "<script>alert('Usuario no encontrado'); window.location='../index.php';</script>";
        }
    } else {
        echo "<script>alert('Todos los campos son obligatorios'); window.location='../index.php';</script>";
    }
}
?>

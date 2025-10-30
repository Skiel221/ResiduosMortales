<?php
include("../controller/conex.php");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = $_POST["email"];
    $password = $_POST["password"];

    $check = $conexion->prepare("SELECT * FROM users WHERE email = ?");
    $check->bind_param("s", $email);
    $check->execute();
    $result = $check->get_result();

    if ($result->num_rows > 0) {
        echo "<script>alert('El usuario ya existe'); window.location='../pages/register.php';</script>";
    } else {
        $password_hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $conexion->prepare("INSERT INTO users (email, password) VALUES (?, ?)");
        $stmt->bind_param("ss", $email, $password_hash);

        if ($stmt->execute()) {
            echo "<script>alert('Usuario registrado correctamente'); window.location='../index.php';</script>";
        } else {
            echo "<script>alert('Error al registrar'); window.location='../pages/register.php';</script>";
        }
    }
}
?>

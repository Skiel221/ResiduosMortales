<?php
header('Content-Type: application/json');
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$score = isset($_POST['score']) ? intval($_POST['score']) : 0;
$time = isset($_POST['time']) ? intval($_POST['time']) : 0;
if ($name === '' || $score < 0 || $time < 0) {
    echo json_encode(['ok' => false, 'error' => 'invalid']);
    exit;
}
require_once('../controller/conex.php');
$stmt = $conn->prepare('INSERT INTO marcadores (name, score, time) VALUES (?, ?, ?)');
$stmt->bind_param('sii', $name, $score, $time);
$ok = $stmt->execute();
$stmt->close();
$conn->close();
echo json_encode(['ok' => $ok ? true : false]);


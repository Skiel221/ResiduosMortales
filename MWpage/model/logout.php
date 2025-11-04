<?php
session_start();
session_destroy();
header("Location: ../view/pages/index.php");
exit();
?>

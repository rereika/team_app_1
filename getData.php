<?php

require('connectDB.php');

$sql = "SELECT * FROM tags";
$stmt = $pdo->query($sql);

$results = $stmt->fetchAll();

echo json_encode($results);

?>

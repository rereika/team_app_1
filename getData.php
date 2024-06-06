<?php

require('connectDB.php');

$results = [];
$sql1 = "SELECT * FROM tags";
$stmt = $pdo->query($sql1);
$results[] = $stmt->fetchAll();

$sql2 = "SELECT r.day, t.tag_name
           FROM reports AS r
           JOIN report_tags AS rt
             ON r.id = rt.reports_id
           JOIN tags AS t
             ON rt.tags_id = t.id";
$stmt = $pdo->query($sql2);
$results[] = $stmt->fetchAll();

echo json_encode($results);

?>

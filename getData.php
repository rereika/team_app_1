<?php

require('connectDB.php');

// この配列はJSでインデックス番号を使って操作するので新規データは末尾に追加するように
$results = [];

$sql1 = "SELECT * FROM reports";
$stmt = $pdo->query($sql1);
$results[] = $stmt->fetchAll();

$sql2 = "SELECT r.day, t.tag_name
           FROM reports AS r
           LEFT JOIN report_tags AS rt
             ON r.day = rt.report_day
           LEFT JOIN tags AS t
             ON rt.tags_id = t.id";
$stmt = $pdo->query($sql2);
$results[] = $stmt->fetchAll();

$sql3 = "SELECT * FROM tags";
$stmt = $pdo->query($sql3);
$results[] = $stmt->fetchAll();

$sql4 = "SELECT hour, day
           FROM reports";
$stmt = $pdo->query($sql4);
$results[] = $stmt->fetchAll();

echo json_encode($results);


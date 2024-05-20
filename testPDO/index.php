<?php
    $dsn = 'mysql:host=localhost;dbname=app_members_db;charset=utf8'; //ホスト名も必要であれば書き換える
    $user = ''; //ユーザー名
    $password = ''; //パスワード名

    try {
        $pdo = new PDO(
            $dsn,
            $user,
            $password,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        echo "接続に成功しました\n";
    } catch (PDOException $e) {
        echo "接続に失敗しました\n";
        echo $e->getMessage() . "\n";
    }

    try {
        $pdo->query("DROP TABLE IF EXISTS app_members");
        $pdo->query(
            "CREATE TABLE app_members (
                PRIMARY KEY (id),
                id   INT         NOT NULL AUTO_INCREMENT,
                name VARCHAR(50) NOT NULL
            )"
        );
        $pdo->query(
            "INSERT INTO app_members VALUES
                (0, 'オオタケ'),
                (0, 'オカダ'),
                (0, 'クラモト'),
                (0, 'ヤエガシ')"
        );

        $num = rand(1, 4);
        $stmt = $pdo->prepare("SELECT name FROM app_members WHERE id = ?");
        $stmt->execute([$num]);
        $result = $stmt->fetchColumn(0);
    } catch (PDOException $i) {
        echo $i->getMessage() . PHP_EOL;
    }
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>テスト</title>
</head>
<body>
    <h1><?= 'さーて、来週の' . $result . 'さんは？' . PHP_EOL; ?></h1>
</body>
</html>

<?php

require('connectDB.php');

$date = $_SERVER['QUERY_STRING'];

$stmt = $pdo->prepare("SELECT hour, rate, studies, good, more, tomorrow FROM reports WHERE day = ?");
$stmt->execute([$date]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

$hour = $row['hour'];
$rate = $row['rate'];
$studies = $row['studies'];
$good = $row['good'];
$more = $row['more'];
$tomorrow = $row['tomorrow'];

$stmt = $pdo->query("SELECT tag_name FROM tags");
$tags = $stmt->fetchAll();

?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>登録</title>
  <link rel="stylesheet" href="/css/reset.css" />
  <link rel="stylesheet" type="text/css" href="css/register.css">
  <link rel="stylesheet" href="../vendor/twbs/bootstrap/dist/css/bootstrap.css">
</head>

<body>
  <header>
    <button type="button" class="btn btn-outline-primary list-button">一覧へ</button>
  </header>

  <div class="inner">
    <form class="tag-item">
      タグ
      <div class="select-container">
        <select id="tagSelect" name="tag" multiple>
          <?php foreach ($tags as $tag) : ?>
            <option value="<?= $tag['tag_name']; ?>"><?= $tag['tag_name']; ?></option>
          <?php endforeach; ?>
          <option value="new">+</option>
        </select>
        <input type="text" id="newTag" class="new-tag" placeholder="新しいタグを入力">
      </div>
    </form>

    <form>
      <ul>
        <li>学習時間
          <select id="study time">
            <!-- PHPで生成した方がselected属性を簡単につけられる -->
            <?php for ($i = 1; $i <= 24; $i++) : ?>
              <option value="" <?= $i === $hour ? "selected" : '' ?>><?= $i; ?></option>
            <?php endfor; ?>
          </select>
        </li>

        <li>内容<textarea><?= $studies !== '' ? $studies : ''; ?></textarea></li>

        <li>良かった点<textarea><?= $good !== '' ? $good : ''; ?></textarea></li>

        <li>もっと良くできる点<textarea><?= $more !== '' ? $more : ''; ?></textarea></li>

        <li>明日への決意<textarea><?= $tomorrow !== '' ? $tomorrow : ''; ?></textarea></li>

        <li>自己評価
          <div class="score">
            <div>
              <input type="radio" id="score0" name="score" <?= $rate === 1 ? "checked" : " " ?>>
              <label for="score0">0</label>
            </div>
            <div>
              <input type="radio" id="score20" name="score" <?= $rate === 2 ? "checked" : " " ?>>
              <label for="score20">20</label>
            </div>
            <div>
              <input type="radio" id="score40" name="score" <?= $rate === 3 ? "checked" : " " ?>>
              <label for="score40">40</label>
            </div>
            <div>
              <input type="radio" id="score60" name="score" <?= $rate === 4 ? "checked" : " " ?>>
              <label for="score60">60</label>
            </div>
            <div>
              <input type="radio" id="score80" name="score" <?= $rate === 5 ? "checked" : " " ?>>
              <label for="score80">80</label>
            </div>
            <div>
              <input type="radio" id="score100" name="score" <?= $rate === 6 ? "checked" : " " ?>>
              <label for="score100">100</label>
            </div>
          </div>
        </li>
      </ul>
    </form>
  </div>

  <footer>
    <button type="button" class="btn btn-outline-primary register-button">登録</button>
  </footer>
  <script src="js/register.js"></script>
</body>

</html>

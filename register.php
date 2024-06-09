<?php

require('connectDB.php');

$date = $_SERVER['QUERY_STRING'];

$stmt = $pdo->prepare("SELECT t.tag_name
                         FROM tags AS t
                    LEFT JOIN report_tags AS rt
                           ON t.id = rt.tags_id
                    LEFT JOIN reports AS r
                           ON rt.report_day = r.day
                        WHERE r.day = ?");
$stmt->execute([$date]);
$selectedTagsB = $stmt->fetchAll();
$selectedTagsB = array_column($selectedTagsB, 'tag_name');

$stmt = $pdo->prepare("SELECT hour, rate, studies, good, more, tomorrow FROM reports WHERE day = ?");
$stmt->execute([$date]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

// BはBefore(初期値)のB
$hourB = $row['hour'];
$rateB = $row['rate'];
// rateのみバリデーションが必要、他のNOT NULLカラムはほとんど初期値がある
$rateB = $rateB !== NULL ? $row['rate'] : 1;
$studiesB = $row['studies'];
$goodB = $row['good'];
$moreB = $row['more'];
$tomorrowB = $row['tomorrow'];

$stmt = $pdo->query("SELECT name FROM tagsShadow");
$storedTags = $stmt->fetchAll();

// ↓これは何用なのか全く覚えていないため、しばらくバグが見つからなければ削除
// $stmt = $pdo->prepare("SELECT id FROM reports WHERE day = ?");
// $stmt->execute([$date]);
// $row = $stmt->fetch(PDO::FETCH_ASSOC);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $action = filter_input(INPUT_GET, 'action');
  switch ($action) {
    case 'upOrIn':
      upOrIn($pdo);
      break;
    case 'add-tag':
      addTag($pdo);
      break;
    case 'delete':
      deleteTag($pdo);
      break;
  }

  header('Location: http://localhost:8000/calendar.html?' . $date);
  exit;
}

// upOrIn→update or insert
function upOrIn($pdo)
{
  // AはAfter(入力後)のA
  $selectedTagsA = filter_input(INPUT_POST, 'tags', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY);
  $hourA = filter_input(INPUT_POST, 'hour');
  $rateA = filter_input(INPUT_POST, 'rate');
  $studiesA = filter_input(INPUT_POST, 'studies');
  $goodA = filter_input(INPUT_POST, 'good');
  $moreA = filter_input(INPUT_POST, 'more');
  $tomorrowA = filter_input(INPUT_POST, 'tomorrow');
  $date = filter_input(INPUT_POST, 'date');

  // 選択したタグのタグ名をタグidに変換(テーブルの構成上必要)
  $selectedTagIds = [];
  foreach ($selectedTagsA as $selectedTagA) {
    $stmt = $pdo->prepare("SELECT id FROM tags WHERE tag_name = :selectedTag");
    $stmt->execute(['selectedTag' => $selectedTagA]);
    $selectedTagIds[] = $stmt->fetchColumn();
  }

  // 日付に合致するレコードがあるかを調べ、なければINSERT、あればUPDATE。ここでは取得カラムをdayにしているがhourかrateでもよいはず
  $stmt = $pdo->prepare("SELECT day FROM reports WHERE day = ?");
  $stmt->execute([$date]);
  $check = $stmt->fetchColumn();

  if ($check === false) {
    $stmt = $pdo->prepare("INSERT INTO reports VALUES (0, :hour, :rate, :studies, :good, :more, :tomorrow, :date)");
    $stmt->execute([
      'hour' => $hourA,
      'rate' => $rateA,
      'studies' => $studiesA,
      'good' => $goodA,
      'more' => $moreA,
      'tomorrow' => $tomorrowA,
      'date' => $date
    ]);

    // これを後にしないと外部キー制約の関係でエラーになる
    foreach ($selectedTagIds as $selectedTagId) {
      $stmt = $pdo->prepare("INSERT INTO report_tags (report_day, tags_id) VALUES (:date, :selectedTagId)");
      $stmt->execute(['date' => $date, 'selectedTagId' => $selectedTagId]);
    }

    return;
  }
  $stmt = $pdo->prepare("UPDATE reports SET hour = :hour, rate = :rate, studies = :studies, good = :good, more = :more, tomorrow = :tomorrow WHERE day = :date");
  $stmt->execute([
    'hour' => $hourA,
    'rate' => $rateA,
    'studies' => $studiesA,
    'good' => $goodA,
    'more' => $moreA,
    'tomorrow' => $tomorrowA,
    'date' => $date
  ]);

  $stmt = $pdo->prepare("DELETE FROM report_tags WHERE report_day = :date");
  $stmt->execute(['date' => $date]);

  foreach ($selectedTagIds as $selectedTagId) {
    $stmt = $pdo->prepare("INSERT INTO report_tags (report_day, tags_id) VALUES (:date, :selectedTagId)");
    $stmt->execute(['date' => $date, 'selectedTagId' => $selectedTagId]);
  }
}

function addTag($pdo)
{
  // 追加するときはtagテーブルとtagsShadowテーブル両方に追加せよ
  $newTag = filter_input(INPUT_POST, 'new-tag');
  $stmt = $pdo->prepare("INSERT INTO tags (tag_name) VALUES (?)");
  $stmt->execute([$newTag]);
  $stmt = $pdo->prepare("INSERT INTO tagsShadow (name) VALUES (?)");
  $stmt->execute([$newTag]);
}

function deleteTag($pdo)
{
  // 一度optionにフォーカスを当てて(青く反転させて)からダブルクリックしないと値が送信されないようだ
  $registeredTag = filter_input(INPUT_POST, 'tags', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY);
  // var_dump($registeredTag);
  $stmt = $pdo->prepare("DELETE FROM tagsShadow WHERE name = ?");
  $stmt->execute([$registeredTag[0]]);
}

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
    <form action="?action=upOrIn" method="post">
      <input type="hidden" name="date" value="<?= $date; ?>">
      <h1>10月7日（サンプル）</h1>
      <ul>
        <li>学習時間
          <select id="study time" name="hour">
            <!-- PHPで生成した方がselected属性を簡単につけられる -->
            <?php for ($i = 1; $i <= 24; $i++) : ?>
              <option value="<?= $i; ?>" <?= $i === $hourB ? "selected" : ''; ?>><?= $i; ?></option>
            <?php endfor; ?>
          </select>
        </li>

        <li class="tag-item">タグ
          <div class="select-container">
            <select id="tagSelect" name="tags[]" multiple ondblclick="deleteTag('?action=delete')">
              <?php foreach ($storedTags as $tag) : ?>
                <?php var_dump($tag); ?>
                <option value="<?= $tag['name']; ?>" <?= in_array($tag['name'], $selectedTagsB) ? 'selected' : '' ?>><?= $tag['name']; ?></option>
              <?php endforeach; ?>
              <option value="new">+</option>
            </select>
            <input type="text" id="newTag" class="new-tag" name="new-tag" placeholder="新しいタグを入力" onblur="addTag('?action=add-tag')">
          </div>
        </li>

        <li>
          内容
          <textarea name="studies"><?= $studiesB !== '' ? $studiesB : ''; ?></textarea>
        </li>

        <li>
          良かった点
          <textarea name="good"><?= $goodB !== '' ? $goodB : ''; ?></textarea>
        </li>

        <li>
          もっと良くできる点
          <textarea name="more"><?= $moreB !== '' ? $moreB : ''; ?></textarea>
        </li>

        <li>
          明日への決意
          <textarea name="tomorrow"><?= $tomorrowB !== '' ? $tomorrowB : ''; ?></textarea>
        </li>

        <li>自己評価
          <div class="score">
            <?php for ($i = 1; $i <= 5; $i++) : ?>
              <div>
                <input type="radio" id="<?= 'rate' . $i ?>" name="rate" value="<?= $i; ?>" <?= $rateB === $i ? "checked" : " "; ?>>
                <label for="<?= 'rate' . $i ?>"><?= $i; ?></label>
              </div>
            <?php endfor; ?>
          </div>
        </li>
      </ul>
      <button type="submit" class="btn btn-outline-primary register-button">登録</button>
    </form>
  </div>

  <!-- 基本的にボタンはformの中にいれなければならない -->
  <!-- <footer>
    <button type="submit" class="btn btn-outline-primary register-button">登録</button>
  </footer> -->
  <script src="js/register.js"></script>
</body>

</html>

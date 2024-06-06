document.addEventListener("DOMContentLoaded", () => {
  const goalInput = document.getElementById("goal-input");

  // ローカルストレージから目標を読み込む
  const savedGoal = localStorage.getItem("monthlyGoal");
  if (savedGoal) {
    goalInput.value = savedGoal;
  }

  // 目標が入力されたらローカルストレージに保存する
  goalInput.addEventListener("input", () => {
    localStorage.setItem("monthlyGoal", goalInput.value);
  });



  // ここからカレンダー自動生成
  // 現在日時の情報を取得
  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth();

  // 前月の残り部分を生成
  function getCalendarHead() {
    const dates = [];
    const d = new Date(year, month, 0).getDate();
    const n = new Date(year, month, 1).getDay();

    for (let i = 0; i < n; i++) {
      dates.unshift({
        date: d - i,
        isToday: false,
        isDisabled: true,
      });
    }
    return dates;
  }

  // 今月分を生成
  function getCalendarBody() {
    const dates = [];
    const lastDate = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= lastDate; i++) {
      dates.push({
        date: i,
        isToday: false,
        isDisabled: false,
      });
    }

    if (year === today.getFullYear() && month === today.getMonth()) {
      dates[today.getDate() - 1].isToday = true;
    }

    return dates;
  }

  // 来月分の冒頭を生成
  function getCalendarTail() {
    const dates = [];
    const lastDay = new Date(year, month + 1, 0).getDay();
    for (let i = 1; i < 7 - lastDay; i++) {
      dates.push({
        date: i,
        isToday: false,
        isDisabled: true
      });
    }
    return dates;
  }

  // カレンダーをリセット
  function clearCalendar() {
    const tbody = document.querySelector('.calendar tbody');
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }
  }

  // 左上の月表示
  function renderMonth() {
    const title = month + 1;
    document.querySelector('.goal-time-container span').textContent = title + '月';
  }

  // カレンダーを行(週)ごとに作成、ここがメイン
  function renderWeeks() {
    const dates = [
      ...getCalendarHead(),
      ...getCalendarBody(),
      ...getCalendarTail()
    ];
    const weeks = [];
    const weeksCount = dates.length / 7;
    for (let i = 0; i < weeksCount; i++) {
      weeks.push(dates.splice(0, 7));
    }

    weeks.forEach((week) => {
      const tr = document.createElement('tr');
      week.forEach((date) => {
        const td = document.createElement(('td'));
        const span = document.createElement('span');
        span.classList.add('date-number');
        span.textContent = date.date;
        td.appendChild(span);
        // タグ情報取得、今はダミーデータを入れています(重複あり)
        const testArray = ['JS', 'PHP', 'SQL', 'HTML', 'CSS', 'Laravel', 'オリプロ', 'チーム会', '記事'];
        for (let i = 0; i < 4; i++) {
          const div = document.createElement('div');
          div.classList.add('event');
          div.textContent = testArray[Math.floor(Math.random() * testArray.length)];
          td.appendChild(div);
        }
        // 今日をオレンジにする
        if (date.isToday) {
          td.classList.add('today');
        }
        // はみ出ている前月分と来月分の数字を薄くする
        if (date.isDisabled) {
          span.classList.add('disabled');
        }
        tr.appendChild(td);
      });
      document.querySelector('.calendar tbody').appendChild(tr);
    });
  }

  function createCalendar() {
    clearCalendar();
    renderMonth();
    renderWeeks();
    addMWEvent();
  }

  createCalendar();

  // クリックイベントを生成
  document.querySelector('#prev').addEventListener('click', () => {
    month--;
    if (month < 0) {
      year--;
      month = 11;
    }
    createCalendar();
  });

  document.querySelector('#next').addEventListener('click', () => {
    month++;
    if (month > 11) {
      year++;
      month = 0;
    }
    createCalendar();
  });



  // ここからモーダルウィンドウ
  // モーダルウィンドウの要素を取得
  const modal = document.getElementById("myModal");
  const modalDate = document.getElementById("modal-date");
  const modalStudyTime = document.getElementById("modal-study-time");
  const modalGoodPoints = document.getElementById("modal-good-points");
  const modalImprovePoints = document.getElementById("modal-improve-points");
  const modalCommitment = document.getElementById("modal-commitment");
  const closeModalButton = document.getElementById("close-modal");
  const editModalButton = document.getElementById("edit-modal");

  // カレンダーの日付セルをクリックしたときの処理
  function addMWEvent() {
    document.querySelectorAll(".calendar tbody td").forEach(cell => {
      cell.addEventListener("click", () => {
        modalDate.textContent = `${cell.firstElementChild.textContent}日`;

        // データベースからデータを取得して表示
        modalStudyTime.textContent = "";
        modalGoodPoints.textContent = "";
        modalImprovePoints.textContent = "";
        modalCommitment.textContent = "";

        // モーダルを表示
        modal.showModal();
      });
    });
  }

  // モーダルを閉じる処理
  closeModalButton.onclick = () => {
    modal.close();
  };

  // 編集ボタンの処理（編集画面への遷移）
  editModalButton.onclick = () => {
    // 編集画面への遷移処理をここに記述
    window.location.href = "nippo.html"; // 編集画面へのURLに置き換える
  };

  // モーダルの外側をクリックしたときにモーダルを閉じる
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.close();
    }
  });
});

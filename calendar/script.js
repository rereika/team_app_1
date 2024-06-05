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

  //カレンダー自動生成部分、左上の月も連動する
  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth();

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

  function clearCalendar() {
    const tbody = document.querySelector('.calendar tbody');
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }
  }

  function renderMonth() {
    const title = month + 1;
    document.querySelector('.goal-time-container span').textContent = title + '月';
  }

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
        td.textContent = date.date;
        if (date.isToday) {
          td.classList.add('today');
        }
        if (date.isDisabled) {
          td.classList.add('disabled');
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
  }

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

  // createCalendar();

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

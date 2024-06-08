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

  // PHPからデータを取得
  async function getData() {
    try {
      const response = await fetch('../getData.php');
      const data = await response.json();
      // console.log(data);
      return data;
    } catch (err) {
      console.log('失敗');
      console.log(err);
    }
  }

  // 月の合計時間を取得・表示
  async function renderTotalTimePerMonth() {
    const jsonData = await getData();
    const times = jsonData[3].filter(d => {
      // ↓の地獄みたいなコードは不適切なので、だれか直してください
      return d.day >= `${year}-${String(month + 1).padStart(2, '0')}-${String(new Date(year, month + 1, 1).getDate()).padStart(2, '0')}` &&
        d.day <= `${year}-${ String(month + 1).padStart(2, '0') }-${ String(new Date(year, month + 2, 0).getDate()).padStart(2, '0') }`;
    });
    let num = 0;
    times.forEach((time) => {
      num += time.hour;
    });
    document.querySelector('.time .totalTime').textContent = `${num}h`;
  }

  renderTotalTimePerMonth();

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
        uniqueDate: `${year}-${String(month).padStart(2, '0')}-${String(d - i).padStart(2, '0')}`
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
        uniqueDate: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
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
        isDisabled: true,
        uniqueDate: `${year}-${String(month + 2).padStart(2, '0')}-${String(i).padStart(2, '0')}`
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
    document.querySelector('.goal-time-container span').textContent = `${title}月`;
  }

  // カレンダーを行(週)ごとに作成、ここがメイン
  async function renderWeeks() {
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

      week.forEach(async (date) => {
        // データ取得
        const jsonData = await getData();
        // 各日付の枠組みを生成
        const td = document.createElement(('td'));
        const span = document.createElement('span');
        span.classList.add('date-number');
        span.textContent = date.date;

        // 今日の日付ならspanにもtodayクラスを追加
        if (date.isToday) {
          span.classList.add('today');
        }
        
        td.appendChild(span);

        getTags(date, jsonData, td);
        addColor(date, jsonData, td);

        // はみ出ている前月分と来月分の数字を薄くする
        if (date.isDisabled) {
          span.classList.add('disabled');
        }
        tr.appendChild(td);

        addMWEvent(date, jsonData, td);
      });
      document.querySelector('.calendar tbody').appendChild(tr);
    });
  // 週合計時間枠を追加
  createTotalWeek();
  }

  // タグ情報の表示
  function getTags(date, jsonData, td) {
    const tags = jsonData[1].filter(data => {
      return date.uniqueDate === data.day;
    });
    const array = [];
    tags.forEach(tag => {
      array.push(tag.tag_name);
    });
    for (let i = 0; i < 4; i++) {
      const div = document.createElement('div');
      div.classList.add('event');
      div.textContent = array[i];
      td.appendChild(div);
    }
  }

  // 背景色の設定
  function addColor(date, jsonData, td) {
    // 今日をオレンジにする
    if (date.isToday) {
      td.classList.add('today');
    }
    // 自己評価に応じて背景色を設定
    const rating = jsonData[0].filter(data => {
      return date.uniqueDate === data.day;
    });
    if (rating.length > 0) {
      td.classList.remove('today');
      switch (rating[0].rate) {
        case 1:
          td.style.background = '#eaffea';
          break;
        case 2:
          td.style.background = '#aaffaa';
          break;
        case 3:
          td.style.background = '#55ff55';
          break;
        case 4:
          td.style.background = '#00d500';
          break;
        case 5:
          td.style.background = '#008000';
          break;
      }
    } else {
      td.style.background = 'transparent';
    }
  }

  function createCalendar() {
    clearCalendar();
    renderMonth();
    renderWeeks();
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
    renderTotalTimePerMonth();
  });

  document.querySelector('#next').addEventListener('click', () => {
    month++;
    if (month > 11) {
      year++;
      month = 0;
    }
    createCalendar();
    renderTotalTimePerMonth();
  });

//週合計時間を動的に生成
  function createTotalWeek() {
    const tbody = document.querySelector('.calendar tbody');
    const weekRows = tbody.querySelectorAll('tr').length;
    const sideTable = document.querySelector('.side-table tbody');

    // 現在の合計時間枠をクリア
    while (sideTable.firstChild) {
      sideTable.removeChild(sideTable.firstChild);
    }

    // 必要な数だけ週合計の枠を追加
    for (let i = 0; i < weekRows; i++) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      const span = document.createElement('span');
      span.classList.add('week_total');
      td.appendChild(span);
      tr.appendChild(td);
      sideTable.appendChild(tr);
    }
  }




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

  // MWのクリックイベントとリンクの動的生成とデータ表示
  function addMWEvent(date, jsonData, td) {
    td.addEventListener("click", () => {
      // 月と日付の両方を表示
      const clickedDate = new Date(date.uniqueDate);
      const formattedDate = `${clickedDate.getMonth() + 1}月${clickedDate.getDate()}日`;
      modalDate.textContent = formattedDate;

      const infoMW = jsonData[0].filter(data => {
        return date.uniqueDate === data.day;
      });
      console.log(date.uniqueDate);
      // データベースからデータを取得して表示
      if (infoMW.length > 0) {
        modalStudyTime.textContent = `${infoMW[0].hour}時間`;
        modalGoodPoints.textContent = infoMW[0].good;
        modalImprovePoints.textContent = infoMW[0].more;
        modalCommitment.textContent = infoMW[0].tomorrow;
      } else {
        modalStudyTime.textContent = "データなし";
        modalGoodPoints.textContent = "データなし";
        modalImprovePoints.textContent = "データなし";
        modalCommitment.textContent = "データなし";
      }

      // モーダルを表示
      modal.showModal();
      // 編集ボタンの処理（編集画面への遷移）
      editModalButton.onclick = () => {
        // 編集画面への遷移処理をここに記述
        window.location.href = `register.php?${date.uniqueDate}`; // 編集画面へのURLに置き換える
      };
    });
  }

  // モーダルを閉じる処理
  closeModalButton.onclick = () => {
    modal.close();
  };

  // モーダルの外側をクリックしたときにモーダルを閉じる
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.close();
    }
  });
});

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
  document.querySelectorAll("tbody td").forEach(cell => {
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

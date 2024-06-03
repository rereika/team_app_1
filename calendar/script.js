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
});

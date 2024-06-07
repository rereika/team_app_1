
// PHPで生成しました
// const select = document.getElementById('study time');
// for (let i = 1; i <= 24; i++) {
//   const option = document.createElement('option');
//   option.value = i;
//   option.textContent = i;
//   select.appendChild(option);
// }

const tagSelect = document.getElementById('tagSelect');
const newOptionInput = document.getElementById('newTag');

tagSelect.addEventListener('change', function () {
  if (this.value === 'new') {
    newOptionInput.style.display = 'block';
    newOptionInput.focus();
  } else {
    newOptionInput.style.display = 'none';
  }
});

tagSelect.addEventListener('dblclick', (event) => {
  if (event.target.tagName === 'OPTION') {
    tagSelect.removeChild(event.target);
  }
});

newOptionInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    const newOptionValue = newOptionInput.value.trim();
    if (newOptionValue) {
      //新しいoption要素を作成
      const newOption = document.createElement('option');
      //全て小文字で登録し、重複を防ぐ
      newOption.value = newOptionValue.toLowerCase();
      newOption.text = newOptionValue;
      //新しいオプションを選択状態にする
      newOption.selected = true;
      //新しいオプションをプラスオプションの手前に追加
      tagSelect.insertBefore(newOption, tagSelect.options[tagSelect.options.length - 1]);
      //入力フィールドを非表示にする
      newOptionInput.style.display = 'none';
      //入力フィールドを空にする
      newOptionInput.value = '';
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // ボタン要素を取得
  const registerButton = document.querySelector(".register-button");

  // ボタンがクリックされたときの処理
  registerButton.addEventListener("click", function () {
    alert("日報を登録しました。今日もお疲れ様！");
  });
});

// 「一覧へ」ボタンのクリックイベントリスナーを追加
document.querySelector('.list-button').addEventListener('click', function() {
  window.location.href = 'calendar.html'; // カレンダーのHTMLファイルへのパスを指定
});

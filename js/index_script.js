// 変数定義
// TopPageクラスを生成
const topPage = new TopPage();

// localStorageのkey名
const selectedMapIndexKeyName = "selectedMapIndex";
const mapArrayKeyName = "mapArray";

// 操作
// ロード時の操作
$(window).on("load", function () {
  // 1. selectedMapIndex を取得する
  topPage.SelectedMapIndex = localStorage.getItem(selectedMapIndexKeyName);

  // 2. MapList を取得し、画面を表示する
  topPage.LoadMapList(localStorage.getItem(mapArrayKeyName));
});

// Map list のクリック時の操作
$("#map_list").on("click", "li:not(.selected_map_item)", function () {
  topPage.ChangeSelectedItem($("#map_list>li").index($(this)));
});

// 選択済の Map list のクリック時の操作
$("#map_list").on("click", ".selected_map_item", function () {
  // 登録値の設定
  const item = topPage.MapList[$("#map_list>li").index($(this))];
  $("#edit_map_name").val(item.MapName);
  $("#edit_map_path").val(item.MapImgPath);
  $("#edit_map_area").fadeIn();
});

// Zoom スライダー変更時の操作
$("#zoom_range").on("input change", function () {
  // エラー処理
  if (topPage.MapList.length == 0) return;
  const zoomVal = $(this).val();
  topPage.MapList[topPage.SelectedMapIndex].ResizeMapImgAndMemo(zoomVal);
  localStorage.setItem(mapArrayKeyName, topPage.GetValueToRegisterLocalStorage());
});

// スクロール変更時の操作
let timeOut;
$("main").on("scroll", function () {
  // エラー処理
  if (topPage.MapList.length == 0) return;
  const main = $(this);
  clearTimeout(timeOut);
  timeOut = setTimeout(function () {
    const item = topPage.MapList[topPage.SelectedMapIndex];
    item.ScrollX = main.scrollLeft();
    item.ScrollY = main.scrollTop();
    localStorage.setItem(mapArrayKeyName, topPage.GetValueToRegisterLocalStorage());
  }, 500);
});

// Mapを追加するボタン押下時の操作
$("#add_map_btn").on("click", function () {
  // 新規Map登録モーダルを開く
  $("#create_map_area").fadeIn();
});

// モーダルをキャンセル
$(".modal_overlay, .modal_close, #create_map_cancel, #edit_map_cancel").on(
  "click",
  function () {
    // 新規Map登録モーダルを閉じる
    $(".map_name").val("");
    $(".map_path").val("");
    $(".modal_area").fadeOut();
  }
);

// 登録ボタン押下時の処理
$("#create_map_register").on("click", function () {
  // 入力内容の取得
  const name = $("#create_map_name").val();
  const path = $("#create_map_path").val();

  // バリデーションチェック
  if (!MapItemRegisterInputCheck(name, path)) {
    return;
  }

  // オブジェクトへ登録 & Map の表示
  topPage.NewMapItemAndSetMapList(name, path);

  // ストレージへ登録
  localStorage.setItem(mapArrayKeyName, topPage.GetValueToRegisterLocalStorage());

  // モーダルを閉じる
  $("#create_map_name").val("");
  $("#create_map_path").val("");
  $("#create_map_area").fadeOut();
});

// 更新ボタン押下時の処理
$("#edit_map_update").on("click", function () {
  // 入力内容の取得
  const name = $("#edit_map_name").val();
  const path = $("#edit_map_path").val();

  // バリデーションチェック
  if (!MapItemRegisterInputCheck(name, path)) {
    return;
  }

  // オブジェクトの更新 & Map の再表示
  topPage.UpdateMapItem(name, path);

  // ストレージへ登録
  localStorage.setItem(mapArrayKeyName, topPage.GetValueToRegisterLocalStorage());

  // モーダルを閉じる
  $("#edit_map_name").val("");
  $("#edit_map_path").val("");
  $("#edit_map_area").fadeOut();
});

// 削除ボタン押下時の処理
$("#edit_map_delete").on("click", function () {
  // 警告
  const result = confirm("登録してあるMemoもすべて消えますが、本当にこのMapを削除しますか？");
  if (!result) {
    return;
  }

  // オブジェクトの削除 & Map の再表示
  topPage.deleteMapItem();

  // ストレージへ登録
  localStorage.setItem(mapArrayKeyName, topPage.GetValueToRegisterLocalStorage());

  // モーダルを閉じる
  $("#edit_map_name").val("");
  $("#edit_map_path").val("");
  $("#edit_map_area").fadeOut();
});

// 関数
// バリデーションチェック
MapItemRegisterInputCheck = function (name, path) {
  if (name == "") {
    alert("「Map名」は必須です。入力してください。");
    return false;
  } else if (path == "") {
    alert("「Map画像のPath」は必須です。入力してください。");
    return false;
  }
  return true;
};

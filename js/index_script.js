// 変数定義
// TopPageクラスを生成
const topPage = new TopPage();

// localStorageのkey名
const selectedMapIndexKeyName = "selectedMapIndex";
const mapArrayKeyName = "mapAry";
const mapContentKeyPrefix = "mapCnt";
const memoArrayKeyPrefix = "memAry";
const memoContentKeyPrefix = "memCnt";

// 操作
// ロード時の操作
$(window).on("load", function () {
  // トップ画面のロード
  topPage.LoadTopPage();
});

// Map list のクリック時の操作
$("#map_list").on("click", "li:not(.selected_map_item)", function () {
  topPage.ChangeSelectedMap($("#map_list>li").index($(this)));
});

// 選択済の Map list のクリック時の操作
$("#map_list").on("click", ".selected_map_item", function () {
  // 登録値の設定
  $("#edit_map_name").val(topPage.MapList[topPage.SelectedMapIndex].MapName);
  $("#edit_map_path").val(topPage.CurrentMapItem.MapImgPath);
  $("#edit_map_area").fadeIn();
});

// Zoom スライダー変更時の操作
$("#zoom_range").on("input change", function () {
  // エラー処理
  if (topPage.MapList.length == 0) return;
  topPage.CurrentMapItem.ResizeMapImg($(this).val());
});

// スクロール変更時の操作
let timeOut;
$("main").on("scroll", function () {
  // 1. エラー処理
  if (topPage.MapList.length == 0) return;

  // 2. 0.5 秒間隔が空いたらスクロール位置を localStorage に登録する
  const main = $(this);
  clearTimeout(timeOut);
  timeOut = setTimeout(function () {
    topPage.CurrentMapItem.ScrollX = main.scrollLeft();
    topPage.CurrentMapItem.ScrollY = main.scrollTop();
    topPage.CurrentMapItem.SetMapCntToStorage();
  }, 500);
});

// Mapを追加するボタン押下時の操作
$("#add_map_btn").on("click", function () {
  // 1. 新規Map登録モーダルを開く
  $("#create_map_area").fadeIn();
});

// モーダルをキャンセル
$(".modal_overlay, .modal_close, #create_map_cancel, #edit_map_cancel, #memo_cancel").on(
  "click",
  function () {
    // 1. 新規Map登録モーダルを閉じる
    $(".map_name").val("");
    $(".map_path").val("");
    $(".modal_area").fadeOut();
  }
);

// 登録ボタン押下時の処理
$("#create_map_register").on("click", function () {
  // 1. 入力内容の取得
  const name = $("#create_map_name").val();
  const path = $("#create_map_path").val();

  // 2. バリデーションチェック
  if (!MapInputFormRequiredCheck(name, path)) {
    return;
  }

  // 3. Map の登録 & 表示
  topPage.CreateNewMap(name, path);

  // 4. モーダルを閉じる
  $("#create_map_name").val("");
  $("#create_map_path").val("");
  $("#create_map_area").fadeOut();
});

// 更新ボタン押下時の処理
$("#edit_map_update").on("click", function () {
  // 1. 入力内容の取得
  const name = $("#edit_map_name").val();
  const path = $("#edit_map_path").val();

  // 2. バリデーションチェック
  if (!MapInputFormRequiredCheck(name, path)) return;

  // 3. Map の更新 & 再表示
  topPage.UpdateMapItem(name, path);

  // モーダルを閉じる
  $("#edit_map_name").val("");
  $("#edit_map_path").val("");
  $("#edit_map_area").fadeOut();
});

// 削除ボタン押下時の処理
$("#edit_map_delete").on("click", function () {
  // 1. 警告
  const result = confirm("登録してあるMemoもすべて消えますが、本当にこのMapを削除しますか？");
  if (!result) return;

  // 2. オブジェクトの削除 & Map の再表示
  topPage.deleteMapItem();

  // モーダルを閉じる
  $("#edit_map_name").val("");
  $("#edit_map_path").val("");
  $("#edit_map_area").fadeOut();
});

// 関数
// 必須バリデーションチェック
MapInputFormRequiredCheck = function (name, path) {
  if (name == "") {
    alert("「Map名」は必須です。入力してください。");
    return false;
  } else if (path == "") {
    alert("「Map画像のPath」は必須です。入力してください。");
    return false;
  }
  return true;
};

GetMapCntKeyName = function (keyNum) {
  return mapContentKeyPrefix + keyNum;
};

GetMemAryKeyName = function (keyNum) {
  return memoArrayKeyPrefix + keyNum;
};

GetMemCntKeyName = function (keyNum) {
  return memoContentKeyPrefix + keyNum;
};

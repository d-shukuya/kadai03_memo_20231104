// 変数定義
// TopPageクラスを生成
const topPage = new TopPage();

// localStorageのkey名
const selectedMapIndexKeyName = "selectedMapIndex";
const mapArrayKeyName = "mapAry";
const mapContentKeyPrefix = "mapCnt";
const memoArrayKeyPrefix = "memAry";
const memoContentKeyPrefix = "memCnt";

// Icon のパス
const iconImgDic = {
  "01": "./img/01_hamburger.png",
  "02": "./img/02_french-fries.png",
  "03": "./img/03_hotdog.png",
  "04": "./img/04_pizza.png",
  "05": "./img/05_popcorn.png",
  "06": "./img/06_coffee.png",
  "07": "./img/07_juice.png",
};

// Icon のサイズ
const iconSizeClass = {
  "01": "small_pin",
  "02": "",
  "03": "large_pin",
};

// トップ画面の操作
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
  // 1. 画像サイズの変更
  if (topPage.MapList.length == 0) return;
  const zoomVal = $(this).val();
  topPage.CurrentMapItem.ResizeMapImg(zoomVal);

  // 3. メモアイコン位置の変更
  const elements = $("main .icon_pin_set");
  if (elements == null || elements.length == 0) return;
  for (let i = 0; i < elements.length; i++) {
    $(elements[i]).css({
      top: topPage.CurrentMapItem.MemoList[i].ReconvertTopFromRatio(zoomVal) + "px",
      left: topPage.CurrentMapItem.MemoList[i].ReconvertLeftFromRatio(zoomVal) + "px",
    });
  }
});

// スクロール変更時の操作
let scrollTimeOut;
$("main").on("scroll", function () {
  // 1. エラー処理
  if (topPage.MapList.length == 0) return;

  // 2. 0.5 秒間隔が空いたらスクロール位置を localStorage に登録する
  clearTimeout(scrollTimeOut);
  const main = $(this);
  scrollTimeOut = setTimeout(function () {
    topPage.CurrentMapItem.ScrollX = main.scrollLeft();
    topPage.CurrentMapItem.ScrollY = main.scrollTop();
    topPage.CurrentMapItem.SetMapCntToStorage();
  }, 500);
});

// マップ登録画面の操作
// Mapを追加するボタン押下時の操作
$("#add_map_btn").on("click", function () {
  // 1. 新規Map登録モーダルを開く
  $("#create_map_area").fadeIn();
});

// モーダルをキャンセル
$(
  "#edit_map_area>.modal_overlay, #create_map_area>.modal_overlay, .map_modal_close, #create_map_cancel, #edit_map_cancel, #memo_cancel"
).on("click", function () {
  // 1. 新規Map登録モーダルを閉じる
  $(".map_name").val("");
  $(".map_path").val("");
  $(".modal_area").fadeOut();
});

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

// メモ登録画面の操作
// Map 上の任意の位置のクリック時に登録モーダルを起動
let clickedPointLeft;
let clickedPointTop;
let isNew = false;
$("#map_img_blk").on("click", ".map_img", function (e) {
  // 1. 新規登録フラグは true
  isNew = true;
  const imgOffset = $(this).offset();
  clickedPointLeft = e.pageX - imgOffset.left;
  clickedPointTop = e.pageY - imgOffset.top;
  $("#memo_area").fadeIn();
});

// 既存の icon をクリック時の操作
$("main").on("click", ".icon_pin_set", function () {
  // 1. 新規登録フラグは false
  isNew = false;

  // 2. クリックされた Icon の memoIndex を取得
  const index = $("main .icon_pin_set").index($(this));
  topPage.CurrentMapItem.SelectedMemoIndexIndex = index;
  const memoIndex = topPage.CurrentMapItem.MemoList[index];

  // 3. memoCnt を取得する
  memoIndex.LoadMemCntFromStorage();

  // 4. 登録値の設定
  $("#memo_title").val(memoIndex.MemoTitle);
  $("#icon_type_selector").val(memoIndex.IconType);
  $("#icon_size_selector").val(memoIndex.IconSize);
  $("#memo_text").val(memoIndex.MemoCnt.MemoText);
  $("#memo_area").fadeIn();
});

// Icon 選択時の画像切り替え
$(".memo_icon_selector").change(function () {
  const iconImg = $(`<img />`).attr({ src: iconImgDic[$("option:selected").val()] });
  $("#memo_icon_img_blk").empty();
  $("#memo_icon_img_blk").append(iconImg);
});

// Memo の保存ボタン押下時の処理
$("#memo_save").on("click", function () {
  // 1. 入力内容の取得
  const title = $("#memo_title").val();
  const iconType = $("#icon_type_selector").val();
  const iconSize = $("#icon_size_selector").val();
  const memoText = $("#memo_text").val();

  // 2. バリデーションチェック
  if (!MemoInputFormRequiredCheck(title)) {
    return;
  }

  // 3. Memo の登録 & 表示
  let memoIndex;
  if (isNew) {
    memoIndex = topPage.CurrentMapItem.CreateNewMemo(
      title,
      iconType,
      iconSize,
      clickedPointTop,
      clickedPointLeft
    );
  } else {
    memoIndex = topPage.CurrentMapItem.UpdateMemo(title, iconType, iconSize);
  }
  memoIndex.CreateMemoCnt(memoText);

  // 4. モーダルを閉じる
  $("#memo_title").val("");
  $("#icon_type_selector").val("");
  $("#icon_size_selector").val("");
  $("#memo_text").val("");
  $("#memo_area").fadeOut();
});

// モーダルをキャンセル
$("#memo_area>#memo_area_overlay, .memo_modal_close, #memo_cancel").on("click", function () {
  // 1. 値をリセットしてモーダルを閉じる
  $("#memo_title").val("");
  $("#icon_type_selector").val("");
  $("#icon_size_selector").val("");
  $("#memo_text").val("");
  $(".modal_area").fadeOut();
});

// 関数
// Mapの必須バリデーションチェック
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

// Memoの必須バリデーションチェック
MemoInputFormRequiredCheck = function (title) {
  if (title == "") {
    alert("「Title」は必須です。入力してください。");
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

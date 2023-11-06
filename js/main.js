// 変数定義
// Mapsクラスを生成
const maps = new Maps();

// localStorageのkey名
const selectedMapIndexKeyName = "selectedMapIndex";
const mapArrayKeyName = "mapArray";

// テスト用データ
// const mapArray = [
//   ["M002", "Map_01", "./img/sample01.jpg", 150, 50, 100],
//   ["M011", "Map_02", "./img/sample02.jpg", 160, 100, 150],
//   ["M001", "Map_03", "./img/sample03.jpg", 140, 80, 200],
// ];

// 操作
// ロード時の操作
$(window).on("load", function () {
  // 1. selectedMapIndex を取得する
  maps.SelectedMapIndex = localStorage.getItem(selectedMapIndexKeyName);

  // 2. MapList を取得する
  let mapArrayJson = localStorage.getItem(mapArrayKeyName);
  let mapArray;
  if (mapArrayJson == null) {
    mapArray = [];
  } else {
    mapArray = JSON.parse(mapArrayJson);
  }
  maps.LoadMapList(mapArray);
});

// Map list のクリック時の操作
$("#map_list").on("click", "li:not(.selected_map_item)", function () {
  const index = $("#map_list>li").index($(this));
  maps.ChangeSelectedItem(index);
});

$("#map_list").on("click", ".selected_map_item", function () {
  alert("選択済みリストを押下");
});

// Zoom スライダー変更時の操作
$("#zoom_range").on("input change", function () {
  const zoomVal = $(this).val();
  maps.MapList[maps.SelectedMapIndex].ResizeMapImgAndMemo(zoomVal);
  localStorage.setItem(mapArrayKeyName, maps.GetValueToRegisterLocalStorage());
});

// スクロール変更時の操作
let timeOut;
$("main").on("scroll", function () {
  const main = $(this);
  clearTimeout(timeOut);
  timeOut = setTimeout(function () {
    const item = maps.MapList[maps.SelectedMapIndex];
    item.ScrollX = main.scrollLeft();
    item.ScrollY = main.scrollTop();
    localStorage.setItem(mapArrayKeyName, maps.GetValueToRegisterLocalStorage());
  }, 500);
});

// Mapを追加するボタン押下時の操作
$("#add_map_btn").on("click", function () {
  // 新規Map登録モーダルを開く
  $("#create_map_area").fadeIn();
});

$("#create_map_area_overlay, #create_map_area_close, #create_map_cancel").on("click", function () {
  // 新規Map登録モーダルを閉じる
  $("#create_map_name").val("");
  $("#create_map_path").val("");
  $("#create_map_area").fadeOut();
});

$("#create_map_register").on("click", function () {
  // 入力内容の取得
  const name = $("#create_map_name").val();
  const path = $("#create_map_path").val();

  // バリデーションチェック
  if (name == "") {
    alert("「Map名」は必須です。入力してください。");
    return;
  } else if (path == "") {
    alert("「Map画像のPath」は必須です。入力してください。");
    return;
  }

  // オブジェクトへ登録 & Map の表示
  maps.NewMapItemAndSetMapList(name, path);

  // ストレージへ登録
  localStorage.setItem(mapArrayKeyName, maps.GetValueToRegisterLocalStorage());

  // モーダルを閉じる
  $("#create_map_name").val("");
  $("#create_map_path").val("");
  $("#create_map_area").fadeOut();
});

// 関数

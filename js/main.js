// 変数定義
// Mapsクラスを生成
const maps = new Maps();

// テスト用データ
const mapArray = [
  ["Map_01", "./img/sample01.jpg", [], 150, 50, 100],
  ["Map_02", "./img/sample02.jpg", [], 160, 100, 150],
  ["Map_03", "./img/sample03.jpg", [], 140, 80, 200],
];
const selectedMapItemIndex = 2;

// 操作
// ロード時の操作
$(window).on("load", function () {
  maps.LoadMapList(mapArray, selectedMapItemIndex);
});

// Map list のクリック時の操作
$("#map_list").on("click", "li", function () {
  const index = $("#map_list>li").index($(this));
  maps.ChangeSelectedItem(index);
});

// スライダー変更時の操作
$("#zoom_range").on("input change", function () {
  maps.MapList[maps.SelectedItemIndex].ResizeMapImgAndMemo($(this).val());
});

// スクロール変更時の操作
let timeOut;
$("main").on("scroll", function () {
  const main = $(this);
  clearTimeout(timeOut);
  timeOut = setTimeout(function () {
    const scrollX = main.scrollLeft();
    const scrollY = main.scrollTop();
  }, 500);
});

// Mapを追加するボタン押下時の操作
$("#add_map_btn").on("click", function () {
  // 新規Map登録モーダルを表示
  $("#create_map_area").fadeIn();
});

$("#create_map_area_overlay, #create_map_area_close, #create_map_cancel").on("click", function () {
  // 新規Map登録モーダルを表示
  $("#create_map_area").fadeOut();
});

$("#create_map_register").on("click", function () {
});

// 関数

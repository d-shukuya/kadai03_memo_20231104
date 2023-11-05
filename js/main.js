// 変数定義
// Mapsクラスを生成
const maps = new Maps();

// テスト用データ
const mapArray = [
  ["Map_01", "./img/sample01.jpg", [], 100, 50, 100],
  ["Map_02", "./img/sample02.jpg", [], 70, 0, 0],
  ["Map_03", "./img/sample03.jpg", [], 120, 100, 200],
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
  maps.MapList[maps.SelectedItemIndex].ChangeZoomRange($("#zoom_range").val());
});

// スクロール変更時の操作
let timeOut;
$("main").on("scroll", function () {
  clearTimeout(timeOut);
  timeOut = setTimeout(function () {
    const scrollX = $("main").scrollLeft();
    const scrollY = $("main").scrollTop();
    console.log("scrollX", scrollX);
    console.log("scrollY", scrollY);
  }, 500);
});

// 関数

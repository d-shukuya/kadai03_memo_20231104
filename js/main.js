// 操作

// ロード時の操作
$(window).on("load", function () {
  SetZoomRange($("#zoom_range").val());
});

// スライダー変更時の操作
$("#zoom_range").on("input change", function () {
  SetZoomRange($("#zoom_range").val());
});

// 関数
SetZoomRange = function (zoomVal) {
  // zoom 倍率数の表示
  const html = `zoom: ${zoomVal} %`;
  $("#display_zoom_range").html(html);

  // マップ画像の倍率反映
  const cal = (1580 * zoomVal) / 100;
  const px = `${cal}px`;
  $(".map_img").css("width", px);
};

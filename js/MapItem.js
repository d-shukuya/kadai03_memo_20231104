class MapItem {
  #memoList = [];

  #mapName = "";
  set MapName(val) {
    this.#mapName = val;
  }
  get MapName() {
    return this.#mapName;
  }

  #mapImgPath = "";
  set MapImgPath(val) {
    this.#mapImgPath = val;
  }
  get MapImgPath() {
    return this.#mapImgPath;
  }

  #zoomValue = 100;
  set ZoomValue(val) {
    this.#zoomValue = val;
  }
  get ZoomValue() {
    return this.#zoomValue;
  }

  #scrollX = 0;
  set ScrollX(val) {
    this.#scrollX = val;
  }
  get ScrollX() {
    return this.#scrollX;
  }

  #scrollY = 0;
  set ScrollY(val) {
    this.#scrollY = val;
  }
  get ScrollY() {
    return this.#scrollY;
  }

  constructor(name, path, zoomVal, x, y) {
    this.#mapName = name;
    this.#mapImgPath = path;
    this.#zoomValue = zoomVal;
    this.#scrollX = x;
    this.#scrollY = y;
  }

  SetMemoItem(path, title, text, x, y) {
    this.#memoList.push(new MemoItem(path, title, text, x, y));
  }

  LoadMapImgAndMemo() {
    // 背景画像の表示
    const mapItemImgHtml = `<img class="map_img" src=${this.#mapImgPath} alt="" />`;
    $("main").empty();
    $("main").append(mapItemImgHtml);
    this.LoadZoomRange();

    // メモアイコンの表示
  }

  // 画像の倍率を変更する
  LoadZoomRange() {
    // zoom 倍率数の表示
    const html = `zoom: ${this.#zoomValue} %`;
    $("#display_zoom_range").html(html);

    // マップ画像の倍率反映
    const cal = (1580 * this.#zoomValue) / 100;
    const px = `${cal}px`;
    $(".map_img").css("width", px);
    $("#zoom_range").val(this.#zoomValue);
  }

  ChangeZoomRange(zoomVal) {
    this.#zoomValue = zoomVal;
    this.LoadZoomRange();
  }

  LoadScrollPosition() {
    $("main").scrollLeft(this.#scrollX);
    $("main").scrollTop(this.#scrollY);
    console.log("scrollX", this.#scrollX);
    console.log("scrollY", this.#scrollY);
  }
}

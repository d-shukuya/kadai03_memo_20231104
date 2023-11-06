class MapItem {
  #memoList = [];
  #baseImgWidth = 1580;

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
    // zoom スライダーの設定
    $("#display_zoom_range").html(`zoom: ${this.#zoomValue} %`);
    $("#zoom_range").val(this.#zoomValue);

    // 背景画像の表示
    const mapImg = $(`<img />`)
      .attr({ class: "map_img", src: this.#mapImgPath })
      .css({ width: this.CalImgWidthPx() });
    $("main").empty();
    $("main").append(mapImg);
    // スクロール位置の設定
    mapImg.on("load", () => this.LoadScrollPosition());

    // メモアイコンの表示
  }

  ResizeMapImgAndMemo(zoomVal) {
    // zoom スライダーの設定
    this.#zoomValue = zoomVal;
    $("#display_zoom_range").html(`zoom: ${zoomVal} %`);

    // 背景画像の表示
    const mapImg = $(`<img />`)
      .attr({ class: "map_img", src: this.#mapImgPath })
      .css({ width: this.CalImgWidthPx() });
    $("main").empty();
    $("main").append(mapImg);

    // メモアイコンの表示
  }

  // zoom倍率から画像幅を計算
  CalImgWidthPx() {
    return `${(this.#baseImgWidth * this.#zoomValue) / 100}`;
  }

  // スクロール位置の設定
  LoadScrollPosition() {
    $("main").scrollLeft(this.#scrollX);
    $("main").scrollTop(this.#scrollY);
  }
}

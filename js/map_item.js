class MapItem {
  #memoList = [];
  #baseImgWidth = 1580;

  #mapKeyNum = "";
  set MapKeyNum(val) {
    if (val == null || val == "") {
      this.#mapKeyNum = "M000";
    } else {
      this.#mapKeyNum = val;
    }
  }
  get MapKeyNum() {
    return this.#mapKeyNum;
  }

  #mapName = "";
  set MapName(val) {
    if (val == null) {
      this.#mapName = "";
    } else {
      this.#mapName = val;
    }
  }
  get MapName() {
    return this.#mapName;
  }

  #mapImgPath = "";
  set MapImgPath(val) {
    if (val == null) {
      this.#mapImgPath = "";
    } else {
      this.#mapImgPath = val;
    }
  }
  get MapImgPath() {
    return this.#mapImgPath;
  }

  #zoomValue = 100;
  set ZoomValue(val) {
    if (val == null || val == "") {
      this.#zoomValue = 100;
    } else {
      this.#zoomValue = val;
    }
  }
  get ZoomValue() {
    return this.#zoomValue;
  }

  #scrollX = 0;
  set ScrollX(val) {
    if (val == null || val == "") {
      this.#scrollX = 0;
    } else {
      this.#scrollX = val;
    }
  }
  get ScrollX() {
    return this.#scrollX;
  }

  #scrollY = 0;
  set ScrollY(val) {
    if (val == null || val == "") {
      this.#scrollY = 0;
    } else {
      this.#scrollY = val;
    }
  }
  get ScrollY() {
    return this.#scrollY;
  }

  constructor(key, name, path, zoomVal, x, y) {
    this.MapKeyNum = key;
    this.MapName = name;
    this.MapImgPath = path;
    this.ZoomValue = zoomVal;
    this.ScrollX = x;
    this.ScrollY = y;
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

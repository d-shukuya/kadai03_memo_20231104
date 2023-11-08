// MapItem クラス（マップのコンテンツを保持）
class MapItem {
  #memoList = [];
  #baseImgWidth = 1580;
  #mapImgClassName = "map_img";

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

  constructor(key, path, zoomVal, x, y) {
    this.MapKeyNum = key;
    this.MapImgPath = path;
    this.ZoomValue = zoomVal;
    this.ScrollX = x;
    this.ScrollY = y;
  }

  ResetScreenSetting() {
    this.ZoomValue = 100;
    this.ScrollX = 0;
    this.ScrollY = 0;
  }

  ShowMapImg() {
    // エラー処理
    if (this.MapImgPath == "") {
      $("#display_zoom_range").html(`zoom: - %`);
      $("#zoom_range").val(100);
      return;
    }

    // 1. zoom スライダーの設定
    $("#display_zoom_range").html(`zoom: ${this.ZoomValue} %`);
    $("#zoom_range").val(this.ZoomValue);

    // 2. 背景画像の表示
    const mapImg = $(`<img />`)
      .attr({ class: this.#mapImgClassName, src: this.#mapImgPath })
      .css({ width: this.CalImgWidthPx() });
    $("main").empty();
    $("main").append(mapImg);

    // 3. スクロール位置の設定
    mapImg.on("load", () => this.LoadScrollPosition());
  }

  ResizeMapImg(zoomVal) {
    // 1. zoom スライダーの設定
    this.ZoomValue = zoomVal;
    $("#display_zoom_range").html(`zoom: ${zoomVal} %`);

    // 2. localStorage を更新
    this.SetMapCntToStorage();

    // 2. 背景画像の表示サイズを変更
    $(`.${this.#mapImgClassName}`).css("width", this.CalImgWidthPx());
  }

  // zoom倍率から画像幅を計算
  CalImgWidthPx() {
    return `${(this.#baseImgWidth * this.ZoomValue) / 100}`;
  }

  // スクロール位置の設定
  LoadScrollPosition() {
    $("main").scrollLeft(this.#scrollX);
    $("main").scrollTop(this.#scrollY);
  }

  // localStorage との通信用メソッド
  // mapCnt を localStorage からロード
  LoadMapCntFromStorage(mapKeyNum) {
    // 1. localStorage からロード
    const arrayJson = localStorage.getItem(GetMapCntKeyName(mapKeyNum));

    // array が空なら処理をしない
    if (arrayJson == null || arrayJson.length == 0) return;

    // JSONのパース
    let array = JSON.parse(arrayJson);

    // ロードした値を MapItem オブジェクトへマッピング
    this.MapKeyNum = array[0];
    this.MapImgPath = array[1];
    this.ZoomValue = array[2];
    this.ScrollX = array[3];
    this.ScrollY = array[4];
  }

  // mapCnt を LocalStorage へ保存
  SetMapCntToStorage() {
    localStorage.setItem(
      GetMapCntKeyName(this.MapKeyNum),
      JSON.stringify([this.MapKeyNum, this.MapImgPath, this.ZoomValue, this.ScrollX, this.ScrollY])
    );
  }

  // mapCnt を LocalStorage から削除する
  DeleteMapCntToStorage(mapKeyNum) {
    localStorage.removeItem(GetMapCntKeyName(mapKeyNum));
  }
}

// MapIndex クラス（マップ一覧の内容を保持）
class MapIndex {
  #mapKeyNum = ""; // 書式は「M001」
  set MapKeyNum(val) {
    this.#mapKeyNum = val;
  }
  get MapKeyNum() {
    return this.#mapKeyNum;
  }

  #mapName = "";
  set MapName(val) {
    this.#mapName = val;
  }
  get MapName() {
    return this.#mapName;
  }

  constructor(key, name) {
    this.MapKeyNum = key;
    this.MapName = name;
  }
}

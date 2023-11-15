// MapItem クラス（マップのコンテンツを保持）
class MapItem {
  // 表示されているマップ上のメモ一覧
  #baseImgWidth = 1580;
  #mapImgClassName = "map_img";

  // memoIndex のリスト
  MemoList = [];

  // 選択された memoIndex の index
  #selectedMemoIndexIndex = 0;
  set SelectedMemoIndexIndex(val) {
    this.#selectedMemoIndexIndex = val;
  }
  get SelectedMemoIndexIndex() {
    return this.#selectedMemoIndexIndex;
  }

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

  // Map の操作
  ShowMapImg() {
    // 1. エラー処理
    if (this.MapImgPath == "") {
      $("#display_zoom_range").html(`zoom: - %`);
      $("#zoom_range").val(100);
      return;
    }

    // 2. zoom スライダーの設定
    $("#display_zoom_range").html(`zoom: ${this.ZoomValue} %`);
    $("#zoom_range").val(this.ZoomValue);

    // 3. 背景画像の表示
    const mapImg = $(`<img />`)
      .attr({ class: this.#mapImgClassName, src: this.#mapImgPath })
      .css({ width: this.CalImgWidthPx() });
    $("#map_img_blk").empty();
    $("#map_img_blk").append(mapImg);

    // 4. スクロール位置の設定
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

  // Memo の操作
  ShowMemoIcon() {
    // 1. エラー処理
    if (this.MemoList == null || this.MemoList.length == 0) return;

    // 2. Iconの表示
    this.MemoList.forEach((e) => {
      this.PutNewIcon(e);
    });
  }

  // localStorage との通信用メソッド
  // mapCnt を localStorage からロード
  LoadMapCntFromStorage(mapKeyNum) {
    // 1. localStorage からロード
    const arrayJson = localStorage.getItem(GetMapCntKeyName(mapKeyNum));

    // 2. array が空なら処理をしない
    if (arrayJson == null || arrayJson.length == 0) return;

    // 3. JSONのパース
    let array = JSON.parse(arrayJson);

    // 4. ロードした値を MapItem オブジェクトへマッピング
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

  // mapAry を localStorage からロード
  LoadMemAryFromStorage() {
    // 1. localStorage からロード
    const arrayJson = localStorage.getItem(GetMemAryKeyName(this.MapKeyNum));

    // array が空なら処理をしない
    if (arrayJson == null || arrayJson.length == 0) {
      this.MemoList = [];
      return;
    }

    // JSONのパース
    let array = JSON.parse(arrayJson);

    // ロードした値を MemoIndex オブジェクトへマッピング
    array.forEach((e) => {
      this.MemoList.push(new MemoIndex(e[0], e[1], e[2], e[3], e[4], e[5]));
    });
  }

  // mapAry を localStorage へ保存
  SetMemAryToStorage() {
    let array = [];
    if (this.MemoList.length != 0) {
      this.MemoList.forEach((memoIndex) => {
        array.push([
          memoIndex.MemoKeyNum,
          memoIndex.MemoTitle,
          memoIndex.IconType,
          memoIndex.IconSize,
          memoIndex.IconTopRatio,
          memoIndex.IconLeftRatio,
        ]);
      });
    }
    localStorage.setItem(GetMemAryKeyName(this.MapKeyNum), JSON.stringify(array));
  }

  // mapCnt を LocalStorage から削除する
  DeleteMapCntToStorage(mapKeyNum) {
    localStorage.removeItem(GetMapCntKeyName(mapKeyNum));
  }

  // memoIcon の操作
  // Icon を指定の位置に配置する
  CreateNewMemo(title, type, size, top, left) {
    // 1. memoKeyNum の採番
    let keyNum = "";
    if (this.MemoList.length == 0) {
      keyNum = `${this.MapKeyNum}-001`;
    } else {
      for (let i = 1; i < 1000; i++) {
        if (this.MemoList.every((e) => Number(e.MemoKeyNum.trim().substr(5)) != i)) {
          keyNum = `${this.MapKeyNum}-` + String(i).padStart(3, "0");
          break;
        }
      }
    }

    // 2. MemoIndex の作成 と MemoList への追加
    const memoIndex = new MemoIndex(
      keyNum,
      title,
      type,
      size,
      this.ConvertToRatio(top),
      this.ConvertToRatio(left)
    );
    this.MemoList.push(memoIndex);

    // 3. localStorage へ登録
    this.SetMemAryToStorage();

    // 4. 画面表示
    this.PutNewIcon(memoIndex);

    // 5. 返り値設定
    return memoIndex;
  }

  UpdateMemo(title, type, size) {
    // 1. MemoIndex へ反映
    const memoIndex = this.MemoList[this.SelectedMemoIndexIndex];
    memoIndex.MemoTitle = title;
    memoIndex.IconType = type;
    memoIndex.IconSize = size;

    // 2. localStorage へ登録
    this.SetMemAryToStorage();

    // 3. 画面表示を更新
    this.UpdateIcon(memoIndex);

    // 4. 返り値設定
    return memoIndex;
  }

  ConvertToRatio(val) {
    if (this.ZoomValue == 0) return;
    return val / this.ZoomValue;
  }

  ReconvertFromRatio(ratio) {
    return ratio * this.ZoomValue;
  }

  PutNewIcon(memoIndex) {
    const iconImg = $(`<img />`).attr({
      class: `icon_pin ${iconSizeClass[memoIndex.IconSize]}`,
      src: iconImgDic[memoIndex.IconType],
    });
    const iconLabel = $("<label />").attr({ class: "icon_pin_label" }).html(memoIndex.MemoTitle);
    const iconPinSet = $("<div />")
      .attr({ class: "icon_pin_set" })
      .css({
        top: `${this.ReconvertFromRatio(memoIndex.IconTopRatio) - 40}px`,
        left: `${this.ReconvertFromRatio(memoIndex.IconLeftRatio) - 50}px`,
      });

    let self = this;
    iconPinSet.draggable({
      stop: function (event, ui) {
        // ドロップ位置の位置を取得
        const left = ui.position.left;
        const top = ui.position.top;
        memoIndex.IconLeftRatio = self.ConvertToRatio(left + 50);
        memoIndex.IconTopRatio = self.ConvertToRatio(top + 40);
        // localStorage へ登録
        self.SetMemAryToStorage();
      },
    });
    iconPinSet.append(iconImg);
    iconPinSet.append(iconLabel);
    $("main").append(iconPinSet);
  }

  UpdateIcon(memoIndex) {
    // 該当のIconを取得
    const iconPinSet = $("main>.icon_pin_set").eq(this.SelectedMemoIndexIndex);

    // 中身をクリア
    iconPinSet.empty();

    // 中身をセット
    const iconImg = $(`<img />`).attr({
      class: `icon_pin ${iconSizeClass[memoIndex.IconSize]}`,
      src: iconImgDic[memoIndex.IconType],
    });
    const iconLabel = $("<label />").attr({ class: "icon_pin_label" }).html(memoIndex.MemoTitle);
    iconPinSet.append(iconImg);
    iconPinSet.append(iconLabel);
  }

  DeleteMemo(index) {
    const memoIndex = this.MemoList[index];

    // 1. 対象の Icon を画面から削除
    $("main>.icon_pin_set").eq(index).remove();

    // 2. MemoItem を localStorage から削除
    memoIndex.MemoCnt.DeleteMemCntFromStorage();

    // 3. 対象の MemoIndex を MemoList から削除
    this.MemoList.splice(index, 1);

    // 4. MemoList を localStorage に反映
    this.SetMemAryToStorage();
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

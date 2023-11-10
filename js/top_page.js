class TopPage {
  // プロパティ
  // HTML要素のクラス名
  #selectedMapClassName = "selected_map_item";

  // 表示されているマップ一覧
  MapList = [];

  // マップ一覧内の選択されている Map のインデックス
  #selectedMapIndex = 0;
  set SelectedMapIndex(val) {
    if (val == null || val == "" || val < 0) {
      this.#selectedMapIndex = 0;
      // インデックスの値をストレージに再セット
      this.SetSelectedMapIndexToStorage();
    } else {
      this.#selectedMapIndex = val;
    }
  }
  get SelectedMapIndex() {
    return this.#selectedMapIndex;
  }

  // 選択されている Map
  CurrentMapItem = new MapItem("", "", 100, 0, 0);

  // メソッド
  // トップ画面のロード処理
  LoadTopPage() {
    // 1. selectedMapIndex をロード
    this.LoadSelectedMapIndexFromStorage();

    // 2. MapList のロード & 表示
    this.LoadMapAryFromStorage();
    if (this.MapList.length == 0) {
      $("#display_zoom_range").html(`zoom: - %`);
      $("#zoom_range").val(100);
      return;
    }
    this.ShowMapList();

    // 3. Map 本体のロード & 表示
    this.CurrentMapItem = new MapItem("", "", 100, 0, 0);
    this.CurrentMapItem.LoadMapCntFromStorage(this.MapList[this.SelectedMapIndex].MapKeyNum);
    this.CurrentMapItem.ShowMapImg();

    // 4. MemoList のロード
    this.CurrentMapItem.LoadMemAryFromStorage();
    this.CurrentMapItem.ShowMemoIcon();
  }

  // マップリストを画面表示する
  ShowMapList() {
    $("#map_list").empty();
    this.MapList.forEach((mapIndex) => {
      $("#map_list").append(`<li>${mapIndex.MapName}</li>`);
    });
    $("#map_list li").eq(this.SelectedMapIndex).addClass(this.#selectedMapClassName);
  }

  ChangeSelectedMap(clickedMapIndex) {
    const oldIndex = this.SelectedMapIndex;
    const newIndex = clickedMapIndex;

    // 1. SelectedMapIndex の更新
    this.SelectedMapIndex = newIndex;
    this.SetSelectedMapIndexToStorage();

    // 2. 選択された Map 本体のロード
    if (this.MapList.length == 0) return;
    this.CurrentMapItem = new MapItem("", "", 100, 0, 0);
    this.CurrentMapItem.LoadMapCntFromStorage(this.MapList[newIndex].MapKeyNum);

    // 3. 画面表示の更新
    $("#map_list li").eq(oldIndex).removeClass(this.#selectedMapClassName);
    $("#map_list li").eq(newIndex).addClass(this.#selectedMapClassName);
    this.CurrentMapItem.ShowMapImg();
  }

  // Map の新規作成処理
  CreateNewMap(name, path) {
    // 1. mapKeyNum の採番
    let keyNum = "";
    if (this.MapList.length == 0) {
      keyNum = "M001";
    } else {
      for (let i = 1; i < 1000; i++) {
        if (this.MapList.every((e) => Number(e.MapKeyNum.trim().substr(1)) != i)) {
          keyNum = "M" + String(i).padStart(3, "0");
          break;
        }
      }
    }

    // 2. MapIndex の作成 と MapList への追加
    this.MapList.push(new MapIndex(keyNum, name));
    this.SelectedMapIndex = this.MapList.length - 1;
    this.CurrentMapItem = new MapItem(keyNum, path, 100, 0, 0);

    // 3. localStorage へ登録
    this.SetSelectedMapIndexToStorage();
    this.SetMapAryToStorage();
    this.CurrentMapItem.SetMapCntToStorage();

    // 4. 画面表示
    this.ShowMapList();
    this.CurrentMapItem.ShowMapImg();
  }

  // MapItem更新時の処理
  UpdateMapItem(name, path) {
    // マップ名に変更がある場合
    const currentMapIndex = this.MapList[this.SelectedMapIndex];
    if (name != currentMapIndex.MapName) {
      // 1. オブジェクトの更新
      currentMapIndex.MapName = name;

      // 2. localStorage の更新
      this.SetMapAryToStorage();

      // 3. 画面表示の更新
      $(".selected_map_item").html(name);
    }

    // マップ画像のパスに変更がある場合
    if (path != this.CurrentMapItem.MapImgPath) {
      // 1. オブジェクトの更新
      this.CurrentMapItem.MapImgPath = path;
      this.CurrentMapItem.ResetScreenSetting();

      // 2. localStorage の更新
      this.CurrentMapItem.SetMapCntToStorage();

      // 3. 画面表示の更新
      this.CurrentMapItem.ShowMapImg();
    }
  }

  // MapItem削除時の処理
  deleteMapItem() {
    // 1. 新しい SelectedMapIndex を一つ上に設定
    let oldIndex = this.SelectedMapIndex;
    let newIndex = 0;
    if (oldIndex <= 0) {
      newIndex = 0;
    } else {
      newIndex = oldIndex - 1;
    }
    this.SelectedMapIndex = newIndex;
    this.SetSelectedMapIndexToStorage();

    let oldMapKeyNum = this.MapList[oldIndex].MapKeyNum;
    let newMapKeyNum = this.MapList[newIndex].MapKeyNum;

    // 2. 対象の MapIndex をリストから削除
    this.MapList.splice(oldIndex, 1);
    $(`.${this.#selectedMapClassName}`).remove();
    this.SetMapAryToStorage();

    // 3. 画面表示の変更
    if (this.MapList.length == 0) {
      $("#display_zoom_range").html(`zoom: - %`);
      $("#zoom_range").val(100);
      $("#map_img_blk").empty();
    } else {
      // 3-1. localStorage から MapItem を取得する
      this.CurrentMapItem = new MapItem("", "", 100, 0, 0);
      this.CurrentMapItem.LoadMapCntFromStorage(newMapKeyNum);

      // 3-2. 画面表示
      $("#map_list li").eq(newIndex).addClass(this.#selectedMapClassName);
      this.CurrentMapItem.ShowMapImg();
    }

    // mapCnt を LocalStorage から削除する
    this.CurrentMapItem.DeleteMapCntToStorage(oldMapKeyNum);
  }

  // localStorage との通信用メソッド
  // selectedMapIndex を localStorage からロード
  LoadSelectedMapIndexFromStorage() {
    this.SelectedMapIndex = localStorage.getItem(selectedMapIndexKeyName);
  }

  // selectedMapIndex を localStorage へ保存
  SetSelectedMapIndexToStorage() {
    localStorage.setItem(selectedMapIndexKeyName, this.SelectedMapIndex);
  }

  // mapAry を localStorage からロード
  LoadMapAryFromStorage() {
    // localStorage からロード
    const arrayJson = localStorage.getItem(mapArrayKeyName);

    // array が空なら処理をしない
    if (arrayJson == null || arrayJson.length == 0) {
      this.MapList = [];
      return;
    }

    // JSONのパース
    let array = JSON.parse(arrayJson);

    // ロードした値を MapIndex オブジェクトへマッピング
    array.forEach((e) => {
      this.MapList.push(new MapIndex(e[0], e[1]));
    });
  }

  // mapAry を localStorage へ保存
  SetMapAryToStorage() {
    let array = [];
    if (this.MapList.length != 0) {
      this.MapList.forEach((mapIndex) => {
        array.push([mapIndex.MapKeyNum, mapIndex.MapName]);
      });
    }
    localStorage.setItem(mapArrayKeyName, JSON.stringify(array));
  }
}

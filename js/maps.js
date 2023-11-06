class Maps {
  #selectedItemClassName = "selected_map_item";

  #selectedMapIndex = 0;
  set SelectedMapIndex(val) {
    if (val == null || val == "" || val < 0) {
      this.#selectedMapIndex = 0;
    } else {
      this.#selectedMapIndex = val;
    }
  }
  get SelectedMapIndex() {
    return this.#selectedMapIndex;
  }

  MapList = [];

  //ストレージからロード
  LoadMapList(array) {
    // array が空なら処理をしない
    if (array.length == 0) {
      $("#display_zoom_range").html(`zoom: ${100} %`);
      $("#zoom_range").val(100);
      return;
    }

    // ロードしたインデックスの値をストレージに再セット
    this.SetSelectedMapIndexToStorage(this.#selectedMapIndex);

    // ロードした値をオブジェクトへマッピング
    for (let i = 0; i < array.length; i++) {
      const mapItem = new MapItem(
        array[i][0],
        array[i][1],
        array[i][2],
        array[i][3],
        array[i][4],
        array[i][5]
      );
      this.MapList.push(mapItem);
      this.ShowMapList(array[i][1]);
    }

    const selectedItem = this.MapList[this.#selectedMapIndex];
    selectedItem.LoadMapImgAndMemo();
    $("#map_list li").eq(this.#selectedMapIndex).addClass(this.#selectedItemClassName);
  }

  ShowMapList(name) {
    $("#map_list").append(`<li>${name}</li>`);
  }

  ChangeSelectedItem(clickedItemIndex) {
    // 画面表示の変更
    $("#map_list li").eq(this.#selectedMapIndex).removeClass(this.#selectedItemClassName);
    $("#map_list li").eq(clickedItemIndex).addClass(this.#selectedItemClassName);
    this.MapList[clickedItemIndex].LoadMapImgAndMemo();
    this.#selectedMapIndex = clickedItemIndex;

    // localStorage への保存
    this.SetSelectedMapIndexToStorage(this.#selectedMapIndex);
  }

  // localStorage への保存
  SetSelectedMapIndexToStorage(index) {
    localStorage.setItem(selectedMapIndexKeyName, index);
  }

  // 新規作成時の作成処理
  NewMapItemAndSetMapList(name, path) {
    // mapKeyNum の採番
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

    // MapItem の生成 & MapList に追加
    const item = new MapItem(keyNum, name, path, 100, 0, 0);
    this.MapList.push(item);

    // 追加したリストを表示
    this.ShowMapList(name);

    // selectedItem をセットし、画像を表示
    this.ChangeSelectedItem(this.MapList.length - 1);
  }

  // localStorage への登録する value を返す
  GetValueToRegisterLocalStorage() {
    let array = this.MapList.map((e) => {
      return [e.MapKeyNum, e.MapName, e.MapImgPath, e.ZoomValue, e.ScrollX, e.ScrollY];
    });
    return JSON.stringify(array);
  }
}

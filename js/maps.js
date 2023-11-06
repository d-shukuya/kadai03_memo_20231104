class Maps {
  #selectedItemClassName = "selected_map_item";

  #selectedItemIndex = 0;
  set SelectedItemIndex(val) {
    this.#selectedItemIndex = val;
  }
  get SelectedItemIndex() {
    return this.#selectedItemIndex;
  }

  MapList = [];

  //ストレージからロード
  //listの構造
  //   list = [
  //     ["mapName_1", "mapImgPath_1", [
  //         [iconPath_1-1, title_1-1, text_1-1, x_1-1, y_1-1],
  //         [iconPath_1-2, title_1-2, text_1-2, x_1-2, y_1-2],
  //         [iconPath_1-3, title_1-3, text_1-3, x_1-3, y_1-3],
  //     ]],
  //     ・・・
  //   ];
  LoadMapList(array, index) {
    for (let i = 0; i < array.length; i++) {
      const mapItem = new MapItem(array[i][0], array[i][1], array[i][3], array[i][4], array[i][5]);
      for (let m = 0; m < array[i][2].length; m++) {
        mapItem.SetMemoItem(
          array[i][2][m][0],
          array[i][2][m][1],
          array[i][2][m][2],
          array[i][2][m][3],
          array[i][2][m][4]
        );
      }
      this.MapList.push(mapItem);
      this.ShowMapList(array[i][0]);
    }

    if (index == "") {
      this.#selectedItemIndex = 0;
    } else {
      this.#selectedItemIndex = index;
    }
    const selectedItem = this.MapList[this.#selectedItemIndex];
    selectedItem.LoadMapImgAndMemo();
    $("#map_list li").eq(this.#selectedItemIndex).addClass(this.#selectedItemClassName);
  }

  ShowMapList(name) {
    $("#map_list").append(`<li>${name}</li>`);
  }

  ChangeSelectedItem(clickedItemIndex) {
    // 選択済みのマップをクリックした場合
    if (clickedItemIndex == this.#selectedItemIndex) {
      alert("これから実装する");
      return;
    }

    // 未選択のマップをクリックした場合
    // 画面表示の変更
    $("#map_list li").eq(this.#selectedItemIndex).removeClass(this.#selectedItemClassName);
    $("#map_list li").eq(clickedItemIndex).addClass(this.#selectedItemClassName);
    this.MapList[clickedItemIndex].LoadMapImgAndMemo();
    this.#selectedItemIndex = clickedItemIndex;

    // localStorage への保存
    localStorage.setItem(selectedMapIndexKeyName, this.#selectedItemIndex);
  }
}

class MemoItem {
  #memoKeyNum = "";
  set MemoKeyNum(val) {
    if (val == null || val == "") {
      this.#memoKeyNum = "M000-000";
    } else {
      this.#memoKeyNum = val;
    }
  }
  get MemoKeyNum() {
    return this.#memoKeyNum;
  }

  #memoText = "";
  set MemoText(val) {
    if (val == null) {
      this.#memoText = "";
    } else {
      this.#memoText = val;
    }
  }
  get MemoText() {
    return this.#memoText;
  }

  constructor(key, text) {
    this.MemoKeyNum = key;
    this.MemoText = text;
  }

  // localStorage との通信用メソッド
  // MemoItem を localStorage へ保存
  SetMemCntToStorage() {
    localStorage.setItem(GetMemCntKeyName(this.MemoKeyNum), this.MemoText);
  }
}

class MemoIndex {
  // Memoの本文
  MemoCnt = new MemoItem("", "");

  #memoKeyNum = "";
  set MemoKeyNum(val) {
    if (val == null || val == "") {
      this.#memoKeyNum = "M000-000";
    } else {
      this.#memoKeyNum = val;
    }
  }
  get MemoKeyNum() {
    return this.#memoKeyNum;
  }

  #memoTitle = "";
  set MemoTitle(val) {
    this.#memoTitle = val;
  }
  get MemoTitle() {
    return this.#memoTitle;
  }

  #iconType = 0;
  set IconType(val) {
    this.#iconType = val;
  }
  get IconType() {
    return this.#iconType;
  }

  #iconSize = 0;
  set IconSize(val) {
    this.#iconSize = val;
  }
  get IconSize() {
    return this.#iconSize;
  }

  #iconTopRatio = "";
  set IconTopRatio(val) {
    this.#iconTopRatio = val;
  }
  get IconTopRatio() {
    return this.#iconTopRatio;
  }

  #iconLeftRatio = "";
  set IconLeftRatio(val) {
    this.#iconLeftRatio = val;
  }
  get IconLeftRatio() {
    return this.#iconLeftRatio;
  }

  constructor(key, title, type, size, top, left) {
    this.MemoKeyNum = key;
    this.MemoTitle = title;
    this.IconType = type;
    this.IconSize = size;
    this.IconTopRatio = top;
    this.IconLeftRatio = left;
  }

  ReconvertTopFromRatio(zoomVal) {
    return this.IconTopRatio * zoomVal;
  }
  ReconvertLeftFromRatio(zoomVal) {
    return this.IconLeftRatio * zoomVal;
  }

  CreateMemoCnt(text) {
    // 1. MemoItem の作成
    this.MemoCnt = new MemoItem(this.MemoKeyNum, text);

    // 2. localStorage へ登録
    this.MemoCnt.SetMemCntToStorage();
  }

  // localStorage との通信用メソッド
  // MemoItem を localStorage からロード
  LoadMemCntFromStorage() {
    // 1. localStorage からロード
    const text = localStorage.getItem(GetMemCntKeyName(this.MemoKeyNum));

    // 2. ロードした値を MapItem オブジェクトへマッピング
    this.MemoCnt = new MemoItem(this.MemoKeyNum, text);
  }
}

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
    this.#memoText = val;
  }
  get MemoText() {
    return this.#memoText;
  }

  constructor(key, text) {
    this.MemoKeyNum = key;
    this.MemoText = text;
  }
}

class MemoIndex {
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

  #positionX = "";
  set PositionX(val) {
    this.#positionX = val;
  }
  get PositionX() {
    return this.#positionX;
  }

  #positionY = "";
  set PositionY(val) {
    this.#positionY = val;
  }
  get PositionY() {
    return this.#positionY;
  }

  constructor(key, title, type, size, x, y) {
    this.MemoKeyNum = key;
    this.MemoTitle = title;
    this.IconType = type;
    this.IconSize = size;
    this.PositionX = x;
    this.PositionY = y;
  }
}

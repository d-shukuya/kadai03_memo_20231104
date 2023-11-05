class MemoItem {
  #iconPath = "";
  #memoTitle = "";
  #memoText = "";
  #positionX = "";
  #positionY = "";

  constructor(path, title, text, x, y) {
    this.#iconPath = path;
    this.#memoTitle = title;
    this.#memoText = text;
    this.#positionX = x;
    this.#positionY = y;
  }
}

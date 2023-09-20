export default class ToDoItem {
  constructor() {
    this._id = null;
    this._item = null;
    this._isItemCheck = false;
  }

  getId() {
    return this._id;
  }

  setId(id) {
    this._id = id;
  }

  getItem() {
    return this._item;
  }

  setItem(item) {
    this._item = item;
  }

  getCheck() {
    return this._isItemCheck;
  }

  setCheck(isItemChecked) {
    this._isItemCheck = isItemChecked;
  }
}
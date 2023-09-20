export default class ToDoList {
  constructor() {
    this._list = [];
  }

  getList() {
    return this._list;
  }

  clearList() {
    this._list = [];
  }

  addItemToEndList(itemObj) {
    this._list.push(itemObj);
  }

  addItemToTopList(itemObj) {
    this._list.unshift(itemObj);
  }

  removeItemFromList(id) {
    const list = this._list;
    for(let i = 0; i < list.length; i++) {
      if(list[i]._id == id) {
        list.splice(i, 1);
        break;
      }
    }
  }

  sortList() {
    const list = this._list;
    const checkedList = [];
    const unCheckedList = [];
    list.forEach(item => {
      item.getCheck() ? checkedList.push(item) : unCheckedList.push(item);
    });
    this._list = [...unCheckedList, ...checkedList];
  }
}
import "./sass/style.scss";
import ToDoList from "./js/ToDoList.js";
import ToDoItem from "./js/ToDoItem.js";

const toDoList = new ToDoList();

const clearListDisplay = () => {
  const parentElement = document.getElementById("tasksContainer__tasks");
  parentElement.innerHTML = "";
};

const updatePersistentData = () => {
  toDoList.sortList();
  localStorage.setItem("myToDoList", JSON.stringify(toDoList.getList()));
};

const styleDeleteIcon = (checkbox, deleteIcon) => {
  if (checkbox.checked) {
    deleteIcon.classList.add("view-trash");
  } else {
    deleteIcon.classList.add("hide-trash");
  }
};

const addClickListenerToCheckbox = (checkbox, item, taskItem, deleteIcon, div) => {
  checkbox.addEventListener("click", () => {
    if (checkbox.checked) {
      div.classList.add("tasksContainer__item_disabled");
      item.setCheck(true);
    } else {
      div.classList.remove("tasksContainer__item_disabled");
      item.setCheck(false);
    }
    styleDeleteIcon(checkbox, deleteIcon);
    updatePersistentData();
    refreshThePage();
  });
};

const makeIcon = (className) => {
  const icon = document.createElement("i");
  icon.className = className;
  return icon;
};

const addClickListenerToEditBtn = (editBtn, taskItem, item, div) => {
  const saveItem = () => {
    if (!item.getItem().length) {
      deleteTask(item.getId());
    }
    editBtn.className = "bi bi-pencil";
    taskItem.textContent = taskItem.textContent.trim();
    taskItem.contentEditable = "false";
    if (item.getCheck()) {
      div.classList.add("tasksContainer__item_disabled");
    }
    div.classList.remove("tasksContainer__item_edit");
    editBtn.removeEventListener("click", saveItem);
    editBtn.addEventListener("click", editMode);
  };

  const editMode = () => {
    editBtn.className = "bi bi-pencil-fill";
    taskItem.contentEditable = "true";
    taskItem.focus();
    window.getSelection().selectAllChildren(taskItem);
    window.getSelection().collapseToEnd();
    if (item.getCheck()) {
      div.classList.remove("tasksContainer__item_disabled");
    }
    div.classList.add("tasksContainer__item_edit");
    taskItem.addEventListener("keyup", (e) => {
      item.setItem(taskItem.textContent);
      updatePersistentData();
      if (e.keyCode === 13) {
        saveItem();
      }
    })
    editBtn.removeEventListener("click", editMode);
    editBtn.addEventListener("click", saveItem);
  };
  editBtn.addEventListener("click", editMode);
};

const buildListItem = (item) => {
  const div = document.createElement("div");
  div.className = "tasksContainer__item";
  const checkBox = document.createElement("input");
  checkBox.className = "tasksContainer__checkbox btn"
  checkBox.type = "checkbox";
  checkBox.id = item.getId();
  checkBox.tabIndex = 0;
  checkBox.checked = item.getCheck();
  checkBox.checked ? div.classList.add("tasksContainer__item_disabled") : div.classList.remove("tasksContainer__item_disabled");
  const taskItem = document.createElement("div");
  taskItem.classList.add("tasksContainer__taskText")
  taskItem.textContent = item.getItem();
  taskItem.contentEditable = "false";
  div.appendChild(checkBox);
  div.appendChild(taskItem);
  const editIcon = makeIcon("bi bi-pencil");
  div.appendChild(editIcon);
  addClickListenerToEditBtn(editIcon, taskItem, item, div);
  const deleteIcon = makeIcon("bi bi-trash");
  styleDeleteIcon(checkBox, deleteIcon);
  div.appendChild(deleteIcon);
  addClickListenerToCheckbox(checkBox, item, taskItem, deleteIcon, div);
  addClickListenerToDeleteBtn(deleteIcon, item.getId());
  const container = document.getElementById("tasksContainer__tasks");
  container.appendChild(div);
};

const renderList = () => {
  const list = toDoList.getList();
  list.forEach(item => {
    buildListItem(item);
  })
};

const clearItemEntryField = () => {
  document.getElementById("addNewTask__input").value = "";
};

const setFocusOnItemEntry = () => {
  document.getElementById("addNewTask__input").focus();
};

const refreshThePage = () => {
  clearListDisplay();
  renderList();
  clearItemEntryField();
  setFocusOnItemEntry();
};

const deleteTask = (itemId) => {
  toDoList.removeItemFromList(itemId);
  updatePersistentData();
  refreshThePage();
};

const addClickListenerToDeleteBtn = (deleteBtn, itemId) => {
  deleteBtn.addEventListener("click", () => {
    deleteTask(itemId)
  })
};

const calcNextItemId = () => {
  let id = 1;
  const list = toDoList.getList();
  if (!list.length) {
    return id;
  } else {
    id = 1 + list.reduce((maxId, item) => {
      if (item.getId() >= maxId) {
        maxId = item.getId();
      }
      return maxId;
    }, 1);
    return id;
  }
};

const createNewItem = (itemId, itemText, itemCheck) => {
  const toDo = new ToDoItem();
  toDo.setId(itemId);
  toDo.setItem(itemText);
  toDo.setCheck(itemCheck);
  return toDo;
};

const processSubmission = () => {
  const newEntryText = document.getElementById("addNewTask__input").value.trim();
  if (!newEntryText.length) return;
  const nextItemId = calcNextItemId();
  const toDoItem = createNewItem(nextItemId, newEntryText, false);
  toDoList.addItemToTopList(toDoItem);
  updatePersistentData();
  refreshThePage();
};

const loadListObject = () => {
  const storedList = localStorage.getItem("myToDoList");
  if (typeof storedList !== "string") return;
  const parsedList = JSON.parse(storedList);
  parsedList.forEach(itemObj => {
    const newToDoItem = createNewItem(itemObj._id, itemObj._item, itemObj._isItemCheck);
    toDoList.addItemToEndList(newToDoItem);
  });
};

const initApp = () => {
//  Add listeners
  const itemEntryForm = document.getElementById("itemEntryForm");
  itemEntryForm.addEventListener("submit", (e) => {
    e.preventDefault();
    processSubmission();
  });

  const clearItemsBtn = document.getElementById("clearItemsBtn");
  clearItemsBtn.addEventListener("click", () => {
    const list = toDoList.getList();
    if (list.length) {
      const confirmed = confirm("Are you sure you want to clear the entire list?");
      if (confirmed) {
        toDoList.clearList();
        updatePersistentData();
        refreshThePage();
      }
    }
  });

//  Procedural
  loadListObject();

//  Refresh the page
  refreshThePage();
};
initApp();
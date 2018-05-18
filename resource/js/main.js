var data = localStorage.getItem("todoList")
  ? JSON.parse(localStorage.getItem("todoList"))
  : {
      todo: [],
      completed: []
    };

var currentItem = ""; // item that will have his text changed
var currSelectedText = ""; // current item's text
var currentList = ""; // item's container - todo or completed

var tc_modal = document.getElementById("simpleModal");
var tc_closeButton = document.getElementById("closeBtn");
var tc_confirmButton = document.getElementById("confirmBtn");
tc_closeButton.addEventListener("click", closeModal);
tc_confirmButton.addEventListener("click", updateTaskString);

// resetLocalStorage()
document.getElementById("addItem").addEventListener("click", checkInputValue);
var removeSVG =
  '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><g><path class="fill" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6L16.3,18.7L16.3,18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="fill" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="fill" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8C7.4,10.2,7.7,10,8,10c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="fill" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></svg>';
var completeSVG =
  '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"></style><g><path class="fill" d="M9.7,14.4L9.7,14.4c-0.2,0-0.4-0.1-0.5-0.2l-2.7-2.7c-0.3-0.3-0.3-0.8,0-1.1s0.8-0.3,1.1,0l2.1,2.1l4.8-4.8c0.3-0.3,0.8-0.3,1.1,0s0.3,0.8,0,1.1l-5.3,5.3C10.1,14.3,9.9,14.4,9.7,14.4z"/></g></svg>';

initAppFromSave();

//
function initAppFromSave() {
  console.log("get stored data and add task if there are any", data);
  var i;
  var j;
  if (data.todo.length != 0) {
    var todoReversed = data.todo.reverse();
    for (var i = 0; i < todoReversed.length; i++) {
      value = todoReversed[i];
      addNewTask(value, "todo", true);
      //console.log(value)
    }
    todoReversed.reverse();
  }
  if (data.completed.length != 0) {
    var completedReversed = data.completed.reverse();
    for (var j = 0; j < completedReversed.length; j++) {
      value = data.completed[j];
      addNewTask(value, "completed", true);
      //console.log(value)
    }
    completedReversed.reverse();
  }
}

function checkInputValue(evt) {
  console.log("button addItem has been clicked");
  var textInputValue = document.getElementById("item").value;

  if (textInputValue == "") console.log("You have not yet enter a task");
  else addNewTask(textInputValue, "todo", false);
}

//
function addNewTask(taskValueText, target, onInit) {
  //console.log('New task has been added to your ToDoList' + ' = ' + taskValueText)

  var list = document.getElementById(target);
  var item = document.createElement("li");
  var editButton = document.createElement("button");
  var taskText = document.createElement("p");
  var buttons = document.createElement("div");
  var remove = document.createElement("button");
  var complete = document.createElement("button");

  editButton.classList.add("editButton");
  taskText.classList.add("taskText");
  taskText.innerHTML = taskValueText;
  buttons.classList.add("buttons");
  remove.classList.add("remove");
  complete.classList.add("complete");

  buttons.appendChild(remove);
  buttons.appendChild(complete);

  complete.innerHTML = completeSVG;
  remove.innerHTML = removeSVG;
  // remove.appendChild(removeSVG)

  item.setAttribute("id", "li");
  // taskText.setAttribute("contenteditable", true)
  item.appendChild(editButton);
  item.appendChild(taskText);
  item.appendChild(buttons);
  list.insertBefore(item, list.childNodes[0]);

  document.getElementById("item").value = "";

  complete.addEventListener("click", addTaskToComplete);
  remove.addEventListener("click", removeTask);
  editButton.addEventListener("click", editText);

  if (onInit === false) {
    // neet to convert any double whiteSpace between characters into 1
    let textToSave = trimMultipleSpaces(taskText.innerHTML);
    // if there are any whitespaces at the end, remove them too
    textToSave = trimLastWhiteSpace(textToSave);
    data.todo.unshift(textToSave);
    saveData();
  }
}

//
function addTaskToComplete() {
  var parent = this.parentNode.parentNode.parentNode;
  var item = this.parentNode.parentNode;
  var id = parent.id;
  var target =
    id === "todo"
      ? document.getElementById("completed")
      : document.getElementById("todo");

  parent.removeChild(item);
  target.insertBefore(item, target.childNodes[0]);

  if (id === "todo") {
    data.todo.splice(data.todo.indexOf(item.innerText), 1);
    data.completed.unshift(item.innerText);
  }
  if (id === "completed") {
    data.completed.splice(data.completed.indexOf(item.innerText), 1);
    data.todo.unshift(item.innerText);
  }
  saveData();
}

//
function removeTask() {
  var parent = this.parentNode.parentNode.parentNode;
  var item = this.parentNode.parentNode;
  var id = parent.id;

  parent.removeChild(item);
  console.log("This task has been succesfully removed");

  if (id === "todo") data.todo.splice(data.todo.indexOf(item.innerText), 1);
  if (id === "completed")
    data.completed.splice(data.completed.indexOf(item.innerText), 1);

  saveData();
}

//
function editText(evt) {
  // open modal first
  tc_modal.style.display = "block";
  let tc_text = tc_modal.getElementsByClassName("textToChange")[0];

  // save info about editted task
  let list = this.parentNode.parentNode; // todo or completed
  let id = list.id; // list name
  let item = this.parentNode; // task entry
  let p = item.getElementsByClassName("taskText")[0]; // innerText of the task

  //save currText and it into the Modal
  currSelectedText = trimMultipleSpaces(p.innerText);
  currSelectedText = trimMultipleSpaces(currSelectedText);
  tc_text.value = currSelectedText;
  currentItem = p;
  currentList = id;
}

//
function updateTaskString() {  
  let tc_text = tc_modal.getElementsByClassName("textToChange")[0];
  //neet to convert any double whiteSpace between characters into 1
  let textToSave = trimMultipleSpaces(tc_text.value);
  // if there are any whitespaces at the end, remove them too
  textToSave = trimLastWhiteSpace(textToSave);
  currentItem.innerText = textToSave;
  console.log(tc_text.value);

  let itemIndex = data[currentList].indexOf(currSelectedText);
  data[currentList][itemIndex] = textToSave;
  saveData(); 
  tc_modal.style.display = "none";
}

//
function closeModal() {
  
  tc_modal.style.display = "none";
}

//
function saveData() {
  console.log(data);
  localStorage.setItem("todoList", JSON.stringify(data));
}

//
function resetLocalStorage() {
  data.todo.splice(0);
  data.completed.splice(0);
  localStorage.setItem("todoList", JSON.stringify(data));
}

//
function trimMultipleSpaces(x) {
  return x.replace(/\s+/g, " ");
}

//
function trimLastWhiteSpace(x) {
  return x.replace(/\s*$/, "");
}

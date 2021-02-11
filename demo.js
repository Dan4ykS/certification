const todoContainer = document.getElementById('list');
const doneContainer = document.getElementById('donelist');

let todoList = [];
let doneList = [];

let elementValue;
let countToDo = 0;
let countDone = 0;
let countToDoForLSRender = 0;
let countDoneForLSRender = 0;

function updateDataInLocalstorage() {
  const todoListForLS = JSON.stringify(todoList);
  const donelistForLS = JSON.stringify(doneList);
  localStorage.setItem('countToDo', countToDo);
  localStorage.setItem('countDone', countDone);
  localStorage.setItem('todoList', todoListForLS);
  localStorage.setItem('doneList', donelistForLS);
}

function renderDataFromLocalstorage() {
  const countFromLS = +localStorage.getItem('countToDo');
  const counterDoneFromFS = +localStorage.getItem('countDone');
  const todoListFromLS = localStorage.getItem('todoList');
  const doneListFromLS = localStorage.getItem('doneList');

  if (!todoListFromLS) {
    todoList = [];
  } else {
    todoList = JSON.parse(todoListFromLS);
  }
  if (!doneListFromLS) {
    doneList = [];
  } else {
    doneList = JSON.parse(doneListFromLS);
  }

  countToDo = countFromLS;
  countDone = counterDoneFromFS;
}

renderDataFromLocalstorage();

let todoCount = countToDo;
let doneCount = countDone;

while (todoCount > 0) {
  addTodoItem('todoList');
  --todoCount;
}

while (doneCount > 0) {
  addTodoItem('doneList');
  --doneCount;
}

function createNewTodo(e) {
  if (e.keyCode === 13) {
    addTodoItem('new');
  }
}

function addTodoItem(mode) {
  const newTodo = document.createElement('li');
  const content = document.createElement('span');
  const checkbox = document.createElement('input');
  const deleteBtn = document.createElement('span');
  newTodo.appendChild(checkbox);

  newTodo.appendChild(deleteBtn);
  newTodo.appendChild(content);

  checkbox.setAttribute('type', 'checkbox');
  checkbox.classList.add('check-item');
  content.classList.add('list-item');
  deleteBtn.classList.add('glyphicon');
  deleteBtn.classList.add('glyphicon-remove');

  if (mode === 'todoList') {
    const itemContent = todoList[countToDoForLSRender];
    content.innerHTML = itemContent;
    todoContainer.appendChild(newTodo);
    countToDoForLSRender += 1;
    document.getElementById('noitem').style.display = 'none';
  } else if (mode === 'doneList') {
    checkbox.checked = true;
    const itemContent = doneList[countDoneForLSRender];
    content.innerHTML = itemContent;
    countDoneForLSRender += 1;
    doneContainer.appendChild(newTodo);
    document.getElementById('doneitem').style.display = 'none';
  } else {
    const itemContent = document.getElementById('itemname');
    todoList.push(itemContent.value);
    content.innerHTML = itemContent.value;
    todoContainer.appendChild(newTodo);
    itemContent.value = '';
    countToDo += 1;
    updateDataInLocalstorage();
    rendrTitle();
  }

  checkbox.addEventListener('change', function () {
    const doneItem = this.parentElement;
    elementValue = doneItem.childNodes[2].innerHTML;
    if (todoContainer.id === this.parentElement.parentElement.id) {
      todoContainer.removeChild(doneItem);
      content.innerHTML = elementValue;
      doneContainer.appendChild(newTodo);
      countToDo -= 1;
      countDone += 1;
      doneList.push(elementValue);
      for (let i = 0; i < todoList.length; i++) {
        if (elementValue === todoList[i]) todoList.splice(i, 1);
      }
    } else {
      doneContainer.removeChild(doneItem);
      content.innerHTML = elementValue;
      todoContainer.appendChild(newTodo);
      countToDo += 1;
      countDone -= 1;
      todoList.push(elementValue);
      for (let i = 0; i < doneList.length; i++) {
        if (elementValue === doneList[i]) doneList.splice(i, 1);
      }
    }
    updateDataInLocalstorage();
    rendrTitle();
  });

  content.addEventListener('dblclick', function () {
    let data = this.innerHTML;
    const parent = this.parentElement;
    content.innerHTML = '';
    const form = document.createElement('content');
    const text = document.createElement('input');
    const submitBtn = document.createElement('button');
    const cancelBtn = document.createElement('button');

    text.value = data;
    submitBtn.innerHTML = 'OK';
    cancelBtn.innerHTML = 'Cancel';

    form.appendChild(text);
    form.appendChild(submitBtn);
    form.appendChild(cancelBtn);
    content.appendChild(form);

    submitBtn.addEventListener('click', function () {
      content.removeChild(form);

      for (let i = 0; i < todoList.length; i++) {
        if (data === todoList[i]) {
          todoList[i] = text.value;
        }
      }

      for (let i = 0; i < doneList.length; i++) {
        if (data === doneList[i]) {
          doneList[i] = text.value;
        }
      }
      updateDataInLocalstorage();
      data = text.value;
      content.innerHTML = data;
      parent.appendChild(content);
    });

    cancelBtn.addEventListener('click', function () {
      content.removeChild(form);
      content.innerHTML = data;
      parent.appendChild(content);
    });
  });

  deleteBtn.addEventListener('click', function () {
    const removeItem = this.parentElement;
    elementValue = removeItem.childNodes[2].innerHTML;

    if (todoContainer.id === this.parentElement.parentElement.id) {
      todoContainer.removeChild(removeItem);
      countToDo -= 1;
      for (let i = 0; i < todoList.length; i++) {
        if (elementValue === todoList[i]) todoList.splice(i, 1);
      }
    } else {
      doneContainer.removeChild(removeItem);
      countDone -= 1;
      for (let i = 0; i < doneList.length; i++) {
        if ((elementValue = doneList[i])) doneList.splice(i, 1);
      }
    }
    updateDataInLocalstorage();
    rendrTitle();
  });
}

function rendrTitle() {
  if (countToDo === 0) {
    document.getElementById('noitem').style.display = 'block';
  }
  if (countToDo === 1) {
    document.getElementById('noitem').style.display = 'none';
  }
  if (countDone === 0) {
    document.getElementById('doneitem').style.display = 'block';
  }
  if (countDone === 1) {
    document.getElementById('doneitem').style.display = 'none';
  }
}

function removeList(id) {
  const root = document.getElementById(id);
  while (root.firstChild) {
    root.removeChild(document.getElementById(id).firstChild);
  }

  if (todoContainer.id === id) {
    todoList = [];
    countToDo = 0;
  } else {
    doneList = [];
    countDone = 0;
  }
  updateDataInLocalstorage();
  rendrTitle();
}

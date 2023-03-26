let hour = new Date().getHours();
let greeting;
  if (hour < 12) {
    greeting = "GOOD MORNING";
  } else if (hour < 16) {
    greeting = "GOOD AFTERNOON";
  } else  {
    greeting = "GOOD EVENING";
  }
document.getElementById("greeting").innerHTML = greeting;



// 
// SELECT ELEMENTS
const form = document.getElementById('todoform');
const todoInput = document.getElementById('newtodo');
const todosListEl = document.getElementById('todos-list');
const errorMessageEl = document.querySelector(".error-message");


// 
let todos = JSON.parse(localStorage.getItem("todos")) || [];
let EditTodoId = -1
// FORM SUBMIT
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // save todo
  saveTodo();
  // 1st render
  renderTodos();
  localStorage.setItem("todos", JSON.stringify(todos));
})

function saveTodo() {
  const todoValue = todoInput.value;
// duplicate todos
const isDuplicate = todos.some(
    (todo) => todo.value.toUpperCase() === todoValue.toUpperCase())
  // empty input
  const isEmpty = todoValue === '';
  if (isEmpty){
    errorMessage("EMPTY");
  }
  else if (isDuplicate) {
    errorMessage("Todo already exists!");
  }
  else{
 
 if (EditTodoId >= 0) {
   todos = todos.map((todo, index) => ({
     ...todo,
     value: index === EditTodoId ? todoValue : todo.value,
   }));
   EditTodoId = -1;
 } else {
   todos.push({
     value: todoValue,
     checked: false,
     color: "#" + Math.floor(Math.random() * 16777215).toString(16),
   });
 }
    todoInput.value = "";
  //  console.log(todos)
  }
  
  
}

function renderTodos() {
  // if (todos.length === 0) {
  //   todosListEl.innerHTML = "<center>Nothing to do!</center>";
  //   return;
  // }

  // CLEAR ELEMENT BEFORE A RE-RENDER
  todosListEl.innerHTML = "";

  // RENDER TODOS
  todos.forEach((todo, index) => {
    todosListEl.innerHTML += `


     <div class="todo" id=${index}>
      <i 
        class="bi ${todo.checked ? "bi-check-circle-fill" : "bi-circle"}"
        style="color : ${todo.color}"
        data-action="check"
      ></i>
      <p class="${todo.checked ? "checked" : ""}" data-action="check">${
      todo.value
    }</p>
      <i class="bi bi-pencil-square" data-action="edit"></i>
      <i class="bi bi-trash" data-action="delete"></i>
    </div>
    `;
  });
}
todosListEl.addEventListener("click", (e) => {
  const target = e.target;
  const parentElement = target.parentNode;

  if (parentElement.className !== "todo") return;
    const todo = parentElement;
    const todoId = Number(todo.id);

     const action = target.dataset.action;
     action === "check" && checkTodo(todoId);
     action === "edit" && editTodo(todoId);
     action === "delete" && deleteTodo(todoId);
 console.log(todoId, action);

})

function checkTodo(todoId) {
  todos = todos.map((todo, index) => ({
    ...todo,
    checked: index === todoId ? !todo.checked : todo.checked,
  }));
    renderTodos();
}

function editTodo(todoId) {
  todoInput.value = todos[todoId].value;
  EditTodoId = todoId;
}

function deleteTodo(todoId) {
  todos = todos.filter((todo, index) => index !== todoId);
  EditTodoId = -1;
  renderTodos();
}

function errorMessage(msg) {
  // change the message
  errorMessageEl.innerHTML = msg;

  // notification enter
  errorMessageEl.classList.add("notif-enter");

  // notification leave
  setTimeout(() => {
    errorMessageEl.classList.remove("notif-enter");
  }, 2000);
}
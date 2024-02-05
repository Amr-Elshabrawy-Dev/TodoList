const formAdd = document.getElementById("add");
const newTaskInput = document.getElementById("newTask");
const taskList = document.getElementById("task-list");
const clearButton = document.getElementById("clear");
const filterTaskInput = document.getElementById("filterTask");
const overlay = document.querySelector(".overlay");

// Loading tasks from Local Storage when the page loads
loadTasksFromLocalStorage();

formAdd.addEventListener("submit", function (event) {
  event.preventDefault();
  addTask(newTaskInput.value);
  newTaskInput.value = "";
  // Save tasks in Local Storage after adding
  saveTasksToLocalStorage();
});

clearButton.addEventListener("click", function () {
  clearTasks();
  // Save tasks to Local Storage after deleting
  saveTasksToLocalStorage();
});

filterTaskInput.addEventListener("input", function () {
  filterTasks(filterTaskInput.value.toLowerCase());
});

// Add a task to the task list
function addTask(taskText) {
  if (taskText.trim() !== "") {
    const li = document.createElement("li");
    li.classList.add("list-item");
    li.innerHTML = `
        <span>${taskText}</span>
        <input type="text" class="update-input" value="${taskText}" autocomplete="off" style="display:none" />
        <span>
          <button title="Edit" class="editList" onclick="editTask(this)">
            <i class="icon-edit"></i>
          </button>
          <button title="Delete" class="delList" onclick="deleteTask(this)">
            <i class="icon-trash-o"></i>
          </button>
          <button title="Update" class="updateList" onclick="saveTask(this)" style="display:none">
            <i class="icon-refresh"></i>
          </button>
        </span>
      `;
    taskList.appendChild(li);
  }else {
    overlay.classList.remove('none')
  }
}

// close modal 
const btnClose = document.querySelector("#btnModal");
btnClose.addEventListener('click', () => {
  overlay.classList.add("none");
})

// Delete a task from the task list
const deleteTask = function (button) {
  const li = button.closest(".list-item");
  li.remove();
  saveTasksToLocalStorage();
};

// Edit Task in the task list
function editTask(button) {
  const li = button.closest(".list-item");
  const span = li.querySelector("span:first-child");
  const input = li.querySelector(".update-input");
  const updateButton = li.querySelector(".updateList");

  // Show input and hide span
  input.style.display = "inline";
  span.style.display = "none";
  input.focus();

  // Show "update" button
  updateButton.style.display = "inline";

  // Add keydown event to input
  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      // If Enter is pressed, execute the saveTask function
      saveTask(updateButton);
    }
  });
}

function saveTask(button) {
  const li = button.closest(".list-item");
  const span = li.querySelector("span:first-child");
  const input = li.querySelector(".update-input");

  // Save the modified value in span
  span.textContent = input.value;

  // Show span and hide input
  input.style.display = "none";
  span.style.display = "inline";

  // Hide the "update" button
  button.style.display = "none";

  // Save tasks to Local Storage after editing
  saveTasksToLocalStorage();
}

// Delete all tasks from Local Storage and the page
const clearTasks = function () {
  taskList.innerHTML = "";
  localStorage.removeItem("tasks");
};

const filterTasks = function (keyword) {
  const tasks = taskList.querySelectorAll(".list-item");
  tasks.forEach((task) => {
    const taskText = task.textContent.toLowerCase();
    task.style.display = taskText.includes(keyword) ? "flex" : "none";
  });
};

function saveTasksToLocalStorage() {
  const tasks = [];
  const taskItems = taskList.querySelectorAll(".list-item span:first-child");
  taskItems.forEach(function (task) {
    tasks.push(task.textContent);
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    const tasks = JSON.parse(storedTasks);
    tasks.forEach(function (taskText) {
      addTask(taskText);
    });
  }
}

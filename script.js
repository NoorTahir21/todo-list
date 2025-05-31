let editMode = false;
let currentEditItem = null;

//form submit
function onformSubmit() {
  const formData = ReadTaskData();
  if (formData.taskinput.trim() !== "") {
    if (editMode) {
      updateTask(formData);
    } else {
      insertNewTask(formData);
    }
    document.getElementById("taskinput").value = "";
    document.getElementById("category-select").value = "";
    document.getElementById("add-task").value = "Add";
    editMode = false;
    currentEditItem = null;
  }
}

//read form data
function ReadTaskData() {
  return {
    taskinput: document.getElementById("taskinput").value,
    category: document.getElementById("category-select").value,
  };
}

//insert new task
function insertNewTask(data) {
  const taskList = document.getElementById("tasklist");

  const taskItem = document.createElement("li");
  taskItem.className =
    "bg-gray-50 flex justify-between items-center border rounded-xl p-4 shadow-sm hover:shadow-md transition";

  taskItem.innerHTML = `
    <div>
      <p class="text-lg font-medium text-gray-800 task-text">${data.taskinput}</p>
      <p class="text-sm text-gray-500 task-category">Category: ${data.category}</p>
    </div>
    <div class="flex items-center gap-5">
      <button class="text-blue-500 hover:text-blue-700 font-medium text-sm" onclick="onEdit(this)">✎ Edit</button>
      <button class="text-red-500 hover:text-red-700 font-bold text-xl" onclick="onDelete(this)">×</button>
    </div>
  `;

  taskList.appendChild(taskItem);
  saveTasksToLocalStorage();
}

//edit task
function onEdit(btn) {
  const li = btn.closest("li");
  const taskText = li.querySelector(".task-text").textContent;
  const taskCategory = li
    .querySelector(".task-category")
    .textContent.replace("Category: ", "");

  document.getElementById("taskinput").value = taskText;
  document.getElementById("category-select").value = taskCategory;
  document.getElementById("add-task").value = "Update";

  editMode = true;
  currentEditItem = li;
}

//update task
function updateTask(data) {
  if (currentEditItem) {
    currentEditItem.querySelector(".task-text").textContent = data.taskinput;
    currentEditItem.querySelector(
      ".task-category"
    ).textContent = `Category: ${data.category}`;
    saveTasksToLocalStorage();
  }
}

//delete task
function onDelete(btn) {
  const li = btn.closest("li");
  li.remove();
  saveTasksToLocalStorage();
}

//filter categories
function taskfilter() {
  const selectedCategory = document.getElementById("filter-category").value;
  const tasks = document.querySelectorAll("#tasklist li");

  tasks.forEach((task) => {
    const categoryText = task.querySelector(".task-category").textContent;
    const taskCategory = categoryText.replace("Category: ", "");

    if (selectedCategory === "all" || taskCategory === selectedCategory) {
      task.style.display = "flex";
    } else {
      task.style.display = "none";
    }
  });
}

//store task in local storage
function saveTasksToLocalStorage() {
  const tasks = [];
  document.querySelectorAll("#tasklist li").forEach((li) => {
    const taskText = li.querySelector(".task-text").textContent;
    const taskCategory = li
      .querySelector(".task-category")
      .textContent.replace("Category: ", "");
    tasks.push({ taskinput: taskText, category: taskCategory });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => insertNewTask(task));
}
window.addEventListener("DOMContentLoaded", loadTasksFromLocalStorage);

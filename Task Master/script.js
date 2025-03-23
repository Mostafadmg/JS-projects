// Initialize variables
let tasks = [];
let currentFilter = "all";
let draggedItem = null;

// DOM Elements
const taskInput = document.getElementById("task-input");
const addButton = document.getElementById("add-button");
const taskList = document.getElementById("task-list");
const filterButtons = document.querySelectorAll(".filter-btn");
const clearCompleted = document.getElementById("clear-completed");
const tasksCounter = document.getElementById("tasks-counter");

// Load tasks from localStorage
function loadTasks() {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    renderTasks();
  }
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add a new task
function addTask(text) {
  if (text.trim() === "") return;

  const newTask = {
    id: Date.now(),
    text: text,
    completed: false,
  };

  tasks.unshift(newTask);
  saveTasks();
  renderTasks();
  taskInput.value = "";
}

// Delete a task
function deleteTask(id) {
  const index = tasks.findIndex((task) => task.id === id);
  if (index !== -1) {
    const taskItem = document.querySelector(`[data-id="${id}"]`);

    // Add a removal animation
    taskItem.style.animation = "fadeOut 0.3s ease-out forwards";

    // Wait for animation to complete before removing from DOM
    setTimeout(() => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    }, 300);
  }
}

// Toggle task completion status
function toggleTaskStatus(id) {
  const task = tasks.find((task) => task.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

// Edit a task
function editTask(id, newText) {
  const task = tasks.find((task) => task.id === id);
  if (task && newText.trim() !== "") {
    task.text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

// Filter tasks
function filterTasks(filter) {
  currentFilter = filter;
  renderTasks();

  // Update active filter button
  filterButtons.forEach((btn) => {
    if (btn.dataset.filter === filter) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

// Clear completed tasks
function clearCompletedTasks() {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
}

// Update task counter
function updateTaskCounter() {
  const remainingTasks = tasks.filter((task) => !task.completed).length;
  tasksCounter.textContent = `${remainingTasks} task${
    remainingTasks !== 1 ? "s" : ""
  } remaining`;
}

// Create task element
function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = `task-item ${task.completed ? "completed" : ""}`;
  li.dataset.id = task.id;
  li.draggable = true;

  const taskContent = document.createElement("div");
  taskContent.className = "task-content";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "checkbox";
  checkbox.checked = task.completed;

  const taskText = document.createElement("span");
  taskText.className = "task-text";
  taskText.textContent = task.text;

  const taskActions = document.createElement("div");
  taskActions.className = "task-actions";

  const editBtn = document.createElement("button");
  editBtn.className = "edit-btn";
  editBtn.innerHTML = '<i class="fas fa-pencil-alt"></i>';

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';

  // Add event listeners
  checkbox.addEventListener("change", () => {
    toggleTaskStatus(task.id);
  });

  // Double click to edit
  taskText.addEventListener("dblclick", () => {
    enableEditMode(li, task);
  });

  editBtn.addEventListener("click", () => {
    enableEditMode(li, task);
  });

  deleteBtn.addEventListener("click", () => {
    deleteTask(task.id);
  });

  // Drag and drop events
  li.addEventListener("dragstart", (e) => {
    draggedItem = li;
    setTimeout(() => {
      li.classList.add("dragging");
    }, 0);
  });

  li.addEventListener("dragend", () => {
    draggedItem = null;
    li.classList.remove("dragging");
  });

  // Assemble task element
  taskContent.appendChild(checkbox);
  taskContent.appendChild(taskText);
  taskActions.appendChild(editBtn);
  taskActions.appendChild(deleteBtn);

  li.appendChild(taskContent);
  li.appendChild(taskActions);

  return li;
}

// Enable edit mode for a task
function enableEditMode(taskElement, task) {
  if (taskElement.classList.contains("edit-mode")) return;

  const taskContent = taskElement.querySelector(".task-content");
  const taskText = taskElement.querySelector(".task-text");
  const textValue = taskText.textContent;

  taskElement.classList.add("edit-mode");

  // Create edit input
  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.value = textValue;
  editInput.className = "edit-input";

  // Replace text with input
  taskContent.replaceChild(editInput, taskText);
  editInput.focus();

  // Handle edit completion
  function completeEdit() {
    if (taskElement.classList.contains("edit-mode")) {
      editTask(task.id, editInput.value);
      taskElement.classList.remove("edit-mode");
    }
  }

  editInput.addEventListener("blur", completeEdit);
  editInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      completeEdit();
    }
  });
}

// Render tasks based on current filter
function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;
  if (currentFilter === "active") {
    filteredTasks = tasks.filter((task) => !task.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  }

  filteredTasks.forEach((task) => {
    const taskElement = createTaskElement(task);
    taskList.appendChild(taskElement);
  });

  updateTaskCounter();
}

// Setup drag and drop functionality
function setupDragAndDrop() {
  taskList.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(taskList, e.clientY);
    const draggable = document.querySelector(".dragging");

    if (afterElement == null) {
      taskList.appendChild(draggable);
    } else {
      taskList.insertBefore(draggable, afterElement);
    }
  });

  taskList.addEventListener("drop", (e) => {
    e.preventDefault();
    const draggedId = parseInt(draggedItem.dataset.id);
    const taskElements = Array.from(taskList.querySelectorAll(".task-item"));

    // Reorder tasks array to match DOM order
    const newTasks = [];
    taskElements.forEach((element) => {
      const id = parseInt(element.dataset.id);
      const task = tasks.find((t) => t.id === id);
      if (task) newTasks.push(task);
    });

    tasks = newTasks;
    saveTasks();
  });
}

// Helper function for drag and drop positioning
function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll(".task-item:not(.dragging)")];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

// Event listeners
addButton.addEventListener("click", () => {
  addTask(taskInput.value);
});

taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTask(taskInput.value);
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterTasks(button.dataset.filter);
  });
});

clearCompleted.addEventListener("click", clearCompletedTasks);

// Add animation when tasks are added
function addPulseAnimation() {
  taskList.addEventListener("animationend", (e) => {
    if (e.animationName === "slideIn") {
      e.target.style.animation = "";
    }
  });
}

// Initialize the app
function initApp() {
  loadTasks();
  setupDragAndDrop();
  addPulseAnimation();
}

// Run on page load
document.addEventListener("DOMContentLoaded", initApp);

// Add some example tasks if there are no tasks
if (tasks.length === 0) {
  addTask("Learn JavaScript basics");
  addTask("Complete the interactive to-do app tutorial");
  addTask("Customize this app with new features");
}

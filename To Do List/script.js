// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Get references to HTML elements
  const taskInput = document.getElementById("taskInput");
  const addButton = document.getElementById("addButton");
  const taskList = document.getElementById("taskList");
  const currentDateElement = document.getElementById("currentDate");

  // Display current date from the provided information
  currentDateElement.textContent = "Current Date: 2025-03-23";

  // Load tasks from localStorage if available
  loadTasks();

  // Add event listener to the Add button
  addButton.addEventListener("click", addTask);

  // Add event listener to allow adding tasks by pressing Enter key
  taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addTask();
    }
  });

  // Function to add a new task
  function addTask() {
    const taskText = taskInput.value.trim();

    // Check if input is not empty
    if (taskText !== "") {
      // Create a new task object
      const task = {
        id: Date.now(),
        text: taskText,
        completed: false,
      };

      // Add task to the list
      createTaskElement(task);

      // Save tasks to localStorage
      saveTasks();

      // Clear the input field
      taskInput.value = "";

      // Focus back on the input field
      taskInput.focus();
    } else {
      alert("Please enter a task!");
    }
  }

  // Function to create a new task element in the DOM
  function createTaskElement(task) {
    const li = document.createElement("li");
    li.dataset.id = task.id;

    if (task.completed) {
      li.classList.add("completed");
    }

    // Create task text span
    const taskTextSpan = document.createElement("span");
    taskTextSpan.textContent = task.text;

    // Add click event to toggle completion status
    taskTextSpan.addEventListener("click", function () {
      li.classList.toggle("completed");
      task.completed = !task.completed;
      saveTasks();
    });

    // Create delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");

    // Add click event to delete button
    deleteBtn.addEventListener("click", function () {
      li.remove();
      saveTasks();
    });

    // Append elements to the list item
    li.appendChild(taskTextSpan);
    li.appendChild(deleteBtn);

    // Add the new task to the list
    taskList.appendChild(li);
  }

  // Function to save tasks to localStorage
  function saveTasks() {
    const tasks = [];

    // Get all task items
    document.querySelectorAll("#taskList li").forEach(function (taskElement) {
      const task = {
        id: taskElement.dataset.id,
        text: taskElement.querySelector("span").textContent,
        completed: taskElement.classList.contains("completed"),
      };

      tasks.push(task);
    });

    // Save to localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Function to load tasks from localStorage
  function loadTasks() {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
      const tasks = JSON.parse(savedTasks);

      tasks.forEach(function (task) {
        createTaskElement(task);
      });
    }
  }
});

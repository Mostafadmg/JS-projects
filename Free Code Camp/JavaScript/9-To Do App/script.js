/*
 * ELEMENT SELECTION SECTION
 *
 * Let's start by understanding how we're connecting JavaScript to our HTML elements. Think of this
 * as creating a control panel for our application - each variable gives us a direct line to manipulate
 * a specific part of our webpage.
 *
 * When the browser reads these lines, it's like sending out search parties throughout our HTML document.
 * Each document.getElementById() call finds a specific element based on its unique ID and brings back
 * a reference we can work with.
 *
 * Imagine building a remote control for your TV - you need buttons for volume, channel, power, etc.
 * Similarly, here we're gathering all the "buttons" and "displays" our app needs to function: the form
 * itself, the various buttons users can click, the container where tasks will appear, and the input
 * fields where users enter information.
 *
 * This preparation step is crucial - without these references, our JavaScript would have no way to
 * interact with what the user sees on screen. Once we have these elements stored in variables, we
 * can manipulate them, read their values, or respond to events like clicks and form submissions.
 */
const taskForm = document.getElementById("task-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const openTaskFormBtn = document.getElementById("open-task-form-btn");
const closeTaskFormBtn = document.getElementById("close-task-form-btn");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");
const tasksContainer = document.getElementById("tasks-container");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descriptionInput = document.getElementById("description-input");

//----------------------------------------------------------------------------------------------------------------------------------------------------------

/*
 * DATA INITIALIZATION SECTION
 *
 * Now that we have our controls ready, we need a place to store our data. Think of this step as
 * preparing the "memory" of our application.
 *
 * The first line is particularly clever - it's doing three important things at once:
 *
 * First, it tries to retrieve any previously saved tasks from the browser's localStorage. This is like
 * looking for a notebook where we previously wrote down our tasks. If we find it (the user has used
 * our app before), great! If not, we'll start with a blank page.
 *
 * Second, since localStorage can only store strings (imagine it only accepts written text, not objects),
 * we need to convert what we retrieve into a usable JavaScript array. JSON.parse() does this conversion -
 * it's like translating from a foreign language back into one we understand.
 *
 * Third, the "|| []" part is a safety net. If localStorage returns null (no data found), this expression
 * defaults to an empty array. It's like saying "if the notebook is empty, start with a blank page."
 *
 * The currentTask variable will act as our workspace for the task being edited. When we're not editing
 * anything, it's empty ({}). When a user clicks "Edit" on a task, this variable will hold all the details
 * of that specific task so we can manipulate it.
 *
 * Why does this matter? Because it allows our app to have "memory" - users can close the browser and
 * return later to find their tasks still there. It also helps us track which task is currently being edited.
 */
const taskData = JSON.parse(localStorage.getItem("data")) || [];
let currentTask = {};

//----------------------------------------------------------------------------------------------------------------------------------------------------------

/*
 * HELPER FUNCTION: removeSpecialChars
 *
 * Before we dive into the main functions, let's understand this utility function that helps us sanitize user input.
 *
 * Think of this function as a security guard and cleaner for our text data. When users type information into
 * our form, they might include all sorts of characters - some potentially problematic for our application.
 *
 * What does this function do? It takes any text value and performs two cleaning operations:
 *
 * 1. trim() removes any extra spaces at the beginning or end of the text. It's like trimming the crusts off a
 *    sandwich - removing the parts we don't need. For example, if someone types "  Buy milk  " with extra spaces,
 *    it becomes "Buy milk".
 *
 * 2. replace() with a regular expression filters out special characters. This is where things get interesting!
 *    The pattern /[^A-Za-z0-9\-\s]/g is like a bouncer at a club with very specific instructions:
 *    - Only allow letters (both uppercase and lowercase)
 *    - Only allow numbers
 *    - Only allow hyphens
 *    - Only allow spaces
 *    - Reject everything else
 *
 * So if someone types "Buy milk & eggs!! #important", it becomes "Buy milk  eggs important" - all the special
 * characters are removed.
 *
 * Why do we need this? Several reasons:
 * - Security: Special characters could potentially be used for malicious purposes (like code injection)
 * - Consistency: It helps maintain a clean, uniform format for our tasks
 * - Functionality: We use the title to generate IDs, and IDs work better without special characters
 *
 * This function is like the first quality control checkpoint for data entering our application.
 */
const removeSpecialChars = (val) => {
  return val.trim().replace(/[^A-Za-z0-9\-\s]/g, "");
};

//----------------------------------------------------------------------------------------------------------------------------------------------------------

/*
 * CORE FUNCTION: addOrUpdateTask
 *
 * Now we come to the heart of our application - the function that handles creating new tasks and updating
 * existing ones. This is where the real magic happens!
 *
 * Think of this function as both a factory and a repair shop - it can create brand new tasks and fix up
 * existing ones. Let's break down the workflow:
 *
 * 1. Validation Check: First, we ensure the user has provided a title. Just like you can't mail a letter
 *    without an address, we can't create a task without a title. If there's no title, we alert the user and
 *    exit the function early.
 *
 * 2. Task Identification: Next, we determine if we're updating an existing task or creating a new one.
 *    We search through our taskData array to see if any task has an ID matching our currentTask.id.
 *    - If we find a match (dataArrIndex is not -1), we're updating that existing task
 *    - If we don't find a match (dataArrIndex is -1), we're creating a new task
 *
 * 3. Task Construction: We build a task object with all the necessary properties:
 *    - id: A unique identifier built from the title and current timestamp
 *    - title: The sanitized title
 *    - date: The deadline or relevant date
 *    - description: The sanitized task description
 *
 * 4. Data Storage: Depending on whether we're adding or updating:
 *    - For a new task, we use unshift() to add it to the beginning of our array (newest tasks appear first)
 *    - For an existing task, we replace the old version with our updated version
 *
 * 5. Persistence: We save the updated taskData to localStorage to ensure it persists between sessions
 *
 * 6. UI Refresh: We update the visual display to reflect our changes
 *
 * 7. Form Reset: We clear and hide the form, ready for the next interaction
 *
 * The beauty of this function is how it handles both creation and updates with the same code path,
 * simplifying our application logic while ensuring consistent behavior.
 */
const addOrUpdateTask = () => {
  if (!titleInput.value.trim()) {
    alert("Please provide a title");
    return;
  }
  const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);
  const taskObj = {
    id: `${removeSpecialChars(titleInput.value)
      .toLowerCase()
      .split(" ")
      .join("-")}-${Date.now()}`,
    title: removeSpecialChars(titleInput.value),
    date: dateInput.value,
    description: removeSpecialChars(descriptionInput.value),
  };

  if (dataArrIndex === -1) {
    taskData.unshift(taskObj);
  } else {
    taskData[dataArrIndex] = taskObj;
  }

  localStorage.setItem("data", JSON.stringify(taskData));
  updateTaskContainer();
  reset();
};

//----------------------------------------------------------------------------------------------------------------------------------------------------------

/*
 * FUNCTION: updateTaskContainer
 *
 * This function is responsible for refreshing the visual display of tasks on our webpage. Think of it as
 * repainting a bulletin board with all our current tasks.
 *
 * Here's what happens when this function runs:
 *
 * 1. Clear the Canvas: We start by clearing out the entire task container. It's like erasing a whiteboard
 *    before writing new information. This ensures we don't end up with duplicate tasks or outdated information.
 *
 * 2. Dynamic Rebuilding: We then loop through each task in our taskData array. For each task, we:
 *    - Extract the key properties (id, title, date, description) using JavaScript's destructuring syntax
 *    - Construct an HTML string representing that task
 *    - Add that HTML to our container
 *
 * 3. Interactive Elements: Each task div we create includes:
 *    - The task information (title, date, description)
 *    - Edit and Delete buttons with onclick attributes
 *
 * The HTML we generate uses string template literals (the backtick syntax ``) which allows us to embed variables
 * directly in our HTML strings. This makes the code more readable and maintainable.
 *
 * The onclick attributes are particularly interesting - they call the editTask() and deleteTask() functions
 * and pass "this" (the button itself) as an argument. This allows those functions to identify which task
 * is being edited or deleted.
 *
 * This function is called in several scenarios:
 * - When the page first loads (to display saved tasks)
 * - After adding or updating a task
 * - After deleting a task
 *
 * It ensures that what the user sees always matches the data in our application.
 */
const updateTaskContainer = () => {
  tasksContainer.innerHTML = "";

  taskData.forEach(({ id, title, date, description }) => {
    tasksContainer.innerHTML += `
        <div class="task" id="${id}">
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Description:</strong> ${description}</p>
          <button onclick="editTask(this)" type="button" class="btn">Edit</button>
          <button onclick="deleteTask(this)" type="button" class="btn">Delete</button>
        </div>
      `;
  });
};

//----------------------------------------------------------------------------------------------------------------------------------------------------------

/*
 * FUNCTION: deleteTask
 *
 * This function handles the deletion of tasks. Think of it as a process for removing items from both
 * our data storage and the visual display.
 *
 * When a user clicks the "Delete" button on a task, here's what happens:
 *
 * 1. Task Identification: First, we need to find which task the user wants to delete. The function
 *    receives the button element (buttonEl) that was clicked, and from there:
 *    - We access buttonEl.parentElement to get the containing task div
 *    - We get its id attribute, which matches our task's unique identifier
 *    - We use findIndex to locate this task in our taskData array
 *
 * 2. Visual Removal: We immediately remove the task from the DOM using buttonEl.parentElement.remove().
 *    This gives the user instant visual feedback - the task disappears from their screen right away.
 *
 * 3. Data Removal: We use splice() to remove the task from our taskData array. This method:
 *    - Takes the index we found (dataArrIndex)
 *    - Removes 1 element at that position
 *    - Modifies the original array (rather than creating a new one)
 *
 * 4. Persistence: Finally, we save the updated taskData back to localStorage to ensure our changes persist.
 *
 * This approach ensures both the visual interface and the underlying data stay synchronized. The user sees
 * the task disappear, and if they refresh the page, the task remains deleted because we've updated our
 * persistent storage.
 *
 * Notice how this function demonstrates a key principle in web development: keeping the UI in sync with
 * your data model. Every change to the data is reflected in the UI, and vice versa.
 */
const deleteTask = (buttonEl) => {
  const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );

  buttonEl.parentElement.remove();
  taskData.splice(dataArrIndex, 1);
  localStorage.setItem("data", JSON.stringify(taskData));
};

//----------------------------------------------------------------------------------------------------------------------------------------------------------

/*
 * FUNCTION: editTask
 *
 * This function handles the process of editing an existing task. Think of it as opening a document
 * for editing - it retrieves the original content and prepares it for modifications.
 *
 * When a user clicks the "Edit" button on a task, here's the sequence that unfolds:
 *
 * 1. Task Identification: Similar to deleteTask, we first need to identify which task is being edited:
 *    - We start with the button element (buttonEl) that was clicked
 *    - Access its parent element (the task div) to get the task ID
 *    - Use findIndex to locate this task in our taskData array
 *
 * 2. Current Task Tracking: We store the entire task object in our currentTask variable.
 *    This is crucial because:
 *    - It lets us track which task is being edited
 *    - We'll need to reference this when saving updates
 *    - It helps us determine if changes have been made when closing the form
 *
 * 3. Form Population: We fill the form inputs with the current task's values:
 *    - The title field gets the task's title
 *    - The date field gets the task's date
 *    - The description field gets the task's description
 *    This gives the user a starting point for their edits.
 *
 * 4. Button Text Update: We change the submit button text from "Add Task" to "Update Task".
 *    This provides clear visual feedback that we're editing rather than creating.
 *
 * 5. Form Display: Finally, we make the form visible by toggling the "hidden" class.
 *
 * What's really interesting about this approach is how it repurposes the same form for both adding and editing.
 * Rather than having separate interfaces, we use context (the currentTask variable and button text) to
 * determine how the form should behave when submitted. This creates a more consistent user experience
 * and simplifies our code.
 */
const editTask = (buttonEl) => {
  const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );

  currentTask = taskData[dataArrIndex];

  titleInput.value = currentTask.title;
  dateInput.value = currentTask.date;
  descriptionInput.value = currentTask.description;

  addOrUpdateTaskBtn.innerText = "Update Task";

  taskForm.classList.toggle("hidden");
};

//----------------------------------------------------------------------------------------------------------------------------------------------------------

/*
 * FUNCTION: reset
 *
 * This function resets the form and related state after adding, updating, or discarding a task. Think of it
 * as cleaning up our workspace and putting away our tools after we've finished a job.
 *
 * Here's what happens when this function runs:
 *
 * 1. Button Text Reset: First, we change the submit button text back to "Add Task". This is important
 *    after editing a task, when the button would say "Update Task". It ensures the form is ready for
 *    its default action (adding) the next time it's opened.
 *
 * 2. Form Clearing: We erase all the data in the form fields:
 *    - The title input is cleared
 *    - The date input is cleared
 *    - The description input is cleared
 *    This ensures that old task data doesn't linger in the form.
 *
 * 3. Form Hiding: We toggle the "hidden" class on the form, which typically hides it from view.
 *    This returns the user to the main task list view.
 *
 * 4. Current Task Reset: We reset the currentTask object to an empty object. This is crucial because:
 *    - It signifies we're no longer editing any task
 *    - It prevents confusion about which task is being edited
 *    - It prepares the system for adding a new task the next time the form is opened
 *
 * The reset function is called in several scenarios:
 * - After successfully adding a new task
 * - After successfully updating an existing task
 * - When discarding changes to a task
 *
 * This function exemplifies good state management - ensuring that our application returns to a clean,
 * well-defined state after various operations. It prevents state leakage (where previous operations
 * affect current ones in unintended ways) and provides a consistent experience for users.
 */
const reset = () => {
  addOrUpdateTaskBtn.innerText = "Add Task";
  titleInput.value = "";
  dateInput.value = "";
  descriptionInput.value = "";
  taskForm.classList.toggle("hidden");
  currentTask = {};
};

//----------------------------------------------------------------------------------------------------------------------------------------------------------

/*
 * INITIAL DATA LOADING
 *
 * This simple conditional block plays a crucial role when the page first loads. Think of it as the
 * "wake-up routine" for our application.
 *
 * What's happening here?
 *
 * We check if taskData has any items (taskData.length evaluates to true if the array contains elements).
 * If it does, we call updateTaskContainer() to display those tasks.
 *
 * This is important because:
 *
 * 1. Persistence Check: It determines if there are saved tasks from previous sessions
 *
 * 2. Immediate Display: If there are tasks, it ensures they're displayed right away without any
 *    user action required
 *
 * 3. Clean Start: If there are no tasks (first-time user or all tasks deleted), nothing happens -
 *    the user starts with a clean interface
 *
 * This block bridges the gap between our data storage and the user interface. Without it, users would
 * have their tasks saved in localStorage, but wouldn't see them when they reload the page until they
 * performed some action that triggered updateTaskContainer().
 *
 * It's a simple piece of code, but it greatly enhances the user experience by providing continuity
 * between sessions.
 */
if (taskData.length) {
  updateTaskContainer();
}

//----------------------------------------------------------------------------------------------------------------------------------------------------------

/*
 * EVENT LISTENER: Open Task Form
 *
 * This event listener sets up the interaction for opening the task form. Think of it as connecting a
 * doorbell to the action of opening a door.
 *
 * Here's what happens:
 *
 * 1. Target Element: We attach an event listener to the openTaskFormBtn, which is our "Add New Task" button
 *
 * 2. Event Type: We listen for the "click" event - when the user clicks this button
 *
 * 3. Event Handler: When clicked, we execute an arrow function that toggles the "hidden" class on the taskForm
 *    - If the form has the "hidden" class, it removes it (making the form visible)
 *    - If the form doesn't have the "hidden" class, it adds it (hiding the form)
 *    In practice, since the form starts with the "hidden" class, the first click will make it visible.
 *
 * The classList.toggle() method is a convenient way to switch a class on and off. It's like a light switch -
 * each click changes the state from on to off or vice versa.
 *
 * This simple listener is the entry point for the main interaction in our app - adding a new task. When users
 * want to add a task, they click this button, the form appears, and they can enter the task details.
 */
openTaskFormBtn.addEventListener("click", () => taskForm.classList.toggle("hidden"));

//----------------------------------------------------------------------------------------------------------------------------------------------------------

/*
 * EVENT LISTENER: Close Task Form
 *
 * This event listener handles what happens when a user tries to close the task form. Think of it as a
 * smart door that asks "Are you sure?" before closing if you might lose something.
 *
 * Here's the step-by-step process:
 *
 * 1. We attach a click event listener to the closeTaskFormBtn (the X button in the form)
 *
 * 2. When clicked, the handler function executes and performs these checks:
 *
 *    - formInputsContainValues: This checks if any of the form fields have content.
 *      It uses logical OR (||) to see if any of the three inputs have a value.
 *      If any field has content, this variable is true.
 *
 *    - formInputValuesUpdated: This checks if the form values differ from the original task (if editing).
 *      It compares each input value with the corresponding property in currentTask.
 *      If any value is different, this variable is true.
 *
 * 3. Based on these checks, one of two things happens:
 *
 *    - If there are values AND they've been changed (formInputsContainValues && formInputValuesUpdated),
 *      we show the confirmation dialog with confirmCloseDialog.showModal().
 *      This asks the user if they want to discard their unsaved changes.
 *
 *    - Otherwise (empty form or unchanged values), we simply call reset() to clear and hide the form.
 *      No confirmation needed because nothing important would be lost.
 *
 * This is a thoughtful user experience design - it prevents accidental data loss by confirming the user's
 * intention when they have unsaved changes, but doesn't bother them with confirmations when there's nothing
 * to lose.
 */
closeTaskFormBtn.addEventListener("click", () => {
  const formInputsContainValues =
    titleInput.value || dateInput.value || descriptionInput.value;
  const formInputValuesUpdated =
    titleInput.value !== currentTask.title ||
    dateInput.value !== currentTask.date ||
    descriptionInput.value !== currentTask.description;

  if (formInputsContainValues && formInputValuesUpdated) {
    confirmCloseDialog.showModal();
  } else {
    reset();
  }
});

//----------------------------------------------------------------------------------------------------------------------------------------------------------

/*
 * EVENT LISTENER: Cancel Button (in Dialog)
 *
 * This event listener handles the "Cancel" button in the confirmation dialog. Think of it as the "No, wait,
 * I changed my mind" option when the application asks if you're sure about discarding changes.
 *
 * Here's what happens:
 *
 * 1. We attach a click event listener to the cancelBtn element
 *
 * 2. When clicked, it executes a simple action: confirmCloseDialog.close()
 *    This closes the dialog without taking any further action.
 *
 * 3. The result is:
 *    - The dialog disappears
 *    - The form remains open
 *    - All user input remains intact
 *    - The user can continue editing their task
 *
 * This provides a simple escape hatch for users who accidentally clicked the close button or reconsidered
 * after seeing the warning about unsaved changes.
 *
 * The dialog is shown only when there are unsaved changes, so the Cancel button effectively means
 * "I want to continue working on this task" rather than "I want to discard my changes."
 */
cancelBtn.addEventListener("click", () => confirmCloseDialog.close());

//----------------------------------------------------------------------------------------------------------------------------------------------------------

/*
 * EVENT LISTENER: Discard Button (in Dialog)
 *
 * This event listener handles the "Discard" button in the confirmation dialog. Think of it as the
 * "Yes, I'm sure - throw it away" option when the application asks about unsaved changes.
 *
 * Here's what happens when the user clicks this button:
 *
 * 1. First, we close the confirmation dialog with confirmCloseDialog.close()
 *    This removes the dialog from view.
 *
 * 2. Then, we call the reset() function, which:
 *    - Clears all form inputs
 *    - Hides the form
 *    - Resets the currentTask to an empty object
 *    - Returns the button text to "Add Task"
 *
 * The end result is that:
 * - All unsaved changes are discarded
 * - The form disappears
 * - The application returns to the task list view
 * - Any task that was being edited remains in its original state
 *
 * This action gives users a clear way to abandon their changes when they decide they don't want to
 * save them. It's an important part of the application flow, allowing users to back out of operations
 * they no longer wish to complete.
 */
discardBtn.addEventListener("click", () => {
  confirmCloseDialog.close();
  reset();
});

//----------------------------------------------------------------------------------------------------------------------------------------------------------

/*
 * EVENT LISTENER: Form Submission
 *
 * This event listener handles the form submission when the user clicks the "Add Task" or "Update Task" button.
 * Think of it as the final step in the workflow - the moment when a task is actually created or modified.
 *
 * Here's what happens:
 *
 * 1. We attach a submit event listener to the taskForm element
 *    This triggers when the form is submitted (when a submit button is clicked or Enter is pressed in the form)
 *
 * 2. The event handler function receives an event object (e) and immediately calls e.preventDefault()
 *    This is crucial - it stops the default browser behavior of submitting the form to a server and reloading the page
 *    Without this, our application state would be lost on every form submission
 *
 * 3. After preventing the default behavior, we call our addOrUpdateTask() function
 *    This function handles all the logic for:
 *    - Validating the form data
 *    - Creating or updating the task
 *    - Saving to localStorage
 *    - Updating the UI
 *    - Resetting the form
 *
 * This event listener is the trigger that puts all our task management logic into action. When the user has
 * filled out the form and clicks submit, this is the code that captures that action and processes it.
 *
 * The beauty of this approach is its simplicity - the event listener itself is very lean, delegating all
 * the complex logic to our addOrUpdateTask function. This separation of concerns makes the code more
 * maintainable and easier to understand.
 */
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  addOrUpdateTask();
});

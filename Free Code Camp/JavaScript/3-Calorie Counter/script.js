// 1. Get the Calorie Counter form element
// This form contains all the input fields, fieldsets (breakfast, lunch, dinner, snacks, exercise), and buttons.
// HTML Reference:
// <form id="calorie-counter">...</form>
const calorieCounter = document.getElementById("calorie-counter");

// 2. Get the Budget input field
// This is the number input where the user sets their daily calorie budget.
// HTML Reference:
// <label for="budget">Budget</label>
// <input type="number" id="budget" placeholder="Daily calorie budget">
const budgetNumberInput = document.getElementById("budget");

// 3. Get the entry dropdown menu
// This dropdown allows the user to select whether they are adding an entry under "Breakfast", "Lunch", "Dinner", "Snacks", or "Exercise".
// HTML Reference:
// <label for="entry-dropdown">Add food or exercise:</label>
// <select id="entry-dropdown">
//     <option value="breakfast">Breakfast</option>
//     <option value="lunch">Lunch</option>
//     <option value="dinner">Dinner</option>
//     <option value="snacks">Snacks</option>
//     <option value="exercise">Exercise</option>
// </select>
const entryDropdown = document.getElementById("entry-dropdown");

// 4. Get the "Add Entry" button
// This button allows users to add a new entry (food/exercise) to the selected category.
// HTML Reference:
// <button type="button" id="add-entry">Add Entry</button>
const addEntryButton = document.getElementById("add-entry");

// 5. Get the "Clear" button
// This button resets the form and clears all user inputs.
// HTML Reference:
// <button type="button" id="clear">Clear</button>
const clearButton = document.getElementById("clear");

// 6. Get the Output section
// This section displays the remaining calories after food intake and exercise are added.
// HTML Reference:
// <div id="output" class="output hide"></div>
const output = document.getElementById("output");

/*
 * Function: cleanInputString
 * Purpose: This function removes specific unwanted characters from a given string.
 * It ensures that the final output contains only valid numbers (digits) by removing
 * any plus signs (+), minus signs (-), and whitespace characters.
 *
 * Step-by-step breakdown:
 *
 * 1. Function Definition:
 *    - The function `cleanInputString(str)` takes a single argument, `str`, which is expected to be a string.
 *
 * 2. Regular Expression (Regex) Explanation:
 *    - The regex pattern `/[+-\s]/g` is used to match specific unwanted characters in the string.
 *    - `[+-\s]`: This defines a **character set** that includes:
 *       - `+` → Matches the plus sign.
 *       - `-` → Matches the minus sign.
 *       - `\s` → Matches any whitespace character (spaces, tabs, newlines).
 *    - `/g` (global flag) ensures that **all occurrences** of these characters are removed throughout the string.
 *
 * 3. `.replace(regex, '')`:
 *    - The `replace()` method finds all instances of the characters matched by the regex in `str` and replaces them with an **empty string ('')**.
 *    - This effectively **removes** all occurrences of `+`, `-`, and whitespace from the input.
 *
 * 4. Return Value:
 *    - The cleaned string (without `+`, `-`, or spaces) is returned as the function’s output.
 *
 * Example Usage:
 * ----------------------
 * cleanInputString("  +123 -456 ") → "123456"
 * cleanInputString("- 78 +90 ") → "7890"
 * cleanInputString("  12345 ") → "12345"  (No changes, since there are no `+` or `-`)
 *
 * This function is useful when processing **numeric inputs** where `+`, `-`, or spaces should be ignored.
 */

function cleanInputString(str) {
    const regex = /[+-\s]/g; // Define regex to match +, -, and spaces globally
    return str.replace(regex, ""); // Replace matched characters with an empty string = deleting the found regex
}

/*
 * Function: isInvalidInput
 * Purpose: This function checks if a given string contains a **scientific notation number** (e.g., "1e10", "2E5").
 * If such a pattern is found, it returns a **match object**; otherwise, it returns `null`.
 *
 * Step-by-step breakdown:
 *
 * 1. Function Definition:
 *    - The function `isInvalidInput(str)` takes a **string (`str`)** as input.
 *
 * 2. Regular Expression (Regex) Explanation:
 *    - The regex pattern `/\d+e\d+/i` is used to detect numbers written in **scientific notation**.
 *    - `\d+` → Matches **one or more digits** (e.g., "1", "23", "1000").
 *    - `e` → Matches the **character 'e'** (which represents scientific notation).
 *    - `\d+` → Matches **one or more digits** after 'e' (e.g., "10", "5").
 *    - `/i` (case-insensitive flag) → Allows matching both lowercase 'e' (`1e10`) and uppercase 'E' (`2E5`).
 *    - This ensures that **numbers like "1e10", "2E5", or "3e100"** are correctly identified.
 *
 * 3. `.match(regex)`:
 *    - The `match()` method checks if the input string (`str`) **contains a number in scientific notation**.
 *    - If a match is found, it returns a **match object** (an array-like structure containing the matched text).
 *    - If no match is found, it returns `null`.
 *
 * 4. Return Value:
 *    - If the string contains **scientific notation**, the match object is returned.
 *    - If not, `null` is returned.
 *
 * Example Usage:
 * ----------------------
 * isInvalidInput("1e10")   → Returns `["1e10"]` (match found)
 * isInvalidInput("2E5")    → Returns `["2E5"]` (match found)
 * isInvalidInput("abc123") → Returns `null` (no match)
 * isInvalidInput("100")    → Returns `null` (no match, no 'e' present)
 *
 * This function is useful when **validating numeric inputs**, especially in cases where scientific notation should not be allowed (e.g., form validation in a calculator app).
 */

function isInvalidInput(str) {
    const regex = /\d+e\d+/i; // Define regex to detect scientific notation (e.g., "1e10", "2E5")
    return str.match(regex); // Returns a match object if scientific notation is found, otherwise returns null
}

/*
 * Function: addEntry
 * Purpose: This function dynamically adds a new food or exercise entry inside the selected category
 * (Breakfast, Lunch, Dinner, Snacks, or Exercise) when the "Add Entry" button is clicked.
 *
 * Step-by-step breakdown:
 *
 * 1. **Get the Target Input Container**
 *    - The function first determines which section (Breakfast, Lunch, Dinner, Snacks, or Exercise) the new entry should be added to.
 *    - It uses `document.querySelector(...)` to **select the `.input-container`** inside the fieldset that matches the **selected value of `entryDropdown`**.
 *
 *    - HTML Reference:
 *      ```html
 *      <fieldset id="breakfast">
 *        <legend>Breakfast</legend>
 *        <div class="input-container"></div> <!-- New input fields are added here -->
 *      </fieldset>
 *      ```
 *    - Code:
 *      ```javascript
 *      const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
 *      ```
 *    - Example:
 *      - If `entryDropdown.value` is `"lunch"`, this selects:
 *        ```html
 *        <div class="input-container"></div> <!-- Inside <fieldset id="lunch"> -->
 *        ```
 *
 * 2. **Determine the Entry Number**
 *    - Counts the number of existing **text inputs (`<input type="text">`)** inside the selected category.
 *    - The new entry is assigned a number based on this count (**+1**).
 *
 *    - Code:
 *      ```javascript
 *      const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;
 *      ```
 *    - Example:
 *      - If there are already 2 entries in the **Lunch** section, the new entry will be **Entry 3**.
 *
 * 3. **Create the New Entry's HTML Structure**
 *    - Defines an **HTML string** containing:
 *      1. A **label** for the food/exercise name.
 *      2. A **text input** field for the name.
 *      3. A **label** for the calorie count.
 *      4. A **number input** field for calories.
 *    - The **IDs** of the inputs are dynamically created using:
 *      ```javascript
 *      entryDropdown.value + "-" + entryNumber + "-name"
 *      ```
 *      and
 *      ```javascript
 *      entryDropdown.value + "-" + entryNumber + "-calories"
 *      ```
 *    - Example:
 *      - If `entryDropdown.value = "snacks"` and `entryNumber = 2`, the generated IDs will be:
 *        ```html
 *        <label for="snacks-2-name">Entry 2 Name</label>
 *        <input type="text" id="snacks-2-name" placeholder="Name" />
 *        <label for="snacks-2-calories">Entry 2 Calories</label>
 *        <input type="number" id="snacks-2-calories" placeholder="Calories" />
 *        ```
 *
 *    - Code:
 *      ```javascript
 *      const HTMLString = `
 *      <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
 *      <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Name" />
 *      <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
 *      <input type="number" min="0" id="${entryDropdown.value}-${entryNumber}-calories" placeholder="Calories" />
 *      `;
 *      ```
 *
 * 4. **Insert the New Entry into the Selected Section**
 *    - Uses `.insertAdjacentHTML('beforeend', HTMLString)` to append the new entry to the selected category's **`.input-container`**.
 *
 *    - Code:
 *      ```javascript
 *      targetInputContainer.insertAdjacentHTML('beforeend', HTMLString);
 *      ```
 *    - This ensures that each new entry appears **below the previous ones**.
 *
 * Example Usage:
 * ----------------------
 * 1. User selects **"Dinner"** from the dropdown.
 * 2. Clicks the "Add Entry" button.
 * 3. The following fields appear inside the **Dinner** section:
 *    ```html
 *    <label for="dinner-1-name">Entry 1 Name</label>
 *    <input type="text" id="dinner-1-name" placeholder="Name" />
 *    <label for="dinner-1-calories">Entry 1 Calories</label>
 *    <input type="number" id="dinner-1-calories" placeholder="Calories" />
 *    ```
 * 4. If the user clicks "Add Entry" again, another set of inputs is added for **Entry 2**.
 */

function addEntry() {
    // 1. Get the target input container inside the selected category (breakfast, lunch, dinner, snacks, or exercise)
    const targetInputContainer = document.querySelector(
        `#${entryDropdown.value} .input-container`
    );

    // 2. Determine the new entry number by counting existing text inputs inside the target container
    const entryNumber =
        targetInputContainer.querySelectorAll('input[type="text"]').length + 1;

    // 3. Create the HTML for the new entry (name and calorie inputs with labels)
    const HTMLString = `
  <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
  <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Name" />
  <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
  <input type="number" min="0" id="${entryDropdown.value}-${entryNumber}-calories" placeholder="Calories" />
  `;

    // 4. Insert the new entry into the selected category's input container
    targetInputContainer.insertAdjacentHTML("beforeend", HTMLString);
}

addEntryButton.addEventListener("click", addEntry);

/*
 * Function: getCaloriesFromInputs
 * Purpose: This function processes a list of input elements, extracts their numeric values,
 * validates them, and returns the total sum of all calories entered.
 *
 * Step-by-step breakdown:
 *
 * 1. **Initialize the Total Calories Variable**
 *    - A variable `calories` is created and initialized to `0`.
 *    - This will be used to store the total calorie count after processing each input.
 *
 *    ```javascript
 *    let calories = 0;
 *    ```
 *
 * 2. **Loop Through Each Input in the List**
 *    - Uses a `for...of` loop to iterate through each `item` (which is an `<input>` element).
 *
 *    ```javascript
 *    for (const item of list) {
 *    ```
 *
 * 3. **Extract and Clean Input Values**
 *    - Calls `cleanInputString(item.value)`, which removes unwanted characters (`+`, `-`, spaces)
 *      and ensures we only get numeric values.
 *
 *    ```javascript
 *    const currVal = cleanInputString(item.value);
 *    ```
 *
 * 4. **Validate the Cleaned Input (Check for Invalid Scientific Notation)**
 *    - Calls `isInvalidInput(currVal)`, which checks if `currVal` contains **scientific notation (e.g., "2e10")**.
 *    - It does this using `.match(regex)`, which:
 *      - Returns **an array** of matched values if the input contains invalid notation.
 *      - Returns `null` if the input is valid.
 *
 *    ```javascript
 *    const invalidInputMatch = isInvalidInput(currVal);
 *    ```
 *
 *    - **How .match() Works:**
 *      - If a match is found (input is invalid), it returns an array:
 *        ```javascript
 *        console.log("2e10".match(/\d+e\d+/i));  // ["2e10"]
 *        ```
 *      - If no match is found (input is valid), it returns `null`:
 *        ```javascript
 *        console.log("100".match(/\d+e\d+/i));  // null
 *        ```
 *
 * 5. **Handle Invalid Input (Show an Alert)**
 *    - If `invalidInputMatch` is **not null**, it means an invalid input was found.
 *    - Since `.match()` returns an **array**, we access **invalidInputMatch[0]** to get the actual matched invalid input.
 *    - This ensures we only display the **invalid part** instead of the entire array.
 *
 *    ```javascript
 *    if (invalidInputMatch) {
 *      alert(`Invalid Input: ${invalidInputMatch[0]}`);
 *    ```
 *
 *    - **Why Use `invalidInputMatch[0]` Instead of Just `invalidInputMatch`?**
 *      | Scenario                  | What Happens                               |
 *      |---------------------------|-------------------------------------------|
 *      | `match()` finds a match    | Returns `["2e10"]`, so `[0]` extracts `"2e10"` |
 *      | `match()` finds nothing    | Returns `null`, avoiding errors          |
 *      | Using `invalidInputMatch[0]` | Extracts only the **first matched value** for better readability |
 *
 *    - **Incorrect Behavior If We Don't Use `[0]`:**
 *      ```javascript
 *      alert(`Invalid input: ${invalidInputMatch}`); // Shows ["2e10"], not user-friendly
 *      ```
 *
 *    - **Correct Behavior Using `[0]`:**
 *      ```javascript
 *      alert(`Invalid input: ${invalidInputMatch[0]}`); // Shows "2e10"
 *      ```
 *
 * 6. **Set Error Flag and Stop Execution**
 *    - If an invalid input is detected:
 *      - `isError = true` is set (global error flag).
 *      - The function **immediately returns `null`**, stopping further execution.
 *
 *    ```javascript
 *    isError = true;
 *    return null;
 *    ```
 *
 * 7. **Convert Valid Input to a Number and Add to Total**
 *    - If the input passes validation, it is converted to a **number** using `Number(currVal)`.
 *    - This ensures that the final sum only contains valid numeric values.
 *
 *    ```javascript
 *    calories += Number(currVal);
 *    ```
 *
 * 8. **Return the Total Calories**
 *    - Once all inputs have been processed, the total calorie count is returned.
 *
 *    ```javascript
 *    return calories;
 *    ```
 *
 * Example Usage:
 * ----------------------
 * **Valid Inputs:**
 * ```javascript
 * getCaloriesFromInputs(["200", "150", "50"]);  // Returns 400
 * ```
 *
 * **Invalid Inputs (Scientific Notation):**
 * ```javascript
 * getCaloriesFromInputs(["2e10", "300"]);  // Triggers alert: "Invalid Input: 2e10"
 * ```
 *
 * **Final Correct Code:**
 */

function getCaloriesFromInputs(list) {
    let calories = 0; // 1. Initialize total calories

    for (const item of list) {
        // 2. Loop through each input field
        const currVal = cleanInputString(item.value); // 3. Clean the input value
        const invalidInputMatch = isInvalidInput(currVal); // 4. Check for invalid input

        if (invalidInputMatch) {
            // 5. If invalid input is found:
            alert(`Invalid Input: ${invalidInputMatch[0]}`); // 6. Show the exact invalid part
            isError = true; // 7. Set error flag
            return null; // 8. Stop execution ==> no need for else as this will stop the function.
        }

        calories += Number(currVal); // 9. Convert to number and add to total
    }

    return calories; // 10. Return total calories
}

/*
 * Function: calculateCalories
 * Purpose: This function calculates the remaining calories based on user input for food intake
 * (breakfast, lunch, dinner, snacks) and exercise. It then updates the UI with the results.
 *
 * Step-by-step breakdown:
 *
 * 1. **Prevent Default Form Submission**
 *    - The function is triggered when the user submits the form.
 *    - `e.preventDefault();` prevents the form from refreshing the page.
 *
 *    ```javascript
 *    e.preventDefault();
 *    ```
 *
 * 2. **Initialize Error Tracking**
 *    - A global variable `isError` is set to `false`. If an error occurs while fetching calorie values,
 *      this flag is set to `true`, preventing further calculations.
 *
 *    ```javascript
 *    isError = false;
 *    ```
 *
 * 3. **Get Input Fields for Each Meal and Exercise**
 *    - Uses `document.querySelectorAll(...)` to select all `<input type="number">` fields inside
 *      each meal section (Breakfast, Lunch, Dinner, Snacks, Exercise).
 *
 *    ```javascript
 *    const breakfastNumberInputs = document.querySelectorAll("#breakfast input[type='number']");
 *    const lunchNumberInputs = document.querySelectorAll("#lunch input[type='number']");
 *    const dinnerNumberInputs = document.querySelectorAll("#dinner input[type='number']");
 *    const snacksNumberInputs = document.querySelectorAll("#snacks input[type='number']");
 *    const exerciseNumberInputs = document.querySelectorAll("#exercise input[type='number']");
 *    ```
 *
 *    - Example:
 *      - If the user enters `400` calories in the Breakfast section, this function collects that input.
 *      - If multiple inputs exist in a section, they are stored in a **NodeList**.
 *
 * 4. **Extract and Sum Calories from Inputs**
 *    - Calls `getCaloriesFromInputs(...)` for each meal section and the exercise section.
 *    - The function `getCaloriesFromInputs` (defined separately) extracts numerical values
 *      from inputs and adds them together.
 *
 *    ```javascript
 *    const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
 *    const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
 *    const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
 *    const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
 *    const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
 *    const budgetCalories = getCaloriesFromInputs([budgetNumberInput]); // Fetches user-defined calorie budget
 *    ```
 *
 *    - Example:
 *      - If Breakfast has inputs `400` and `200`, `getCaloriesFromInputs(breakfastNumberInputs)` returns `600`.
 *
 * 5. **Error Handling**
 *    - If `isError` is set to `true` (due to invalid input), the function stops execution.
 *
 *    ```javascript
 *    if (isError) {
 *      return;
 *    }
 *    ```
 *
 * 6. **Calculate Consumed and Remaining Calories**
 *    - Adds up **total consumed calories** from Breakfast, Lunch, Dinner, and Snacks.
 *    - Subtracts **consumed calories** from the budget and **adds burned calories** (exercise).
 *
 *    ```javascript
 *    const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
 *    const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
 *    ```
 *
 * 7. **Determine Surplus or Deficit**
 *    - If `remainingCalories < 0`, the user **exceeded** the budget → "Surplus."
 *    - If `remainingCalories >= 0`, the user is **within the budget** → "Deficit."
 *
 *    ```javascript
 *    const surplusOrDeficit = remainingCalories < 0 ? 'Surplus' : 'Deficit';
 *    ```
 *
 * 8. **Update the UI**
 *    - Displays the **remaining calories** with appropriate styling.
 *    - Uses `Math.abs(remainingCalories)` to ensure it shows the absolute difference.
 *    - The `output.innerHTML` dynamically updates the UI with:
 *      - Calories left (Surplus/Deficit)
 *      - Calories budgeted
 *      - Calories consumed
 *      - Calories burned (from exercise)
 *
 *    ```javascript
 *    output.innerHTML = `
 *      <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
 *      <hr>
 *      <p>${budgetCalories} Calories Budgeted</p>
 *      <p>${consumedCalories} Calories Consumed</p>
 *      <p>${exerciseCalories} Calories Burned</p>
 *    `;
 *    ```
 *
 * 9. **Show the Output Section**
 *    - Removes the `.hide` class from the output div to make the result visible.
 *
 *    ```javascript
 *    output.classList.remove('hide');
 *    ```
 *
 * Example Usage:
 * ----------------------
 * **Scenario 1:**
 * - Budget: `2000` calories
 * - Breakfast: `500`
 * - Lunch: `600`
 * - Dinner: `700`
 * - Snacks: `200`
 * - Exercise: `300`
 * - Calculation:
 *   - Consumed: `500 + 600 + 700 + 200 = 2000`
 *   - Remaining: `2000 - 2000 + 300 = 300`
 * - **Output Displayed:**
 *   ```
 *   300 Calorie Deficit
 *   -------------------
 *   2000 Calories Budgeted
 *   2000 Calories Consumed
 *   300 Calories Burned
 *   ```
 *
 * **Scenario 2 (Surplus):**
 * - Budget: `2000`
 * - Consumed: `2500`
 * - Exercise: `200`
 * - Remaining: `2000 - 2500 + 200 = -300`
 * - **Output:**
 *   ```
 *   300 Calorie Surplus
 *   -------------------
 *   2000 Calories Budgeted
 *   2500 Calories Consumed
 *   200 Calories Burned
 *   ```
 */

function calculateCalories(e) {
    e.preventDefault(); // 1. Prevent form submission

    isError = false; // 2. Initialize error tracking

    // 3. Get all calorie input fields for each category
    const breakfastNumberInputs = document.querySelectorAll(
        "#breakfast input[type='number']"
    );
    const lunchNumberInputs = document.querySelectorAll("#lunch input[type='number']");
    const dinnerNumberInputs = document.querySelectorAll("#dinner input[type='number']");
    const snacksNumberInputs = document.querySelectorAll("#snacks input[type='number']");
    const exerciseNumberInputs = document.querySelectorAll(
        "#exercise input[type='number']"
    );

    // 4. Extract calorie values from input fields
    const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
    const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
    const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
    const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
    const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
    const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

    // 5. Stop if an error is detected (invalid input)
    if (isError) {
        return;
    }

    // 6. Calculate consumed and remaining calories
    const consumedCalories =
        breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
    const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;

    // 7. Determine if the user is in a surplus or deficit
    const surplusOrDeficit = remainingCalories < 0 ? "Surplus" : "Deficit";

    // 8. Update the output section with the results
    output.innerHTML = `
  <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(
        remainingCalories
    )} Calorie ${surplusOrDeficit}</span>
  <hr>
  <p>${budgetCalories} Calories Budgeted</p>
  <p>${consumedCalories} Calories Consumed</p>
  <p>${exerciseCalories} Calories Burned</p>
  `;

    // 9. Show the output div
    output.classList.remove("hide");
}

/*
 * Function: clearForm
 * Purpose: This function clears all user inputs from the form, resets the calorie tracker,
 * and hides the output section.
 *
 * Step-by-step breakdown:
 *
 * 1. **Select All Input Containers**
 *    - Uses `document.querySelectorAll(".input-container")` to get all `<div class="input-container">`
 *      elements inside the different meal and exercise sections.
 *    - Converts the **NodeList** into an **array** using `Array.from(...)` so we can use `for...of` loop.
 *
 *    ```javascript
 *    const inputContainers = Array.from(document.querySelectorAll(".input-container"));
 *    ```
 *
 *    - **Example:** If the user added inputs in the **Breakfast, Lunch, and Dinner** sections,
 *      `inputContainers` would contain:
 *      ```html
 *      <div class="input-container"> <!-- Inside Breakfast -->
 *          <label>Entry 1</label>
 *          <input type="text">
 *          <input type="number">
 *      </div>
 *      <div class="input-container"> <!-- Inside Lunch -->
 *          <label>Entry 1</label>
 *          <input type="text">
 *          <input type="number">
 *      </div>
 *      ```
 *      After clearing, all these containers will become **empty**.
 *
 * 2. **Clear All Input Containers**
 *    - Iterates through each `.input-container` and sets `container.innerHTML = ""`,
 *      which removes all dynamically added inputs.
 *
 *    ```javascript
 *    for (const container of inputContainers) {
 *        container.innerHTML = "";
 *    }
 *    ```
 *
 *    - **Before Clearing:**
 *      ```html
 *      <div class="input-container">
 *          <input type="text">
 *          <input type="number">
 *      </div>
 *      ```
 *    - **After Clearing:**
 *      ```html
 *      <div class="input-container"></div>
 *      ```
 *
 * 3. **Reset the Budget Input**
 *    - Clears the **budget input field** so that the user can enter a new value.
 *
 *    ```javascript
 *    budgetNumberInput.value = "";
 *    ```
 *
 *    - **Before:**
 *      ```html
 *      <input type="number" id="budget" value="2000">
 *      ```
 *    - **After:**
 *      ```html
 *      <input type="number" id="budget" value="">
 *      ```
 *
 * 4. **Clear the Output Section**
 *    - Removes any displayed **calculation results** by setting `output.innerText = ""`.
 *
 *    ```javascript
 *    output.innerText = "";
 *    ```
 *
 * 5. **Hide the Output Section**
 *    - Adds the `"hide"` class to the `output` div, making it **invisible**.
 *
 *    ```javascript
 *    output.classList.add("hide");
 *    ```
 *
 *    - **Before Clearing:**
 *      ```html
 *      <div id="output" class="output">500 Calorie Deficit</div>
 *      ```
 *    - **After Clearing:**
 *      ```html
 *      <div id="output" class="output hide"></div>
 *      ```
 *
 * Example Usage:
 * ----------------------
 * **User Actions Before Clicking "Clear"**
 * - Adds a **2000 calorie budget**.
 * - Adds **Breakfast: 500 calories**.
 * - Adds **Exercise: burns 200 calories**.
 * - Clicks **"Calculate Remaining Calories"**, and sees:
 *   ```
 *   1700 Calorie Deficit
 *   --------------------
 *   2000 Calories Budgeted
 *   500 Calories Consumed
 *   200 Calories Burned
 *   ```
 *
 * **User Clicks the "Clear" Button**
 * - All **inputs are removed**.
 * - The **budget field is cleared**.
 * - The **output section is hidden**.
 *
 * **Final State After Clicking "Clear"**
 * - **Form is empty**
 * - **Output is hidden**
 *
 * ---
 *
 * **Event Listeners:**
 * - **Clicking "Clear"** triggers `clearForm()`:
 *    ```javascript
 *    clearButton.addEventListener("click", clearForm);
 *    ```
 * - **Clicking "Add Entry"** adds a new input field:
 *    ```javascript
 *    addEntryButton.addEventListener("click", addEntry);
 *    ```
 * - **Submitting the form** calculates calories:
 *    ```javascript
 *    calorieCounter.addEventListener("submit", calculateCalories);
 *    ```
 */

function clearForm() {
    // 1. Get all input containers inside the form
    const inputContainers = Array.from(document.querySelectorAll(".input-container"));

    // 2. Loop through each container and clear its content
    for (const container of inputContainers) {
        container.innerHTML = "";
    }

    // 3. Clear the budget input field
    budgetNumberInput.value = "";

    // 4. Clear the output section
    output.innerText = "";

    // 5. Hide the output section
    output.classList.add("hide");
}

// Attach event listeners to buttons
clearButton.addEventListener("click", clearForm); // Clears the form when "Clear" button is clicked
addEntryButton.addEventListener("click", addEntry); // Adds new entry fields when "Add Entry" button is clicked
calorieCounter.addEventListener("submit", calculateCalories); // Triggers calorie calculation when the form is submitted

/**
 * Starting with the user journey is crucial because programming is about solving human problems.
 * We're mapping out what the user does (enters text), what triggers our program (button click),
 * what happens behind the scenes (palindrome check), and what the user sees (the result).
 * This user-focused thinking helps build intuitive interfaces, like apps that seem to read your mind.
 */
/*
Think of the process first,
1-the user needs to write a text
2-the user then clicks check button
3-then there is a process for checking the text if it is a palindrome
4- after that the results is shown

First, I need to establish connections to the key parts of my webpage. These are the elements
users will interact with and where we'll display results.
*/

/**
 * These three lines are like building bridges between our JavaScript and the HTML elements.
 * We're connecting to the input field where users type, the button they'll click, and the
 * container where we'll show results.
 *
 * We do this at the top of our file because these are our primary tools throughout the code.
 * It's like organizing all your ingredients before cooking - we're saying, "Here are all the
 * webpage elements I'll be working with."
 *
 * We use const instead of let or var because these references shouldn't change during the
 * life of our program.
 */
// Step 1: Setting up connections to HTML elements
// These are like setting up phone lines to different parts of our webpage
// Where users will type, what users will click, and where we'll show results
const userInput = document.getElementById("text-input");
const checkPalindromeBtn = document.getElementById("check-btn");
const resultDiv = document.getElementById("result");
//--------------------------------------------------------------------------------------------------------------

/**
 * Now we're creating the main function that powers everything, using a modern arrow function
 * for clarity.
 *
 * The first thing we do is save a copy of the original input. This is because we'll need to
 * transform the input (removing spaces, making it lowercase) to check if it's a palindrome,
 * but we want to display the original text in our result.
 *
 * It's like making a photocopy of a document to mark up, while keeping the original pristine.
 * Without saving this original copy, we'd lose the user's exact input!
 */
/*
Now I need to create the main function that will handle the entire palindrome checking process.
This function will take the input text and determine if it's a palindrome, then display the result.
I'm using an arrow function here which is a more modern, compact way to define functions.
*/

// Step 2: Creating our main palindrome checking function
const checkForPalindrome = (input) => {
  // I'm storing the original input immediately because I'll need to display it later
  // after I've modified a copy for checking
  const originalInput = input;

  /**
   * Here we're thinking defensively: "What might go wrong? What if the user clicks 'Check'
   * without typing anything?"
   *
   * This is like checking if someone filled out a form before processing it. The return statement
   * is crucial - it says "If there's nothing to check, stop right here." Without this early exit,
   * we'd attempt to process an empty string, which isn't helpful.
   *
   * If we removed this check, the program wouldn't break, but we'd end up showing that an
   * empty string is a palindrome - technically correct but not useful to users!
   */
  // First, check if the user actually entered something
  // If they didn't, we should show an alert and stop the function right here
  if (input === "") {
    alert("Please input a value");
    return; // This exits the function immediately - no need to go further
  }

  /**
   * This single line shows we're thinking about repeated use. What happens if someone checks
   * "racecar", then wants to check "hello"?
   *
   * Without this line, results would stack up. By calling replaceChildren(), we're saying
   * "clear out any previous results before showing a new one." It's like erasing a chalkboard
   * before writing a new message.
   */
  // Clear any previous results to start fresh
  // It's like wiping the slate clean before writing a new message
  resultDiv.replaceChildren();

  /**
   * This is the heart of our application. First, we clean the string by removing anything
   * that's not a letter or number and converting everything to lowercase.
   *
   * Why? Because "A man, a plan, a canal: Panama!" should be recognized as a palindrome despite
   * spaces, punctuation, and capital letters. We're getting to the essence of the text.
   *
   * For the palindrome check:
   * 1. [...lowerCaseStr] spreads the string into an array of individual characters
   * 2. .reverse() flips the array order
   * 3. .join("") reassembles the characters into a string
   * 4. We compare this to the original cleaned string
   *
   * The ternary operator (? :) elegantly chooses between "is" and "is not" based on this comparison.
   * This approach mimics exactly what we do mentally: "Does this word read the same backward as forward?"
   */
  // This is where the actual palindrome checking happens
  // First, clean the string by removing non-alphanumeric characters and making everything lowercase
  const lowerCaseStr = input.replace(/[^A-Za-z0-9]/gi, "").toLowerCase();

  // Now check if the cleaned string is the same forward and backward
  // We use the [...string] spread syntax to convert to an array, then reverse it and join back to a string
  // The ternary operator (? :) gives us a compact way to choose between "is" and "is not"
  let resultMsg = `${originalInput} ${
    lowerCaseStr === [...lowerCaseStr].reverse().join("") ? "is" : "is not"
  } a palindrome.`;

  /**
   * Now we're thinking about how to present the result to the user. Instead of just setting text,
   * we're creating a whole new element with specific styling and adding it to the container.
   *
   * Why create a new element instead of just updating text? This gives us more control over styling
   * and structure. It's like crafting a proper response card rather than just shouting an answer.
   *
   * And finally, we make sure the results area is visible by removing the 'hidden' class.
   */
  // Create a new paragraph element to display our result
  // This gives us more control over styling and structure
  const pTag = document.createElement("p");
  pTag.className = "user-input"; // Add a CSS class for styling
  pTag.innerText = resultMsg; // Set the text to our result message
  resultDiv.appendChild(pTag); // Add it to our result container

  // Make sure our result is visible by removing the 'hidden' class
  resultDiv.classList.remove("hidden");
};
//--------------------------------------------------------------------------------------------------------------

/**
 * Here we're wiring up what happens when someone clicks the button:
 * 1. Get the current text from the input field
 * 2. Pass it to our palindrome checking function
 * 3. Clear the input field for the next check
 *
 * Think of this like setting up a doorbell - when someone presses it, specific actions happen
 * in sequence. We clear the input afterward to give the user a clean slate for their next check.
 */
/*
Now I need to connect user actions to our function. I'll set up an event listener for button clicks.
This is what triggers our palindrome checking when the user clicks the button.
*/

// Step 3: Setting up event listener for button clicks
checkPalindromeBtn.addEventListener("click", () => {
  // When button is clicked, grab the current input value and check it
  checkForPalindrome(userInput.value);
  // Clear the input field to make it easy to enter a new word
  userInput.value = "";
});
//--------------------------------------------------------------------------------------------------------------

/**
 * This final piece shows we're really thinking about natural user behavior. Have you ever filled
 * out a form and instinctively hit Enter? That's exactly what we're accommodating here!
 *
 * We're listening for keydown events, checking if the key pressed is Enter, and if so, triggering
 * the same process as a button click. This parallel path means users can interact in whatever way
 * feels most natural to them.
 *
 * Every line in this program serves a specific purpose in a carefully considered flow. Each piece
 * builds on the last, creating a seamless experience from user input to final result.
 */
/*
For better user experience, I should also allow users to press Enter to check palindromes.
This makes the interface more natural, as users often expect to be able to submit by pressing Enter.
*/

// Step 4: Adding convenience feature - also check when Enter key is pressed
userInput.addEventListener("keydown", (e) => {
  // Check if the key pressed is Enter
  if (e.key === "Enter") {
    // If it is, do the same thing as a button click
    checkForPalindrome(userInput.value);
    userInput.value = ""; // Also clear the input field
  }
});

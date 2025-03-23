/*
Think of the process first,
1-the user needs to write a text
2-the user then clicks check button
3-then there is a process for checking the text if it is a palindrome
4- after that the results is shown

- so knowing the interactive elements in my code i can do the event handling by accessing them.
as follows:


Choosing these because:

1-input where users type their input
2- the button because they interact by clicking it
3- the space where the results will show.
*/
/* Step 1 ==> Settug up Event Handlers and Javascript files */
const textInput = document.getElementById("text-input");
const checkButton = document.getElementById("check-btn");
const resultsBox = document.getElementById("result");
//--------------------------------------------------------------------------------------------------------------

/* Step 2 ==> Event Listeners that Kicks everything off*/
/*
-what happens here? ==> once the button is click, the function will run, the first thing
we need to know is grab the value that is typed by the user ==> inputText
*/

checkButton.addEventListener("click", handlePalindromeCheck);

/*
Step 3 ==> Clean the input,
- we make sure we need to remove any characters that are not 0-9 or a-z,
-we want to remove any puncuation, spaces and special characters,
- instead of
 */

function handlePalindromeCheck() {
  const inputText = textInput.value.trim(); //grabbing the text user put, this is the starting material to start

  /*
-now we need to see whether there is actually an text written or the user just clicked without submitting a text.
*/
  if (!inputText) {
    alert("Please input a value u moron fuck");
    return; // stops the function here, without it the rest of the code will run, regardless of showing the alert.
  }
  /* here we call our specialised function that check whether the input is a palindrome or not, */
  const palindromeCheck = isPalindrome(inputText);
  resultsBox.classList.remove("hidden");
  resultsBox.style.display = "block";
  resultsBox.textContent = palindromeCheck
    ? `${inputText} is a palindrome.`
    : `${inputText} is not a palindrome.`;

  textInput.value = ""; //clears the value
}
//--------------------------------------------------------------------------------------------------------------

function isPalindrome(str) {
  const cleanedStr = cleanInputString(str);
  const reversedStr = cleanedStr.split("").reverse().join("");
  return cleanedStr === reversedStr;
}
/*
Step 3 ==> Handle the click, in the event listener,
*/

function cleanInputString(str) {
  const regex = /[^a-z0-9]/g;
  return str.toLowerCase().replace(regex, "");
}

// Step 4: Adding convenience feature - also check when Enter key is pressed

textInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handlePalindromeCheck();
  }
});

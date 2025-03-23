const numberInput = document.getElementById("number");
const convertBtn = document.getElementById("convert-btn");
const output = document.getElementById("output");

const romanNumerals = [
  { value: 1000, symbol: "M" },
  { value: 900, symbol: "CM" },
  { value: 500, symbol: "D" },
  { value: 400, symbol: "CD" },
  { value: 100, symbol: "C" },
  { value: 90, symbol: "XC" },
  { value: 50, symbol: "L" },
  { value: 40, symbol: "XL" },
  { value: 10, symbol: "X" },
  { value: 9, symbol: "IX" },
  { value: 5, symbol: "V" },
  { value: 4, symbol: "IV" },
  { value: 1, symbol: "I" },
];

convertToRoman = (num) => {
  let roman = "";
  for (let i = 0; i < romanNumerals.length; i++) {
    while (num >= romanNumerals[i].value) {
      roman += romanNumerals[i].symbol;
      num = num - romanNumerals[i].value;
    }
  }
  return roman;
};

const res = [];

const checkUserInput = () => {
  const inputValue = numberInput.value;
  const num = parseInt(inputValue);

  output.classList.remove("hidden");
  output.classList.remove("alert");

  if (!inputValue || isNaN(num)) {
    output.textContent = "Please enter a valid number";
    output.classList.add("alert");
  } else if (num < 1) {
    output.textContent = "Please enter a number greater than or equal to 1";
    output.classList.add("alert");
  } else if (num >= 4000) {
    output.textContent = "Please enter a number less than or equal to 3999";
    output.classList.add("alert");
  } else {
    output.textContent = convertToRoman(num);
  }
};

convertBtn.addEventListener("click", checkUserInput);

numberInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    checkUserInput();
  }
});

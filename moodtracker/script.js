// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function () {
  // Get DOM elements
  const currentDateElement = document.getElementById("current-date");
  const moodOptions = document.querySelectorAll(".mood-option");
  const moodNotes = document.getElementById("mood-notes");
  const saveEntryButton = document.getElementById("save-entry");
  const historyContainer = document.getElementById("history-container");

  // Set current date
  const today = new Date();
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  currentDateElement.textContent = today.toLocaleDateString("en-US", options);

  // Initialize variables
  let selectedMood = null;

  // Load saved moods from local storage
  loadMoodHistory();

  // Add event listeners to mood options
  moodOptions.forEach((option) => {
    option.addEventListener("click", function () {
      // Remove selected class from all options
      moodOptions.forEach((opt) => opt.classList.remove("selected"));

      // Add selected class to clicked option
      this.classList.add("selected");

      // Save selected mood
      selectedMood = this.getAttribute("data-mood");
    });
  });

  // Save mood entry
  saveEntryButton.addEventListener("click", function () {
    if (!selectedMood) {
      alert("Please select a mood first!");
      return;
    }

    // Get selected emoji
    const selectedEmoji = document.querySelector(
      `.mood-option[data-mood="${selectedMood}"] .mood-emoji`
    ).textContent;

    // Create mood entry object
    const moodEntry = {
      date: new Date().toISOString(),
      mood: selectedMood,
      emoji: selectedEmoji,
      notes: moodNotes.value.trim(),
    };

    // Save to local storage
    saveMoodEntry(moodEntry);

    // Add to history
    addMoodToHistory(moodEntry);

    // Reset form
    resetForm();

    // Show success feedback
    showSaveFeedback();
  });

  // Function to save mood entry to local storage
  function saveMoodEntry(entry) {
    // Get existing entries or initialize empty array
    const entries = JSON.parse(localStorage.getItem("moodEntries")) || [];

    // Add new entry
    entries.push(entry);

    // Save back to local storage
    localStorage.setItem("moodEntries", JSON.stringify(entries));
  }

  // Function to load mood history from local storage
  function loadMoodHistory() {
    // Get entries from local storage
    const entries = JSON.parse(localStorage.getItem("moodEntries")) || [];

    // Clear history container
    historyContainer.innerHTML = "";

    // Add entries to history in reverse order (newest first)
    entries
      .slice()
      .reverse()
      .forEach((entry) => {
        addMoodToHistory(entry);
      });

    // Show message if no entries
    if (entries.length === 0) {
      historyContainer.innerHTML =
        '<p class="no-entries">No mood entries yet. Start tracking today!</p>';
    }
  }

  // Function to add mood entry to history UI
  function addMoodToHistory(entry) {
    // Create history item element
    const historyItem = document.createElement("div");
    historyItem.className = "history-item";
    historyItem.setAttribute("data-id", entry.date);

    // Format date
    const entryDate = new Date(entry.date);
    const formattedDate = entryDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Build history item HTML
    historyItem.innerHTML = `
            <div class="history-item-left">
                <div class="history-date">${formattedDate}</div>
                <div class="history-mood">
                    <span class="history-mood-emoji">${entry.emoji}</span>
                    <span>${
                      entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)
                    }</span>
                </div>
                ${entry.notes ? `<div class="history-notes">${entry.notes}</div>` : ""}
            </div>
            <div class="history-item-right">
                <button class="delete-btn" data-id="${entry.date}">×</button>
            </div>
        `;

    // Add to history container
    historyContainer.prepend(historyItem);

    // Add delete functionality
    historyItem.querySelector(".delete-btn").addEventListener("click", function (e) {
      e.stopPropagation();
      deleteMoodEntry(entry.date);
    });
  }

  // Function to delete mood entry
  function deleteMoodEntry(entryDate) {
    // Get existing entries
    let entries = JSON.parse(localStorage.getItem("moodEntries")) || [];

    // Filter out the entry to delete
    entries = entries.filter((entry) => entry.date !== entryDate);

    // Save back to local storage
    localStorage.setItem("moodEntries", JSON.stringify(entries));

    // Remove from UI
    const entryElement = document.querySelector(`.history-item[data-id="${entryDate}"]`);
    if (entryElement) {
      entryElement.style.transform = "translateX(100px)";
      entryElement.style.opacity = "0";
      setTimeout(() => {
        entryElement.remove();

        // Show message if no entries
        if (entries.length === 0) {
          historyContainer.innerHTML =
            '<p class="no-entries">No mood entries yet. Start tracking today!</p>';
        }
      }, 300);
    }
  }

  // Function to reset form after saving
  function resetForm() {
    moodOptions.forEach((opt) => opt.classList.remove("selected"));
    moodNotes.value = "";
    selectedMood = null;
  }

  // Function to show save feedback
  function showSaveFeedback() {
    const originalText = saveEntryButton.textContent;
    saveEntryButton.textContent = "Saved!";
    saveEntryButton.style.backgroundColor = "#4CAF50";

    setTimeout(() => {
      saveEntryButton.textContent = originalText;
      saveEntryButton.style.backgroundColor = "";
    }, 1500);
  }
});

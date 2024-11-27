import { categories } from "./utils.js";

// DOM Elements
const categorySelect = document.getElementById("category");
const fetchWordButton = document.getElementById("fetchWord");
const wordElement = document.getElementById("word");
const definitionElement = document.getElementById("definition");
const errorElement = document.getElementById("error");
const saveWordButton = document.createElement("button");
const savedWordsButton = document.createElement("button");
const container = document.querySelector(".container");

// Add buttons for saving and viewing words
saveWordButton.textContent = "Save Word";
saveWordButton.style.display = "none"; // Initially hidden
container.appendChild(saveWordButton);

savedWordsButton.textContent = "View Saved Words";
container.appendChild(savedWordsButton);

let currentWord = null;

// Function to fetch a random word from the selected category
function fetchWord(category) {
  const categoryWords = categories[category];
  if (!categoryWords) {
    throw new Error("Invalid category");
  }
  return categoryWords[Math.floor(Math.random() * categoryWords.length)];
}

// Function to fetch the image from the server
async function fetchImage(prompt) {
  try {
    const response = await fetch("http://localhost:5000/generate-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const { imageUrl } = await response.json();
    return imageUrl;
  } catch (error) {
    console.error("Error fetching image:", error);
    throw new Error("Failed to fetch image. Please try again later.");
  }
}

// Fetch word on button click
fetchWordButton.addEventListener("click", async () => {
  const category = categorySelect.value;

  // Clear previous results
  wordElement.textContent = "";
  definitionElement.textContent = "";
  errorElement.textContent = "";
  saveWordButton.style.display = "none";

  try {
    const { word, definition } = fetchWord(category);
    currentWord = { word, definition };
    wordElement.textContent = word;
    definitionElement.textContent = definition;
    saveWordButton.style.display = "block";

    // Fetch and apply background image
    const imagePrompt = `A high-quality, artistic representation of ${word}: ${definition}`;
    const imageUrl = await fetchImage(imagePrompt);
    document.body.style.backgroundImage = `url(${imageUrl})`;
  } catch (error) {
    errorElement.textContent = error.message;
  }
});

// Save the current word to local storage
saveWordButton.addEventListener("click", () => {
  if (!currentWord) return;

  let savedWords = JSON.parse(localStorage.getItem("savedWords")) || [];
  savedWords.push(currentWord);
  localStorage.setItem("savedWords", JSON.stringify(savedWords));
  alert(`Saved: ${currentWord.word}`);
});

// View saved words
savedWordsButton.addEventListener("click", () => {
  const savedWords = JSON.parse(localStorage.getItem("savedWords")) || [];
  if (savedWords.length === 0) {
    alert("No saved words found.");
    return;
  }

  const savedWordsList = savedWords
    .map((entry) => `${entry.word}: ${entry.definition}`)
    .join("\n");
  alert(`Saved Words:\n\n${savedWordsList}`);
});

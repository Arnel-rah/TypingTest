// ============= Dark mode toggle ================ //
const body = document.body;
const themeIcon = document.getElementById("theme-icon");
const toggleThumb = document.getElementById("toggle-thumb");

function applyTheme(theme) {
  if (theme === "dark") {
    body.classList.add("dark");
    themeIcon.classList.replace("fa-sun", "fa-moon");
    toggleThumb.style.transform = "translateX(22px)";
  } else {
    body.classList.remove("dark");
    themeIcon.classList.replace("fa-moon", "fa-sun");
    toggleThumb.style.transform = "translateX(0)";
  }
}

function toggleDarkMode() {
  const isDark = body.classList.toggle("dark");
  const theme = isDark ? "dark" : "light";
  localStorage.setItem("theme", theme);
  applyTheme(theme);
}

document.getElementById("theme-switch").addEventListener("click", toggleDarkMode);


const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);


// ============== Gestion des cartes de difficulte =============== //

let selectedDifficulty = null;
let selectedDuration = null;
document.querySelectorAll(".difficulty-card").forEach(card => {
  card.addEventListener("click", () => {
    if (card.classList.contains("facile")) {
      selectedDifficulty = "facile";
    } else if (card.classList.contains("ordinaire")) {
      selectedDifficulty = "ordinaire";
    } else if (card.classList.contains("dur")) {
      selectedDifficulty = "dur";
    }
    document.querySelectorAll(".difficulty-card").forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");

    checkSelectionAndRedirect();
  });
});
document.querySelectorAll(".duration-card").forEach(card => {
  card.addEventListener("click", () => {
    selectedDuration = card.dataset.duration;
    document.querySelectorAll(".duration-card").forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");

    checkSelectionAndRedirect();
  });
});

function checkSelectionAndRedirect() {
  if (selectedDifficulty && selectedDuration) {
    const url = `typing-test.html?difficulty=${selectedDifficulty}&duration=${selectedDuration}`;
    window.location.href = url;
  }
}



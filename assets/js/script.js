// --- Dark mode toggle ---
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

// Load saved theme
const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);


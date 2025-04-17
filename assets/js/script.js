// ================== DARK MODE TOGGLE ================== //
const body = document.body;
const themeIcon = document.getElementById("theme-icon");
const toggleThumb = document.getElementById("toggle-thumb");

// APPLIQUE LE THÈME SELON LA VALEUR PASSÉE
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

// BASCULE ENTRE LE MODE SOMBRE ET CLAIR
function toggleDarkMode() {
  const isDark = body.classList.toggle("dark");
  const theme = isDark ? "dark" : "light";
  localStorage.setItem("theme", theme);
  applyTheme(theme);
}

// AJOUTE L'ÉCOUTEUR D'ÉVÈNEMENT AU SWITCH
document
  .getElementById("theme-switch")
  .addEventListener("click", toggleDarkMode);

// CHARGE LE THÈME SAUVEGARDÉ AU CHARGEMENT
const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);

// ================== GESTION DES CARTES DE DIFFICULTÉ & DURÉE ================== //
let selectedDifficulty = null;
let selectedDuration = null;

// SÉLECTION DU NIVEAU DE DIFFICULTÉ
document.querySelectorAll(".difficulty-card").forEach((card) => {
  card.addEventListener("click", () => {
    if (card.classList.contains("facile")) {
      selectedDifficulty = "facile";
    } else if (card.classList.contains("ordinaire")) {
      selectedDifficulty = "ordinaire";
    } else if (card.classList.contains("dur")) {
      selectedDifficulty = "dur";
    }
    document
      .querySelectorAll(".difficulty-card")
      .forEach((c) => c.classList.remove("selected"));
    card.classList.add("selected");

    checkSelectionAndRedirect();
  });
});

// SÉLECTION DE LA DURÉE
document.querySelectorAll(".duration-card").forEach((card) => {
  card.addEventListener("click", () => {
    selectedDuration = card.dataset.duration;
    document
      .querySelectorAll(".duration-card")
      .forEach((c) => c.classList.remove("selected"));
    card.classList.add("selected");

    checkSelectionAndRedirect();
  });
});

// REDIRIGE VERS LA PAGE DU TEST AVEC LES PARAMÈTRES
function checkSelectionAndRedirect() {
  if (selectedDifficulty && selectedDuration) {
    const url = `typing-test.html?difficulty=${selectedDifficulty}&duration=${selectedDuration}`;
    window.location.href = url;
  }
}

// ================== MENU BURGER POUR MOBILE ================== //
function toggleMenu() {
  const navMenu = document.getElementById("navMenu");
  const burgerIcon = document.querySelector("#burgerMenu i");

  navMenu.classList.toggle("show");

  if (navMenu.classList.contains("show")) {
    burgerIcon.classList.remove("fa-bars");
    burgerIcon.classList.add("fa-times");
  } else {
    burgerIcon.classList.remove("fa-times");
    burgerIcon.classList.add("fa-bars");
  }
}

// FERMER LE MENU SI ON CLIQUE EN DEHORS
document.addEventListener("click", function (e) {
  const navMenu = document.getElementById("navMenu");
  const burgerMenu = document.getElementById("burgerMenu");

  if (
    !navMenu.contains(e.target) &&
    !burgerMenu.contains(e.target) &&
    navMenu.classList.contains("show")
  ) {
    navMenu.classList.remove("show");
    const icon = burgerMenu.querySelector("i");
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
  }
});


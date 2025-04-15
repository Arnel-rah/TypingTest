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

// ================== TRADUCTION (FR / EN) ================== //
const translations = {
  fr: {
    welcome: "BIENVENU AU VANILLA TYPING",
    choose_difficulty: "Choisissez le niveau de difficulté du test",
    easy: "Facile",
    medium: "Ordinaire",
    hard: "Dur",
    choose_duration: "Choisissez la durée du test",
    "1min": "1 Minute",
    "2min": "2 Minutes",
    "3min": "3 Minutes",
    demo: "Démo",
    signup: "S’inscrire"
  },
  en: {
    welcome: "WELCOME TO VANILLA TYPING",
    choose_difficulty: "Choose the test difficulty level",
    easy: "Easy",
    medium: "Meduim",
    hard: "Hard",
    choose_duration: "Choose test duration",
    "1min": "1 Minute",
    "2min": "2 Minutes",
    "3min": "3 Minutes",
    demo: "Demo",
    signup: "Sign up"
  },
};

// APPLIQUE LA LANGUE SÉLECTIONNÉE AUX ÉLÉMENTS
function applyLanguage(lang) {
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  const flagIcon = document.getElementById("flagIcon");
  const languageCode = document.getElementById("languageCode");

  if (flagIcon && languageCode) {
    flagIcon.textContent = lang === "fr" ? "🇫🇷" : "🇬🇧";
    languageCode.textContent = lang.toUpperCase();
  }

  localStorage.setItem("lang", lang);
  document.documentElement.setAttribute("lang", lang);
}

// INITIALISE LA LANGUE AU CHARGEMENT DE LA PAGE
window.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("lang") || "fr";
  applyLanguage(savedLang);

  const toggleBtn = document.getElementById("languageToggle");
  toggleBtn.addEventListener("click", () => {
    const currentLang = localStorage.getItem("lang") || "fr";
    const newLang = currentLang === "fr" ? "en" : "fr";
    applyLanguage(newLang);
  });
});

// ================== JEU DE FRAPPE ================== //
const textElement = document.getElementById("textToType");
const timerDisplay = document.getElementById("timer");
const wordCountDisplay = document.getElementById("wordCount");
const errorCountDisplay = document.getElementById("errorCount");
const wpmDisplay = document.getElementById("wpm");
const resultModal = document.getElementById("resultModal");

const words = [
  "freedom", "justice", "equality", "rights", "peace", "respect", "dignity",
  "democracy", "law", "truth", "education", "family", "future", "hope"
];

let fullText = [];
let currentWordIndex = 0;
let wordTyped = "";
let errors = 0;
let wordCount = 0;
let startTime;
let timerInterval;
let timeLeft = 60;
let typingStarted = false;

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    difficulty: params.get("difficulty") || "facile",
    duration: parseInt(params.get("duration")) || 1
  };
}

function generateText() {
  fullText = [];
  for (let i = 0; i < 30; i++) {
    fullText.push(words[Math.floor(Math.random() * words.length)]);
  }

  textElement.innerHTML = fullText
    .map((word, i) =>
      `<span class="word${i === 0 ? ' active' : ''}">` +
      word.split('').map(letter => `<span class="letter">${letter}</span>`).join('') +
      `</span><span class="space"> </span>`
    )
    .join("");
}

function startTimer() {
  startTime = new Date();
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft + "s";

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}

function startGame() {
  clearInterval(timerInterval);

  const { difficulty, duration } = getQueryParams();
  timeLeft = duration * 60;

  timerDisplay.textContent = timeLeft + "s";
  errors = 0;
  wordCount = 0;
  currentWordIndex = 0;
  wordTyped = "";
  typingStarted = false;

  errorCountDisplay.textContent = "0";
  wordCountDisplay.textContent = "0";
  wpmDisplay.textContent = "0";
  resultModal.classList.add("hidden");

  const modeElement = document.querySelector(".mode-box strong");
  if (modeElement) {
    modeElement.textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  }

  generateText();
}

function handleKeyPress(e) {
  const isLetter = /^[a-zA-Z]$/.test(e.key);
  const isSpace = e.key === " ";
  const isBackspace = e.key === "Backspace";
  if (!isLetter && !isSpace && !isBackspace) return;

  if (!typingStarted && timeLeft > 0) {
    typingStarted = true;
    startTimer();
  }

  if (timeLeft <= 0) return;

  const currentWordSpans = textElement.querySelectorAll(".word")[currentWordIndex];
  const letters = currentWordSpans.querySelectorAll(".letter");

  if (isSpace) {
    const expected = fullText[currentWordIndex];
    if (wordTyped.trim() === expected) {
      letters.forEach((l) => {
        l.classList.remove("wrong");
        l.classList.add("correct");
      });
      wordCount++;
    } else {
      letters.forEach((l, i) => {
        const typedChar = wordTyped[i];
        l.classList.remove("correct", "wrong");
        if (typedChar === l.textContent) {
          l.classList.add("correct");
        } else {
          l.classList.add("wrong");
        }
      });
      errors++;
    }

    currentWordSpans.classList.remove("active");
    currentWordIndex++;
    const spans = textElement.querySelectorAll(".word");
    if (currentWordIndex < spans.length) {
      spans[currentWordIndex].classList.add("active");
    }

    wordTyped = "";
    wordCountDisplay.textContent = wordCount;
    errorCountDisplay.textContent = errors;

  } else if (isBackspace) {
    wordTyped = wordTyped.slice(0, -1);
  } else {
    wordTyped += e.key;
  }

  letters.forEach((span, i) => {
    const typedChar = wordTyped[i];
    span.classList.remove("correct", "wrong", "animate");
    if (typedChar == null) return;
    if (typedChar === span.textContent) {
      span.classList.add("correct", "animate");
    } else {
      span.classList.add("wrong", "animate");
    }
  });
}

function endGame() {
  let totalTime = getQueryParams().duration * 60;
  let wpm = Math.round((wordCount / totalTime) * 60);
  wpmDisplay.textContent = wpm;

  resultModal.classList.remove("hidden");

  const ctx = document.getElementById("resultChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Mots tapés", "Erreurs", "WPM"],
      datasets: [{
        label: "Résultats",
        data: [wordCount, errors, wpm],
        backgroundColor: ["#28a745", "#dc3545", "#ffc107"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: "Statistiques de frappe" }
      }
    }
  });
}

function closeModal() {
  resultModal.classList.add("hidden");
}

window.addEventListener("DOMContentLoaded", () => {
  if (textElement) {
    startGame();
    window.addEventListener("keydown", handleKeyPress);
  }
});
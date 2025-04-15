
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
let currentCharIndex = 0;
let errors = 0;
let wordCount = 0;
let startTime;
let timerInterval;
let timeLeft = 60;
let typingStarted = false;
let correctChars = 0;
let totalChars = 0;

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    difficulty: params.get("difficulty") || "facile",
    duration: parseInt(params.get("duration")) || 1
  };
}

function generateText() {
  fullText = [];
  const wordCount = 30;
  
  for (let i = 0; i < wordCount; i++) {
    fullText.push(words[Math.floor(Math.random() * words.length)]);
  }

  textElement.innerHTML = fullText
    .map((word, i) => {
      const letters = word.split('')
        .map(letter => `<span class="letter">${letter}</span>`)
        .join('');
      return `<span class="word${i === 0 ? ' active' : ''}">${letters}</span>`;
    })
    .join(' ');
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
  currentCharIndex = 0;
  correctChars = 0;
  totalChars = 0;
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
  if (e.ctrlKey || e.altKey || e.metaKey) return;

  const isLetter = /^[a-zA-Z]$/.test(e.key);
  const isSpace = e.key === " ";
  const isBackspace = e.key === "Backspace";
  
  if (isSpace) {
    e.preventDefault();
  }
  
  if (!isLetter && !isSpace && !isBackspace) return;

  if (!typingStarted && timeLeft > 0) {
    typingStarted = true;
    startTimer();
  }

  if (timeLeft <= 0) return;

  const currentWord = document.querySelector(".word.active");
  if (!currentWord) return;

  const letters = currentWord.querySelectorAll(".letter");
  const currentWordText = fullText[currentWordIndex];

  if (isBackspace) {
    if (currentCharIndex > 0) {
      currentCharIndex--;
      const prevLetter = letters[currentCharIndex];
      
      if (prevLetter.classList.contains("wrong")) {
        errors--;
        errorCountDisplay.textContent = errors;
      }
      
      prevLetter.classList.remove("correct", "wrong");
    }
    return;
  }

  if (isSpace) {
    e.preventDefault();
    
    // Ignorer si le mot n'est pas complètement tapé
    if (currentCharIndex < currentWordText.length) {
        return;
    }

    let hasErrors = false;
    
    // Vérifier chaque lettre
    letters.forEach((letter, i) => {
        if (letter.textContent !== currentWordText[i]) {
            hasErrors = true;
            if (!letter.classList.contains("wrong")) {
                letter.classList.add("wrong");
                errors++;
            }
        }
    });

    if (!hasErrors) {
        wordCount++;
        correctChars += currentWordText.length;
        wordCountDisplay.textContent = wordCount;
    }
    errorCountDisplay.textContent = errors;

    // Passer au mot suivant
    goToNextWord();
    return;
}

function goToNextWord() {
  const currentWord = document.querySelector(".word.active");
  if (currentWord) currentWord.classList.remove("active");

  currentWordIndex++;
  currentCharIndex = 0;

  const nextWord = document.querySelectorAll(".word")[currentWordIndex];
  if (nextWord) {
      nextWord.classList.add("active");
      nextWord.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } else {
      endGame();
  }
}

  if (currentCharIndex < currentWordText.length) {
    totalChars++;
    const expectedChar = currentWordText[currentCharIndex];
    const letterSpan = letters[currentCharIndex];
    
    if (e.key === expectedChar) {
      letterSpan.classList.add("correct");
      letterSpan.classList.remove("wrong");
      correctChars++;
    } else {
      letterSpan.classList.add("wrong");
      letterSpan.classList.remove("correct");
      errors++;
      errorCountDisplay.textContent = errors;
    }
    
    currentCharIndex++;
  }
}

function endGame() {
  clearInterval(timerInterval);
  
  const minutes = (getQueryParams().duration * 60 - timeLeft) / 60;
  const wpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;
  
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

// Initialisation
window.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("lang") || "fr";
  applyLanguage(savedLang);

  const toggleBtn = document.getElementById("languageToggle");
  toggleBtn.addEventListener("click", () => {
    const currentLang = localStorage.getItem("lang") || "fr";
    const newLang = currentLang === "fr" ? "en" : "fr";
    applyLanguage(newLang);
  });

  if (textElement) {
    startGame();
    document.addEventListener("keydown", handleKeyPress);
  }
});

// Variables globales
let resultChart = null;

function endGame() {
  clearInterval(timerInterval);
  
  // Calcul des stats
  const minutes = (selectedDuration * 60 - timeLeft) / 60;
  const wpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;
  
  // Mise à jour du modal
  document.getElementById("displayWpm").textContent = wpm;
  document.getElementById("displayCorrect").textContent = wordCount;
  document.getElementById("displayErrors").textContent = errors;
  
  // Affichage du modal
  document.getElementById("resultModal").classList.remove("hidden");
  
  // Création du graphique
  createResultChart(wpm, wordCount, errors);
}

function createResultChart(wpm, correct, errors) {
  // Détruire le graphique existant
  if (resultChart) {
    resultChart.destroy();
  }
  
  const ctx = document.getElementById("resultChart").getContext("2d");
  resultChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['WPM', 'Corrects', 'Erreurs'],
      datasets: [{
        data: [wpm, correct, errors],
        backgroundColor: [
          'rgba(255, 128, 0, 0.8)',
          'rgba(0, 200, 83, 0.8)',
          'rgba(255, 23, 68, 0.8)'
        ],
        borderColor: [
          'rgba(255, 128, 0, 1)',
          'rgba(0, 200, 83, 1)',
          'rgba(255, 23, 68, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: getComputedStyle(document.body).getPropertyValue('--text-dark')
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.raw}`;
            }
          }
        }
      },
      cutout: '60%'
    }
  });
}

function closeModal() {
  document.getElementById("resultModal").classList.add("hidden");
}
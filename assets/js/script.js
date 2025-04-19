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
    signup: "S'inscrire",
    level: "Niveau :",
    time: "Temps :",
    correct_words: "Mots réussis",
    errors: "Erreurs",
    wpm: "Mots/minute",
    quit: "Quitter",
    retry: "Recommencer",
    stats_title: "Statistiques",
    correct: "Corrects",
    close: "Fermer",
    level: "Niveau :",
    time: "Temps :",
    correct_words: "Mots réussis",
    errors: "Erreurs",
    wpm: "Mots/minute",
    quit: "Quitter",
    retry: "Recommencer",
    score: "Score",
    logout: "Déconnexion",
    user: "Utilisateur",
    difficulty: {
      easy: "Facile",
      medium: "Moyen",
      hard: "Difficile",
    },

    typing_words: {
      facile: [
        "liberté",
        "justice",
        "égalité",
        "droits",
        "paix",
        "respect",
        "dignité",
        "démocratie",
        "loi",
        "vérité",
        "éducation",
        "famille",
        "avenir",
        "espoir",
      ],
      ordinaire: [
        "citoyenneté",
        "confiance",
        "intégrité",
        "loyauté",
        "discipline",
        "coopération",
        "innovation",
        "responsable",
        "travail",
        "engagement",
      ],
      dur: [
        "constitutionnalité",
        "incommensurable",
        "anticonstitutionnellement",
        "intergouvernemental",
        "désintéressement",
        "décentralisation",
        "inaccessibilité",
        "indéchiffrable",
        "imprévisibilité",
        "caractéristique",
      ],
    },
  },
  en: {
    welcome: "WELCOME TO VANILLA TYPING",
    choose_difficulty: "Choose the test difficulty level",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    choose_duration: "Choose test duration",
    "1min": "1 Minute",
    "2min": "2 Minutes",
    "3min": "3 Minutes",
    demo: "Demo",
    signup: "Sign up",
    level: "Level:",
    time: "Time:",
    correct_words: "Correct words",
    errors: "Errors",
    wpm: "Words/minute",
    quit: "Quit",
    retry: "Retry",
    stats_title: "Statistics",
    correct: "Correct",
    close: "Close",
    level: "Level:",
    time: "Time:",
    correct_words: "Correct words",
    errors: "Errors",
    wpm: "Words/minute",
    quit: "Quit",
    retry: "Retry",
    score: "Score",
    logout: "Logout",
    user: "User",
    difficulty: {
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
    },

    typing_words: {
      facile: [
        "freedom",
        "justice",
        "equality",
        "rights",
        "peace",
        "respect",
        "dignity",
        "democracy",
        "law",
        "truth",
        "education",
        "family",
        "future",
        "hope",
      ],
      ordinaire: [
        "citizenship",
        "trust",
        "integrity",
        "loyalty",
        "discipline",
        "cooperation",
        "innovation",
        "responsible",
        "work",
        "commitment",
      ],
      dur: [
        "constitutionalism",
        "incomprehensible",
        "counterintuitive",
        "intergovernmental",
        "disinterestedness",
        "decentralization",
        "inaccessibility",
        "undecipherable",
        "unpredictability",
        "characteristic",
      ],
    },
  },
};

const applyLanguage = (lang) => {
  const mainContainer = document.querySelector("main") || document.body;

  mainContainer.classList.add("fade-out");

  setTimeout(() => {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (translations[lang]?.[key]) {
        el.textContent = translations[lang][key];
      }
    });
    

    const difficultyDisplay = document.getElementById("difficultyDisplay");
    if (difficultyDisplay) {
      const { difficulty } = getQueryParams();
      const difficultyKeyMap = {
        facile: "easy",
        ordinaire: "medium",
        dur: "hard",
        easy: "easy",
        medium: "medium",
        hard: "hard",
      };

      const normalizedKey =
        difficultyKeyMap[difficulty.toLowerCase()] || "easy";

      difficultyDisplay.textContent =
        translations[lang].difficulty?.[normalizedKey] ||
        translations[lang][normalizedKey] ||
        difficulty;
    }

    const elementsToTranslate = {
      errorLabel: document.querySelector(".stat-card:nth-child(2) .stat-label"),
      wpmLabel: document.querySelector(".stat-card:nth-child(3) .stat-label"),
      quitBtn: document.querySelector(".quit-btn"),
      retryBtn: document.querySelector(".retry-btn"),
    };

    if (elementsToTranslate.errorLabel) {
      elementsToTranslate.errorLabel.textContent = translations[lang].errors;
    }
    if (elementsToTranslate.wpmLabel) {
      elementsToTranslate.wpmLabel.textContent = translations[lang].wpm;
    }
    if (elementsToTranslate.quitBtn) {
      elementsToTranslate.quitBtn.innerHTML = `<i class="fa-solid fa-door-open"></i> ${translations[lang].quit}`;
    }
    if (elementsToTranslate.retryBtn) {
      elementsToTranslate.retryBtn.innerHTML = `<i class="fa-solid fa-rotate"></i> ${translations[lang].retry}`;
    }
    const flagIcon = document.getElementById("flagIcon");
    const languageCode = document.getElementById("languageCode");

    if (flagIcon && languageCode) {
      flagIcon.src =
        lang === "fr" ? "assets/image/fr.jpg" : "assets/image/gb.jpg";
      flagIcon.alt = lang.toUpperCase();
      languageCode.textContent = lang.toUpperCase();
    }
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
    if (document.getElementById("textToType")) {
      startGame();
    }

    mainContainer.classList.remove("fade-out");
  }, 300);
};

// ================== LOGIQUE DE TAPAGE ================== //
const textElement = document.getElementById("textToType");
const timerDisplay = document.getElementById("timer");
const wordCountDisplay = document.getElementById("wordCount");
const errorCountDisplay = document.getElementById("errorCount");
const wpmDisplay = document.getElementById("wpm");
const resultModal = document.getElementById("resultModal");

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
let resultChart = null;
let wpmHistory = [];
let timeStamps = [];


const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    difficulty: params.get("difficulty") || "easy",
    duration: parseInt(params.get("duration")) || 1,
  };
};

const getWordsForDifficulty = (difficulty) => {
  const lang = document.documentElement.lang || "fr";
  const difficultyMap = {
    easy: "facile",
    medium: "ordinaire",
    hard: "dur",
    facile: "facile",
    ordinaire: "ordinaire",
    dur: "dur",
  };

  const difficultyKey = difficultyMap[difficulty.toLowerCase()] || "facile";
  return translations[lang].typing_words[difficultyKey];
};

const generateText = () => {
  fullText = [];
  const wordCount = 30;
  const { difficulty } = getQueryParams();
  const words = getWordsForDifficulty(difficulty);

  for (let i = 0; i < wordCount; i++) {
    fullText.push(words[Math.floor(Math.random() * words.length)]);
  }

  textElement.innerHTML = fullText
    .map((word, i) => {
      const letters = word
        .split("")
        .map((letter) => `<span class="letter">${letter}</span>`)
        .join("");
      return `<span class="word${i === 0 ? " active" : ""}">${letters}</span>`;
    })
    .join(" ");
};

const startTimer = () => {
  startTime = new Date();
  const { duration } = getQueryParams();
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft + "s";

    const now = new Date();
    const elapsedTime = (now - startTime) / 1000 / 60;
    const currentWPM = calculateWPM(wordCount, elapsedTime);
    if ((timeLeft % 10 === 0 || timeLeft === 1) && timeLeft > 0) {
      wpmHistory.push(currentWPM);
      timeStamps.push(`${duration * 60 - timeLeft}s`);
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
};

const startGame = () => {
  const { difficulty, duration } = getQueryParams();
  timeLeft = duration * 60;

  clearInterval(timerInterval);
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

  if (resultChart) {
    resultChart.destroy();
    resultChart = null;
  }

  const difficultyDisplay = document.getElementById("difficultyDisplay");
  if (difficultyDisplay) {
    const lang = document.documentElement.lang || "fr";
    const difficultyKeyMap = {
      facile: "easy",
      ordinaire: "medium",
      dur: "hard",
      easy: "easy",
      medium: "medium",
      hard: "hard",
    };

    const normalizedKey = difficultyKeyMap[difficulty.toLowerCase()] || "easy";

    difficultyDisplay.textContent =
      translations[lang].difficulty[normalizedKey] ||
      translations[lang][normalizedKey] ||
      difficulty;
  }

  generateText();
  setDynamicTitle("playing");
  
};

const handleKeyPress = (e) => {
  if (e.ctrlKey || e.altKey || e.metaKey) return;

  const isLetter = /^[a-zA-ZéèêàçôîûùëïöâäüÜÄÖËÎÔÊÈ]$/.test(e.key);
  const isSpace = e.key === " ";
  const isBackspace = e.key === "Backspace";

  if (isSpace) e.preventDefault();
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

    if (currentCharIndex < currentWordText.length) return;

    let hasErrors = false;
    letters.forEach((letter) => {
      if (!letter.classList.contains("correct")) {
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
      updateWPMRealtime();
    }
    setDynamicTitle("playing");
    errorCountDisplay.textContent = errors;
    goToNextWord();
    return;
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
};

const goToNextWord = () => {
  const currentWord = document.querySelector(".word.active");
  if (currentWord) currentWord.classList.remove("active");

  currentWordIndex++;
  currentCharIndex = 0;

  const allWords = document.querySelectorAll(".word");
  const nextWord = allWords[currentWordIndex];

  if (nextWord) {
    nextWord.classList.add("active");

    const container = document.querySelector(".typing-area");
    const offsetTop = nextWord.offsetTop - container.offsetTop;

    gsap.to(container, {
      scrollTop: offsetTop - 20,
      duration: 0.4,
      ease: "power2.out",
    });
  } else {
    generateText();
    currentWordIndex = 0;
    currentCharIndex = 0;

    const newWords = document.querySelectorAll(".word");
    newWords[0].classList.add("active");
  }
};

const calculateWPM = (words, minutes) => {
  return minutes > 0 ? Math.round(words / minutes) : 0;
};

const updateWPMRealtime = () => {
  const now = new Date();
  const elapsedTime = (now - startTime) / 1000 / 60;
  const wpm = calculateWPM(wordCount, elapsedTime);
  wpmDisplay.textContent = wpm;
};

const createResultChart = (wpm, correct, errors) => {
  const ctx = document.getElementById("resultChart").getContext("2d");
  const lang = document.documentElement.lang || "fr";

  if (resultChart) {
    resultChart.destroy();
  }

  resultChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [
        translations[lang].wpm,
        translations[lang].correct,
        translations[lang].errors,
      ],
      datasets: [
        {
          data: [wpm, correct, errors],
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          borderWidth: 3,
          pointBackgroundColor: ["#3b82f6", "#10b981", "#ef4444"],
          pointRadius: 6,
          fill: true,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) =>
              `${context.parsed.y} ${context.label.toLowerCase()}`,
          },
        },
      },
    },
  });
};

const endGame = () => {
  clearInterval(timerInterval);
  const { duration } = getQueryParams();
  const wpm = calculateWPM(wordCount, duration);
  resultModal.classList.remove("hidden");
  document.getElementById("displayWpm").textContent = wpm;
  document.getElementById("displayCorrect").textContent = wordCount;
  document.getElementById("displayErrors").textContent = errors;
  createResultChart(wpm, wordCount, errors);

  const username = localStorage.getItem("username");
  if (username) {
    const score = {
      wpm,
      correct: wordCount,
      errors,
      date: new Date().toLocaleString(),
    };

    const existingScores =
      JSON.parse(localStorage.getItem(`scores_${username}`)) || [];
    existingScores.push(score);
    localStorage.setItem(`scores_${username}`, JSON.stringify(existingScores));
  }
};

document.addEventListener("DOMContentLoaded", function () {
  const savedLang = localStorage.getItem("lang") || "fr";
  applyLanguage(savedLang);
  const languageToggle = document.getElementById("languageToggle");
  if (languageToggle) {
    languageToggle.addEventListener("click", function () {
      const currentLang = document.documentElement.lang || "fr";
      const newLang = currentLang === "fr" ? "en" : "fr";
      applyLanguage(newLang);
      startGame();
    });
  }

  if (document.getElementById("textToType")) {
    startGame();
    document.addEventListener("keydown", handleKeyPress);
  }
  
});

const closeModal = () => {
  document.getElementById("resultModal").classList.add("hidden");
};

const setDynamicTitle = (state = "default") => {
  const { difficulty } = getQueryParams();
  const lang = document.documentElement.lang || "fr";
  const difficultyKeyMap = {
    easy: "facile",
    medium: "ordinaire",
    hard: "dur",
    facile: "facile",
    ordinaire: "ordinaire",
    dur: "dur",
  };

  const difficultyKey = difficultyKeyMap[difficulty.toLowerCase()] || "facile";
  const difficultyLabel = translations[lang].difficulty[difficultyKey] || difficulty;

  const currentWord = fullText?.[currentWordIndex] || "";

  switch (state) {
    case "welcome":
      document.title = ` Bienvenue | Vanilla Typing`;
      break;
    case "playing":
      document.title = ` ${difficultyLabel} | Mot : ${currentWord}`;
      break;
    case "finished":
      document.title = ` Test terminé | Vanilla Typing`;
      break;
    case "inactive":
      document.title = " Reviens taper !";
      break;
    default:
      document.title = "Vanilla Typing";
  }
};

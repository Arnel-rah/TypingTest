const textElement = document.getElementById("textToType");
const timerDisplay = document.getElementById("timer");
const wordCountDisplay = document.getElementById("wordCount");
const errorCountDisplay = document.getElementById("errorCount");
const wpmDisplay = document.getElementById("wpm");
const resultModal = document.getElementById("resultModal");

const words = [
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
let resultChart = null;
let wpmHistory = [];
let timeStamps = [];

const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    difficulty: params.get("difficulty") || "facile",
    duration: parseInt(params.get("duration")) || 1,
  };
};

const generateText = () => {
  fullText = [];
  const wordCount = 30;

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

  const modeElement = document.querySelector(".mode-box strong");
  if (modeElement) {
    modeElement.textContent =
      difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  }

  generateText();
};

const handleKeyPress = (e) => {
  if (e.ctrlKey || e.altKey || e.metaKey) return;

  const isLetter = /^[a-zA-Z]$/.test(e.key);
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

  if (resultChart) {
    resultChart.destroy();
  }

  resultChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Vitesse", "Corrects", "Erreurs"],
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
};

document.addEventListener("keydown", handleKeyPress);
window.addEventListener("load", startGame);
const closeModal = () => {
  document.getElementById("resultModal").classList.add("hidden");
};

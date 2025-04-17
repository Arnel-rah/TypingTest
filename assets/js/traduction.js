
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
    },
  };
  
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
    document.documentElement.lang = lang;
  }
  
  document.addEventListener("DOMContentLoaded", function() {
    const savedLang = localStorage.getItem("lang") || "fr";
    applyLanguage(savedLang);
    const languageToggle = document.getElementById("languageToggle");
    if (languageToggle) {
      languageToggle.addEventListener("click", function() {
        const currentLang = document.documentElement.lang || "fr";
        const newLang = currentLang === "fr" ? "en" : "fr";
        applyLanguage(newLang);
      });
    }
  
    if (document.getElementById("textToType")) {
      startGame();
      document.addEventListener("keydown", handleKeyPress);
    }
  });
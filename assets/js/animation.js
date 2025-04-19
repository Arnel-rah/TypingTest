document.addEventListener("DOMContentLoaded", () => {
  // ====================== Connexion Modal =======================
  const loginBtn = document.querySelector(".signup-btn");
  const loginModal = document.getElementById("loginModal");
  const closeLogin = document.getElementById("closeLogin");

  if (loginBtn && loginModal && closeLogin) {
    loginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      loginModal.classList.add("show");
    });

    closeLogin.addEventListener("click", () => {
      loginModal.classList.remove("show");
    });

    window.addEventListener("click", (e) => {
      if (e.target === loginModal) {
        loginModal.classList.remove("show");
      }
    });
  }

  // ====================== Thème =======================
  const themeToggle = document.querySelector("#themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
    });
  }

  // ====================== Connexion / Navbar =======================
  const loginForm = document.getElementById("loginForm");
  const demoBtn = document.getElementById("demoBtn");
  const signupBtn = document.querySelector(".signup-btn");
  const userMenu = document.getElementById("userMenu");
  const usernameDisplay = document.getElementById("usernameDisplay");
  const logoutBtn = document.getElementById("logoutBtn");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const username = email.split("@")[0];

      demoBtn.classList.add("hidden");
      signupBtn.classList.add("hidden");
      userMenu.classList.remove("hidden");
      usernameDisplay.textContent = username;

      loginModal.classList.remove("show");

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      userMenu.classList.add("hidden");
      demoBtn.classList.remove("hidden");
      signupBtn.classList.remove("hidden");

      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");
    });
  }
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const savedUsername = localStorage.getItem("username");
  if (isLoggedIn && savedUsername) {
    demoBtn.classList.add("hidden");
    signupBtn.classList.add("hidden");
    userMenu.classList.remove("hidden");
    usernameDisplay.textContent = savedUsername;
  }
});

const showUserScores = () => {
  const username = localStorage.getItem("username");
  if (!username) {
    alert("Veuillez vous connecter pour voir vos scores.");
    return;
  }

  const scores = JSON.parse(localStorage.getItem(`scores_${username}`)) || [];

  if (scores.length === 0) {
    alert("Aucun score enregistré pour le moment.");
    return;
  }

  let message = ` Scores de ${username} :\n\n`;
  scores.forEach((score, i) => {
    message += `#${i + 1} - ${score.date}\n→ WPM: ${score.wpm}, Mots: ${
      score.correct
    }, Erreurs: ${score.errors}\n\n`;
  });

  alert(message);
};

const scoreBtn = document.getElementById("scoreBtn");
if (scoreBtn) {
  scoreBtn.addEventListener("click", showUserScores);
}

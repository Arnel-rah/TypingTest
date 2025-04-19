window.addEventListener("storage", function (event) {
  if (event.key === "isLoggedIn" || event.key === null) {
    checkAuthState();
  }
});

window.addEventListener("pageshow", function (event) {
  if (event.persisted || performance.navigation.type === 2) {
    checkAuthState();
  }
});

document.addEventListener("DOMContentLoaded", () => {
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


  // ====================== Gestion Authentification =======================
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

      updateUIAfterLogin(username);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);
      window.dispatchEvent(new Event("storage"));
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      updateUIAfterLogout();
      // Notifier les autres onglets
      window.dispatchEvent(new Event("storage"));
      window.location.href = "index.html";
    });
  }

  checkAuthState();

  // ====================== Gestion Scores =======================
  const scoreBtn = document.getElementById("scoreBtn");
  const scoreModal = document.getElementById("scoreModal");
  const closeScoreModal = document.getElementById("closeScoreModal");

  if (scoreBtn && scoreModal && closeScoreModal) {
    scoreBtn.addEventListener("click", showUserScores);

    closeScoreModal.addEventListener("click", () => {
      scoreModal.classList.add("hidden");
    });

    window.addEventListener("click", (e) => {
      if (e.target === scoreModal) {
        scoreModal.classList.add("hidden");
      }
    });
  }
});

// ====================== Fonctions Utilitaires =======================
const checkAuthState = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const savedUsername = localStorage.getItem("username");

  if (isLoggedIn && savedUsername) {
    updateUIAfterLogin(savedUsername);
  } else {
    updateUIAfterLogout();
  }
}

const updateUIAfterLogin = (username) => {
  const demoBtn = document.getElementById("demoBtn");
  const signupBtn = document.querySelector(".signup-btn");
  const userMenu = document.getElementById("userMenu");
  const usernameDisplay = document.getElementById("usernameDisplay");
  const loginModal = document.getElementById("loginModal");

  if (demoBtn) demoBtn.classList.add("hidden");
  if (signupBtn) signupBtn.classList.add("hidden");
  if (userMenu) userMenu.classList.remove("hidden");
  if (usernameDisplay) usernameDisplay.textContent = username;
  if (loginModal) loginModal.classList.remove("show");
}

const  updateUIAfterLogout = () => {
  const demoBtn = document.getElementById("demoBtn");
  const signupBtn = document.querySelector(".signup-btn");
  const userMenu = document.getElementById("userMenu");

  if (demoBtn) demoBtn.classList.remove("hidden");
  if (signupBtn) signupBtn.classList.remove("hidden");
  if (userMenu) userMenu.classList.add("hidden");
}

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

  document.getElementById("scoreUsername").textContent = username;

  const list = document.getElementById("scoreList");
  list.innerHTML = "";

  scores.forEach((score, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>#${i + 1}</strong> – ${
      score.date
    }<br>→ <strong>WPM:</strong> ${score.wpm}, <strong>Mots:</strong> ${
      score.correct
    }, <strong>Erreurs:</strong> ${score.errors}`;
    list.appendChild(li);
  });

  document.getElementById("scoreModal").classList.remove("hidden");
}

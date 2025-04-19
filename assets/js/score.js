
export function saveUserScore({ wpm, correct, errors }) {
    const username = localStorage.getItem("username");
    if (!username) return;
  
    const scores = JSON.parse(localStorage.getItem(`scores_${username}`)) || [];
    scores.push({
      wpm,
      correct,
      errors,
      date: new Date().toLocaleString(),
    });
  
    localStorage.setItem(`scores_${username}`, JSON.stringify(scores));
  }
  
  export function showUserScores() {
    const username = localStorage.getItem("username");
    if (!username) return alert("Vous devez être connecté.");
  
    const scores = JSON.parse(localStorage.getItem(`scores_${username}`)) || [];
    if (scores.length === 0) return alert("Aucun score enregistré.");
  
    let message = ` Scores de ${username} :\n\n`;
    scores.forEach((s, i) => {
      message += `#${i + 1} - ${s.date}\n→ WPM: ${s.wpm}, Mots: ${s.correct}, Erreurs: ${s.errors}\n\n`;
    });
  
    alert(message);
  }
  
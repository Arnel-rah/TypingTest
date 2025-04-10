
document.addEventListener("DOMContentLoaded", () => {
    gsap.from(".difficulty-card", {
      opacity: 0,
      y: 50,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out"
    });
    gsap.from(".duration-card", {
      opacity: 0,
      y: 50,
      duration: 0.8,
      delay: 0.6,
      stagger: 0.2,
      ease: "power2.out"
    });
  
    gsap.from(".difficulty-section h2, .duration-section h2", {
      opacity: 0,
      y: -20,
      duration: 0.6,
      delay: 0.2,
      ease: "power2.out"
    });
  });
  
// navbar.js
// ========================
// Mobile Nav Toggle
// ========================
document.addEventListener('DOMContentLoaded', () => 
    {   
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('navLinks');

    if (hamburger && nav) {
      hamburger.addEventListener('click', () => {
        nav.classList.toggle('open');
      });
    }
    }); 
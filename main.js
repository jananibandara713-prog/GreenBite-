// ========================
// Mobile nav toggle
// ========================
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('navLinks');

if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('open'); // ✅ must match CSS
  });
}

// ========================
// Rotating Quotes
// ========================
const quotes = [
  'Eat real food, not too much, mostly plants.',
  'Small steps every day build big change.',
  'Hydrate, move, breathe, repeat.',
  'Mindful eating, mindful living.',
  'Nourish to flourish.',
  'Healthy habits, happy life.',
  'Choose whole over processed.',
  'Listen to your body’s wisdom.',
  'Balance is the key to wellness.',
  'Wellness is a journey, not a destination.',
  'Your body deserves the best.',
  'Fuel your day with good choices.',
  'Health is a relationship between you and your body.'
];

const quoteEl = document.getElementById('rotatingQuote');

if (quoteEl) {
  let i = 0;
  setInterval(() => {
    i = (i + 1) % quotes.length;
    quoteEl.textContent = quotes[i];
  }, 3500);
}

// ========================
// Daily Tips
// ========================
const tipsByDay = [
  'Add a serving of leafy greens today.',
  'Walk for 20 minutes after meals.',
  'Replace sugary drinks with water.',
  'Sleep 7–8 hours for recovery.',
  'Try a digital detox for an hour.',
  'Practice gratitude journaling.',
  'Incorporate a new fruit or vegetable into your meals.',
  'Try a new healthy recipe.',
  'Try a 5-minute breathing break.',
  'Color your plate with veggies.',
  'Stretch for 10 minutes.'
];
const tipEl = document.getElementById('dailyTip');
if (tipEl) {
  tipEl.textContent = 'Tip: ' + tipsByDay[new Date().getDay()];
}

// ========================
// Newsletter Subscription
// ========================
const newsBtn = document.getElementById('newsBtn');
if (newsBtn) {
  newsBtn.addEventListener('click', () => {
    const email = document.getElementById('newsEmail').value.trim();
    const msg = document.getElementById('newsMsg');

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      msg.textContent = 'Please enter a valid email.';
      msg.style.color = 'var(--accent)';
      return;
    }

    const list = JSON.parse(localStorage.getItem('newsletter') || '[]');
    if (!list.includes(email)) list.push(email);
    localStorage.setItem('newsletter', JSON.stringify(list));

    msg.textContent = 'Subscribed! Check your inbox.';
    msg.style.color = 'var(--primary)';
  });
}

// ========================
// Accordion Toggle
// ========================
document.querySelectorAll('.accordion-title').forEach(t => {
  t.addEventListener('click', () => {
    const c = t.nextElementSibling;
    c.style.display = c.style.display === 'block' ? 'none' : 'block';
  });
});

// ========================
// Service Worker
// ========================
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

// ========================
// Active Nav Highlight
// ========================
// Add <body data-page="index"> or "recipes" etc. in each page
const currentPage = document.body.getAttribute('data-page');
if (currentPage) {
  document.querySelectorAll('#navLinks a').forEach(link => {
    if (link.getAttribute('data-page') === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}




// select hero section------------------------------------------------------------------------
// Hero background slideshow
const heroImages = [
  "https://i.pinimg.com/736x/79/6b/86/796b86a19fd5c62faf75882170b15d25.jpg",
  "https://i.pinimg.com/736x/ab/64/52/ab645276f3df07cebfc05ac1dc5663ab.jpg",
  "https://i.pinimg.com/736x/1e/da/48/1eda480b629bcf0bc36fa2c53404b089.jpg",
  "https://i.pinimg.com/736x/d8/4c/52/d84c522d23ffa9746f9663937730ddd9.jpg",
  "https://i.pinimg.com/1200x/ee/68/ac/ee68acd973f42f0c72435c93e99da39c.jpg",
  "https://i.pinimg.com/1200x/c4/b9/85/c4b985f1a8e0ef855f514a827bc9d8d0.jpg",
];


const hero = document.querySelector('.hero');

if (hero && heroImages.length) {
  let idx = 0;

  // function to apply a background
  const applyBg = () => {
    const url = heroImages[idx % heroImages.length];
    hero.style.background = 
      `linear-gradient(to bottom, rgba(0,0,0,.5), rgba(0,0,0,.6)), url('${url}') center/cover no-repeat`;
  };

  // show first immediately
  applyBg();

  // change every 60s
  setInterval(() => {
    idx = (idx + 1) % heroImages.length;
    applyBg();
  }, 60000); // 60000 ms = 1 minute
}

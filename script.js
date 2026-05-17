document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetSelector = link.getAttribute('href');
    if (!targetSelector || targetSelector === '#') return;

    const target = document.querySelector(targetSelector);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

const form = document.querySelector('[data-brief-form]');
if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Merci ! Ceci est une maquette statique. Branche ce formulaire a Formspree, Netlify Forms ou ton backend.');
  });
}

const animated = document.querySelectorAll('section .section-head,.card,.project,.feature,.price-table,.contact-panel,.visual,.faq-item,.legal h2,.legal p,.legal li');

animated.forEach((element, index) => {
  element.classList.add('reveal');
  element.style.transitionDelay = `${Math.min((index % 6) * 70, 280)}ms`;
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  animated.forEach((element) => observer.observe(element));
} else {
  animated.forEach((element) => element.classList.add('is-visible'));
}

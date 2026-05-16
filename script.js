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

(function setupSimpleYouTubeBackgrounds() {
  const backgrounds = [...document.querySelectorAll('.youtube-bg[data-video-id]')];
  if (!backgrounds.length) return;

  const createEmbedUrl = (videoId) => {
    const params = new URLSearchParams({
      autoplay: '1',
      mute: '1',
      controls: '0',
      loop: '1',
      playlist: videoId,
      playsinline: '1',
      rel: '0',
      modestbranding: '1',
      iv_load_policy: '3',
      disablekb: '1',
      fs: '0'
    });

    return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
  };

  backgrounds.forEach((background) => {
    const videoId = background.dataset.videoId;
    const wrapper = background.querySelector('.video-player');
    if (!videoId || !wrapper) return;

    wrapper.innerHTML = '';

    const mount = document.createElement('div');
    mount.className = 'video-player-mount';

    const iframe = document.createElement('iframe');
    iframe.src = createEmbedUrl(videoId);
    iframe.title = 'Background video';
    iframe.allow = 'autoplay; fullscreen; picture-in-picture';
    iframe.setAttribute('aria-hidden', 'true');
    iframe.setAttribute('tabindex', '-1');

    iframe.addEventListener('load', () => {
      background.classList.add('video-ready');
    });

    mount.appendChild(iframe);
    wrapper.appendChild(mount);
  });
})();

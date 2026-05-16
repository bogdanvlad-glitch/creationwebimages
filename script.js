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
    alert(
      'Merci ! Ceci est une maquette statique. Branche ce formulaire a Formspree, Netlify Forms ou ton backend.'
    );
  });
}

const animated = document.querySelectorAll(
  'section .section-head,.card,.project,.feature,.price-table,.contact-panel,.visual,.faq-item,.legal h2,.legal p,.legal li'
);

animated.forEach((element, index) => {
  element.classList.add('reveal');
  element.style.transitionDelay = `${Math.min((index % 6) * 70, 280)}ms`;
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );

  animated.forEach((element) => observer.observe(element));
} else {
  animated.forEach((element) => element.classList.add('is-visible'));
}

(function setupYouTubeBackgrounds() {
  const backgrounds = [...document.querySelectorAll('.youtube-bg[data-video-id]')];
  if (!backgrounds.length) return;

  const iframeApiUrl = 'https://www.youtube.com/iframe_api';
  let fallbackTimer = null;

  const markReady = (background) => {
    background.classList.add('video-ready');
    background.dataset.videoStatus = 'ready';
  };

  const markFailed = (background) => {
    background.classList.remove('video-ready');
    background.dataset.videoStatus = 'failed';
  };

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
      fs: '0',
      enablejsapi: '1',
      origin: window.location.origin,
    });

    return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
  };

  const mountIframeFallback = (background) => {
    const videoId = background.dataset.videoId;
    const target = background.querySelector('.video-player');
    if (!videoId || !target || target.dataset.mode === 'fallback') return;

    const iframe = document.createElement('iframe');
    iframe.src = createEmbedUrl(videoId);
    iframe.title = 'Background video';
    iframe.allow = 'autoplay; fullscreen; picture-in-picture';
    iframe.setAttribute('aria-hidden', 'true');
    iframe.setAttribute('tabindex', '-1');

    target.replaceChildren(iframe);
    target.dataset.mode = 'fallback';

    iframe.addEventListener('load', () => {
      window.setTimeout(() => markReady(background), 300);
    });
  };

  const mountApiPlayer = (background) => {
    const videoId = background.dataset.videoId;
    const target = background.querySelector('.video-player');
    if (!videoId || !target || target.dataset.mode === 'api') return;
    if (typeof window.YT === 'undefined' || typeof window.YT.Player === 'undefined') return;

    target.replaceChildren();
    target.dataset.mode = 'api';

    try {
      const player = new window.YT.Player(target, {
        videoId,
        host: 'https://www.youtube-nocookie.com',
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          loop: 1,
          playlist: videoId,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          disablekb: 1,
          fs: 0,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            try {
              event.target.mute();
              event.target.playVideo();
            } catch (error) {
              mountIframeFallback(background);
              return;
            }

            markReady(background);
          },
          onStateChange: (event) => {
            if (typeof window.YT === 'undefined' || typeof window.YT.PlayerState === 'undefined') {
              return;
            }

            if (
              event.data === window.YT.PlayerState.UNSTARTED ||
              event.data === window.YT.PlayerState.CUED
            ) {
              try {
                event.target.mute();
                event.target.playVideo();
              } catch (error) {
                mountIframeFallback(background);
              }
            }
          },
          onError: () => {
            markFailed(background);
            mountIframeFallback(background);
          },
        },
      });

      background._ytPlayer = player;
    } catch (error) {
      markFailed(background);
      mountIframeFallback(background);
    }
  };

  const initPlayers = () => {
    if (typeof window.YT === 'undefined' || typeof window.YT.Player === 'undefined') {
      backgrounds.forEach(mountIframeFallback);
      return;
    }

    backgrounds.forEach(mountApiPlayer);
  };

  const ensureApi = () => {
    if (typeof window.YT !== 'undefined' && typeof window.YT.Player !== 'undefined') {
      initPlayers();
      return;
    }

    const existingScript = document.querySelector(`script[src="${iframeApiUrl}"]`);
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = iframeApiUrl;
      script.async = true;
      document.head.appendChild(script);
    }

    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previousReady === 'function') previousReady();
      initPlayers();
    };

    fallbackTimer = window.setTimeout(() => {
      backgrounds.forEach((background) => {
        if (background.dataset.videoStatus === 'ready') return;
        mountIframeFallback(background);
      });
    }, 2500);
  };

  const start = () => {
    ensureApi();

    window.addEventListener(
      'pageshow',
      () => {
        backgrounds.forEach((background) => {
          if (background.dataset.videoStatus === 'ready') return;
          mountIframeFallback(background);
        });
      },
      { once: true }
    );
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }

  window.addEventListener('beforeunload', () => {
    if (fallbackTimer) window.clearTimeout(fallbackTimer);
  });
})();

(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = document.querySelectorAll(
    'main > section, main > .section, main > .content > section, .content > section, .wrap > section, .container > section, article, .project, .project-card, .item'
  );

  if (!reduceMotion && 'IntersectionObserver' in window) {
    root.classList.add('motion-ready');
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

    revealTargets.forEach((element, index) => {
      element.classList.add('portfolio-reveal');
      element.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 70}ms`);
      observer.observe(element);
    });
  }

  document.querySelectorAll('article, .project, .project-card, .item, .education').forEach((card) => {
    const glow = document.createElement('span');
    glow.className = 'portfolio-pointer-glow';
    glow.setAttribute('aria-hidden', 'true');
    card.prepend(glow);
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
      card.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
    }, { passive: true });
  });


})();

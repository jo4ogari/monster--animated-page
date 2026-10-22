(() => {
  const section = document.querySelector('.flavors-world');
  if (!section || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const gallery = section.querySelector('.flavors-gallery');
  const rail = section.querySelector('.flavors-rail');
  const scenes = gsap.utils.toArray('.flavor-scene', section);
  const media = gsap.matchMedia();

  media.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.from('.flavors-intro h2 > span', {
      yPercent: 100, opacity: 0, rotate: 3, stagger: .15, duration: 1,
      ease: 'power3.out', scrollTrigger: { trigger: '.flavors-intro', start: 'top 75%' },
    });
    gsap.to('.flavors-scroll', {
      y: 16, ease: 'none', scrollTrigger: { trigger: '.flavors-intro', start: 'top bottom', end: 'bottom top', scrub: true },
    });
    gsap.from('.flavors-outro p', {
      y: 80, opacity: 0, scale: .9, ease: 'power3.out',
      scrollTrigger: { trigger: '.flavors-outro', start: 'top 85%', end: 'top 35%', scrub: 1 },
    });
  });

  media.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
    gallery.classList.add('is-horizontal');
    const travel = () => rail.scrollWidth - gallery.clientWidth;
    const horizontal = gsap.to(rail, {
      x: () => -travel(), ease: 'none',
      scrollTrigger: { trigger: gallery, start: 'top top', end: () => `+=${travel()}`,
        pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: (self) => gsap.set('.flavors-meter i', { scaleX: self.progress }),
      },
    });
    scenes.forEach((scene, index) => {
      const animation = index === 0
        ? { trigger: gallery, start: 'top bottom', end: 'top top', scrub: 1 }
        : { trigger: scene, containerAnimation: horizontal, start: 'left right', end: 'left left', scrub: true };
      gsap.from(scene.querySelector('.flavor-art img'), { y: 100, rotation: 18, scale: .78, ease: 'none', scrollTrigger: animation });
      gsap.from(scene.querySelectorAll('.flavor-copy > *'), { y: 65, opacity: 0, stagger: .1, ease: 'none', scrollTrigger: animation });
      gsap.fromTo(scene.querySelector('.flavor-ghost'), { xPercent: 7 }, { xPercent: -12, ease: 'none',
        scrollTrigger: { trigger: scene, containerAnimation: horizontal, start: 'left right', end: 'right left', scrub: true } });
      gsap.to(scene.querySelector('.flavor-orbit'), { rotation: 100, ease: 'none',
        scrollTrigger: { trigger: scene, containerAnimation: horizontal, start: 'left right', end: 'right left', scrub: true } });
    });
    return () => gallery.classList.remove('is-horizontal');
  });

  media.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
    scenes.forEach((scene) => {
      gsap.from(scene.querySelectorAll('.flavor-copy > *'), { y: 35, opacity: 0, stagger: .1, duration: .8,
        scrollTrigger: { trigger: scene, start: 'top 80%' } });
      gsap.fromTo(scene.querySelector('.flavor-art img'), { rotation: 9, y: 40, scale: .9 }, {
        rotation: -12, y: -25, scale: 1, ease: 'none',
        scrollTrigger: { trigger: scene, start: 'top 65%', end: 'bottom 15%', scrub: .8 },
      });
      gsap.to(scene.querySelector('.flavor-orbit'), { rotation: 90, ease: 'none',
        scrollTrigger: { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  });

  // Explicit image dimensions keep the layout stable; refresh once all assets settle.
  Promise.all([...section.querySelectorAll('img')].map((img) => img.decode().catch(() => {})))
    .then(() => ScrollTrigger.refresh());
})();

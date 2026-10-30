import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import HeroCollage from './components/HeroCollage';
import Studio from './components/Studio';
import TagRail from './components/TagRail';
import { examples } from './data/copy';

function Corner({ position }) {
  return (
    <svg className={`frame-corner frame-corner-${position}`} viewBox="0 0 70 70" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="1"><path d="M3 67V3h64M9 60V9h51" /><path d="M14 44V14h30M14 14c14 0 28 12 30 30M20 14c0 12 10 24 24 24M14 25c12 0 19 7 19 19" /><path d="M21 21c7-7 15 2 9 8-5 5-13-1-9-8ZM9 48c8-2 13 3 11 11M48 9c-2 8 3 13 11 11" /><circle cx="14" cy="14" r="2" fill="currentColor" /></g></svg>
  );
}

export default function App() {
  const rootRef = useRef(null);
  const studioRef = useRef(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      let ready = false;
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: () => { ready = true; } });
      timeline
        .from('.tag-rail', { opacity: 0, x: -22, duration: .7 })
        .from('.hero-kicker, .hero-edition-tab', { opacity: 0, y: 12, duration: .5, stagger: .08 }, '<.05')
        .from('.hero-archive-number', { opacity: 0, scale: .82, rotation: -8, duration: .9 }, '<')
        .from('.hero-title-line', { yPercent: 115, rotation: 3, duration: .85, stagger: .11 }, '<.05')
        .from('.hero-script', { opacity: 0, scale: .72, rotation: -12, duration: .65 }, '<.35')
        .from('.hero-description, .hero-actions, .hero-proof', { opacity: 0, y: 18, duration: .55, stagger: .09 }, '<.15')
        .from('.hero-dial', { opacity: 0, scale: .78, rotation: -16, duration: 1 }, .2)
        .from('.hero-blue-paper', { opacity: 0, scale: .86, rotation: 12, duration: .8 }, '<.05')
        .from('.hero-paper', { opacity: 0, y: 64, rotation: -6, duration: .9 }, '<.08')
        .from('.hero-sticker, .hero-camellia, .hero-postmark, .hero-star', { opacity: 0, scale: .62, rotation: -10, duration: .55, stagger: .07 }, '<.35')
        .from('.hero-hanging', { opacity: 0, y: -45, duration: .7 }, '<')
        .from('.hero-souvenir', { opacity: 0, scale: .55, rotation: 20, duration: .75 }, '<.1');

      const visual = rootRef.current?.querySelector('.hero-visual');
      if (!visual) return;
      const layers = gsap.utils.toArray(visual.querySelectorAll('.parallax-layer'));
      const movers = layers.map((layer, index) => ({
        x: gsap.quickTo(layer, 'x', { duration: .8, ease: 'power3.out' }),
        y: gsap.quickTo(layer, 'y', { duration: .8, ease: 'power3.out' }),
        depth: (index % 3 + 1) * 2.5,
      }));
      const onMove = (event) => {
        if (!ready || event.pointerType === 'touch') return;
        const bounds = visual.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - .5;
        const y = (event.clientY - bounds.top) / bounds.height - .5;
        movers.forEach((mover) => { mover.x(x * mover.depth); mover.y(y * mover.depth); });
      };
      const onLeave = () => movers.forEach((mover) => { mover.x(0); mover.y(0); });
      visual.addEventListener('pointermove', onMove);
      visual.addEventListener('pointerleave', onLeave);
      visual.addEventListener('pointercancel', onLeave);
      window.addEventListener('blur', onLeave);
      return () => {
        visual.removeEventListener('pointermove', onMove);
        visual.removeEventListener('pointerleave', onLeave);
        visual.removeEventListener('pointercancel', onLeave);
        window.removeEventListener('blur', onLeave);
      };
    });
    return () => media.revert();
  }, { scope: rootRef });

  const chooseExample = (example) => {
    studioRef.current?.generateWith(example);
    const studio = document.querySelector('#atelier');
    studio?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    studio?.focus({ preventScroll: true });
  };

  return (
    <div ref={rootRef}>
      <a className="skip-link" href="#main">跳至主要内容</a>
      <svg className="page-texture" aria-hidden="true" focusable="false"><filter id="page-grain"><feTurbulence type="fractalNoise" baseFrequency=".72" numOctaves="4" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter><rect width="100%" height="100%" filter="url(#page-grain)" /></svg>
      <div className="book-shell">
        <Corner position="tl" /><Corner position="tr" /><Corner position="bl" /><Corner position="br" />
        <div className="inner-frame">
          <header className="masthead">
            <a className="brand" href="#main" aria-label="Maison des Mots 首页"><span className="brand-seal" aria-hidden="true">M</span><span className="brand-copy"><strong>Maison des Mots</strong><small lang="fr">L’atelier d’écriture</small></span></a>
            <nav className="main-nav" aria-label="主要导航"><a href="#atelier">L’atelier <span>创作台</span></a><a href="#inspiration">Inspiration <span>灵感</span></a><a href="#about">À propos <span>关于</span></a></nav>
            <div className="edition"><span lang="fr">Édition N° 01</span><span lang="fr">Écrire · Coller · Garder</span></div>
          </header>
          <main id="main" tabIndex={-1}>
            <section className="hero" aria-labelledby="hero-title">
              <TagRail />
              <div className="hero-copy">
                <span className="hero-archive-number" aria-hidden="true">01</span>
                <span className="hero-edition-tab" lang="fr">CRÉATION · 01</span>
                <p className="kicker hero-kicker">Copywriting atelier · 文案生成器</p>
                <h1 id="hero-title"><span className="title-mask"><span className="hero-title-line">把心事，</span></span><span className="title-mask"><span className="hero-title-line">写成一页诗意。</span></span></h1>
                <span className="hero-script" aria-hidden="true" lang="fr">Les mots doux</span>
                <p className="hero-description">输入一个主题，选择一种语气。让零散的灵感先成为文字，再让纸张、贴纸与字迹，一起完成这页作品。</p>
                <div className="hero-actions"><a className="primary-button" href="#atelier">开始写一页<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h13M14 7l5 5-5 5" stroke="currentColor" strokeWidth="1.2" /></svg></a><a className="text-link" href="#inspiration">先找一点灵感</a></div>
                <div className="hero-proof"><span><i>01</i>本地灵感生成</span><span><i>02</i>自由贴纸拼贴</span><span><i>03</i>无需注册登录</span></div>
              </div>
              <HeroCollage />
            </section>
            <div className="hero-ledger"><span lang="fr">Des mots pour les jours ordinaires</span><span className="ledger-script" lang="fr">Write it, then make it beautiful.</span><span>Paris · 2026</span></div>
            <Studio ref={studioRef} />
            <section className="inspiration" id="inspiration" aria-labelledby="inspiration-title">
              <div className="inspiration-heading"><p className="kicker" lang="fr">Une petite étincelle</p><h2 id="inspiration-title">不知道写什么，<br /><em>先从这三页开始。</em></h2><p>每个主题都可以直接试写。保留文字，或者换上你自己的故事。</p></div>
              <div className="example-list">{examples.map((example, index) => <button className="example-item" type="button" key={example.title} onClick={() => chooseExample(example)}><span className="example-number">0{index + 1}</span><span className="example-main"><small>{example.label} · ÉDITION 0{index + 1}</small><strong>{example.title}</strong></span><span className="example-action">试写这一页<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h13M14 7l5 5-5 5" stroke="currentColor" strokeWidth="1.2" /></svg></span></button>)}</div>
            </section>
            <section className="about-note" id="about" aria-label="关于 Maison des Mots"><span className="about-ornament" aria-hidden="true">✦</span><p className="about-script" lang="fr">Les jours passent, les mots restent.</p><h2>日子会过去，<br />文字替你留下来。</h2><p>这是一间小而安静的文案房间。模板在你的浏览器里生成，不必登录，也不会上传你写下的故事。</p><a className="light-link" href="#atelier">回到创作台</a></section>
          </main>
          <footer className="footer"><span lang="fr">Fait avec des mots et des riens précieux</span><span className="footer-script">Maison des Mots</span><span>Write · Collect · Remember</span></footer>
        </div>
      </div>
    </div>
  );
}

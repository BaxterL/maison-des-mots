import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import HeroCollage from '../components/HeroCollage';
import TagRail from '../components/TagRail';

export default function Cover({ active, onNavigate }) {
  const rootRef = useRef(null);

  useGSAP(() => {
    if (!active) return undefined;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      timeline
        .from('.tag-rail', { opacity: 0, x: -22, duration: 0.7 })
        .from('.hero-kicker, .hero-edition-tab', { opacity: 0, y: 12, duration: 0.5, stagger: 0.08 }, '<0.05')
        .from('.hero-archive-number', { opacity: 0, scale: 0.82, rotation: -8, duration: 0.9 }, '<')
        .from('.hero-title-line', { yPercent: 115, rotation: 3, duration: 0.9, stagger: 0.11 }, '<0.05')
        .from('.hero-script', { opacity: 0, scale: 0.72, rotation: -12, duration: 0.65 }, '<0.35')
        .from('.hero-description, .hero-actions, .hero-proof', { opacity: 0, y: 18, duration: 0.55, stagger: 0.09 }, '<0.15')
        .from('.hero-dial', { opacity: 0, scale: 0.78, rotation: -16, duration: 1 }, 0.2)
        .from('.hero-blue-paper', { opacity: 0, scale: 0.86, rotation: 12, duration: 0.8 }, '<0.05')
        .from('.hero-paper', { opacity: 0, y: 64, rotation: -6, duration: 0.95 }, '<0.08')
        .from('.hero-sticker, .hero-hanging, .hero-postmark, .hero-star', { opacity: 0, scale: 0.62, rotation: -10, duration: 0.55, stagger: 0.07 }, '<0.35')
        .from('.hero-camellia', { opacity: 0, scale: 0.7, rotation: 8, duration: 0.75 }, '<0.1')
        .from('.hero-souvenir', { opacity: 0, scale: 0.55, rotation: 20, duration: 0.8 }, '<0.08')
        .from('.hero-ledger > *', { opacity: 0, y: 10, duration: 0.5, stagger: 0.08 }, '<0.2');

      const visual = rootRef.current?.querySelector('.hero-visual');
      if (!visual) return undefined;
      const layers = gsap.utils.toArray(visual.querySelectorAll('.parallax-layer'));
      const movers = layers.map((layer, index) => ({
        x: gsap.quickTo(layer, 'x', { duration: 0.8, ease: 'power3.out' }),
        y: gsap.quickTo(layer, 'y', { duration: 0.8, ease: 'power3.out' }),
        depth: (index % 3 + 1) * 2.6,
      }));
      let ready = false;
      const onMove = (event) => {
        if (!ready || event.pointerType === 'touch') return;
        const bounds = visual.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        movers.forEach((mover) => {
          mover.x(x * mover.depth);
          mover.y(y * mover.depth);
        });
      };
      const onLeave = () => movers.forEach((mover) => {
        mover.x(0);
        mover.y(0);
      });
      visual.addEventListener('pointermove', onMove);
      visual.addEventListener('pointerleave', onLeave);
      visual.addEventListener('pointercancel', onLeave);
      window.addEventListener('blur', onLeave);
      timeline.eventCallback('onComplete', () => { ready = true; });
      return () => {
        visual.removeEventListener('pointermove', onMove);
        visual.removeEventListener('pointerleave', onLeave);
        visual.removeEventListener('pointercancel', onLeave);
        window.removeEventListener('blur', onLeave);
      };
    });
    return () => media.revert();
  }, { dependencies: [active], scope: rootRef, revertOnUpdate: true });

  return (
    <section ref={rootRef} className="page-cover" aria-labelledby="hero-title">
      <div className="hero">
        <TagRail />
        <div className="hero-copy">
          <span className="hero-archive-number" aria-hidden="true">01</span>
          <span className="hero-edition-tab" lang="fr">CRÉATION · 01</span>
          <p className="kicker hero-kicker">Copywriting atelier · 文案生成器</p>
          <h1 id="hero-title">
            <span className="title-mask"><span className="hero-title-line">把心事，</span></span>
            <span className="title-mask"><span className="hero-title-line">写成一页诗意。</span></span>
          </h1>
          <span className="hero-script" aria-hidden="true" lang="fr">Les mots doux</span>
          <p className="hero-description">输入一个主题，选择一种语气。让零散的灵感先成为文字，再让纸张、贴纸与字迹，一起完成这页作品。</p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={() => onNavigate('atelier')}>
              推开创作台的门
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h13M14 7l5 5-5 5" stroke="currentColor" strokeWidth="1.2" /></svg>
            </button>
            <button className="text-link" type="button" onClick={() => onNavigate('inspiration')}>先找一点灵感</button>
            <button className="text-link" type="button" onClick={() => onNavigate('maison')}>关于这间纸房间</button>
          </div>
          <div className="hero-proof"><span><i>01</i>本地灵感生成</span><span><i>02</i>自由贴纸拼贴</span><span><i>03</i>无需注册登录</span></div>
        </div>
        <HeroCollage />
      </div>
      <div className="hero-ledger">
        <span lang="fr">Des mots pour les jours ordinaires</span>
        <span className="ledger-script" lang="fr">Write it, then make it beautiful.</span>
        <span>Paris · 2026</span>
      </div>
      <p className="cover-hint"><span aria-hidden="true">✦</span> 书签在边缘，可以翻到任意一页</p>
    </section>
  );
}

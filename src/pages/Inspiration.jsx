import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { createCopy, examples, tones } from '../data/copy';
import { StickerArt, stickerCatalog } from '../components/StickerArt';

const Paperclip = () => (
  <svg viewBox="0 0 28 64" aria-hidden="true"><path d="M20 9v37a8 8 0 0 1-16 0V15a5 5 0 0 1 10 0v34a2.6 2.6 0 0 1-5.2 0V17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
);

const sampleArt = ['rose', 'bottle', 'moon'];

export default function Inspiration({ enter, onUse }) {
  const rootRef = useRef(null);
  const samples = examples.map((example, index) => {
    const copy = createCopy(example.topic, example.tone, index);
    const tone = tones.find((item) => item.id === example.tone);
    return { example, copy, tone, art: sampleArt[index] };
  });

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      timeline
        .from('.inspiration-hero .kicker', { opacity: 0, y: 10, duration: 0.45 })
        .from('.inspiration-hero h2 .line-mask > span', { yPercent: 110, duration: 0.8, stagger: 0.1 }, '<0.1')
        .from('.inspiration-lede, .inspiration-note', { opacity: 0, y: 14, duration: 0.5, stagger: 0.08 }, '<0.2')
        .from('.sample', { opacity: 0, y: 34, rotation: 2, duration: 0.7, stagger: 0.11 }, '<0.25')
        .from('.collection-head, .collection-item', { opacity: 0, y: 16, duration: 0.5, stagger: 0.06 }, '<0.35');
      if (enter) timeline.play(0);
      else timeline.pause(0);
    });
    return () => media.revert();
  }, { dependencies: [enter], scope: rootRef, revertOnUpdate: true });

  return (
    <section ref={rootRef} className="page-inspiration" aria-labelledby="inspiration-title">
      <header className="inspiration-hero">
        <p className="kicker" lang="fr">Une petite étincelle · 灵感</p>
        <h2 id="inspiration-title">
          <span className="line-mask"><span>不知道写什么，</span></span>
          <span className="line-mask"><span>先从这三页开始。</span></span>
        </h2>
        <p className="inspiration-lede">每个主题都已经写到纸上。保留它，或者换上你自己的故事；点一下，就直接走进创作台。</p>
      </header>

      <div className="sample-grid">
        {samples.map(({ example, copy, tone, art }, index) => (
          <article className="sample" key={example.title}>
            <span className="sample-tape" aria-hidden="true" />
            <span className="sample-clip" aria-hidden="true"><Paperclip /></span>
            <div className="sample-head">
              <span className="sample-edition" lang="fr">ÉDITION 0{index + 1}</span>
              <span className="sample-tone">{tone?.label}</span>
            </div>
            <h3>{copy.title}</h3>
            <p className="sample-script" lang="fr">{tone?.french}</p>
            <p className="sample-body">{copy.body.slice(0, 46)}…</p>
            <span className="sample-art" aria-hidden="true"><StickerArt type={art} /></span>
            <button type="button" className="sample-action" onClick={() => onUse(example)}>
              试写这一页
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h13M14 7l5 5-5 5" stroke="currentColor" strokeWidth="1.2" /></svg>
            </button>
            <span className="sample-index" aria-hidden="true">0{index + 1}</span>
          </article>
        ))}
      </div>

      <section className="collection" aria-labelledby="collection-title">
        <span className="collection-clip" aria-hidden="true"><Paperclip /></span>
        <span className="collection-tape" aria-hidden="true" />
        <span className="collection-stamp" lang="fr">PLANCHE N° 02</span>
        <div className="collection-head">
          <p className="kicker" lang="fr">La petite collection</p>
          <h3 id="collection-title">十枚手绘贴纸，<br /><em>等你贴上去。</em></h3>
          <p className="inspiration-note">全部是线稿 SVG，统一收进墨蓝与银蓝两色。</p>
        </div>
        <ul className="collection-grid">
          {stickerCatalog.map((sticker) => (
            <li className="collection-item" key={sticker.id}>
              <span className="collection-art"><StickerArt type={sticker.id} /></span>
              <span className="collection-label">{sticker.label}</span>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}

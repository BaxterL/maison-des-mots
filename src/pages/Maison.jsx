import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const principles = [
  { no: '01', title: '本地生成', text: '模板在浏览器里写完。不登录，不上传，写下的心事只留在这一页。' },
  { no: '02', title: '纸与字', text: '奶白、银蓝、墨蓝，模切白边与 1px 墨线。先看见纸，再看见功能。' },
  { no: '03', title: '慢慢写', text: '模板可以起稿，也可以自己写。自己写的字，会原样落在纸上，不加一句多余的话。' },
];

export default function Maison({ enter, onNavigate }) {
  const rootRef = useRef(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      timeline
        .from('.maison-orbit', { opacity: 0, scale: 0.86, duration: 1.1 })
        .from('.maison-ornament, .maison-kicker', { opacity: 0, y: 8, duration: 0.5, stagger: 0.08 }, '<0.1')
        .from('.about-script', { opacity: 0, scale: 0.82, rotation: -6, duration: 0.8 }, '<0.1')
        .from('.maison-paper h2 .line-mask > span', { yPercent: 110, duration: 0.9, stagger: 0.1 }, '<0.15')
        .from('.maison-lede', { opacity: 0, y: 16, duration: 0.55 }, '<0.2')
        .from('.principle', { opacity: 0, y: 22, duration: 0.6, stagger: 0.1 }, '<0.2')
        .from('.maison-sign > *', { opacity: 0, y: 10, duration: 0.55, stagger: 0.1 }, '<0.2');
      if (enter) timeline.play(0);
      else timeline.pause(0);
    });
    return () => media.revert();
  }, { dependencies: [enter], scope: rootRef, revertOnUpdate: true });

  return (
    <section ref={rootRef} className="page-maison" aria-labelledby="maison-title">
      <span className="maison-orbit" aria-hidden="true" />
      <div className="maison-paper">
        <span className="maison-ornament" aria-hidden="true">✦</span>
        <p className="kicker maison-kicker" lang="fr">À propos · 关于这间纸房间</p>
        <p className="about-script" lang="fr">Les jours passent, les mots restent.</p>
        <h2 id="maison-title">
          <span className="line-mask"><span>日子会过去，</span></span>
          <span className="line-mask"><span>文字替你留下来。</span></span>
        </h2>
        <p className="maison-lede">这是一间小而安静的文案房间。你可以用一个主题让模板起稿，也可以自己把文案写完；纸张、贴纸与字迹，只是替这些话找一个更好的落点。</p>
        <div className="maison-principles">
          {principles.map((item) => (
            <div className="principle" key={item.no}>
              <span className="principle-no" lang="fr">{item.no}</span>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
        <div className="maison-sign">
          <button type="button" className="light-link" onClick={() => onNavigate('couverture')}>回到封面</button>
          <span className="maison-seal" aria-hidden="true">M</span>
          <span className="maison-note" lang="fr">Fait avec des mots et des riens précieux</span>
        </div>
        <p className="maison-colophon">
          <span className="maison-author">作者 <strong>凛冬初十</strong></span>
          <a
            className="maison-github"
            href="https://github.com/BaxterL/maison-des-mots"
            target="_blank"
            rel="noreferrer noopener"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" /></svg>
            <span>github.com/BaxterL/maison-des-mots</span>
            <span aria-hidden="true">↗</span>
          </a>
        </p>
      </div>
    </section>
  );
}

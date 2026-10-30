import { StickerArt } from './StickerArt';
import colonnade from '../assets/colonnade.webp';
import camellia from '../assets/camellia.svg';

function ArchiveDial() {
  return (
    <svg viewBox="0 0 500 500" aria-hidden="true">
      <defs><path id="hero-dial-path" d="M250 250m-190 0a190 190 0 1 1 380 0a190 190 0 1 1-380 0" /></defs>
      <g className="dial-lines"><circle cx="250" cy="250" r="224" /><circle cx="250" cy="250" r="190" /><circle cx="250" cy="250" r="151" /><path d="M250 13v474M13 250h474" /></g>
      <g className="dial-ticks">{Array.from({ length: 48 }, (_, index) => <line key={index} x1="250" y1={index % 4 === 0 ? 17 : 22} x2="250" y2="31" transform={`rotate(${index * 7.5} 250 250)`} />)}</g>
      <text className="dial-text"><textPath href="#hero-dial-path" startOffset="2%">01 ÉCRIRE · 书写 · 02 COLLER · 拼贴 · 03 GARDER · 珍藏 · MAISON DES MOTS · </textPath></text>
    </svg>
  );
}

export default function HeroCollage() {
  return (
    <div className="hero-visual" role="img" aria-label="一页带有古典拱廊、山茶花、香水与档案刻度的法式文案拼贴">
      <div className="hero-dial parallax-layer"><ArchiveDial /></div>
      <div className="hero-blue-paper parallax-layer" aria-hidden="true" />
      <div className="hero-paper parallax-layer">
        <span className="paper-tape" aria-hidden="true" />
        <div className="hero-paper-meta"><span>LETTRE N° 001</span><span>PARIS · 2026</span></div>
        <p className="hero-paper-kicker" lang="fr">Pour la fleuriste du coin</p>
        <h2>把春天，<br />写在街角。</h2>
        <p className="hero-paper-script" lang="fr">La poésie du quotidien</p>
        <p className="hero-paper-copy">光落下来的地方，时间也愿意坐一会儿。那些没有被说出的喜欢，正藏在花影、纸页与午后的微风里。</p>
        <div className="hero-architecture-frame"><img className="hero-colonnade" src={colonnade} width="600" height="392" alt="" /></div>
        <div className="hero-postmark" aria-hidden="true"><span>PARIS</span><small>29 · OCTOBRE</small></div>
        <div className="hero-paper-footer"><span>MAISON DES MOTS</span><span>PAGE 01</span></div>
      </div>
      <div className="hero-sticker hero-stamp parallax-layer"><StickerArt type="stamp" /></div>
      <div className="hero-camellia parallax-layer"><span className="camellia-thread" /><span className="camellia-ring" /><img src={camellia} width="320" height="320" alt="" /></div>
      <div className="hero-hanging parallax-layer" aria-hidden="true"><span className="hanging-thread" /><span className="hanging-ring" /><StickerArt type="bottle" /></div>
      <div className="hero-souvenir parallax-layer"><div className="souvenir-content"><span lang="fr">Souvenir</span><small>PAGE · 01</small></div></div>
    </div>
  );
}

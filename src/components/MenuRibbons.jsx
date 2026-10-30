import { PAGES } from '../data/pages';

function PaperShape() {
  return (
    <svg viewBox="0 0 48 106" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path className="ribbon-edge" d="M0 0H48V94L24 106 0 94Z" />
      <path className="ribbon-face" d="M2.5 2.5H45.5V92.5L24 103.2 2.5 92.5Z" />
    </svg>
  );
}

export default function MenuRibbons({ page, onNavigate }) {
  return (
    <nav className="menu-ribbons" aria-label="章节目录">
      <span className="menu-ribbons__caption" lang="fr" aria-hidden="true">Sommaire</span>
      {PAGES.map((item) => {
        const active = page === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className={`menu-ribbon${active ? ' is-active' : ''}`}
            aria-current={active ? 'page' : undefined}
            aria-label={`${item.no} ${item.cn} · ${item.fr}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="ribbon-layer ribbon-back"><PaperShape /></span>
            <span className="ribbon-layer ribbon-mid"><PaperShape /></span>
            <span className="ribbon-layer ribbon-front">
              <PaperShape />
              <span className="ribbon-label">
                <span className="ribbon-no">{item.no}</span>
                <span className="ribbon-cn">{item.cn}</span>
              </span>
            </span>
          </button>
        );
      })}
      <span className="menu-ribbons__thread" aria-hidden="true" />
    </nav>
  );
}

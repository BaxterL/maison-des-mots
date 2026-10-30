import { PAGES } from '../data/pages';

export default function MenuRibbons({ page, onNavigate }) {
  return (
    <nav className="menu-ribbons" aria-label="章节目录">
      <span className="menu-ribbons__caption" lang="fr" aria-hidden="true">Sommaire</span>
      {PAGES.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`menu-ribbon${page === item.id ? ' is-active' : ''}`}
          aria-current={page === item.id ? 'page' : undefined}
          aria-label={`${item.no} ${item.cn} · ${item.fr}`}
          onClick={() => onNavigate(item.id)}
        >
          <span className="menu-ribbon__no">{item.no}</span>
          <span className="menu-ribbon__cn">{item.cn}</span>
          <span className="menu-ribbon__fr" lang="fr">{item.menu}</span>
        </button>
      ))}
      <span className="menu-ribbons__thread" aria-hidden="true" />
    </nav>
  );
}

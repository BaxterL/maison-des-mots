import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Cover from './pages/Cover';
import Inspiration from './pages/Inspiration';
import Maison from './pages/Maison';
import Studio from './components/Studio';
import MenuRibbons from './components/MenuRibbons';
import { PAGES, pageById, pageFromHash } from './data/pages';

function Corner({ position }) {
  return (
    <svg className={`frame-corner frame-corner-${position}`} viewBox="0 0 70 70" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="1"><path d="M3 67V3h64M9 60V9h51" /><path d="M14 44V14h30M14 14c14 0 28 12 30 30M20 14c0 12 10 24 24 24M14 25c12 0 19 7 19 19" /><path d="M21 21c7-7 15 2 9 8-5 5-13-1-9-8ZM9 48c8-2 13 3 11 11M48 9c-2 8 3 13 11 11" /><circle cx="14" cy="14" r="2" fill="currentColor" /></g></svg>
  );
}

export default function App() {
  const rootRef = useRef(null);
  const mainRef = useRef(null);
  const studioRef = useRef(null);
  const pageRef = useRef(pageFromHash(window.location.hash));

  const [page, setPage] = useState(pageRef.current);
  const [loaded, setLoaded] = useState(() => ({ [pageRef.current]: true }));
  const [pendingExample, setPendingExample] = useState(null);
  // Every arrival replays the entrance: the page mounts in its start state,
  // then the elements land one by one on the next frame.
  const [entered, setEntered] = useState(true);

  useEffect(() => { pageRef.current = page; }, [page]);

  const navigate = useCallback((id, push = true) => {
    if (!PAGES.some((item) => item.id === id) || id === pageRef.current) return;
    setEntered(false);
    setLoaded((current) => (current[id] ? current : { ...current, [id]: true }));
    pageRef.current = id;
    setPage(id);
    if (push) window.history.pushState({ page: id }, '', `#/${id}`);
    window.scrollTo({ top: 0, behavior: 'auto' });
    requestAnimationFrame(() => {
      setEntered(true);
      mainRef.current?.focus({ preventScroll: true });
    });
  }, []);

  useEffect(() => {
    const onPopState = () => {
      const id = pageFromHash(window.location.hash);
      if (id !== pageRef.current) navigate(id, false);
    };
    window.addEventListener('popstate', onPopState);
    if (!window.location.hash) window.history.replaceState({ page: pageRef.current }, '', `#/${pageRef.current}`);
    return () => window.removeEventListener('popstate', onPopState);
  }, [navigate]);

  useEffect(() => {
    const current = pageById(page);
    document.title = `${current.cn} · Maison des Mots`;
  }, [page]);

  useEffect(() => {
    if (!pendingExample || page !== 'atelier') return;
    const timer = window.setTimeout(() => {
      studioRef.current?.generateWith(pendingExample);
      setPendingExample(null);
    }, 160);
    return () => window.clearTimeout(timer);
  }, [pendingExample, page]);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      timeline
        .from('.chapter__no', { opacity: 0, y: -8, duration: 0.35 })
        .from('.chapter__fr, .chapter__cn', { opacity: 0, y: 8, duration: 0.4, stagger: 0.05 }, '<0.05')
        .from('.menu-ribbons .menu-ribbon', { opacity: 0, x: 18, duration: 0.5, stagger: 0.05, clearProps: 'transform' }, '<0.1');
    });
    return () => media.revert();
  }, { dependencies: [page], scope: rootRef, revertOnUpdate: true });

  const useExample = (example) => {
    setPendingExample(example);
    navigate('atelier');
  };

  const activeFor = (id) => page === id;

  return (
    <div ref={rootRef} className="app">
      <a className="skip-link" href="#main">跳至主要内容</a>
      <svg className="page-texture" aria-hidden="true" focusable="false"><filter id="page-grain"><feTurbulence type="fractalNoise" baseFrequency=".72" numOctaves="4" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter><rect width="100%" height="100%" filter="url(#page-grain)" /></svg>
      <div className="book-shell">
        <Corner position="tl" /><Corner position="tr" /><Corner position="bl" /><Corner position="br" />
        <div className="inner-frame">
          <header className="masthead">
            <a
              className="brand"
              href="#/couverture"
              aria-label="Maison des Mots 封面"
              onClick={(event) => { event.preventDefault(); navigate('couverture'); }}
            >
              <span className="brand-seal" aria-hidden="true">M</span>
              <span className="brand-copy"><strong>Maison des Mots</strong><small lang="fr">L’atelier d’écriture</small></span>
            </a>
            <div className="chapter" aria-live="polite">
              <span className="chapter__no" lang="fr">{pageById(page).no}</span>
              <span className="chapter__fr" lang="fr">{pageById(page).fr}</span>
              <span className="chapter__cn">{pageById(page).cn}</span>
            </div>
            <div className="edition"><span lang="fr">Édition N° 01</span><span lang="fr">Écrire · Coller · Garder</span></div>
          </header>
          <MenuRibbons page={page} onNavigate={navigate} />
          <main id="main" ref={mainRef} tabIndex={-1} className="page-stage">
            {Object.keys(loaded).map((id) => (
              <div key={id} className={`page-view page-view--${id}${activeFor(id) ? ' is-active' : ''}`} hidden={page !== id}>
                {id === 'couverture' && <Cover active={activeFor(id)} enter={entered && page === id} onNavigate={navigate} />}
                {id === 'atelier' && (
                  <Studio
                    ref={studioRef}
                    active={activeFor(id)}
                    enter={entered && page === id}
                  />
                )}
                {id === 'inspiration' && <Inspiration active={activeFor(id)} enter={entered && page === id} onUse={useExample} />}
                {id === 'maison' && <Maison active={activeFor(id)} enter={entered && page === id} onNavigate={navigate} />}
              </div>
            ))}
          </main>
          <footer className="footer"><span lang="fr">Fait avec des mots et des riens précieux</span><span className="footer-script">Maison des Mots</span><span>Write · Collect · Remember</span></footer>
        </div>
      </div>
    </div>
  );
}

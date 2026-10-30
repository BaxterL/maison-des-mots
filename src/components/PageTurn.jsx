import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { pageById } from '../data/pages';

function TurnFace({ page, side }) {
  return (
    <div className={`turn-face turn-face--${side}`}>
      <span className="turn-frame" aria-hidden="true" />
      <span className="turn-grain" aria-hidden="true" />
      <div className="turn-content">
        <span className="turn-kicker" lang="fr">
          MAISON DES MOTS · {side === 'front' ? 'PAGE TOURNÉE' : 'PAGE SUIVANTE'}
        </span>
        <span className="turn-number" aria-hidden="true">{page.no}</span>
        <p className="turn-cn">{page.cn}</p>
        <p className="turn-fr" lang="fr">{page.fr}</p>
        <span className="turn-seal" aria-hidden="true">M</span>
        <span className="turn-caption" lang="fr">
          {side === 'front' ? 'Tourner la page' : 'Bienvenue'}
        </span>
      </div>
      <span className="turn-shade" aria-hidden="true" />
    </div>
  );
}

export default function PageTurn({ turn, onDone }) {
  const rootRef = useRef(null);
  const sheetRef = useRef(null);

  useGSAP(() => {
    if (!turn) return;
    const root = rootRef.current;
    const sheet = sheetRef.current;
    if (!root || !sheet) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      gsap.set(root, { display: 'none' });
      onDone();
      return;
    }

    const forward = turn.dir >= 0;
    const duration = window.innerWidth <= 640 ? 0.62 : 0.82;
    gsap.set(root, { display: 'block', opacity: 1 });
    gsap.set(sheet, {
      rotateY: 0,
      rotateX: 0,
      transformOrigin: forward ? 'left center' : 'right center',
      opacity: 1,
    });
    gsap.set(root.querySelectorAll('.turn-shade'), { opacity: 0 });

    const timeline = gsap.timeline({
      onComplete: () => {
        gsap.set(root, { display: 'none' });
        onDone();
      },
    });

    timeline
      .to(sheet, {
        rotateY: forward ? -178 : 178,
        duration,
        ease: 'power2.inOut',
      })
      .to(root.querySelectorAll('.turn-shade'), { opacity: 0.5, duration: duration * 0.44, ease: 'none' }, 0)
      .to(root.querySelectorAll('.turn-shade'), { opacity: 0, duration: duration * 0.44, ease: 'none' }, duration * 0.5);

    return () => timeline.kill();
  }, { dependencies: [turn], scope: rootRef, revertOnUpdate: true });

  if (!turn) return null;

  const from = pageById(turn.from);
  const to = pageById(turn.to);

  return (
    <div ref={rootRef} className={`page-turn ${turn.dir >= 0 ? 'is-forward' : 'is-back'}`} aria-hidden="true">
      <div className="page-turn__stage">
        <div ref={sheetRef} className="page-turn__sheet">
          <TurnFace page={from} side="front" />
          <TurnFace page={to} side="back" />
        </div>
      </div>
    </div>
  );
}

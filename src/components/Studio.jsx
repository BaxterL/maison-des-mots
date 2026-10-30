import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Draggable } from 'gsap/Draggable';
import { createCopy, initialCopy, tones } from '../data/copy';
import { StickerArt, stickerCatalog } from './StickerArt';
import { exportPaperPng, downloadBlob } from '../utils/exportPaper';

const firstStickers = [
  { id: 'rose-first', type: 'rose', x: 18, y: 42, rotation: -12 },
  { id: 'bottle-first', type: 'bottle', x: 2000, y: 360, rotation: 9 },
];

const paperFonts = [
  { id: 'kai', label: '文楷', name: 'LXGW WenKai' },
  { id: 'song', label: '宋体', name: 'Noto Serif SC' },
  { id: 'latin', label: '拉丁', name: 'Cormorant' },
  { id: 'kuaile', label: '快乐', name: 'ZCOOL KuaiLe' },
  { id: 'huangyou', label: '黄油', name: 'ZCOOL QingKe HuangYou' },
];

const TOKEN_RE = /([A-Za-zÀ-ÖØ-öø-ÿ0-9]+(?:[’'\-][A-Za-zÀ-ÖØ-öø-ÿ0-9]+)*)|(\n)|(\s+)|([\s\S])/g;

function tokenize(text) {
  const tokens = [];
  let match;
  TOKEN_RE.lastIndex = 0;
  while ((match = TOKEN_RE.exec(text)) !== null) {
    if (match[2] !== undefined) tokens.push({ text: '\n', newline: true });
    else tokens.push({ text: match[0], space: match[3] !== undefined, word: match[1] !== undefined });
  }
  return tokens;
}

function Brush() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="brush-handle" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F4EFE3" />
          <stop offset="1" stopColor="#DDD4C3" />
        </linearGradient>
        <linearGradient id="brush-tip" x1="0.2" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#28325A" />
          <stop offset="1" stopColor="#0E1426" />
        </linearGradient>
      </defs>
      <path d="M61 3 L37 27" stroke="url(#brush-handle)" strokeWidth="6.4" strokeLinecap="round" />
      <path d="M61 3 L37 27" stroke="rgba(30,39,72,.32)" strokeWidth=".9" strokeLinecap="round" fill="none" />
      <path d="M37 27 L31 33" stroke="#BFC8E0" strokeWidth="6.8" strokeLinecap="round" />
      <path d="M31 33 C27 38 23 44 19 50 C16 55 12 59 8 62 C13 59 18 55 23 51 C28 47 32 41 35 36 Z" fill="url(#brush-tip)" />
      <path d="M30 35 C27 40 24 45 21 50" stroke="rgba(255,253,248,.34)" strokeWidth=".9" fill="none" />
      <circle cx="8" cy="62" r="1.6" fill="#0E1426" opacity=".85" />
    </svg>
  );
}

function Paperclip({ className = '' }) {
  return (
    <svg className={`paperclip ${className}`} viewBox="0 0 28 64" aria-hidden="true">
      <path d="M20 9v37a8 8 0 0 1-16 0V15a5 5 0 0 1 10 0v34a2.6 2.6 0 0 1-5.2 0V17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function Inkwell({ label, dipping, onCycle }) {
  return (
    <button type="button" className={`inkwell${dipping ? ' is-dipping' : ''}`} onClick={onCycle} aria-label={`当前字迹：${label}。点毛笔或这里切换字体`}>
      <svg viewBox="0 0 120 150" aria-hidden="true">
        <defs>
          <linearGradient id="ink-glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="rgba(220,226,241,.9)" />
            <stop offset="1" stopColor="rgba(191,200,224,.55)" />
          </linearGradient>
          <linearGradient id="ink-liquid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2B365E" />
            <stop offset="1" stopColor="#161E3C" />
          </linearGradient>
          <linearGradient id="ink-brush" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F4EFE3" />
            <stop offset="1" stopColor="#DAD1C0" />
          </linearGradient>
        </defs>
        <g className="inkwell-brush">
          <path d="M96 8 L74 40" stroke="url(#ink-brush)" strokeWidth="5.2" strokeLinecap="round" />
          <path d="M96 8 L74 40" stroke="rgba(30,39,72,.3)" strokeWidth=".8" strokeLinecap="round" fill="none" />
          <path d="M74 40 L69 47" stroke="#BFC8E0" strokeWidth="5.6" strokeLinecap="round" />
          <path d="M69 47 C66 51 63 55 59 58 C56 60 53 62 50 63 C54 60 58 57 61 54 C64 51 67 49 69 47 Z" fill="#1E2748" />
        </g>
        <g className="inkwell-bottle">
          <ellipse cx="60" cy="141" rx="30" ry="4" fill="rgba(30,39,72,.14)" />
          <rect x="50" y="52" width="20" height="16" fill="url(#ink-glass)" stroke="rgba(30,39,72,.45)" strokeWidth="1" />
          <rect x="46" y="66" width="28" height="72" rx="8" fill="url(#ink-glass)" stroke="rgba(30,39,72,.45)" strokeWidth="1" />
          <path d="M47 96 h26 v33 a7 7 0 0 1 -7 7 h-12 a7 7 0 0 1 -7 -7 Z" fill="url(#ink-liquid)" opacity=".82" />
          <path d="M47 96 h26" stroke="rgba(255,253,248,.5)" strokeWidth="1.2" />
          <path d="M52 76 v40 M68 72 v44" stroke="rgba(255,253,248,.45)" strokeWidth="1.6" strokeLinecap="round" />
          <ellipse cx="60" cy="52" rx="10" ry="3.4" fill="none" stroke="rgba(30,39,72,.5)" strokeWidth="1" />
          <path d="M50 58 h20" stroke="rgba(30,39,72,.28)" strokeWidth="1" />
        </g>
      </svg>
      <span className="inkwell-label">{label}</span>
    </button>
  );
}


function GeneratedCopy({ copy, onTyped, active, skipRef, onWriting, speed = 1 }) {
  const copyRef = useRef(null);
  const quillRef = useRef(null);
  const playedRef = useRef(null);
  const tokens = useMemo(() => tokenize((copy.body || '').replace(/\r\n/g, '\n')), [copy.body]);

  useGSAP(() => {
    if (!active) return undefined;
    const root = copyRef.current;
    if (!root) return undefined;
    const chars = gsap.utils.toArray(root.querySelectorAll('.ink-token'));
    const quill = quillRef.current;

    if (playedRef.current === copy) {
      gsap.set(chars, { opacity: 1, filter: 'none' });
      if (skipRef) skipRef.current = null;
      onWriting?.(false);
      onTyped();
      return undefined;
    }
    playedRef.current = copy;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(chars, { opacity: 1, filter: 'none' });
      gsap.set(quill, { opacity: 0 });
      if (skipRef) skipRef.current = null;
      onWriting?.(false);
      onTyped();
      return undefined;
    }

    onWriting?.(true);

    const moveQuill = (element, tilt = 0) => {
      if (!quill || !element) return;
      const currentBase = root.getBoundingClientRect();
      const rect = element.getBoundingClientRect();
      const x = rect.left - currentBase.left + rect.width - 6;
      const y = rect.top - currentBase.top + rect.height - 44;
      gsap.to(quill, { x, y, rotation: tilt, scaleY: 1.04, duration: 0.16 / speed, ease: 'power2.out', overwrite: 'auto' });
    };

    gsap.set(chars, { opacity: 0, filter: 'blur(1.8px)', y: 1.6 });
    gsap.set(quill, { opacity: 0, x: 8, y: 30 });
    gsap.from(root.querySelector('.generated-title'), { opacity: 0, y: 10, filter: 'blur(3px)', duration: 0.65, ease: 'power3.out' });
    gsap.from(root.querySelector('.generated-note'), { opacity: 0, y: 6, duration: 0.45, ease: 'power3.out' });

    const groups = [];
    let bucket = [];
    tokens.forEach((token, index) => {
      bucket.push(index);
      const pause = token.newline || /[。！？!?；;：:，,]/.test(token.text);
      if (pause || bucket.length >= 3) {
        groups.push(bucket);
        bucket = [];
      }
    });
    if (bucket.length) groups.push(bucket);

    const timeline = gsap.timeline({
      delay: 0.22 / speed,
      onComplete: () => {
        if (skipRef) skipRef.current = null;
        onWriting?.(false);
        gsap.to(quill, { opacity: 0, duration: 0.22, ease: 'power1.in' });
        onTyped();
      },
    });
    timeline.to(quill, { opacity: 1, duration: 0.2 }, 0);

    const step = Math.min(0.17, 2.2 / Math.max(1, groups.length)) / speed;
    let cursor = 0;
    groups.forEach((group, groupIndex) => {
      const visible = group.filter((index) => !tokens[index].space && !tokens[index].newline);
      const last = visible[visible.length - 1];
      if (last !== undefined) timeline.call(() => moveQuill(chars[last], groupIndex % 2 ? 5 : -4), null, cursor);
      group.forEach((index, order) => {
        timeline.to(chars[index], {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 0.13 / speed,
          ease: 'power1.out',
        }, cursor + Math.min(0.04, order * 0.02) / speed);
      });
      cursor += step;
    });
    timeline.from(root.querySelector('.generated-signature'), { opacity: 0, y: 6, duration: 0.45 / speed, ease: 'power3.out' }, '+=0.12');

    if (skipRef) skipRef.current = () => timeline.progress(1);

    return () => {
      if (skipRef) skipRef.current = null;
      onWriting?.(false);
      timeline.kill();
      gsap.killTweensOf(quill);
    };
  }, { dependencies: [copy, active], scope: copyRef, revertOnUpdate: true });

  return (
    <div ref={copyRef} className="generated-copy">
      {copy.custom ? null : <span className="generated-note" lang="fr">{copy.note}</span>}
      {copy.title ? <h3 className="generated-title">{copy.title}</h3> : null}
      <span className="generated-flourish" aria-hidden="true">✦</span>
      <p className="generated-body" aria-hidden="true">
        {tokens.map((token, index) => token.newline
          ? <span key={index} className="ink-token ink-space ink-newline"><br /></span>
          : <span key={index} className={`ink-token${token.space ? ' ink-space' : ''}${token.word ? ' ink-word' : ''}`}>{token.text}</span>)}
      </p>
      <span className="sr-only" aria-live="polite">{copy.body}</span>
      <span className="brush" ref={quillRef} aria-hidden="true"><Brush /></span>
      {copy.custom ? null : <span className="generated-signature" lang="fr">{copy.signature || 'avec tendresse,'}</span>}
    </div>
  );
}

const Studio = forwardRef(function Studio({ active, enter }, ref) {
  const rootRef = useRef(null);
  const boardRef = useRef(null);
  const paperRef = useRef(null);
  const topicRef = useRef(null);
  const customBodyRef = useRef(null);
  const delayRef = useRef(null);
  const skipWritingRef = useRef(null);
  const stickersRef = useRef(firstStickers);
  const newStickerRef = useRef(null);  const [mode, setMode] = useState('template');
  const [topic, setTopic] = useState('街角花店的春日午后');
  const [tone, setTone] = useState('tender');
  const [customTitle, setCustomTitle] = useState('');
  const [customBody, setCustomBody] = useState('');
  const [copy, setCopy] = useState(initialCopy);
  const [variation, setVariation] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [writing, setWriting] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('写下主题，第一页就从这里开始。');
  const [paperTheme, setPaperTheme] = useState('cream');
  const [stickers, setStickers] = useState(firstStickers);
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [copied, setCopied] = useState(false);
  const [paperFont, setPaperFont] = useState('kai');
  const [dipping, setDipping] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [pane, setPane] = useState('write');
  const [speed, setSpeed] = useState(1);
  const [noteOffset, setNoteOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(false), 1100);
    return () => window.clearTimeout(timer);
  }, [copied]);

  useLayoutEffect(() => { stickersRef.current = stickers; }, [stickers]);
  useEffect(() => () => delayRef.current?.kill(), []);

  const { contextSafe } = useGSAP(() => {}, { scope: rootRef });

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      timeline
        .from('.studio-heading .kicker', { opacity: 0, y: 8, duration: 0.4 })
        .from('.studio-heading h2', { opacity: 0, y: 18, duration: 0.65 }, '<0.05')
        .from('.studio-heading > p', { opacity: 0, y: 12, duration: 0.5 }, '<0.08')
        .from('.prompt-panel', { opacity: 0, y: 26, rotation: -1.2, duration: 0.65 }, '<0.1')
        .from('.preview-toolbar', { opacity: 0, y: 12, duration: 0.45 }, '<0.08')
        .from('.collage-board', { opacity: 0, y: 22, duration: 0.65 }, '<0.04')
        .from('.board-actions', { opacity: 0, y: 10, duration: 0.4 }, '<0.12')
        .from('.sticker-book', { opacity: 0, y: 18, duration: 0.55 }, '<0.08')
        .from('.studio-status', { opacity: 0, duration: 0.4 }, '<0.1');
      if (enter) timeline.play(0);
      else timeline.pause(0);
    });
    return () => media.revert();
  }, { dependencies: [enter], scope: rootRef, revertOnUpdate: true });

  useGSAP(() => {
    const board = boardRef.current;
    if (!board) return undefined;
    const elements = gsap.utils.toArray(board.querySelectorAll('.board-sticker'));
    const clamped = [];
    const clampElement = (element, item) => {
      const maxX = Math.max(0, board.clientWidth - element.offsetWidth);
      const maxY = Math.max(0, board.clientHeight - element.offsetHeight);
      const x = gsap.utils.clamp(0, maxX, item.x);
      const y = gsap.utils.clamp(0, maxY, item.y);
      gsap.set(element, { x, y, rotation: item.rotation });
      const draggable = Draggable.get(element);
      if (draggable) {
        draggable.applyBounds(board);
        draggable.update();
      }
      return x !== item.x || y !== item.y ? { id: item.id, x, y } : null;
    };
    const instances = elements.map((element) => {
      const item = stickersRef.current.find((sticker) => sticker.id === element.dataset.stickerId);
      if (item) {
        const correction = clampElement(element, item);
        if (correction) clamped.push(correction);
      }
      return Draggable.create(element, {
        type: 'x,y',
        bounds: board,
        edgeResistance: 0.82,
        cursor: 'grab',
        activeCursor: 'grabbing',
        onPress: () => setSelectedSticker(element.dataset.stickerId),
        onDragEnd: function updatePosition() {
          const id = element.dataset.stickerId;
          setStickers((current) => current.map((sticker) => sticker.id === id ? { ...sticker, x: this.x, y: this.y } : sticker));
        },
      })[0];
    });
    const applyCorrections = (corrections) => {
      if (!corrections.length) return;
      setStickers((current) => current.map((sticker) => {
        const position = corrections.find((item) => item.id === sticker.id);
        return position ? { ...sticker, ...position } : sticker;
      }));
    };
    applyCorrections(clamped);
    let resizeFrame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        if (!board.clientWidth || !board.clientHeight) return;
        const corrections = elements.map((element) => {
          const item = stickersRef.current.find((sticker) => sticker.id === element.dataset.stickerId);
          return item ? clampElement(element, item) : null;
        }).filter(Boolean);
        applyCorrections(corrections);
      });
    });
    observer.observe(board);
    if (newStickerRef.current) {
      const added = board.querySelector(`[data-sticker-id="${newStickerRef.current}"]`);
      if (added && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.from(added, { scale: 0, rotation: -24, duration: 0.55, ease: 'back.out(1.5)' });
      }
      newStickerRef.current = null;
    }
    return () => {
      cancelAnimationFrame(resizeFrame);
      observer.disconnect();
      instances.forEach((instance) => instance.kill());
    };
  }, { dependencies: [stickers.length], scope: boardRef, revertOnUpdate: true });

  const finishGeneration = (nextCopy, nextVariation) => {
    setCopy(nextCopy);
    setVariation(nextVariation);
    setPane('read');
  };

  const completeGeneration = () => {
    if (!isGenerating) return;
    setIsGenerating(false);
    setStatus(copy.custom ? '已经放到纸上了，可以继续改，或者贴一枚贴纸。' : '新的一页已经写好，可以添加贴纸了。');
  };

  const skipWriting = () => {
    skipWritingRef.current?.();
    setStatus('已直接显示完整纸面。');
  };

  const animatePaper = (nextCopy, nextVariation) => {
    const timeline = gsap.timeline();
    timeline
      .to(paperRef.current, { opacity: 0, y: 22, rotation: -3, duration: 0.22, ease: 'power2.in' })
      .call(() => finishGeneration(nextCopy, nextVariation))
      .fromTo(paperRef.current, { opacity: 0, y: -26, rotation: 3 }, { opacity: 1, y: 0, rotation: -1, duration: 0.62, ease: 'power3.out' });
  };

  const startGeneration = contextSafe((nextTopic = topic, nextTone = tone) => {
    if (isGenerating) {
      setStatus('这一页正在书写，完成后再生成新的主题。');
      return;
    }
    if (!nextTopic.trim()) {
      setError('先写下一个主题，比如「雨后重新开门的书店」。');
      topicRef.current?.focus();
      return;
    }
    delayRef.current?.kill();
    const nextVariation = variation + 1;
    const nextCopy = createCopy(nextTopic, nextTone, nextVariation);
    setError('');
    setIsGenerating(true);
    setStatus('正在整理纸屑与词句…');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      delayRef.current = gsap.delayedCall(0.05, () => finishGeneration(nextCopy, nextVariation));
      return;
    }
    animatePaper(nextCopy, nextVariation);
  });

  const startCustomWriting = contextSafe(() => {
    if (isGenerating) {
      setStatus('这一页正在书写，完成后再写新的。');
      return;
    }
    const body = customBody.trim();
    if (!body) {
      setError('先写一点想放在纸上的话。');
      customBodyRef.current?.focus();
      return;
    }
    delayRef.current?.kill();
    const nextVariation = variation + 1;
    const nextCopy = {
      title: customTitle.trim(),
      body,
      note: '',
      signature: '',
      custom: true,
    };
    setError('');
    setIsGenerating(true);
    setStatus('正在把字放到纸上…');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      delayRef.current = gsap.delayedCall(0.05, () => finishGeneration(nextCopy, nextVariation));
      return;
    }
    animatePaper(nextCopy, nextVariation);
  });

  const dragNote = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if (event.target.closest('button')) return;
    event.preventDefault();
    const startX = event.clientX;
    const startY = event.clientY;
    const origin = { ...noteOffset };
    const move = (moveEvent) => {
      setNoteOffset({ x: origin.x + moveEvent.clientX - startX, y: origin.y + moveEvent.clientY - startY });
    };
    const stop = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);
  };

  useImperativeHandle(ref, () => ({
    generateWith(example) {
      if (isGenerating) {
        setStatus('这一页正在书写，完成后再试写新的主题。');
        return;
      }
      setMode('template');
      setTopic(example.topic);
      setTone(example.tone);
      setError('');
      startGeneration(example.topic, example.tone);
    },
  }));

  const switchMode = (nextMode) => {
    if (nextMode === mode) return;
    setMode(nextMode);
    setError('');
    if (nextMode === 'custom') {
      setStatus('把想写的话放进来，纸会原样接住；想接着改纸上的字，点「编辑这段」。');
      requestAnimationFrame(() => customBodyRef.current?.focus({ preventScroll: true }));
    } else {
      setStatus('起稿会补成一封信；写自己的则原样上纸。');
    }
  };

  const editCurrent = () => {
    if (isGenerating) {
      setStatus('这一页正在书写，写完后可以再改。');
      return;
    }
    setPane('write');
    setMode('custom');
    setCustomTitle(copy.title);
    setCustomBody(copy.body);
    setError('');
    setStatus('已把纸上的文字带出来，改完点「放到纸上」。');
    requestAnimationFrame(() => customBodyRef.current?.focus({ preventScroll: true }));
  };

  const addSticker = contextSafe((type, point) => {
    if (stickers.length >= 8) {
      setStatus('一页最多放 8 枚贴纸，先移除一枚再试试。');
      return;
    }
    const boardStyles = getComputedStyle(boardRef.current);
    const stickerWidth = parseFloat(boardStyles.getPropertyValue('--sticker-w')) || 92;
    const stickerHeight = parseFloat(boardStyles.getPropertyValue('--sticker-h')) || 110;
    const maxX = Math.max(1, boardRef.current.clientWidth - stickerWidth);
    const maxY = Math.max(1, boardRef.current.clientHeight - stickerHeight);
    const count = stickers.length;
    const id = `${type}-${Date.now()}`;
    const x = point ? Math.min(maxX, Math.max(0, point.x - stickerWidth / 2)) : Math.min(maxX - 20, 24 + (count * 67) % maxX);
    const y = point ? Math.min(maxY, Math.max(0, point.y - stickerHeight / 2)) : Math.min(maxY - 20, 24 + (count * 83) % maxY);
    const sticker = { id, type, x, y, rotation: -12 + (count * 9) % 25 };
    newStickerRef.current = id;
    setSelectedSticker(id);
    setStickers((current) => [...current, sticker]);
    setStatus(`已添加${stickerCatalog.find((item) => item.id === type)?.label}，拖动它完成拼贴。`);
  });

  const pullSticker = contextSafe((event, type) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const art = event.currentTarget.querySelector('.sticker-chip__art');
    if (!art) return;
    const startX = event.clientX;
    const startY = event.clientY;
    let ghost = null;
    let moved = false;
    const onMove = (moveEvent) => {
      if (!moved && Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY) < 7) return;
      moved = true;
      if (!ghost) {
        ghost = document.createElement('span');
        ghost.className = 'sticker-drag-ghost';
        ghost.appendChild(art.querySelector('svg')?.cloneNode(true) || art.cloneNode(true));
        document.body.appendChild(ghost);
      }
      ghost.style.transform = `translate3d(${moveEvent.clientX - 30}px, ${moveEvent.clientY - 36}px, 0) rotate(-7deg)`;
    };
    const clean = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', finish);
      window.removeEventListener('pointercancel', clean);
      if (ghost) ghost.remove();
    };
    const finish = (upEvent) => {
      clean();
      if (!moved) {
        addSticker(type);
        return;
      }
      const board = boardRef.current?.getBoundingClientRect();
      if (!board) return;
      const inside = upEvent.clientX >= board.left - 8 && upEvent.clientX <= board.right + 8
        && upEvent.clientY >= board.top - 8 && upEvent.clientY <= board.bottom + 8;
      if (!inside) return;
      addSticker(type, { x: upEvent.clientX - board.left, y: upEvent.clientY - board.top });
      setBookOpen(false);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', finish);
    window.addEventListener('pointercancel', clean);
  });

  const removeSelected = contextSafe(() => {
    if (!selectedSticker) return;
    const id = selectedSticker;
    const element = boardRef.current.querySelector(`[data-sticker-id="${id}"]`);
    const remove = () => {
      setStickers((current) => current.filter((sticker) => sticker.id !== id));
      setSelectedSticker((current) => current === id ? null : current);
      setStatus('已取下选中的贴纸。');
    };
    if (element && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.to(element, { scale: 0, opacity: 0, rotation: 20, duration: 0.2, ease: 'power2.in', onComplete: remove });
    } else remove();
  });

  const moveSticker = contextSafe((event, item) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      const index = stickers.findIndex((sticker) => sticker.id === item.id);
      const next = stickers[index + 1] || stickers[index - 1];
      setStickers((current) => current.filter((sticker) => sticker.id !== item.id));
      setSelectedSticker(next?.id || null);
      setStatus('已取下选中的贴纸。');
      requestAnimationFrame(() => {
        const nextElement = next && boardRef.current.querySelector(`[data-sticker-id="${next.id}"]`);
        (nextElement || rootRef.current.querySelector('.sticker-options button'))?.focus();
      });
      return;
    }
    const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    if (!directions[event.key]) return;
    event.preventDefault();
    const [dx, dy] = directions[event.key];
    const distance = event.shiftKey ? 20 : 8;
    const maxX = Math.max(0, boardRef.current.clientWidth - event.currentTarget.offsetWidth);
    const maxY = Math.max(0, boardRef.current.clientHeight - event.currentTarget.offsetHeight);
    const x = Math.min(maxX, Math.max(0, item.x + dx * distance));
    const y = Math.min(maxY, Math.max(0, item.y + dy * distance));
    setStickers((current) => current.map((sticker) => sticker.id === item.id ? { ...sticker, x, y } : sticker));
    gsap.set(event.currentTarget, { x, y });
    Draggable.get(event.currentTarget)?.update();
  });

  const copyText = async () => {    const text = `${copy.title}\n\n${copy.body}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setStatus('文案已复制，去把它贴进喜欢的地方吧。');
    } catch {
      const temporary = document.createElement('textarea');
      temporary.value = text;
      temporary.style.position = 'fixed';
      temporary.style.opacity = '0';
      document.body.appendChild(temporary);
      temporary.select();
      const copiedNow = document.execCommand('copy');
      temporary.remove();
      if (copiedNow) setCopied(true);
      setStatus(copiedNow ? '文案已复制，去把它贴进喜欢的地方吧。' : '当前环境无法复制，请手动选择画布里的文字。');
    }
  };

  const exportImage = async () => {
    if (exporting) return;
    setExporting(true);
    setStatus('正在把这一页装进相框里…');
    try {
      const blob = await exportPaperPng({
        paper: paperRef.current,
        board: boardRef.current,
        copy,
        paperFont,
        edition: variation + 1,
        theme: paperTheme,
      });
      if (!blob) throw new Error('empty');
      const now = new Date();
      const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
      downloadBlob(blob, `maison-des-mots-${stamp}.png`);
      setStatus('图片已存到下载文件夹：3× 高清，带一处浅色桌面底。');
    } catch {
      setStatus('这张纸暂时没能导出，可以再试一次。');
    } finally {
      setExporting(false);
    }
  };

  const selectedLabel = stickerCatalog.find((item) => item.id === stickers.find((sticker) => sticker.id === selectedSticker)?.type)?.label;

  const currentFont = paperFonts.find((item) => item.id === paperFont) || paperFonts[0];

  const applyFont = (id) => {
    const font = paperFonts.find((item) => item.id === id);
    if (!font || id === paperFont) return;
    setPaperFont(id);
    setDipping(true);
    window.setTimeout(() => setDipping(false), 640);
    setStatus(`字迹换成${font.label}（${font.name}），墨迹干得很快。`);
  };

  const cycleFont = () => {
    const index = paperFonts.findIndex((item) => item.id === paperFont);
    applyFont(paperFonts[(index + 1) % paperFonts.length].id);
  };

  return (
    <section ref={rootRef} className={`studio pane-${pane}`} id="atelier" aria-labelledby="studio-title" tabIndex={-1}>
      <svg className="desk-grain" aria-hidden="true" focusable="false"><filter id="desk-grain"><feTurbulence type="fractalNoise" baseFrequency=".012 .38" numOctaves="4" seed="11" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter><rect width="100%" height="100%" filter="url(#desk-grain)" /></svg>
      <div className="studio-heading"><div><p className="kicker">L’atelier · 创作台</p><h2 id="studio-title">先写一段，<br /><em>再贴成你的样子。</em></h2></div><p>可以用灵感起稿，也可以自己写。自己写的字会原样落在纸上，不追加句子。</p></div>
      <div className="studio-tabs" role="tablist" aria-label="创作台两页">
        <button type="button" role="tab" aria-selected={pane === 'write'} aria-controls="studio-form" onClick={() => setPane('write')}><span>01</span>写作</button>
        <button type="button" role="tab" aria-selected={pane === 'read'} aria-controls="studio-paper" onClick={() => setPane('read')}><span>02</span>纸页</button>
      </div>
      <div className="studio-workspace">
        <form className="prompt-panel" id="studio-form" onSubmit={(event) => { event.preventDefault(); if (mode === 'custom') startCustomWriting(); else startGeneration(); }} noValidate>
          <div className="panel-caption"><span lang="fr">LA FORMULE</span><span>01 / 02</span></div>

          <div className="mode-switch" role="group" aria-label="写作方式">
            <button type="button" aria-pressed={mode === 'template'} onClick={() => switchMode('template')}>
              <span className="mode-switch__no">A</span>用灵感起稿
            </button>
            <button type="button" aria-pressed={mode === 'custom'} onClick={() => switchMode('custom')}>
              <span className="mode-switch__no">B</span>写自己的
            </button>
          </div>
          <p className="mode-hint" id="mode-hint">
            {mode === 'custom'
              ? '写自己的：原样上纸，不追加任何句子。'
              : '起稿会补成一封信；写自己的则原样上纸。'}
          </p>

          {mode === 'template' ? (
            <>
              <div className="form-block">
                <label className="form-label" htmlFor="topic"><span className="step-number">01</span><span>今天想写点什么？<small lang="fr">Un sujet, une émotion</small></span></label>
                <textarea id="topic" ref={topicRef} value={topic} maxLength={120} rows={4} required aria-required="true" aria-invalid={Boolean(error)} aria-describedby={error ? 'field-error' : 'topic-hint'} onChange={(event) => { setTopic(event.target.value); if (error) setError(''); }} />
                <div className="field-meta"><span id="topic-hint">一个物件、一家店，或一种心情</span><span>{topic.length} / 120</span></div>
              </div>
              <fieldset className="form-block tone-fieldset">
                <legend className="form-label"><span className="step-number">02</span><span>选择文字的语气<small lang="fr">Le ton de votre histoire</small></span></legend>
                <div className="tone-options">{tones.map((item) => (
                  <label className="tone-option" key={item.id}>
                    <input type="radio" name="tone" value={item.id} checked={tone === item.id} onChange={() => setTone(item.id)} />
                    <span><strong>{item.label}</strong><small lang="fr">{item.french}</small></span>
                  </label>
                ))}</div>
              </fieldset>
            </>
          ) : (
            <>
              <div className="form-block">
                <label className="form-label" htmlFor="custom-title"><span className="step-number">01</span><span>给这一页一个标题<small lang="fr">Un titre, si vous voulez</small></span></label>
                <input id="custom-title" className="title-input" type="text" value={customTitle} maxLength={40} placeholder="不写也可以" onChange={(event) => setCustomTitle(event.target.value)} />
              </div>
              <div className="form-block">
                <label className="form-label" htmlFor="custom-body"><span className="step-number">02</span><span>写下你的文案<small lang="fr">Vos mots, tels quels</small></span></label>
                <textarea id="custom-body" ref={customBodyRef} className="custom-body" value={customBody} maxLength={600} rows={7} required aria-required="true" aria-invalid={Boolean(error)} aria-describedby={error ? 'field-error' : 'custom-hint'} placeholder="直接写。纸会原样接住，不会替你补一句。" onChange={(event) => { setCustomBody(event.target.value); if (error) setError(''); }} />
                <div className="field-meta"><span id="custom-hint">换行也会保留在纸上</span><span>{customBody.length} / 600</span></div>
              </div>
            </>
          )}
          {error && <p className="field-error" id="field-error" role="alert">{error}</p>}
          <button className="generate-button" type="submit" aria-disabled={isGenerating} aria-busy={isGenerating}>
            <span>{isGenerating ? (mode === 'custom' ? '正在把字放上去' : '正在铺好纸页') : (mode === 'custom' ? '放到纸上' : '生成一页文案')}</span>
            {isGenerating ? <i className="small-spinner" aria-hidden="true" /> : <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3c.5 5 3 8 8 9-5 .5-7.5 3-8 9-.5-6-3-8.5-8-9 5-1 7.5-4 8-9Z" stroke="currentColor" strokeWidth="1.1" /></svg>}
          </button>
          <p className="local-note"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 9V6a5 5 0 0 1 10 0v3M4 9h12v9H4Z" stroke="currentColor" /></svg>{mode === 'custom' ? '自己写的内容只留在本地，不会上传' : '本地模板生成，内容不会上传'}</p>
        </form>

        <div className="preview-panel" id="studio-paper">
          <div className="preview-toolbar">
            <div className="panel-caption"><span lang="fr">LA PAGE</span><span>02 / 02</span></div>
            <div className="font-switch" role="group" aria-label="信纸正文字体">
              {paperFonts.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={paperFont === item.id}
                  onClick={() => applyFont(item.id)}
                  title={item.name}
                >{item.label}</button>
              ))}
            </div>
            <div className="speed-switch" role="group" aria-label="书写速度">
              <span>书写</span>
              {[{ v: 0.7, l: '慢' }, { v: 1, l: '常' }, { v: 1.6, l: '快' }].map((option) => (
                <button key={option.l} type="button" aria-pressed={speed === option.v} onClick={() => { setSpeed(option.v); setStatus(`书写速度：${option.l}。`); }}>{option.l}</button>
              ))}
            </div>
            <div className="paper-switch" role="group" aria-label="纸张颜色">
              <button type="button" aria-pressed={paperTheme === 'cream'} onClick={() => setPaperTheme('cream')}><i className="cream-dot" aria-hidden="true" />奶油纸</button>
              <button type="button" aria-pressed={paperTheme === 'blue'} onClick={() => setPaperTheme('blue')}><i className="blue-dot" aria-hidden="true" />雾蓝纸</button>
            </div>
          </div>
          <div ref={boardRef} className={`collage-board theme-${paperTheme} font-${paperFont}`}>
            <svg className="board-envelope" viewBox="0 0 320 240" aria-hidden="true">
              <ellipse cx="160" cy="206" rx="138" ry="9" fill="#1e2748" opacity=".07" />
              <rect x="17" y="40" width="286" height="167" rx="4" fill="#fffdf8" />
              <rect x="21" y="44" width="278" height="159" rx="2" fill="#fbf9f4" stroke="#1e2748" strokeWidth="1" strokeOpacity=".55" />
              <path d="M21 45 L166 140 L21 202 Z" fill="#dce2f1" fillOpacity=".5" stroke="#1e2748" strokeWidth="1" strokeOpacity=".3" />
              <path d="M299 45 L154 140 L299 202 Z" fill="#bfc8e0" fillOpacity=".28" stroke="#1e2748" strokeWidth="1" strokeOpacity=".3" />
              <path d="M22 202 L160 109 L298 202 Z" fill="#fbf9f4" stroke="#1e2748" strokeWidth="1" strokeOpacity=".4" />
              <path d="M23 49 L160 149 L297 49 Z" fill="#1e2748" opacity=".08" />
              <path d="M22 44 L160 140 L298 44 Z" fill="#fffdf8" stroke="#1e2748" strokeWidth="1" strokeOpacity=".5" />
              <path d="M28 46 L160 137 L292 46" fill="none" stroke="#ffffff" strokeWidth="1" />
              <rect x="253" y="54" width="31" height="35" fill="#fffdf8" />
              <rect x="256" y="57" width="25" height="29" fill="#e8c9d0" fillOpacity=".45" stroke="#46536f" strokeWidth="1" strokeDasharray="1 2" />
              <path d="M262 77 V65 L268 73 L275 65 V77" fill="none" stroke="#46536f" strokeWidth="1" />
              <path d="M108 174 H212 M123 183 H197" fill="none" stroke="#46536f" strokeWidth="1" opacity=".55" />
              <ellipse cx="161" cy="145" rx="20" ry="17" fill="#1e2748" opacity=".13" />
              <path d="M159 121 C166 119 170 125 176 128 S178 139 180 144 172 156 165 157 154 155 148 155 140 148 141 140 139 132 146 128 152 121 159 121 Z" fill="#e8c9d0" stroke="#46536f" strokeWidth="1" strokeOpacity=".45" />
              <path d="M160 146 Q151 141 151 135 Q158 135 160 141 Q162 135 169 135 Q169 141 160 146 Z" fill="none" stroke="#46536f" strokeWidth="1" opacity=".6" />
            </svg>
            <span className="board-corner board-corner-tl" aria-hidden="true" /><span className="board-corner board-corner-tr" aria-hidden="true" /><span className="board-corner board-corner-bl" aria-hidden="true" /><span className="board-corner board-corner-br" aria-hidden="true" />
            <span className="paper-underlay paper-underlay--b" aria-hidden="true" />
            <span className="paper-underlay paper-underlay--a" aria-hidden="true" />
            <article ref={paperRef} className="copy-paper" aria-label="生成的文案" aria-busy={isGenerating}>              <span className="copy-tape" aria-hidden="true" />
              <GeneratedCopy copy={copy} onTyped={completeGeneration} active={active} skipRef={skipWritingRef} onWriting={setWriting} speed={speed} />
              <div className="copy-paper-meta"><span>MAISON DES MOTS</span><span>N° {String(variation + 1).padStart(3, '0')}</span></div>
            </article>
            <span className="board-pocket" aria-hidden="true" />
            <Inkwell label={currentFont.label} dipping={dipping} onCycle={cycleFont} />
            {stickers.map((sticker, index) => (
              <button
                key={sticker.id}
                type="button"
                className={`board-sticker${selectedSticker === sticker.id ? ' is-selected' : ''}`}
                data-sticker-id={sticker.id}
                aria-label={`${stickerCatalog.find((item) => item.id === sticker.type)?.label}贴纸 ${index + 1}/${stickers.length}，方向键移动，Delete 删除`}
                aria-pressed={selectedSticker === sticker.id}
                onClick={() => setSelectedSticker(sticker.id)}
                onKeyDown={(event) => moveSticker(event, sticker)}
              >
                <StickerArt type={sticker.type} />
              </button>
            ))}
            <span className="board-pencil-note" aria-hidden="true" lang="fr">colle tes souvenirs ici</span>
            <span className={`copy-stamp${copied ? ' is-on' : ''}`} aria-hidden="true">COPIÉ</span>
          </div>
          <div className="board-actions">
            <button className="copy-button" type="button" onClick={copyText}>
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="6" y="6" width="10" height="11" stroke="currentColor" /><path d="M13 6V3H3v11h3" stroke="currentColor" /></svg>复制文案
            </button>
            <button className="export-button" type="button" onClick={exportImage} aria-busy={exporting} aria-disabled={exporting}>
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 3v9m0 0 3.5-3.5M10 12 6.5 8.5M3 13v3h14v-3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" /></svg>导出图片
            </button>
            <button type="button" className="quiet-button" aria-disabled={isGenerating} onClick={editCurrent}>编辑这段</button>
            {(isGenerating || writing) && <button type="button" className="quiet-button skip-button" onClick={skipWriting}>跳过书写</button>}
            <button type="button" className="quiet-button" aria-disabled={!selectedSticker} onClick={() => { if (!selectedSticker) return; removeSelected(); }}>取下{selectedLabel ? `「${selectedLabel}」` : '贴纸'}</button>
            <button type="button" className="quiet-button" aria-disabled={stickers.length === 0} onClick={() => { if (!stickers.length) return; setStickers([]); setSelectedSticker(null); setStatus('画布上的贴纸已清空。'); }}>清空贴纸</button>
          </div>
        </div>
      </div>

      <div className={`sticker-book${bookOpen ? ' is-open' : ''}`}>
        <span className="sticker-book__leaf sticker-book__leaf--b" aria-hidden="true" />
        <span className="sticker-book__leaf sticker-book__leaf--a" aria-hidden="true" />
        <button type="button" className="sticker-book__tab" aria-expanded={bookOpen} aria-controls="sticker-note" onClick={() => setBookOpen((open) => !open)}>
          <span className="sticker-book__clip" aria-hidden="true"><Paperclip /></span>
          <span className="sticker-book__stack" aria-hidden="true"><i /><i /><i /></span>
          <span className="sticker-book__label"><small lang="fr">LA PETITE COLLECTION</small><strong>贴纸簿</strong></span>
          <span className="sticker-book__count"><b>{String(stickers.length).padStart(2, '0')}</b>/08</span>
          <span className="sticker-book__mark" aria-hidden="true">{bookOpen ? '×' : '＋'}</span>
        </button>
        <div
          className="sticker-book__note"
          id="sticker-note"
          hidden={!bookOpen}
          style={{ transform: `translate(${noteOffset.x}px, ${noteOffset.y}px) rotate(-1.1deg)` }}
        >
          <span className="sticker-book__clip sticker-book__clip--note" aria-hidden="true"><Paperclip /></span>
          <span className="sticker-book__tape" aria-hidden="true" />
          <div className="sticker-book__head" onPointerDown={dragNote}>
            <span lang="fr">PLANCHE N° 02 · 10 PIÈCES</span>
            <p>点一枚贴到纸上，也可以直接拖过去。</p>
            <button type="button" className="sticker-book__close" onClick={() => setBookOpen(false)} aria-label="收起贴纸簿">收好</button>
          </div>
          <div className="sticker-book__grid">
            {stickerCatalog.map((sticker) => (
              <button
                type="button"
                key={sticker.id}
                className="sticker-chip"
                aria-label={`添加${sticker.label}贴纸，或拖到纸上`}
                onPointerDown={(event) => pullSticker(event, sticker.id)}
                onClick={(event) => { if (event.detail === 0) addSticker(sticker.id); }}
              >
                <span className="sticker-chip__art"><StickerArt type={sticker.id} /></span>
                <span className="sticker-chip__label">{sticker.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="studio-status" role="status" aria-live="polite"><span aria-hidden="true">✦</span>{status}</p>
    </section>
  );
});

export default Studio;

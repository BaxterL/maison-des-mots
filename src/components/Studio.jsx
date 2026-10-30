import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Draggable } from 'gsap/Draggable';
import { createCopy, initialCopy, tones } from '../data/copy';
import { StickerArt, stickerCatalog } from './StickerArt';

const firstStickers = [
  { id: 'rose-first', type: 'rose', x: 18, y: 42, rotation: -12 },
  { id: 'bottle-first', type: 'bottle', x: 2000, y: 360, rotation: 9 },
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

function Quill() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path className="quill-feather" d="M60 4C41 9 27 20 19 34 13 44 9 53 7 60c9-2 18-6 26-13C45 37 55 22 60 4Z" />
      <path className="quill-rib" d="M60 4C47 13 35 26 26 39" />
      <path className="quill-barb" d="M50 13c-3 3-5 6-6 10M43 22c-3 2-5 4-8 5M35 31c-3 2-5 3-8 4M28 41c-2 1-4 1-6 2" />
      <path className="quill-nib" d="M7 58l-4 6 6-2 2-4" />
      <circle className="quill-ink" cx="6" cy="59" r="2" />
    </svg>
  );
}

function GeneratedCopy({ copy, onTyped, active, skipRef, onWriting }) {
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

    const moveQuill = (element) => {
      if (!quill || !element) return;
      const currentBase = root.getBoundingClientRect();
      const rect = element.getBoundingClientRect();
      const x = rect.left - currentBase.left - 4;
      const y = rect.top - currentBase.top + rect.height * 0.6 - 40;
      gsap.to(quill, { x, y, duration: 0.16, ease: 'power2.out', overwrite: 'auto' });
    };

    gsap.set(chars, { opacity: 0, filter: 'blur(1.4px)' });
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
      delay: 0.22,
      onComplete: () => {
        if (skipRef) skipRef.current = null;
        onWriting?.(false);
        gsap.to(quill, { opacity: 0, duration: 0.22, ease: 'power1.in' });
        onTyped();
      },
    });
    timeline.to(quill, { opacity: 1, duration: 0.2 }, 0);

    const step = Math.min(0.17, 2.2 / Math.max(1, groups.length));
    let cursor = 0;
    groups.forEach((group) => {
      const visible = group.filter((index) => !tokens[index].space && !tokens[index].newline);
      const last = visible[visible.length - 1];
      if (last !== undefined) timeline.call(() => moveQuill(chars[last]), null, cursor);
      group.forEach((index, order) => {
        timeline.to(chars[index], {
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.12,
          ease: 'power1.out',
        }, cursor + Math.min(0.04, order * 0.02));
      });
      cursor += step;
    });
    timeline.from(root.querySelector('.generated-signature'), { opacity: 0, y: 6, duration: 0.45, ease: 'power3.out' }, '+=0.12');

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
      <span className="generated-note" lang="fr">{copy.note}</span>
      <h3 className="generated-title">{copy.title}</h3>
      <span className="generated-flourish" aria-hidden="true">✦</span>
      <p className="generated-body" aria-hidden="true">
        {tokens.map((token, index) => token.newline
          ? <span key={index} className="ink-token ink-space ink-newline"><br /></span>
          : <span key={index} className={`ink-token${token.space ? ' ink-space' : ''}${token.word ? ' ink-word' : ''}`}>{token.text}</span>)}
      </p>
      <span className="sr-only" aria-live="polite">{copy.body}</span>
      <span className="quill" ref={quillRef} aria-hidden="true"><Quill /></span>
      <span className="generated-signature" lang="fr">{copy.signature || 'avec tendresse,'}</span>
    </div>
  );
}

const Studio = forwardRef(function Studio({ active }, ref) {
  const rootRef = useRef(null);
  const boardRef = useRef(null);
  const paperRef = useRef(null);
  const topicRef = useRef(null);
  const customBodyRef = useRef(null);
  const delayRef = useRef(null);
  const skipWritingRef = useRef(null);
  const stickersRef = useRef(firstStickers);
  const newStickerRef = useRef(null);
  const [mode, setMode] = useState('template');
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

  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(false), 1100);
    return () => window.clearTimeout(timer);
  }, [copied]);

  useLayoutEffect(() => { stickersRef.current = stickers; }, [stickers]);
  useEffect(() => () => delayRef.current?.kill(), []);

  const { contextSafe } = useGSAP(() => {}, { scope: rootRef });

  useGSAP(() => {
    if (!active) return undefined;
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
        .from('.sticker-shelf', { opacity: 0, y: 18, duration: 0.55 }, '<0.08')
        .from('.studio-status', { opacity: 0, duration: 0.4 }, '<0.1');
    });
    return () => media.revert();
  }, { dependencies: [active], scope: rootRef, revertOnUpdate: true });

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
      title: customTitle.trim() || '无题',
      body,
      note: `Votre texte · Édition ${String(nextVariation).padStart(2, '0')}`,
      signature: 'vos mots,',
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
      if (!customBody.trim()) {
        setCustomTitle(copy.title);
        setCustomBody(copy.body);
      }
      setStatus('把纸上的字带出来了：删改后点「放到纸上」。');
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
    setMode('custom');
    setCustomTitle(copy.title);
    setCustomBody(copy.body);
    setError('');
    setStatus('已把纸上的文字带出来，改完点「放到纸上」。');
    requestAnimationFrame(() => customBodyRef.current?.focus({ preventScroll: true }));
  };

  const addSticker = contextSafe((type) => {
    if (stickers.length >= 8) {
      setStatus('一页最多放 8 枚贴纸，先移除一枚再试试。');
      return;
    }
    const id = `${type}-${Date.now()}`;
    const boardStyles = getComputedStyle(boardRef.current);
    const stickerWidth = parseFloat(boardStyles.getPropertyValue('--sticker-w')) || 92;
    const stickerHeight = parseFloat(boardStyles.getPropertyValue('--sticker-h')) || 110;
    const width = Math.max(1, boardRef.current.clientWidth - stickerWidth - 48);
    const height = Math.max(1, boardRef.current.clientHeight - stickerHeight - 48);
    const count = stickers.length;
    const sticker = {
      id,
      type,
      x: 24 + (count * 67) % width,
      y: 24 + (count * 83) % height,
      rotation: -12 + (count * 9) % 25,
    };
    newStickerRef.current = id;
    setSelectedSticker(id);
    setStickers((current) => [...current, sticker]);
    setStatus(`已添加${stickerCatalog.find((item) => item.id === type)?.label}，拖动它完成拼贴。`);
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

  const copyText = async () => {
    const text = `${copy.title}\n\n${copy.body}`;
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

  const selectedLabel = stickerCatalog.find((item) => item.id === stickers.find((sticker) => sticker.id === selectedSticker)?.type)?.label;

  return (
    <section ref={rootRef} className="studio" id="atelier" aria-labelledby="studio-title" tabIndex={-1}>
      <div className="studio-heading"><div><p className="kicker">L’atelier · 创作台</p><h2 id="studio-title">先写一段，<br /><em>再贴成你的样子。</em></h2></div><p>可以用灵感起稿，也可以自己写。自己写的字会原样落在纸上，不追加句子。</p></div>
      <div className="studio-workspace">
        <form className="prompt-panel" onSubmit={(event) => { event.preventDefault(); if (mode === 'custom') startCustomWriting(); else startGeneration(); }} noValidate>
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

        <div className="preview-panel">
          <div className="preview-toolbar">
            <div className="panel-caption"><span lang="fr">LA PAGE</span><span>02 / 02</span></div>
            <div className="paper-switch" role="group" aria-label="纸张颜色">
              <button type="button" aria-pressed={paperTheme === 'cream'} onClick={() => setPaperTheme('cream')}><i className="cream-dot" aria-hidden="true" />奶油纸</button>
              <button type="button" aria-pressed={paperTheme === 'blue'} onClick={() => setPaperTheme('blue')}><i className="blue-dot" aria-hidden="true" />雾蓝纸</button>
            </div>
          </div>
          <div ref={boardRef} className={`collage-board theme-${paperTheme}`}>
            <span className="board-corner board-corner-tl" aria-hidden="true" /><span className="board-corner board-corner-tr" aria-hidden="true" /><span className="board-corner board-corner-bl" aria-hidden="true" /><span className="board-corner board-corner-br" aria-hidden="true" />
            <article ref={paperRef} className="copy-paper" aria-label="生成的文案" aria-busy={isGenerating}>
              <span className="copy-tape" aria-hidden="true" />
              <GeneratedCopy copy={copy} onTyped={completeGeneration} active={active} skipRef={skipWritingRef} onWriting={setWriting} />
              <div className="copy-paper-meta"><span>MAISON DES MOTS</span><span>N° {String(variation + 1).padStart(3, '0')}</span></div>
            </article>
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
            <button type="button" className="quiet-button" aria-disabled={isGenerating} onClick={editCurrent}>编辑这段</button>
            {(isGenerating || writing) && <button type="button" className="quiet-button skip-button" onClick={skipWriting}>跳过书写</button>}
            <button type="button" className="quiet-button" aria-disabled={!selectedSticker} onClick={() => { if (!selectedSticker) return; removeSelected(); }}>取下{selectedLabel ? `「${selectedLabel}」` : '贴纸'}</button>
            <button type="button" className="quiet-button" aria-disabled={stickers.length === 0} onClick={() => { if (!stickers.length) return; setStickers([]); setSelectedSticker(null); setStatus('画布上的贴纸已清空。'); }}>清空贴纸</button>
          </div>
        </div>
      </div>

      <div className="sticker-shelf">
        <div className="shelf-label"><span lang="fr">LA PETITE COLLECTION</span><strong>选一枚，贴上去</strong><small>拖动移位 · 方向键微调 · Delete 删除</small></div>
        <div className="sticker-options">{stickerCatalog.map((sticker) => (
          <button type="button" key={sticker.id} onClick={() => addSticker(sticker.id)} aria-label={`添加${sticker.label}贴纸`}>
            <span className="sticker-option-art"><StickerArt type={sticker.id} /></span>
            <span>{sticker.label}</span>
          </button>
        ))}</div>
        <div className="sticker-count"><strong>{String(stickers.length).padStart(2, '0')}</strong><span>/ 08<br />枚贴纸</span></div>
      </div>
      <p className="studio-status" role="status" aria-live="polite"><span aria-hidden="true">✦</span>{status}</p>
    </section>
  );
});

export default Studio;

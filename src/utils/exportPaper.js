const STICKER_CSS = `
.sticker-svg [fill="#263b54"] { fill: #1e2748; }
.sticker-svg [stroke="#263b54"] { stroke: #1e2748; }
.sticker-svg [fill="#d8e1e5"] { fill: #dce2f1; }
.sticker-svg [stroke="#d8e1e5"] { stroke: #dce2f1; }
.sticker-svg [fill="#879eae"] { fill: #a9b3cc; }
.sticker-svg [stroke="#879eae"] { stroke: #5c6884; }
.sticker-svg [fill="#f7f2e8"] { fill: #fffdf8; }
.sticker-svg [stroke="#f7f2e8"] { stroke: #fffdf8; }
.stk-edge { fill: #fffdf8; stroke: #fffdf8; stroke-width: 9; stroke-linejoin: round; stroke-linecap: round; }
.stk-line { fill: #fffdf8; stroke: #1e2748; stroke-width: 1.1; stroke-linecap: round; stroke-linejoin: round; }
.stk-leaf { fill: #dce2f1; }
.stk-detail { fill: none; stroke: #5c6884; stroke-width: 1.1; stroke-linecap: round; }
.stk-hi { fill: none; stroke: #fffdf8; stroke-width: 1.1; }
.stk-label { font-family: 'Special Elite', monospace; font-size: 9px; letter-spacing: .08em; fill: #1e2748; }
`;

const FONTS = {
  kai: { body: '"LXGW WenKai", serif', title: '"LXGW WenKai", serif', titleWeight: 700 },
  song: { body: '"Noto Serif SC", serif', title: '"Noto Serif SC", serif', titleWeight: 500 },
  latin: { body: '"Cormorant Garamond", "Noto Serif SC", serif', title: '"LXGW WenKai", serif', titleWeight: 700 },
  kuaile: { body: '"ZCOOL KuaiLe", serif', title: '"ZCOOL KuaiLe", serif', titleWeight: 400 },
  huangyou: { body: '"ZCOOL QingKe HuangYou", serif', title: '"ZCOOL QingKe HuangYou", serif', titleWeight: 400 },
};

function wrapLines(ctx, text, maxWidth) {
  const lines = [];
  for (const paragraph of text.split('\n')) {
    if (!paragraph) {
      lines.push('');
      continue;
    }
    let line = '';
    for (const char of paragraph) {
      const next = line + char;
      if (line && ctx.measureText(next).width > maxWidth) {
        lines.push(line);
        line = char;
      } else {
        line = next;
      }
    }
    lines.push(line);
  }
  return lines;
}

function drawJustified(ctx, line, x, y, maxWidth, justify) {
  if (!justify || line.length < 2) {
    ctx.fillText(line, x, y);
    return;
  }
  const widths = [...line].map((char) => ctx.measureText(char).width);
  const total = widths.reduce((sum, width) => sum + width, 0);
  const gap = (maxWidth - total) / (line.length - 1);
  let cursor = x;
  [...line].forEach((char, index) => {
    ctx.fillText(char, cursor, y);
    cursor += widths[index] + gap;
  });
}

function transformOf(el) {
  const style = window.getComputedStyle(el);
  const matrix = new DOMMatrixReadOnly(style.transform === 'none' ? undefined : style.transform);
  return {
    x: matrix.m41,
    y: matrix.m42,
    rotation: Math.atan2(matrix.m12, matrix.m11) * (180 / Math.PI),
  };
}

async function stickerImage(svg, width, height) {
  const clone = svg.cloneNode(true);
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', String(width));
  clone.setAttribute('height', String(height));
  const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  style.textContent = STICKER_CSS;
  clone.insertBefore(style, clone.firstChild);
  const source = new XMLSerializer().serializeToString(clone);
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`;
  const image = new Image();
  image.decoding = 'sync';
  image.src = url;
  await image.decode().catch(() => new Promise((resolve) => { image.onload = resolve; image.onerror = resolve; }));
  return image;
}

export async function exportPaperPng({ paper, board, copy, paperFont, edition = 1, theme = 'cream' }) {
  const width = paper.offsetWidth;
  const height = paper.offsetHeight;
  const scale = 3;
  const margin = 72;
  const canvas = document.createElement('canvas');
  canvas.width = Math.round((width + margin * 2) * scale);
  canvas.height = Math.round((height + margin * 2) * scale);
  const ctx = canvas.getContext('2d');

  // pale linen desk behind the sheet, so the PNG reads as a flat-lay photo
  const backdrop = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  backdrop.addColorStop(0, '#f2f5fb');
  backdrop.addColorStop(0.52, '#e4eaf5');
  backdrop.addColorStop(1, '#d6dfef');
  ctx.fillStyle = backdrop;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const glow = ctx.createRadialGradient(canvas.width * 0.3, 0, 0, canvas.width * 0.3, 0, canvas.width);
  glow.addColorStop(0, 'rgba(255,255,255,.8)');
  glow.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'rgba(30,39,72,.05)';
  ctx.lineWidth = 1;
  for (let y = 0; y < canvas.height; y += 6) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(canvas.width, y + 0.5);
    ctx.stroke();
  }
  for (let x = 0; x < canvas.width; x += 8) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, canvas.height);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(30,39,72,.08)';
  ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);

  ctx.scale(scale, scale);
  ctx.translate(margin, margin);
  ctx.textBaseline = 'top';

  const family = FONTS[paperFont] || FONTS.kai;
  const font = (size, weight = 500, stack = family.body) => `${weight} ${size}px ${stack}`;

  await Promise.all([
    document.fonts.load(font(15.5, 500)),
    document.fonts.load(font(30, family.titleWeight, family.title)),
    document.fonts.load('400 37px "Pinyon Script"'),
    document.fonts.load('400 9px "Special Elite"'),
  ]).catch(() => {});

  // paper body + contact shadow (a small transparent margin keeps the shadow visible)
  const radius = 3;
  ctx.save();
  ctx.shadowColor = 'rgba(30, 39, 72, .22)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 12;
  const sheet = ctx.createLinearGradient(0, 0, width, height);
  if (theme === 'blue') {
    sheet.addColorStop(0, '#eef2fc');
    sheet.addColorStop(1, '#dbe3f3');
  } else {
    sheet.addColorStop(0, '#fffdf8');
    sheet.addColorStop(1, '#f7f1e3');
  }
  ctx.fillStyle = sheet;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(0, 0, width, height, radius);
  else ctx.rect(0, 0, width, height);
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = 'rgba(30, 39, 72, .42)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(0.5, 0.5, width - 1, height - 1, radius);
  else ctx.rect(0.5, 0.5, width - 1, height - 1);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(30, 39, 72, .16)';
  ctx.strokeRect(9.5, 9.5, width - 19, height - 19);

  // stickers underneath the letter? stickers sit above the paper on screen
  const padX = 42;
  const contentWidth = width - padX * 2;
  let y = 43;

  if (!copy.custom && copy.note) {
    ctx.fillStyle = '#1e2748';
    ctx.font = '400 9px "Special Elite", monospace';
    ctx.letterSpacing = '0.9px';
    ctx.textAlign = 'center';
    ctx.fillText(copy.note.toUpperCase(), width / 2, y);
    y += 20;
  }

  const title = copy.title?.trim();
  if (title) {
    const titleSize = Math.min(30, Math.max(22, 30 - Math.max(0, title.length - 10) * 0.4));
    ctx.font = font(titleSize, family.titleWeight, family.title);
    ctx.letterSpacing = '0.9px';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const lines = wrapLines(ctx, title, contentWidth);
    lines.forEach((line, index) => {
      ctx.fillText(line, width / 2, y + index * titleSize * 1.45);
    });
    y += lines.length * titleSize * 1.45 + 8;
  }

  ctx.font = '400 11px "Noto Serif SC", serif';
  ctx.fillStyle = '#5c6884';
  ctx.textAlign = 'center';
  ctx.fillText('✦', width / 2, y + 2);
  y += 26;

  // body: shrink to fit the sheet rather than spilling over the edge
  let bodySize = 15.5;
  let lines = [];
  let lineHeight = bodySize * 2;
  const bodyTop = y;
  let bodyBottom = height;
  for (let attempt = 0; attempt < 9; attempt += 1) {
    lineHeight = bodySize * 2;
    ctx.font = font(bodySize, 500);
    ctx.letterSpacing = '0.78px';
    lines = wrapLines(ctx, (copy.body || '').replace(/\r\n/g, '\n'), contentWidth);
    bodyBottom = bodyTop + lines.length * lineHeight;
    if (bodyBottom <= height - 92) break;
    bodySize -= 0.5;
  }
  ctx.textAlign = 'left';
  ctx.fillStyle = '#1e2748';
  lines.forEach((line, index) => {
    const isLastOfParagraph = index === lines.length - 1 || lines[index + 1] === '';
    drawJustified(ctx, line, padX, bodyTop + index * lineHeight, contentWidth, !isLastOfParagraph && line.length > 6);
  });

  // signature
  if (!copy.custom && copy.signature) {
    ctx.letterSpacing = '0px';
    ctx.font = '400 37px "Pinyon Script", cursive';
    ctx.fillStyle = '#1e2748';
    ctx.textAlign = 'right';
    ctx.save();
    ctx.translate(width - padX, Math.min(Math.max(bodyBottom + 22, height - 92), height - 58));
    ctx.rotate((-5 * Math.PI) / 180);
    ctx.fillText(copy.signature, 0, 0);
    ctx.restore();
  }
  bodyBottom += 20;

  // footer
  ctx.letterSpacing = '0.8px';
  ctx.font = '400 8px "Special Elite", monospace';
  ctx.fillStyle = '#1e2748';
  ctx.textAlign = 'left';
  ctx.fillText('MAISON DES MOTS', padX, height - 30);
  ctx.textAlign = 'right';
  ctx.fillText(copy.custom ? 'VOS MOTS' : `N° ${String(edition).padStart(3, '0')}`, width - padX, height - 30);
  ctx.strokeStyle = 'rgba(30, 39, 72, .16)';
  ctx.beginPath();
  ctx.moveTo(padX, height - 38);
  ctx.lineTo(width - padX, height - 38);
  ctx.stroke();

  // stickers sitting on the paper
  if (board) {
    const paperRect = paper.getBoundingClientRect();
    const nodes = board.querySelectorAll('.board-sticker');
    for (const node of nodes) {
      const svg = node.querySelector('svg');
      if (!svg) continue;
      const rect = node.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const relX = centerX - paperRect.left;
      const relY = centerY - paperRect.top;
      const stickerW = rect.width;
      const stickerH = rect.height;
      if (relX < -stickerW / 3 || relX > width + stickerW / 3 || relY < -stickerH / 3 || relY > height + stickerH / 3) continue;
      const image = await stickerImage(svg, stickerW, stickerH);
      const { rotation } = transformOf(node);
      ctx.save();
      ctx.translate(relX, relY);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(image, -stickerW / 2, -stickerH / 2, stickerW, stickerH);
      ctx.restore();
    }
  }

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}

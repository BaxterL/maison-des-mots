import React from 'react';

export const stickerCatalog = [
  { id: 'bottle', label: '香水瓶' },
  { id: 'rose', label: '蓝玫瑰' },
  { id: 'stamp', label: '邮票' },
  { id: 'key', label: '旧钥匙' },
  { id: 'bow', label: '缎带蝴蝶结' },
  { id: 'moon', label: '月亮挂坠' },
  { id: 'letter', label: '折叠书信' },
  { id: 'frame', label: '浮雕相框' },
  { id: 'window', label: '法式窗扇' },
  { id: 'herbier', label: '植物标本夹' },
];

function FoldedLetterSticker() {
  return (
    <svg viewBox="0 0 120 140" className="sticker-svg" aria-hidden="true" focusable="false">
      <path className="stk-edge" d="M12 49 95 31 108 91 25 109Z" />
      <g className="stk-line" transform="rotate(-3 60 70)">
        <path d="M14 48 95 34 105 94 25 108Z" fill="#d8e1e5" />
        <path d="M12 46 93 32 104 91 23 105Z" />
        <path d="M13 47 60 72 93 33M24 104 60 72 103 90" fill="none" />
        <path className="stk-detail" d="M17 49 59 76 89 39M27 102 101 89" />
        <path d="M78 35 96 43 91 56Z" fill="#263b54" fillOpacity=".12" stroke="none" />
        <path d="M78 35Q88 33 93 32L96 46Q84 43 78 35Z" fill="#d8e1e5" fillOpacity=".4" />
        <path className="stk-hi" d="M80 35Q88 35 92 34" />
      </g>
    </svg>
  );
}

function OvalFrameSticker() {
  return (
    <svg viewBox="0 0 120 140" className="sticker-svg" aria-hidden="true" focusable="false">
      <path className="stk-edge" d="M60 7Q72 15 69 24C90 32 96 52 94 77C92 110 78 131 60 131S28 110 26 77C24 52 30 32 51 24Q50 14 60 7Z" />
      <g className="stk-line">
        <ellipse cx="60" cy="76" rx="34" ry="54" fill="#d8e1e5" fillOpacity=".4" />
        <ellipse cx="60" cy="76" rx="29" ry="49" />
        <ellipse cx="60" cy="76" rx="24" ry="44" />
        <path className="stk-detail" d="M60 25C42 25 29 47 29 76S42 127 60 127M62 29C78 32 86 52 86 76S77 119 62 123" />
        <ellipse className="stk-hi" cx="60" cy="76" rx="32" ry="52" />
        <ellipse className="stk-hi" cx="60" cy="76" rx="25.5" ry="45.5" />
        <path d="M60 28C49 25 49 14 60 7C70 14 72 23 60 28Z" fill="#d8e1e5" fillOpacity=".4" />
        <path className="stk-detail" d="M60 10V29M60 21 55 16M60 24 65 18" />
        <path d="M29 69 32 76 29 83M91 69 88 76 91 83M54 127 60 123 66 127" fill="none" />
        <path className="stk-detail" d="M38 43 41 46M33 54 36 56M35 98 38 96M43 115 45 112M82 43 79 46M87 54 84 56M85 98 82 96M77 115 75 112" />
      </g>
    </svg>
  );
}

function FrenchWindowSticker() {
  return (
    <svg viewBox="0 0 120 140" className="sticker-svg" aria-hidden="true" focusable="false">
      <path className="stk-edge" d="M14 17H106V117H14Z" />
      <g className="stk-line">
        <path d="M20 19H100V116H20Z" />
        <path d="M24 23H96V112H24Z" fill="none" />
        <path d="M51 25C56 46 46 63 56 87L80 111C68 81 82 49 78 25Z" fill="#d8e1e5" fillOpacity=".12" stroke="none" />
        <path className="stk-detail" d="M67 26C73 48 61 66 74 96M77 26C82 48 73 74 83 102M62 26H90" />
        <path d="M20 19 49 29V106L20 116ZM100 19 71 29V106L100 116Z" fill="#d8e1e5" fillOpacity=".1" />
        <path d="M24 25 45 32V103L24 110ZM96 25 75 32V103L96 110Z" fill="none" />
        <path d="M34.5 28.5V106.5M85.5 28.5V106.5M24 53.3 45 55.7M24 81.7 45 79.3M96 53.3 75 55.7M96 81.7 75 79.3" fill="none" />
        <path d="M16 35H20V43H16ZM16 92H20V100H16ZM100 35H104V43H100ZM100 92H104V100H100Z" fill="#d8e1e5" />
        <path d="M47 64V72M73 64V72" fill="none" />
      </g>
    </svg>
  );
}

function HerbierSticker() {
  return (
    <svg viewBox="0 0 120 140" className="sticker-svg" aria-hidden="true" focusable="false">
      <defs>
        <g id="sticker-ginkgo-leaf">
          <path className="stk-edge" d="M0 0Q-16 -5 -17 -20Q-13 -25 -9 -23Q-5 -28 0 -23Q5 -28 9 -23Q13 -25 17 -20Q16 -5 0 0Z" />
          <path className="stk-line stk-leaf" d="M0 0Q-16 -5 -17 -20Q-13 -25 -9 -23Q-5 -28 0 -23Q5 -28 9 -23Q13 -25 17 -20Q16 -5 0 0Z" />
          <path className="stk-detail" d="M0 -1 -13 -20M0 -1 -7 -22M0 -1V-21M0 -1 7 -22M0 -1 13 -20" />
        </g>
      </defs>
      <path d="M54 127Q65 88 59 31M59 57 40 43M61 77 83 57M60 92 34 77M58 108 83 88" fill="none" stroke="#f7f2e8" strokeWidth="5.1" strokeLinecap="round" />
      <path className="stk-line" d="M54 127Q65 88 59 31M59 57 40 43M61 77 83 57M60 92 34 77M58 108 83 88" fill="none" />
      <use href="#sticker-ginkgo-leaf" transform="translate(59 33) scale(.72)" />
      <use href="#sticker-ginkgo-leaf" transform="translate(41 44) rotate(-40) scale(.78)" />
      <use href="#sticker-ginkgo-leaf" transform="translate(81 58) rotate(38) scale(.85)" />
      <use href="#sticker-ginkgo-leaf" transform="translate(35 78) rotate(-55) scale(.86)" />
      <use href="#sticker-ginkgo-leaf" transform="translate(81 89) rotate(48) scale(.8)" />
      <g transform="rotate(-6 60 111)">
        <path className="stk-edge" d="M37 105H85V117H37Z" />
        <path className="stk-line" d="M37 105H85V117H37Z" />
        <text className="stk-label" x="43" y="114">N° 03</text>
      </g>
    </svg>
  );
}


function BottleSticker() {
  return (
    <svg viewBox="0 0 120 140" className="sticker-svg" aria-hidden="true" focusable="false">
      <g strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M60 9 L72 15 L77 29 L69 40 V46 L74 49 C87 53 95 65 96 80 L98 108 Q98 123 83 124 H37 Q22 123 22 108 L24 80 C25 65 33 53 46 49 L51 46 V40 L43 29 L48 15 Z"
          fill="#f7f2e8"
          stroke="#f7f2e8"
          strokeWidth="9"
        />
        <path
          d="M49 17 L60 12 L71 17 L74 29 L66 39 H54 L46 29 Z"
          fill="#d8e1e5"
          stroke="#263b54"
          strokeWidth="1.5"
        />
        <path d="M60 12 V38 M49 17 L54 29 L46 29 M71 17 L66 29 L74 29 M54 29 H66" fill="none" stroke="#879eae" strokeWidth="1" />
        <path d="M52 38 H68 V50 H52 Z" fill="#f7f2e8" stroke="#263b54" strokeWidth="1.4" />
        <path d="M49 47 H71 V53 H49 Z" fill="#879eae" stroke="#263b54" strokeWidth="1.3" />
        <path
          d="M50 52 C36 55 29 65 28 79 L26 108 Q26 119 37 120 H83 Q94 119 94 108 L92 79 C91 65 84 55 70 52 Z"
          fill="#d8e1e5"
          stroke="#263b54"
          strokeWidth="1.6"
        />
        <path
          d="M29 96 C43 91 76 101 93 94 L94 108 Q94 118 83 119 H37 Q27 118 27 108 Z"
          fill="#879eae"
          opacity="0.22"
        />
        <path d="M37 64 C33 73 33 83 33 91 M34 105 Q34 112 41 113" fill="none" stroke="#f7f2e8" strokeWidth="2.2" />
        <path d="M83 63 C87 73 87 82 87 88" fill="none" stroke="#879eae" strokeWidth="1" />
        <path
          d="M42 76 Q60 70 78 76 L77 103 Q60 109 43 103 Z"
          fill="#f7f2e8"
          stroke="#263b54"
          strokeWidth="1.1"
        />
        <path d="M45 79 Q60 74 75 79 L74 100 Q60 105 46 100 Z" fill="none" stroke="#879eae" strokeWidth="0.75" />
        <text x="60" y="86" textAnchor="middle" fill="#263b54" fontFamily="Georgia, serif" fontSize="6.4" letterSpacing="1">PARFUM</text>
        <text x="60" y="98" textAnchor="middle" fill="#263b54" fontFamily="Georgia, serif" fontSize="12" fontStyle="italic">Bleu</text>
        <path d="M52 101 H68" fill="none" stroke="#879eae" strokeWidth="0.7" />
        <circle cx="60" cy="57" r="1.2" fill="#263b54" />
      </g>
    </svg>
  );
}

function RoseSticker() {
  return (
    <svg viewBox="0 0 120 140" className="sticker-svg" aria-hidden="true" focusable="false">
      <g strokeLinecap="round" strokeLinejoin="round">
        <g fill="#f7f2e8" stroke="#f7f2e8" strokeWidth="8">
          <path d="M60 19 C69 13 80 19 82 27 C92 27 97 39 91 47 C95 58 85 68 75 67 C69 77 55 77 49 69 C38 72 28 63 30 53 C21 45 27 32 37 31 C40 20 51 16 60 19 Z" />
          <path d="M60 66 C57 84 63 103 58 123" fill="none" />
          <path d="M57 92 C46 78 32 79 28 84 C31 97 43 103 57 96 Z" />
          <path d="M60 105 C69 91 84 89 89 94 C85 107 74 114 60 109 Z" />
        </g>
        <path d="M60 66 C57 84 63 103 58 123" fill="none" stroke="#263b54" strokeWidth="2" />
        <path d="M62 75 C60 89 64 103 61 116" fill="none" stroke="#879eae" strokeWidth="0.8" />
        <path d="M57 92 C46 78 32 79 28 84 C31 97 43 103 57 96 Z" fill="#d8e1e5" stroke="#263b54" strokeWidth="1.4" />
        <path d="M60 105 C69 91 84 89 89 94 C85 107 74 114 60 109 Z" fill="#d8e1e5" stroke="#263b54" strokeWidth="1.4" />
        <path d="M31 85 C41 87 48 91 56 95 M86 95 C76 98 69 103 61 108" fill="none" stroke="#879eae" strokeWidth="1" />
        <path d="M39 88 L36 82 M45 91 L43 84 M77 100 L80 94 M70 104 L72 97" fill="none" stroke="#879eae" strokeWidth="0.75" />
        <path d="M42 63 L50 74 L59 68 L67 75 L78 63 L72 78 H49 Z" fill="#879eae" stroke="#263b54" strokeWidth="1.2" />
        <path
          d="M60 19 C69 13 80 19 82 27 C92 27 97 39 91 47 C95 58 85 68 75 67 C69 77 55 77 49 69 C38 72 28 63 30 53 C21 45 27 32 37 31 C40 20 51 16 60 19 Z"
          fill="#d8e1e5"
          stroke="#263b54"
          strokeWidth="1.5"
        />
        <path
          d="M42 39 C45 27 60 24 69 30 C79 27 87 37 82 46 C86 55 73 65 64 59 C54 67 41 60 43 51 C35 49 35 42 42 39 Z"
          fill="#879eae"
          fillOpacity="0.3"
          stroke="#263b54"
          strokeWidth="1.05"
        />
        <path
          d="M51 39 C53 31 65 29 71 36 C80 39 75 50 68 51 C63 59 52 54 54 47 C46 47 45 42 51 39 Z"
          fill="#d8e1e5"
          stroke="#263b54"
          strokeWidth="1"
        />
        <path d="M58 43 C58 37 68 36 70 41 C72 47 63 50 60 46 C57 43 61 40 64 42" fill="none" stroke="#263b54" strokeWidth="1.25" />
        <path d="M37 34 C34 40 35 45 39 48 M47 24 C52 21 58 22 61 25 M78 31 C84 34 85 40 82 44 M35 56 C39 63 45 64 50 62 M70 64 C77 64 82 60 84 55" fill="none" stroke="#879eae" strokeWidth="0.9" />
        <path d="M48 36 C52 32 57 31 61 32 M45 52 C48 55 51 56 55 55 M70 53 C75 52 78 49 78 45" fill="none" stroke="#f7f2e8" strokeWidth="1.2" />
      </g>
    </svg>
  );
}

function StampSticker() {
  return (
    <svg viewBox="0 0 120 140" className="sticker-svg" aria-hidden="true" focusable="false">
      <g transform="rotate(-4 60 70)" strokeLinecap="round" strokeLinejoin="round">
        <rect x="18" y="11" width="84" height="118" rx="2" fill="#f7f2e8" stroke="#f7f2e8" strokeWidth="9" />
        <rect x="21" y="14" width="78" height="112" rx="1" fill="#f7f2e8" stroke="#263b54" strokeWidth="1.2" strokeDasharray="1 3" />
        <rect x="27" y="20" width="66" height="100" fill="none" stroke="#879eae" strokeWidth="1" />
        <path d="M31 35 H89 M31 104 H89" fill="none" stroke="#263b54" strokeWidth="0.8" />
        <text x="60" y="30" textAnchor="middle" fill="#263b54" fontFamily="Georgia, serif" fontSize="7.5" letterSpacing="2">POSTES</text>
        <text x="33" y="44" fill="#263b54" fontFamily="Georgia, serif" fontSize="8">20</text>
        <text x="86" y="43" textAnchor="end" fill="#263b54" fontFamily="Georgia, serif" fontSize="7" fontStyle="italic">c</text>
        <ellipse cx="60" cy="70" rx="23" ry="30" fill="#d8e1e5" stroke="#263b54" strokeWidth="1.2" />
        <ellipse cx="60" cy="70" rx="20" ry="27" fill="none" stroke="#879eae" strokeWidth="0.65" />
        <path d="M39 94 H81 M43 91 H77" fill="none" stroke="#263b54" strokeWidth="1" />
        <path d="M60 43 C58 58 53 75 45 90 M60 43 C62 58 67 75 75 90" fill="none" stroke="#263b54" strokeWidth="1.35" />
        <path d="M60 47 V87 M55 59 H65 M52 69 H68 M49 79 H71 M45 89 H75" fill="none" stroke="#263b54" strokeWidth="1" />
        <path d="M51 90 Q60 78 69 90 M54 69 L57 79 M66 69 L63 79 M56 59 L58 69 M64 59 L62 69" fill="none" stroke="#879eae" strokeWidth="0.9" />
        <path d="M58 48 H62 M59 45 H61" fill="none" stroke="#263b54" strokeWidth="0.8" />
        <path d="M34 52 L35.5 55 L34 58 L32.5 55 Z M86 52 L87.5 55 L86 58 L84.5 55 Z" fill="#879eae" />
        <text x="60" y="111" textAnchor="middle" fill="#263b54" fontFamily="Georgia, serif" fontSize="5.8" letterSpacing="0.7">RÉPUBLIQUE</text>
        <text x="60" y="118" textAnchor="middle" fill="#263b54" fontFamily="Georgia, serif" fontSize="6.8" letterSpacing="1.5">FRANCE</text>
      </g>
    </svg>
  );
}

function KeySticker() {
  return (
    <svg viewBox="0 0 120 140" className="sticker-svg" aria-hidden="true" focusable="false">
      <g transform="rotate(-32 60 70)" strokeLinecap="round" strokeLinejoin="round">
        <g fill="#f7f2e8" stroke="#f7f2e8" strokeWidth="8">
          <path d="M60 16 C72 9 85 17 84 29 C94 35 88 49 77 50 C74 60 65 62 60 56 C55 62 46 60 43 50 C32 49 26 35 36 29 C35 17 48 9 60 16 Z" />
          <path d="M54 51 H66 V97 H80 V103 H75 V110 H81 V117 H66 V122 H54 Z" />
        </g>
        <path
          d="M60 16 C72 9 85 17 84 29 C94 35 88 49 77 50 C74 60 65 62 60 56 C55 62 46 60 43 50 C32 49 26 35 36 29 C35 17 48 9 60 16 Z"
          fill="#d8e1e5"
          stroke="#263b54"
          strokeWidth="1.5"
        />
        <ellipse cx="60" cy="34" rx="11" ry="14" fill="#f7f2e8" stroke="#263b54" strokeWidth="1.25" />
        <ellipse cx="60" cy="34" rx="8" ry="11" fill="none" stroke="#879eae" strokeWidth="0.8" />
        <path d="M42 27 C46 22 50 21 53 23 M67 23 C72 20 78 24 78 29 M39 37 C40 43 45 46 49 44 M71 45 C77 47 82 42 81 37" fill="none" stroke="#879eae" strokeWidth="1" />
        <circle cx="60" cy="18.5" r="1.3" fill="#263b54" />
        <circle cx="37.5" cy="32" r="1.2" fill="#263b54" />
        <circle cx="82.5" cy="32" r="1.2" fill="#263b54" />
        <path d="M56 53 H64 V117 H56 Z" fill="#d8e1e5" stroke="#263b54" strokeWidth="1.4" />
        <path d="M64 96 H80 V103 H75 V110 H81 V117 H64 Z" fill="#d8e1e5" stroke="#263b54" strokeWidth="1.4" />
        <path d="M51 51 H69 V57 H51 Z M52 60 H68 V64 H52 Z" fill="#f7f2e8" stroke="#263b54" strokeWidth="1.2" />
        <path d="M60 66 V111 M67 99 H75 M67 113 H76" fill="none" stroke="#879eae" strokeWidth="1" />
        <path d="M55 116 H65 V121 H55 Z" fill="#879eae" stroke="#263b54" strokeWidth="1.2" />
        <path d="M58 68 V91" fill="none" stroke="#f7f2e8" strokeWidth="1.1" />
      </g>
    </svg>
  );
}

function BowSticker() {
  return (
    <svg viewBox="0 0 120 140" className="sticker-svg" aria-hidden="true" focusable="false">
      <g strokeLinecap="round" strokeLinejoin="round">
        <g fill="#f7f2e8" stroke="#f7f2e8" strokeWidth="8">
          <path d="M54 65 C47 79 43 98 34 116 L48 111 L53 123 C60 100 61 82 60 68 Z" />
          <path d="M66 65 C73 79 77 98 86 116 L72 111 L67 123 C60 100 59 82 60 68 Z" />
          <path d="M55 58 C44 40 26 29 21 39 C14 52 29 72 53 67 L58 63 Z" />
          <path d="M65 58 C76 40 94 29 99 39 C106 52 91 72 67 67 L62 63 Z" />
          <path d="M51 54 Q60 50 69 54 L68 71 Q60 76 52 71 Z" />
        </g>
        <path d="M54 65 C47 79 43 98 34 116 L48 111 L53 123 C60 100 61 82 60 68 Z" fill="#d8e1e5" stroke="#263b54" strokeWidth="1.45" />
        <path d="M66 65 C73 79 77 98 86 116 L72 111 L67 123 C60 100 59 82 60 68 Z" fill="#d8e1e5" stroke="#263b54" strokeWidth="1.45" />
        <path d="M54 73 C50 88 46 103 42 111 L49 108 L53 115 C57 96 58 82 58 74 Z" fill="#879eae" opacity="0.3" />
        <path d="M66 73 C70 88 74 103 78 111 L71 108 L67 115 C63 96 62 82 62 74 Z" fill="#879eae" opacity="0.3" />
        <path d="M48 80 C45 92 42 103 39 109 M72 80 C75 92 78 103 81 109" fill="none" stroke="#f7f2e8" strokeWidth="1" strokeDasharray="2 2" />
        <path d="M55 58 C44 40 26 29 21 39 C14 52 29 72 53 67 L58 63 Z" fill="#d8e1e5" stroke="#263b54" strokeWidth="1.5" />
        <path d="M65 58 C76 40 94 29 99 39 C106 52 91 72 67 67 L62 63 Z" fill="#d8e1e5" stroke="#263b54" strokeWidth="1.5" />
        <path d="M51 58 C39 43 27 38 26 44 C25 52 37 62 52 62 Z" fill="#879eae" opacity="0.35" />
        <path d="M69 58 C81 43 93 38 94 44 C95 52 83 62 68 62 Z" fill="#879eae" opacity="0.35" />
        <path d="M50 57 C40 45 29 39 27 43 M30 57 C37 63 44 64 51 64 M70 57 C80 45 91 39 93 43 M90 57 C83 63 76 64 69 64" fill="none" stroke="#263b54" strokeWidth="0.95" />
        <path d="M24 47 C27 55 34 59 40 61 M96 47 C93 55 86 59 80 61" fill="none" stroke="#f7f2e8" strokeWidth="1.2" />
        <path d="M51 54 Q60 50 69 54 L68 71 Q60 76 52 71 Z" fill="#879eae" stroke="#263b54" strokeWidth="1.4" />
        <path d="M55 55 Q60 53 65 55 L64 70 Q60 72 56 70 Z" fill="#d8e1e5" opacity="0.55" />
        <path d="M54 57 L65 55 M55 69 L65 67" fill="none" stroke="#f7f2e8" strokeWidth="0.9" />
      </g>
    </svg>
  );
}

function MoonSticker() {
  return (
    <svg viewBox="0 0 120 140" className="sticker-svg" aria-hidden="true" focusable="false">
      <g strokeLinecap="round" strokeLinejoin="round">
        <g fill="none" stroke="#f7f2e8" strokeWidth="6">
          <ellipse cx="70" cy="8" rx="3" ry="5" />
          <ellipse cx="70" cy="16" rx="3" ry="5" />
          <ellipse cx="70" cy="24" rx="3" ry="5" />
          <ellipse cx="70" cy="33" rx="4" ry="5" />
          <path d="M84 106 L90 119" />
        </g>
        <path
          d="M70 36 C45 39 29 61 33 83 C37 108 62 121 84 108 C93 103 99 94 101 85 C86 94 69 89 60 76 C51 62 55 46 70 36 Z"
          fill="#f7f2e8"
          stroke="#f7f2e8"
          strokeWidth="9"
        />
        <path d="M95 45 L98 52 L105 55 L98 58 L95 65 L92 58 L85 55 L92 52 Z" fill="#f7f2e8" stroke="#f7f2e8" strokeWidth="6" />
        <path d="M90 116 L93 122 L99 124 L93 126 L90 133 L87 126 L81 124 L87 122 Z" fill="#f7f2e8" stroke="#f7f2e8" strokeWidth="6" />
        <g fill="none" stroke="#263b54" strokeWidth="1.2">
          <ellipse cx="70" cy="8" rx="3" ry="5" />
          <ellipse cx="70" cy="16" rx="3" ry="5" />
          <ellipse cx="70" cy="24" rx="3" ry="5" />
          <ellipse cx="70" cy="33" rx="4" ry="5" />
        </g>
        <path d="M68 5 L72 11 M68 13 L72 19 M68 21 L72 27" fill="none" stroke="#879eae" strokeWidth="0.75" />
        <path
          d="M70 36 C45 39 29 61 33 83 C37 108 62 121 84 108 C93 103 99 94 101 85 C86 94 69 89 60 76 C51 62 55 46 70 36 Z"
          fill="#d8e1e5"
          stroke="#263b54"
          strokeWidth="1.5"
        />
        <path d="M67 44 C48 49 39 66 41 82 C44 100 60 110 77 106" fill="none" stroke="#879eae" strokeWidth="1" />
        <path d="M44 88 Q51 101 64 103 M48 58 Q43 65 43 72" fill="none" stroke="#f7f2e8" strokeWidth="1.3" />
        <path d="M51 75 C49 79 51 83 55 83 C59 83 61 79 59 76 C57 73 53 72 51 75 Z" fill="none" stroke="#879eae" strokeWidth="0.85" />
        <circle cx="55" cy="93" r="2.2" fill="none" stroke="#879eae" strokeWidth="0.8" />
        <circle cx="46" cy="66" r="1.1" fill="#879eae" />
        <circle cx="67" cy="102" r="1" fill="#879eae" />
        <path d="M95 45 L98 52 L105 55 L98 58 L95 65 L92 58 L85 55 L92 52 Z" fill="#879eae" stroke="#263b54" strokeWidth="1.1" />
        <path d="M95 50 V60 M90 55 H100" fill="none" stroke="#f7f2e8" strokeWidth="0.8" />
        <path d="M84 106 L90 119" fill="none" stroke="#263b54" strokeWidth="1.1" />
        <circle cx="87" cy="113" r="1.6" fill="#f7f2e8" stroke="#263b54" strokeWidth="0.8" />
        <path d="M90 116 L93 122 L99 124 L93 126 L90 133 L87 126 L81 124 L87 122 Z" fill="#d8e1e5" stroke="#263b54" strokeWidth="1.1" />
        <path d="M90 120 V128 M86 124 H94" fill="none" stroke="#879eae" strokeWidth="0.75" />
      </g>
    </svg>
  );
}

export function StickerArt({ type }) {
  switch (type) {
    case 'bottle':
      return <BottleSticker />;
    case 'rose':
      return <RoseSticker />;
    case 'stamp':
      return <StampSticker />;
    case 'key':
      return <KeySticker />;
    case 'bow':
      return <BowSticker />;
    case 'moon':
      return <MoonSticker />;
    case 'letter':
      return <FoldedLetterSticker />;
    case 'frame':
      return <OvalFrameSticker />;
    case 'window':
      return <FrenchWindowSticker />;
    case 'herbier':
      return <HerbierSticker />;
    default:
      return null;
  }
}

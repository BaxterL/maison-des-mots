import { StickerArt } from './StickerArt';
import './TagRail.css';

const tags = [
  { type: 'bottle', label: 'PARFUM' },
  { type: 'bow', label: 'RUBAN' },
  { type: 'rose', label: 'FLEUR' },
  { type: 'key', label: 'CLÉ' },
  { type: 'moon', label: 'LUNE' }
];

export default function TagRail() {
  return (
    <div className="tag-rail" aria-hidden="true">
      <span className="tag-rail__cord" />
      <div className="tag-rail__list">
        {tags.map(({ type, label }) => (
          <div key={type} className={`tag-rail__tag tag-rail__tag--${type}`}>
            <div className="tag-rail__paper">
              <span className="tag-rail__art">
                <StickerArt type={type} />
              </span>
              <span className="tag-rail__label">{label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

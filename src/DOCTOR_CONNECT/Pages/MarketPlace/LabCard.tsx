import React from 'react';
import type { Lab } from '../../../Types/MarketPlace/Marketplace';

// ── Star Rating ──────────────────────────────────────────────────
const StarRating: React.FC<{ rating: number; count: number }> = ({ rating, count }) => (
  <div className="lc-stars">
    {[1, 2, 3, 4, 5].map((n) => (
      <span key={n} className={`lc-star ${n <= Math.round(rating) ? 'lit' : ''}`}>★</span>
    ))}
    <span className="lc-review-count">({count})</span>
  </div>
);

// ── Avatar (initials fallback) ───────────────────────────────────
const LabAvatar: React.FC<{ name: string; logoUrl?: string }> = ({ name, logoUrl }) => {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className="lc-avatar">
      {logoUrl ? <img src={logoUrl} alt={name} /> : <span>{initials}</span>}
    </div>
  );
};

// ── Props ────────────────────────────────────────────────────────
interface LabCardProps {
  lab: Lab;
  /** Clicking the card body opens the pricing table modal */
  onCardClick: (lab: Lab) => void;
  /** Clicking the lab name opens the full profile modal */
  onNameClick: (lab: Lab) => void;
  style?: React.CSSProperties;
}

// ── Component ────────────────────────────────────────────────────
const LabCard: React.FC<LabCardProps> = ({ lab, onCardClick, onNameClick, style }) => {
  const handleNameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNameClick(lab);
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Wire up to actual cart/shortlist logic
    alert(`${lab.name} added to your shortlist!`);
  };

  const statusClass = lab.status.toLowerCase() as 'active' | 'inactive' | 'pending';

  return (
    <div
      className={`lab-card ${lab.featured ? 'featured' : ''}`}
      onClick={() => onCardClick(lab)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onCardClick(lab)}
      aria-label={`View pricing for ${lab.name}`}
      style={style}
    >
      {/* Featured badge */}
      {lab.featured && (
        <div className="lc-featured-badge">
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
            <path
              d="M4.5 1l1.05 2.15 2.38.35-1.72 1.67.4 2.38L4.5 6.4 2.39 7.55l.4-2.38L1.07 3.5l2.38-.35L4.5 1z"
              fill="currentColor"
            />
          </svg>
          Featured
        </div>
      )}

      {/* Header: avatar + meta */}
      <div className="lc-header">
        <LabAvatar name={lab.name} logoUrl={lab.logoUrl} />
        <div className="lc-meta">
          <StarRating rating={lab.rating} count={lab.reviewCount} />
          <span className={`lc-status ${statusClass}`}>
            <span className="lc-status-dot" />
            {lab.status}
          </span>
        </div>
      </div>

      {/* Lab name — clicking opens PROFILE modal */}
      <div className="lc-name-row">
        <button
          type="button"
          className="lc-name-btn"
          onClick={handleNameClick}
          title="View full lab profile"
        >
          {lab.name}
          {/* Arrow appears on hover via CSS */}
          <svg
            className="lc-name-arrow"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M2.5 7h9M8.5 4l3 3-3 3"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span className="lc-name-hint">Click name for full profile →</span>
      </div>

      {/* Details */}
      <div className="lc-details">
        {lab.city && (
          <div className="lc-detail">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M6 1C4.07 1 2.5 2.57 2.5 4.5c0 2.78 3.5 6.5 3.5 6.5s3.5-3.72 3.5-6.5C9.5 2.57 7.93 1 6 1zm0 4.75A1.25 1.25 0 116 3.25a1.25 1.25 0 010 2.5z"
                fill="currentColor"
              />
            </svg>
            <span>{lab.city}, {lab.country}</span>
          </div>
        )}
        {lab.restorationTypes.length > 0 && (
          <div className="lc-detail">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M6 1.5C4.07 1.5 2.5 3.07 2.5 5c0 1.05.47 2 1.2 2.65C4.4 8.33 5.17 9.5 5.17 11h1.66c0-1.5.77-2.67 1.47-3.35A3.5 3.5 0 009.5 5c0-1.93-1.57-3.5-3.5-3.5z"
                fill="currentColor"
              />
            </svg>
            <span>
              {lab.restorationTypes.slice(0, 2).join(', ')}
              {lab.restorationTypes.length > 2 && ` +${lab.restorationTypes.length - 2} more`}
            </span>
          </div>
        )}
        {lab.eta && (
          <div className="lc-detail">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M6 3.5V6l1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span>ETA: {lab.eta}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="lc-tags">
        {lab.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="lc-tag">{tag}</span>
        ))}
      </div>

      {/* Footer: price + add */}
      <div className="lc-footer">
        <div className="lc-price">
          <span className="lc-price-from">from</span>
          <span className="lc-price-amount">£{lab.basePrice}</span>
          <span className="lc-price-unit">/unit</span>
        </div>
        <button
          type="button"
          className="lc-add-btn"
          onClick={handleAddClick}
          aria-label={`Add ${lab.name} to shortlist`}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1.5v10M1.5 6.5h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Add Lab
        </button>
      </div>

      {/* Hover pricing hint */}
      <div className="lc-hover-hint" aria-hidden="true">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Click to view pricing
      </div>
    </div>
  );
};

export default LabCard;
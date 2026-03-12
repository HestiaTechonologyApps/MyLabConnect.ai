import React from 'react';
import type { Lab } from '../../../Types/MarketPlace/Marketplace';

// ── Helper: material badge class ─────────────────────────────────
const matClass = (group: string): string => {
  const g = group.toLowerCase();
  if (g.includes('ceramic')) return 'pm-mat-ceramic';
  if (g.includes('metal') || g.includes('pfm')) return 'pm-mat-metal';
  if (g.includes('resin')) return 'pm-mat-resin';
  if (g.includes('implant')) return 'pm-mat-implant';
  if (g.includes('pmma')) return 'pm-mat-pmma';
  if (g.includes('ortho')) return 'pm-mat-ortho';
  return 'pm-mat-ceramic';
};

// ── Props ────────────────────────────────────────────────────────
interface PricingModalProps {
  lab: Lab | null;
  onClose: () => void;
  onViewProfile: (lab: Lab) => void;
}

// ── Component ────────────────────────────────────────────────────
const PricingModal: React.FC<PricingModalProps> = ({ lab, onClose, onViewProfile }) => {
  if (!lab) return null;

  const initials = lab.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <div
      className="pm-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pm-title"
      onClick={onClose}
    >
      <div className="pm-modal" onClick={(e) => e.stopPropagation()}>
        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="pm-header">
          <div className="pm-lab-identity">
            <div className="pm-logo">
              {lab.logoUrl ? <img src={lab.logoUrl} alt={lab.name} /> : <span>{initials}</span>}
            </div>
            <div>
              <h2 className="pm-lab-name" id="pm-title">{lab.name}</h2>
              {lab.city && (
                <p className="pm-lab-loc">
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path
                      d="M5.5 1C3.85 1 2.5 2.35 2.5 4c0 2.5 3 6 3 6s3-3.5 3-6C8.5 2.35 7.15 1 5.5 1zm0 4.25A1.25 1.25 0 115.5 2.75a1.25 1.25 0 010 2.5z"
                      fill="currentColor"
                    />
                  </svg>
                  {lab.city}, {lab.country}
                </p>
              )}
            </div>
          </div>

          <div className="pm-header-actions">
            <div className="pm-rating-chip">
              ⭐ {lab.rating}.0
              <span className="pm-review-text">({lab.reviewCount} reviews)</span>
            </div>
            <button
              type="button"
              className="pm-profile-btn"
              onClick={() => onViewProfile(lab)}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <circle cx="6.5" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M1.5 11c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              Full Profile
            </button>
            <button
              type="button"
              className="pm-close-btn"
              onClick={onClose}
              aria-label="Close pricing modal"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Section title ───────────────────────────────────────── */}
        <div className="pm-section-title">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M5 7h6M5 10h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          Pricing Schedule
        </div>

        {/* ── Pricing table ───────────────────────────────────────── */}
        <div className="pm-table-scroll">
          <table className="pm-table">
            <thead>
              <tr>
                <th>Material Group</th>
                <th>Material Type</th>
                <th>ETA</th>
                <th>Case Type</th>
                <th>Min</th>
                <th>Max</th>
              </tr>
            </thead>
            <tbody>
              {lab.pricingRows.map((row, idx) => (
                <tr key={idx}>
                  <td>
                    <span className={`pm-mat-badge ${matClass(row.materialGroup)}`}>
                      {row.materialGroup}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500, color: 'var(--mp-text-1)' }}>{row.materialType}</td>
                  <td><span className="pm-eta-text">{row.eta}</span></td>
                  <td className="pm-case-type">{row.caseType}</td>
                  <td>
                    <span className="pm-price">
                      <span className="pm-currency">£</span>{row.minPrice}
                    </span>
                  </td>
                  <td>
                    <span className="pm-price pm-price-max">
                      <span className="pm-currency">£</span>{row.maxPrice}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <div className="pm-footer">
          <div className="pm-cert-list">
            {lab.technology.certifications.map((cert) => (
              <span key={cert} className="pm-cert-chip">
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path d="M1.5 4.5l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {cert}
              </span>
            ))}
          </div>
          <button
            type="button"
            className="pm-add-btn"
            onClick={() => alert(`${lab.name} added to My Labs!`)}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.5 1.5v10M1.5 6.5h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            Add to My Labs
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
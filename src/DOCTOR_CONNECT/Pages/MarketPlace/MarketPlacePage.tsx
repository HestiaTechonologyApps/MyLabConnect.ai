/**
 * MarketplacePage.tsx
 * ─────────────────────────────────────────────────────────────────
 * Root page rendered when the doctor clicks "Marketplace" in the
 * KiduSidebar. Composes:
 *   - MarketplaceHeader  (filter + sort bar)
 *   - LabCard grid
 *   - PricingModal       (opens on card click)
 *   - LabProfileModal    (opens on lab name click)
 */

import React, { useState, useMemo } from 'react';

import '../../../Styles/MarketPlace/MarketPlace.css';
import type { Lab, MarketplaceFilters } from '../../../Types/MarketPlace/Marketplace';
import { MOCK_LABS } from '../../../Configs/MockLabs';
import MarketplaceHeader from './MarketPlaceHeader';
import LabCard from './LabCard';
import PricingModal from './PricingModal';
import LabProfileModal from './LabProfileModal';

// ── Default filter state ─────────────────────────────────────────
const DEFAULT_FILTERS: MarketplaceFilters = {
  workflowType: 'all',
  practiceType: 'all',
  product: '',
  search: '',
  sort: [],
};

// ── Component ────────────────────────────────────────────────────
const MarketplacePage: React.FC = () => {
  const [filters, setFilters] = useState<MarketplaceFilters>(DEFAULT_FILTERS);

  /** Lab whose pricing table is currently open */
  const [pricingLab, setPricingLab] = useState<Lab | null>(null);
  /** Lab whose full profile is currently open */
  const [profileLab, setProfileLab] = useState<Lab | null>(null);

  // ── Filter + sort labs ─────────────────────────────────────────
  const filteredLabs = useMemo<Lab[]>(() => {
    let labs = [...MOCK_LABS];

    // Workflow type
    if (filters.workflowType && filters.workflowType !== 'all') {
      labs = labs.filter((l) =>
        l.tags.some((t) => t.toLowerCase() === filters.workflowType.toLowerCase())
      );
    }

    // Practice type
    if (filters.practiceType && filters.practiceType !== 'all') {
      labs = labs.filter((l) =>
        l.tags.some((t) => t.toLowerCase() === filters.practiceType.toLowerCase())
      );
    }

    // Product/restoration type
    if (filters.product) {
      labs = labs.filter((l) =>
        l.restorationTypes.some((r) =>
          r.toLowerCase().includes(filters.product.toLowerCase())
        )
      );
    }

    // Search (name, city, specialities)
    const q = filters.search.trim().toLowerCase();
    if (q.length >= 2) {
      labs = labs.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          (l.city?.toLowerCase().includes(q) ?? false) ||
          l.restorationTypes.some((r) => r.toLowerCase().includes(q)) ||
          l.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort (apply each sort in order)
    filters.sort.forEach((s) => {
      if (s.key === 'price') {
        labs.sort((a, b) =>
          s.dir === 'asc' ? a.basePrice - b.basePrice : b.basePrice - a.basePrice
        );
      } else if (s.key === 'rating') {
        labs.sort((a, b) =>
          s.dir === 'asc' ? a.rating - b.rating : b.rating - a.rating
        );
      } else if (s.key === 'eta') {
        const etaNum = (lab: Lab) => parseInt(lab.eta?.match(/\d+/)?.[0] ?? '999', 10);
        labs.sort((a, b) =>
          s.dir === 'asc' ? etaNum(a) - etaNum(b) : etaNum(b) - etaNum(a)
        );
      }
    });

    return labs;
  }, [filters]);

  const handleFiltersChange = (partial: Partial<MarketplaceFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  // ── Profile modal: close pricing first, then open profile ──────
  const handleViewProfile = (lab: Lab) => {
    setPricingLab(null);
    setProfileLab(lab);
  };

  return (
    <div className="mp-root">
      {/* Header + filter bar */}
      <MarketplaceHeader
        filters={filters}
        onFiltersChange={handleFiltersChange}
        totalCount={MOCK_LABS.length}
        filteredCount={filteredLabs.length}
      />

      {/* Lab cards grid */}
      <div className="mp-grid">
        {filteredLabs.length > 0 ? (
          filteredLabs.map((lab) => (
            <LabCard
              key={lab.id}
              lab={lab}
              onCardClick={(l) => setPricingLab(l)}
              onNameClick={(l) => setProfileLab(l)}
            />
          ))
        ) : (
          <div className="mp-empty">
            <div className="mp-empty-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10 14h8M14 10v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h3>No labs found</h3>
            <p>Try adjusting or clearing your filters to discover more labs.</p>
            <button
              type="button"
              className="mp-empty-reset"
              onClick={() => setFilters(DEFAULT_FILTERS)}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Pricing table modal — opens on card body click */}
      <PricingModal
        lab={pricingLab}
        onClose={() => setPricingLab(null)}
        onViewProfile={handleViewProfile}
      />

      {/* Full profile modal — opens on lab name click */}
      <LabProfileModal
        lab={profileLab}
        onClose={() => setProfileLab(null)}
      />
    </div>
  );
};

export default MarketplacePage;
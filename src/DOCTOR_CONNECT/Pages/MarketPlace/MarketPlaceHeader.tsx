import React, { useState, useRef } from 'react';
import type { MarketplaceFilters, SortKey } from '../../../Types/MarketPlace/Marketplace';
import KiduDropdown from '../../../KIDU_COMPONENTS/KiduDropdown';
import { PRACTICE_OPTIONS, PRODUCT_OPTIONS, WORKFLOW_OPTIONS } from '../../../Configs/MockLabs';

// ────────────────────────────────────────────────────────────────
// Sort Chip
// ────────────────────────────────────────────────────────────────
interface SortChipProps {
  label: string;
  sortKey: SortKey;
  activeSort: { key: SortKey; dir: 'asc' | 'desc' }[];
  onToggle: (key: SortKey) => void;
}

const SortChip: React.FC<SortChipProps> = ({ label, sortKey, activeSort, onToggle }) => {
  const active = activeSort.find((s) => s.key === sortKey);
  return (
    <button
      type="button"
      className={`mp-sort-chip ${active ? 'active' : ''}`}
      onClick={() => onToggle(sortKey)}
      title={`Sort by ${label}`}
    >
      {label}
      <span className={active ? '' : 'mp-sort-neutral'}>
        {active ? (active.dir === 'asc' ? '↑' : '↓') : '↕'}
      </span>
    </button>
  );
};

// ────────────────────────────────────────────────────────────────
// Props
// ────────────────────────────────────────────────────────────────
interface MarketplaceHeaderProps {
  filters: MarketplaceFilters;
  onFiltersChange: (partial: Partial<MarketplaceFilters>) => void;
  totalCount: number;
  filteredCount: number;
}

// ────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────
const MarketplaceHeader: React.FC<MarketplaceHeaderProps> = ({
  filters,
  onFiltersChange,
  totalCount,
  filteredCount,
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // ── Sort toggle ────────────────────────────────────────────────
  const handleSortToggle = (key: SortKey) => {
    const existing = filters.sort.find((s) => s.key === key);
    let next = filters.sort.filter((s) => s.key !== key);
    if (!existing) {
      next = [{ key, dir: 'asc' }, ...next];
    } else if (existing.dir === 'asc') {
      next = [{ key, dir: 'desc' }, ...next.filter((s) => s.key !== key)];
    }
    onFiltersChange({ sort: next });
  };

  // ── Search expand ──────────────────────────────────────────────
  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => searchRef.current?.focus(), 60);
  };

  const handleSearchBlur = () => {
    if (!filters.search) setSearchOpen(false);
  };

  // ── Active filters check ───────────────────────────────────────
  const hasActiveFilters =
    (filters.workflowType && filters.workflowType !== 'all') ||
    (filters.practiceType && filters.practiceType !== 'all') ||
    !!filters.product ||
    !!filters.search;

  const clearAll = () => {
    onFiltersChange({ workflowType: 'all', practiceType: 'all', product: '', search: '', sort: [] });
    setSearchOpen(false);
  };

  return (
    <div className="mp-header">
      {/* ── Top row ─────────────────────────────────────────────── */}
      <div className="mp-header-top">
        <div className="mp-header-identity">
          <div className="mp-header-icon-wrap">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path
                d="M11 2L13.5 7.5H19.5L14.5 11.5L16.5 17.5L11 14L5.5 17.5L7.5 11.5L2.5 7.5H8.5L11 2Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="mp-header-text">
            <h1>Marketplace</h1>
            <p>
              {filteredCount === totalCount
                ? `${totalCount} certified labs available`
                : `Showing ${filteredCount} of ${totalCount} labs`}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mp-search-wrapper">
          {searchOpen || filters.search ? (
            <div className="mp-search-expanded">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                ref={searchRef}
                placeholder="Search labs, specialties..."
                value={filters.search}
                onChange={(e) => onFiltersChange({ search: e.target.value })}
                onBlur={handleSearchBlur}
              />
              {filters.search && (
                <button
                  type="button"
                  className="mp-search-clear"
                  onClick={() => onFiltersChange({ search: '' })}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              className="mp-search-icon-btn"
              onClick={openSearch}
              title="Search labs"
              aria-label="Open search"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Filter row ──────────────────────────────────────────── */}
      <div className="mp-filter-row">
        {/* Workflow */}
        <div className="mp-filter-segment">
          <span className="mp-filter-label">Workflow</span>
          <KiduDropdown
            value={filters.workflowType}
            onChange={(v) => onFiltersChange({ workflowType: String(v ?? 'all') })}
            staticOptions={WORKFLOW_OPTIONS}
            placeholder="All Workflow"
            inputWidth="130px"
          />
        </div>

        <div className="mp-filter-divider" />

        {/* Practice type */}
        <div className="mp-filter-segment">
          <span className="mp-filter-label">Practice</span>
          <KiduDropdown
            value={filters.practiceType}
            onChange={(v) => onFiltersChange({ practiceType: String(v ?? 'all') })}
            staticOptions={PRACTICE_OPTIONS}
            placeholder="All Practices"
            inputWidth="140px"
          />
        </div>

        <div className="mp-filter-divider" />

        {/* Product */}
        <div className="mp-filter-segment">
          <span className="mp-filter-label">Product</span>
          <KiduDropdown
            value={filters.product || null}
            onChange={(v) => onFiltersChange({ product: v ? String(v) : '' })}
            staticOptions={PRODUCT_OPTIONS}
            placeholder="Select Product..."
            inputWidth="170px"
          />
        </div>

        <div className="mp-filter-divider" />

        {/* Sort */}
        <div className="mp-filter-segment">
          <span className="mp-filter-label">Sort</span>
          <div className="mp-sort-chips">
            <SortChip label="Price"  sortKey="price"  activeSort={filters.sort} onToggle={handleSortToggle} />
            <SortChip label="Rating" sortKey="rating" activeSort={filters.sort} onToggle={handleSortToggle} />
            <SortChip label="ETA"    sortKey="eta"    activeSort={filters.sort} onToggle={handleSortToggle} />
          </div>
        </div>

        {/* Clear all */}
        {hasActiveFilters && (
          <button type="button" className="mp-clear-filters" onClick={clearAll}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M1 1l9 9M10 1L1 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Clear all
          </button>
        )}
      </div>
    </div>
  );
};

export default MarketplaceHeader;
// src/KIDU_COMPONENTS/KiduAnalyticsCard.tsx
// ─────────────────────────────────────────────────────────────────────────────
// A composed "Analytics Card" that combines:
//   • One or more KiduFilterSelector groups (year, lab, practice, etc.)
//   • One KiduChartPanel
//   • An optional dimension dropdown in the header
//
// All filter data can come from:
//   a) Direct props  (options=[...])
//   b) An async fetcher (fetchOptions: () => Promise<string[]>)
//
// Props are fully typed — no implicit any.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import KiduChartPanel, { type ChartSeries } from './KiduChartPanel';
import '../../Styles/KiduStyles/Filterseelctor.css';
import KiduFilterSelector from './KiduFilterselector';

// ─── Types ───────────────────────────────────────────────────────

export interface FilterGroupConfig {
  /** Shown above the pills */
  label: string;
  /** Provide options directly ... */
  options?: string[];
  /** ... or let the card fetch them asynchronously */
  fetchOptions?: () => Promise<string[]>;
  /** Allow multi-select for this group? (default false) */
  multi?: boolean;
  /** Default selected value(s) */
  defaultSelected?: string | string[];
}

export interface KiduAnalyticsCardProps {
  /** Card title */
  title: string;
  /**
   * One or more filter groups (Year, Lab, Practice, etc.)
   * The card will render one KiduFilterSelector per group.
   */
  filterGroups: FilterGroupConfig[];
  /**
   * Chart data — array of objects.
   * Each object must contain the xKey field plus one key per series.
   */
  chartData: Record<string, unknown>[];
  /** Which keys in chartData to plot, with label + color */
  chartSeries: ChartSeries[];
  /** 'line' | 'bar' | 'area' — default: 'line' */
  chartType?: 'line' | 'bar' | 'area';
  /** X-axis key in chartData (default: 'month') */
  xKey?: string;
  /** Unit prefix for Y-axis / tooltip (e.g. '£', '$') */
  yPrefix?: string;
  /** Chart height in px (default: 240) */
  chartHeight?: number;
  /** Optional dimension dropdown options (e.g. ['Lab Wise', 'Practice Wise']) */
  dimensionOptions?: string[];
  /** Called when a filter group changes — receives groupLabel + new value(s) */
  onFilterChange?: (groupLabel: string, value: string | string[]) => void;
  /** Called when the dimension dropdown changes */
  onDimensionChange?: (dimension: string) => void;
}

// ─── Component ───────────────────────────────────────────────────

const KiduAnalyticsCard: React.FC<KiduAnalyticsCardProps> = ({
  title,
  filterGroups,
  chartData,
  chartSeries,
  chartType = 'line',
  xKey = 'month',
  yPrefix = '',
  chartHeight = 240,
  dimensionOptions,
  onFilterChange,
  onDimensionChange,
}) => {
  // ── State: resolved options per group ───────────────────────
  const [resolvedOptions, setResolvedOptions] = useState<string[][]>(
    filterGroups.map((g) => g.options ?? [])
  );

  // ── State: selected values per group ────────────────────────
  const [selections, setSelections] = useState<(string | string[])[]>(
    filterGroups.map((g) => {
      if (g.defaultSelected !== undefined) return g.defaultSelected;
      const firstOption = g.options?.[0] ?? '';
      return g.multi ? [firstOption] : firstOption;
    })
  );

  // ── State: dimension dropdown ────────────────────────────────
  const [dimension, setDimension] = useState<string>(dimensionOptions?.[0] ?? '');

  // ── Fetch async options on mount ────────────────────────────
  useEffect(() => {
    filterGroups.forEach((group, idx) => {
      if (group.fetchOptions) {
        group.fetchOptions().then((opts) => {
          setResolvedOptions((prev) => {
            const next = [...prev];
            next[idx] = opts;
            return next;
          });
          // Set default to first fetched option if not already set
          setSelections((prev) => {
            const next = [...prev];
            if (!next[idx] || (Array.isArray(next[idx]) && (next[idx] as string[]).length === 0)) {
              next[idx] = group.multi ? [opts[0] ?? ''] : (opts[0] ?? '');
            }
            return next;
          });
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Handlers ────────────────────────────────────────────────
  const handleFilterChange = (idx: number, value: string | string[]) => {
    setSelections((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
    onFilterChange?.(filterGroups[idx].label, value);
  };

  const handleDimensionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDimension(e.target.value);
    onDimensionChange?.(e.target.value);
  };

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className="kidu-analytics-card">
      {/* Header */}
      <div className="kidu-analytics-card__header">
        <h6 className="kidu-analytics-card__title">{title}</h6>

        {dimensionOptions && dimensionOptions.length > 0 && (
          <div className="kidu-analytics-card__header-actions">
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--theme-text-secondary)',
                fontWeight: 500,
              }}
            >
              Dimension:
            </span>
            <select
              className="kidu-dimension-select"
              value={dimension}
              onChange={handleDimensionChange}
              aria-label="Select dimension"
            >
              {dimensionOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Body: Filters + Chart */}
      <div className="kidu-analytics-card__body">
        {/* Filter groups */}
        <div className="kidu-analytics-card__filters">
          {filterGroups.map((group, idx) => (
            <KiduFilterSelector
              key={group.label}
              label={group.label}
              options={resolvedOptions[idx]}
              selected={selections[idx]}
              multi={group.multi ?? false}
              onChange={(val) => handleFilterChange(idx, val)}
            />
          ))}
        </div>

        {/* Chart */}
        <KiduChartPanel
          data={chartData}
          series={chartSeries}
          chartType={chartType}
          xKey={xKey}
          yPrefix={yPrefix}
          height={chartHeight}
        />
      </div>
    </div>
  );
};

export default KiduAnalyticsCard;
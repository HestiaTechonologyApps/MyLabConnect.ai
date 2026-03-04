// src/KIDU_COMPONENTS/KiduFilterSelector.tsx
// ─────────────────────────────────────────────────────────────────────────────
// A single, generic "pill-button selector" that works for Years, Labs,
// Practices, or any other list of string options.
//
// Props:
//   label        — section label (e.g. "Select Year", "Select Labs")
//   options      — array of option strings (e.g. ['All','2024','2025'])
//   selected     — currently selected value(s)
//   multi        — allow multiple selections (default: false)
//   onChange     — callback with new selection
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import '../../Styles/KiduStyles/Filterseelctor.css';

export interface KiduFilterSelectorProps {
  /** Label shown above the pills */
  label: string;
  /** The list of option strings to display */
  options: string[];
  /** Currently active value (single-select) or values (multi-select) */
  selected: string | string[];
  /** Allow multiple selections */
  multi?: boolean;
  /** Fires with new value (single) or new array (multi) */
  onChange: (value: string | string[]) => void;
}

const KiduFilterSelector: React.FC<KiduFilterSelectorProps> = ({
  label,
  options,
  selected,
  multi = false,
  onChange,
}) => {
  const selectedArr = Array.isArray(selected) ? selected : [selected];

  const isActive = (opt: string) => selectedArr.includes(opt);

  const handleClick = (opt: string) => {
    if (multi) {
      // Toggle opt in/out of the selected array
      const next = isActive(opt)
        ? selectedArr.filter((v) => v !== opt)
        : [...selectedArr, opt];
      onChange(next);
    } else {
      onChange(opt);
    }
  };

  return (
    <div className="kidu-filter-selector">
      <span className="kidu-filter-selector__label">{label}</span>
      <div className="kidu-filter-selector__pills">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            className={`kidu-pill${isActive(opt) ? ' kidu-pill--active' : ''}`}
            onClick={() => handleClick(opt)}
            aria-pressed={isActive(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default KiduFilterSelector;
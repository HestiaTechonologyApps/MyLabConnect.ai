// ─────────────────────────────────────────────────────────────────────────────
// KiduDropdownSelect.tsx
// Reusable styled dropdown — pill/tag display, matches KiduSelectInputPill UX
//
// Supports:
//   ✅ Static options array (pass via `options` prop)
//   ✅ API fetch (pass via `fetchEndpoint` prop — loaded on mount/show)
//   ✅ Selected label shown as removable pill tag
//   ✅ Actual value (id) sent to backend
//   ✅ Theme-aware (uses --theme-* CSS vars)
//   ✅ Error display matching ksp-pill-error-msg style
//
// Place in: src/KIDU_COMPONENTS/KiduDropdownSelect.tsx
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, type CSSProperties } from "react";
import HttpService from "../Services/Common/HttpService";

export interface KiduDropdownOption {
  value: string | number;
  label: string;
}

export interface KiduDropdownSelectProps {
  /** Field name — used for accessibility */
  name: string;

  /** Currently selected value (the id sent to backend) */
  value: string | number;

  /**
   * Static options list.
   * If provided together with fetchEndpoint, static options are used as fallback
   * while fetching, then replaced with fetched data.
   */
  options?: KiduDropdownOption[];

  /**
   * API endpoint to GET options from.
   * Response must be: T[] | { value: T[] } | { data: T[] }
   * Use together with `mapResponse` to shape each item into { value, label }.
   */
  fetchEndpoint?: string;

  /**
   * Maps each fetched item to a KiduDropdownOption.
   * Required when fetchEndpoint is provided.
   *
   * Example:
   *   mapResponse={(item) => ({ value: item.id, label: item.name })}
   */
  mapResponse?: (item: any) => KiduDropdownOption;

  /** Called with the new value (id) when user picks an option */
  onChange: (value: string | number) => void;

  /** Called when user clicks ✕ to clear the selection */
  onClear: () => void;

  onBlur?: () => void;

  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  placeholder?: string;

  inputHeight?: string | number;
  inputWidth?: string | number;
  inputStyle?: CSSProperties;
  className?: string;
}

const KiduDropdownSelect: React.FC<KiduDropdownSelectProps> = ({
  name,
  value,
  options: staticOptions = [],
  fetchEndpoint,
  mapResponse,
  onChange,
  onClear,
  onBlur,
  label,
  required,
  disabled,
  error,
  placeholder = "Select...",
  inputHeight = "40px",
  inputWidth = "100%",
  inputStyle = {},
  className = "",
}) => {
  const [options, setOptions]   = useState<KiduDropdownOption[]>(staticOptions);
  const [loading, setLoading]   = useState(false);

  // ── Fetch options from API ────────────────────────────────────────────────
  useEffect(() => {
    // If no endpoint, just use static options
    if (!fetchEndpoint) {
      setOptions(staticOptions);
      return;
    }

    setLoading(true);
    HttpService.callApi<any>(fetchEndpoint, "GET")
      .then((res) => {
        const raw: any[] =
          Array.isArray(res)        ? res       :
          Array.isArray(res?.value) ? res.value :
          Array.isArray(res?.data)  ? res.data  : [];

        const mapped = mapResponse
          ? raw.map(mapResponse)
          : raw.map((item) => ({
              value: item.id   ?? item.value,
              label: item.name ?? item.label ?? String(item.id ?? item.value),
            }));

        setOptions(mapped);
      })
      .catch(() => setOptions(staticOptions))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchEndpoint]);

  // ── Sync static options if no endpoint ───────────────────────────────────
  useEffect(() => {
    if (!fetchEndpoint) setOptions(staticOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staticOptions]);

  // ── Derived: find label for current value ─────────────────────────────────
  const selectedLabel = options.find(
    (o) => String(o.value) === String(value)
  )?.label ?? "";

  const h = typeof inputHeight === "number" ? `${inputHeight}px` : inputHeight;
  const w = typeof inputWidth  === "number" ? `${inputWidth}px`  : inputWidth;

  return (
    <div
      className={`ksp-pill-wrap ${className}`}
      style={{ width: w }}
    >
      {/* ── Label ── */}
      {label && (
        <span className="ksp-pill-label">
          {label}
          {required && <span className="req">*</span>}
        </span>
      )}

      {/* ── Trigger box — same look as KiduSelectInputPill ── */}
      <div
        className={[
          "ksp-pill-trigger",
          error   ? "ksp-pill-error-border" : "",
          disabled ? "ksp-pill-disabled"    : "",
        ].filter(Boolean).join(" ")}
        style={{ minHeight: h, width: "100%", position: "relative", ...inputStyle }}
      >
        {/* Pill tag when something is selected */}
        {selectedLabel ? (
          <span className="ksp-pill-tag">
            {selectedLabel}
            <button
              className="ksp-pill-clear"
              type="button"
              aria-label="Clear selection"
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              disabled={disabled}
            >
              ✕
            </button>
          </span>
        ) : (
          <span className="ksp-pill-placeholder">
            {loading ? "Loading..." : placeholder}
          </span>
        )}

        {/* Chevron icon */}
        <svg
          className="ksp-pill-search-ico"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          width="15"
          height="15"
          style={{ pointerEvents: "none" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>

        {/* Native <select> — transparent overlay, full clickable area */}
        <select
          name={name}
          value={value}
          disabled={disabled || loading}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "") onClear();
            else onChange(val);
            onBlur?.();
          }}
          onBlur={onBlur}
          aria-label={label}
          style={{
            position : "absolute",
            opacity  : 0,
            top      : 0,
            left     : 0,
            width    : "100%",
            height   : "100%",
            cursor   : disabled ? "not-allowed" : "pointer",
            zIndex   : 1,
          }}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Error message */}
      {error && <span className="ksp-pill-error-msg">{error}</span>}
    </div>
  );
};

export default KiduDropdownSelect;
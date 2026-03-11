import React, {
  useState, useEffect, useCallback, useRef,
  type CSSProperties,
} from "react";
import { Modal } from "react-bootstrap";
import HttpService from "../Services/Common/HttpService"; // adjust path
import "../Styles/PickUp/PickUpModal.css";
import "../Styles/KiduStyles/MultiSelectPopup.css";

// ═══════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════

export interface KiduMultiSelectColumn<T> {
  key: keyof T;
  label: string;
  filterType?: "text" | "select";
  filterOptions?: string[];
  render?: (value: any, row: T) => React.ReactNode;
}

export interface KiduMultiSelectPopupProps<T extends Record<string, any>> {
  show: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;

  /** Pre-loaded data (MODE 1) */
  data?: T[];
  /** Fetch endpoint (MODE 2) */
  fetchEndpoint?: string;
  /** External loading flag */
  loading?: boolean;

  columns: KiduMultiSelectColumn<T>[];

  /** Called with all selected items when user confirms */
  onConfirm: (items: T[]) => void;

  idKey?: keyof T;
  labelKey: keyof T;
  searchKeys?: (keyof T)[];

  /** Pre-selected IDs to restore on open */
  selectedIds?: (string | number)[];

  rowsPerPage?: number;
  rowsPerPageOptions?: number[];
  themeColor?: string;
  confirmLabel?: string;
  maxSelections?: number;
}

// ═══════════════════════════════════════════════════════════
// KiduMultiSelectInputPill — trigger button
// ═══════════════════════════════════════════════════════════

export interface KiduMultiSelectInputPillProps {
  values: string[];                  // display labels of selected items
  onOpen: () => void;
  onRemove: (index: number) => void;
  onClear: () => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  inputWidth?: string | number;
  inputStyle?: CSSProperties;
}

export const KiduMultiSelectInputPill: React.FC<KiduMultiSelectInputPillProps> = ({
  values,
  onOpen,
  onRemove,
  onClear,
  placeholder = "Click to select...",
  error,
  disabled,
  inputWidth = "100%",
  inputStyle = {},
}) => {
  const w = typeof inputWidth === "number" ? `${inputWidth}px` : inputWidth;

  return (
    <div className="kmsp-pill-wrap" style={{ width: w, ...inputStyle }}>
      <div
        className={[
          "kmsp-pill-trigger",
          error ? "kmsp-pill-error-border" : "",
          disabled ? "kmsp-pill-disabled" : "",
        ].filter(Boolean).join(" ")}
        onClick={!disabled ? onOpen : undefined}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) onOpen();
        }}
      >
        <div className="kmsp-pill-tags">
          {values.length === 0 && (
            <span className="kmsp-pill-placeholder">{placeholder}</span>
          )}
          {values.map((v, i) => (
            <span key={i} className="kmsp-pill-tag">
              {v}
              <button
                type="button"
                className="kmsp-pill-tag-remove"
                aria-label={`Remove ${v}`}
                onClick={(e) => { e.stopPropagation(); onRemove(i); }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="kmsp-pill-actions">
          {values.length > 0 && !disabled && (
            <button
              type="button"
              className="kmsp-pill-clear"
              aria-label="Clear all"
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              title="Clear all"
            >
              ×
            </button>
          )}
          <svg className="kmsp-pill-search-ico" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" width="14" height="14">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
      </div>
      {error && <span className="kmsp-pill-error-msg">{error}</span>}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// KiduMultiSelectPopup
// ═══════════════════════════════════════════════════════════

function KiduMultiSelectPopup<T extends Record<string, any>>({
  show,
  onClose,
  title,
  subtitle,
  data: externalData,
  fetchEndpoint,
  loading: externalLoading = false,
  columns,
  onConfirm,
  idKey = "id" as keyof T,
  searchKeys,
  selectedIds: initialSelectedIds = [],
  rowsPerPage = 10,
  rowsPerPageOptions = [5, 10, 20, 50],
  themeColor = "#ef0d50",
  confirmLabel = "Confirm",
  maxSelections,
}: KiduMultiSelectPopupProps<T>) {

  const [allData, setAllData]           = useState<T[]>([]);
  const [filtered, setFiltered]         = useState<T[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);

  const [search, setSearch]               = useState("");
  const [filtersOpen, setFiltersOpen]     = useState(false);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const activeFilterCount = Object.values(columnFilters).filter(Boolean).length;

  const [page, setPage]       = useState(1);
  const [perPage, setPerPage] = useState(rowsPerPage);

  // Internal selected IDs (working set while popup is open)
  const [selectedIds, setSelectedIds] = useState<Set<any>>(new Set());

  const searchRef = useRef<HTMLInputElement>(null);

  const isLoading = fetchLoading || externalLoading;

  // ── Open / fetch ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!show) return;

    setSearch("");
    setColumnFilters({});
    setPage(1);
    setFiltersOpen(false);
    setPerPage(rowsPerPage);
    // Restore pre-selected IDs
    setSelectedIds(new Set(initialSelectedIds.map(String)));

    if (externalData !== undefined) {
      setAllData(externalData);
      setFiltered(externalData);
      setTimeout(() => searchRef.current?.focus(), 120);
      return;
    }

    if (!fetchEndpoint) return;
    setFetchLoading(true);
    HttpService.callApi<any>(fetchEndpoint, "GET")
      .then((res) => {
        const items: T[] =
          Array.isArray(res)        ? res       :
          Array.isArray(res?.value) ? res.value :
          Array.isArray(res?.data)  ? res.data  : [];
        setAllData(items);
        setFiltered(items);
      })
      .catch(() => { setAllData([]); setFiltered([]); })
      .finally(() => {
        setFetchLoading(false);
        setTimeout(() => searchRef.current?.focus(), 120);
      });
  }, [show]);

  // Sync external data changes while open
  useEffect(() => {
    if (!show || externalData === undefined) return;
    setAllData(externalData);
    setFiltered(externalData);
  }, [externalData, show]);

  // ── Filter ────────────────────────────────────────────────────────────────
  useEffect(() => {
    let result = allData;
    const q = search.toLowerCase().trim();
    if (q) {
      const keys = searchKeys ?? columns.map((c) => c.key);
      result = result.filter((row) =>
        keys.some((k) => String(row[k] ?? "").toLowerCase().includes(q))
      );
    }
    Object.entries(columnFilters).forEach(([key, val]) => {
      if (!val) return;
      result = result.filter((row) =>
        String(row[key] ?? "").toLowerCase().includes(val.toLowerCase())
      );
    });
    setFiltered(result);
    setPage(1);
  }, [search, columnFilters, allData]);

  // ── Pagination ────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageData   = filtered.slice((page - 1) * perPage, page * perPage);

  // ── Selection helpers ─────────────────────────────────────────────────────
  const allPageSelected  = pageData.length > 0 && pageData.every((r) => selectedIds.has(String(r[idKey])));
  const somePageSelected = pageData.some((r) => selectedIds.has(String(r[idKey])));

  const toggleRow = (id: any) => {
    const sid = String(id);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(sid)) {
        next.delete(sid);
      } else {
        if (maxSelections && next.size >= maxSelections) return prev;
        next.add(sid);
      }
      return next;
    });
  };

  const togglePageAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allPageSelected) {
        pageData.forEach((r) => next.delete(String(r[idKey])));
      } else {
        pageData.forEach((r) => {
          if (!maxSelections || next.size < maxSelections) {
            next.add(String(r[idKey]));
          }
        });
      }
      return next;
    });
  };

  const handleConfirm = useCallback(() => {
    const selected = allData.filter((r) => selectedIds.has(String(r[idKey])));
    onConfirm(selected);
    onClose();
  }, [allData, selectedIds, idKey, onConfirm, onClose]);

  // ── Highlight ─────────────────────────────────────────────────────────────
  const highlight = (text: string) => {
    if (!search.trim()) return <>{text}</>;
    const q   = search.toLowerCase();
    const idx = text.toLowerCase().indexOf(q);
    if (idx === -1) return <>{text}</>;
    return (
      <>
        {text.slice(0, idx)}
        <mark style={{
          background: `${themeColor}28`, color: themeColor,
          padding: "0 2px", borderRadius: 3, fontWeight: 700,
        }}>
          {text.slice(idx, idx + search.length)}
        </mark>
        {text.slice(idx + search.length)}
      </>
    );
  };

  const visiblePages = () => {
    const count = Math.min(totalPages, 5);
    let start = 1;
    if (totalPages > 5) {
      if (page <= 3) start = 1;
      else if (page >= totalPages - 2) start = totalPages - 4;
      else start = page - 2;
    }
    return Array.from({ length: count }, (_, i) => start + i);
  };

  const filterableCols = columns.filter((c) => !!c.filterType);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Modal
      show={show}
      onHide={onClose}
      size="lg"
      centered
      className="kmsp-modal ksp-modal"
      backdrop="static"
    >
      <Modal.Header closeButton>
        <div>
          <p className="ksp-title">{title}</p>
          {subtitle && <p className="ksp-subtitle">{subtitle}</p>}
        </div>
      </Modal.Header>

      {/* Search + Filter toggle */}
      <div className="ksp-search-zone">
        <div className="ksp-search-wrap">
          <svg className="ksp-search-svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" width="14" height="14">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={searchRef}
            className="ksp-search-input"
            placeholder={`Search ${title.replace("Select ", "").toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {!isLoading && (
            <span className="ksp-result-badge">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {filterableCols.length > 0 && (
          <button
            className={`ksp-filter-toggle${filtersOpen ? " active" : ""}`}
            type="button"
            onClick={() => setFiltersOpen((p) => !p)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" width="13" height="13">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span className="ksp-filter-badge">{activeFilterCount}</span>
            )}
          </button>
        )}
      </div>

      {/* Column filters */}
      {filtersOpen && filterableCols.length > 0 && (
        <div className="ksp-filter-row">
          {filterableCols.map((col) => (
            <div key={String(col.key)} className="ksp-filter-field">
              <label className="ksp-filter-label">{col.label}</label>
              {col.filterType === "select" && col.filterOptions ? (
                <select
                  className="ksp-filter-input"
                  value={columnFilters[String(col.key)] ?? ""}
                  onChange={(e) =>
                    setColumnFilters((p) => ({ ...p, [String(col.key)]: e.target.value }))
                  }
                >
                  <option value="">All</option>
                  {col.filterOptions.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              ) : (
                <input
                  className="ksp-filter-input"
                  type="text"
                  placeholder={`Filter ${col.label}...`}
                  value={columnFilters[String(col.key)] ?? ""}
                  onChange={(e) =>
                    setColumnFilters((p) => ({ ...p, [String(col.key)]: e.target.value }))
                  }
                />
              )}
            </div>
          ))}
          <button
            className="ksp-filter-clear-btn"
            type="button"
            onClick={() => setColumnFilters({})}
          >
            Clear All
          </button>
        </div>
      )}

      {/* Selection count banner */}
      {selectedIds.size > 0 && (
        <div className="ksp-sel-bar kmsp-sel-bar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" width="13" height="13">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>
            {selectedIds.size} item{selectedIds.size !== 1 ? "s" : ""} selected
            {maxSelections && ` (max ${maxSelections})`}
          </span>
          <button
            className="ksp-sel-bar-clear"
            type="button"
            onClick={() => setSelectedIds(new Set())}
          >
            Clear all
          </button>
        </div>
      )}

      {/* Table */}
      <div className="ksp-body">
        {isLoading ? (
          <table className="ksp-tbl">
            <tbody>
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="ksp-skel-row">
                  <td><div className="ksp-skel" style={{ width: 15 }} /></td>
                  {columns.map((_, ci) => (
                    <td key={ci}>
                      <div className="ksp-skel" style={{ width: `${50 + (ci * 17) % 38}%` }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : filtered.length === 0 ? (
          <div className="ksp-empty">
            <div className="ksp-empty-icon">🔍</div>
            <p className="ksp-empty-text">
              {search || activeFilterCount > 0
                ? "No results match your filters"
                : "No records found"}
            </p>
          </div>
        ) : (
          <table className="ksp-tbl">
            <thead>
              <tr>
                <th className="ksp-th-check">
                  <input
                    type="checkbox"
                    className="ksp-checkbox"
                    checked={allPageSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = somePageSelected && !allPageSelected;
                    }}
                    onChange={togglePageAll}
                    title={allPageSelected ? "Deselect page" : "Select page"}
                  />
                </th>
                {columns.map((col) => (
                  <th key={String(col.key)}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageData.map((row) => {
                const id         = String(row[idKey]);
                const isSelected = selectedIds.has(id);
                const isDisabled = !isSelected && !!maxSelections && selectedIds.size >= maxSelections;
                return (
                  <tr
                    key={id}
                    className={[
                      isSelected   ? "ksp-row-selected"  : "",
                      isDisabled   ? "kmsp-row-disabled" : "",
                    ].filter(Boolean).join(" ")}
                    onClick={() => !isDisabled && toggleRow(id)}
                    title={isDisabled ? `Maximum ${maxSelections} items can be selected` : ""}
                  >
                    <td onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="ksp-checkbox"
                        checked={isSelected}
                        disabled={isDisabled}
                        onChange={() => !isDisabled && toggleRow(id)}
                      />
                    </td>
                    {columns.map((col) => (
                      <td key={String(col.key)}>
                        {col.render
                          ? col.render(row[col.key], row)
                          : highlight(String(row[col.key] ?? "—"))}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div className="ksp-footer">
        <div className="ksp-footer-left">
          <div className="ksp-rpp-wrap">
            <span className="ksp-rpp-label">Rows per page</span>
            <select
              className="ksp-rpp-select"
              value={perPage}
              onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
            >
              {rowsPerPageOptions.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="ksp-footer-right">
          {totalPages > 1 && (
            <>
              <span className="ksp-pg-info">Page {page} of {totalPages}</span>
              <div className="ksp-pg">
                <button
                  className="ksp-pg-btn"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >‹</button>
                {visiblePages().map((n) => (
                  <button
                    key={n}
                    className={`ksp-pg-btn${n === page ? " active" : ""}`}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </button>
                ))}
                <button
                  className="ksp-pg-btn"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >›</button>
              </div>
            </>
          )}

          <button
            className="ksp-confirm-btn kmsp-confirm-btn"
            type="button"
            disabled={selectedIds.size === 0}
            onClick={handleConfirm}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" width="13" height="13">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {confirmLabel}{selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default KiduMultiSelectPopup;
/* ============================================================
   components/CaseDashboard.tsx
   Role-aware dashboard shell.
   Receives data from the parent index page (API result).
   Handles tab switching — cards update without page navigation.
   ============================================================ */

import React, { useState, useCallback } from 'react';
import '../Styles/KiduStyles/CaseDashboard.css';
import StatusBar from './KiduCaseStatusbar';
import CaseCard from './KiduCaseCards';
import type { StatusItem } from './KiduCaseStatusbar';
import type { DashboardPageData, LoginRole, StatusKey } from '../Types/IndexPage.types';
import { ROLE_CONFIG, TAB_ICONS, TAB_LABELS } from '../Configs/RoleConfig';

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────

export interface CaseDashboardProps {
  role: LoginRole;
  data: DashboardPageData;
  /** Loading state while API is in-flight */
  loading?: boolean;
}

// ─────────────────────────────────────────────────────────────
// Prescription SVG icon
// ─────────────────────────────────────────────────────────────

const IcoClipboard = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
    style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }}>
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
  </svg>
);

// ─────────────────────────────────────────────────────────────
// Skeleton card for loading state
// ─────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="dash-skeleton-card" aria-hidden="true">
    <div className="skel-bar" />
    <div className="skel-line skel-line--title" />
    <div className="skel-divider" />
    <div className="skel-line" />
    <div className="skel-line skel-line--short" />
    <div className="skel-line skel-line--short" />
    <div className="skel-footer">
      <div className="skel-line skel-line--xs" />
      <div style={{ display: 'flex', gap: 6 }}>
        <div className="skel-circle" />
        <div className="skel-circle" />
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// CaseDashboard Component
// ─────────────────────────────────────────────────────────────

const CaseDashboard: React.FC<CaseDashboardProps> = ({ role, data, loading = false }) => {
  const config = ROLE_CONFIG[role];

  // Initialise with role's default tab
  const [activeTab, setActiveTab] = useState<StatusKey>(config.defaultTab);
  const [gridTransitioning, setGridTransitioning] = useState(false);

  // ── Build StatusBar items from visible tabs + API counts ──
  const statusItems: StatusItem[] = config.visible.map((key) => ({
    key,
    label: TAB_LABELS[key],
    count: data.tabCounts[key] ?? 0,
    active: key === activeTab,
  }));

  // ── Tab switch with fade transition ──
  const switchTab = useCallback((key: StatusKey) => {
    if (key === activeTab) return;
    setGridTransitioning(true);
    setTimeout(() => {
      setActiveTab(key as StatusKey);
      setGridTransitioning(false);
    }, 150);
  }, [activeTab]);

  // ── Cases for current tab ──
  const currentCases = data.cases[activeTab] ?? [];

  // ── Tab label for heading ──
  const tabLabel = TAB_LABELS[activeTab];
  const tabIcon  = TAB_ICONS[activeTab];

  return (
    <main className="dash-page-body">

      {/* ── Status / Tab bar ── */}
      <StatusBar
        items={statusItems}
        onSelect={(key) => switchTab(key)}
      />

      {/* ── Label bar ── */}
      <div className="dash-label-bar">
        <span className="dash-view-label">
          <span className="dash-view-icon" aria-hidden="true">{tabIcon}</span>
          {tabLabel}
        </span>
        <div className="dash-label-actions">
          {!loading && (
            <span className="dash-case-count">{currentCases.length} cases</span>
          )}
          {config.showPrescription && (
            <button className="dash-action-btn dash-action-btn--primary">
              <IcoClipboard />
              Prescription
            </button>
          )}
          {config.showPickup && (
            <button className="dash-action-btn dash-action-btn--info">
              Pickup
            </button>
          )}
        </div>
      </div>

      {/* ── Cards grid ── */}
      <div className="dash-cards-area">
        {loading ? (
          /* Skeleton loaders */
          <div className="dash-cards-grid">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className={`dash-cards-grid${gridTransitioning ? ' transitioning' : ''}`}>
            {currentCases.length === 0 ? (
              <div className="dash-empty">
                <div className="dash-empty-icon" aria-hidden="true">{tabIcon}</div>
                <p>No {tabLabel.toLowerCase()} cases</p>
              </div>
            ) : (
              currentCases.map((c, i) => (
                <CaseCard
                  key={`${c.id}-${i}`}
                  patientName={c.patientName}
                  patientId={c.patientId}
                  caseId={c.id}
                  caseType={c.caseType}
                  doctorName={c.doctorName}
                  labName={c.labName}
                  date={c.date}
                  status={c.status}
                  isRush={c.isRush}
                  mode={config.cardMode}
                  animationDelay={i * 0.04}
                  onClick={() => console.log('Open case:', c.id)}
                  onStatusClick={() => console.log('Status:', c.id)}
                  onSupportClick={() => console.log('Support:', c.id)}
                  onSendMessage={async (text) => console.log('Message:', c.id, text)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default CaseDashboard;
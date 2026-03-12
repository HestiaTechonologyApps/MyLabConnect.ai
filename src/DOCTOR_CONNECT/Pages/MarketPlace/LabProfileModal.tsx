/**
 * LabProfileModal.tsx
 * Full lab profile modal with sidebar navigation.
 * Uses the same pattern as KiduSidebar but scoped to the modal context.
 */

import React, { useState } from 'react';
import {
  OverviewPage,
  OperationalMetricsPage,
  QualityMetricsPage,
  TechnologyPage,
  TurnaroundPage,
  PricingPage,
  SupportPage,
  PartnershipPage,
} from './LabProfilePages';
import type { Lab, ProfileSection } from '../../../Types/MarketPlace/Marketplace';

// ── Nav item config ─────────────────────────────────────────────
interface NavItem {
  key: ProfileSection;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    key: 'overview',
    label: 'Overview',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="1.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
        <rect x="8.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
        <rect x="1.5" y="8.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
        <rect x="8.5" y="8.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    key: 'operational',
    label: 'Operational Metrics',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M2 11L5 7l3 2 5-6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: 'quality',
    label: 'Quality Metrics',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M4.5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: 'technology',
    label: 'Technology',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M5.5 2.5H3a1 1 0 00-1 1v8a1 1 0 001 1h9a1 1 0 001-1V3.5a1 1 0 00-1-1H9.5M5.5 2.5v-1h4v1M5.5 2.5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'turnaround',
    label: 'Turnaround Times',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M7.5 5v2.5l1.75 1.75" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'pricing',
    label: 'Pricing',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M7.5 5v1m0 3v1m-1.5-4.5h2.25a.75.75 0 010 1.5H7.25a.75.75 0 000 1.5H9" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'support',
    label: 'Support',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M3 7.5C3 5.01 5.01 3 7.5 3S12 5.01 12 7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M3 9V7.5a1 1 0 011-1h.5v4H4a1 1 0 01-1-1zm9 1.5a1 1 0 01-1 1h-.5v-4h.5a1 1 0 011 1v2z" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    key: 'partnership',
    label: 'Partnership',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M7.5 2L3 4.5V8c0 2.75 2.1 4.65 4.5 5.25C9.9 12.65 12 10.75 12 8V4.5L7.5 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M5 7.75l2 2 3.5-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

// ── Page renderer ────────────────────────────────────────────────
const renderPage = (section: ProfileSection, lab: Lab): React.ReactNode => {
  switch (section) {
    case 'overview':    return <OverviewPage lab={lab} />;
    case 'operational': return <OperationalMetricsPage lab={lab} />;
    case 'quality':     return <QualityMetricsPage lab={lab} />;
    case 'technology':  return <TechnologyPage lab={lab} />;
    case 'turnaround':  return <TurnaroundPage lab={lab} />;
    case 'pricing':     return <PricingPage lab={lab} />;
    case 'support':     return <SupportPage lab={lab} />;
    case 'partnership': return <PartnershipPage lab={lab} />;
    default:            return <OverviewPage lab={lab} />;
  }
};

// ── Props ─────────────────────────────────────────────────────────
interface LabProfileModalProps {
  lab: Lab | null;
  onClose: () => void;
}

// ── Component ─────────────────────────────────────────────────────
const LabProfileModal: React.FC<LabProfileModalProps> = ({ lab, onClose }) => {
  const [activeSection, setActiveSection] = useState<ProfileSection>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!lab) return null;

  const activeItem = NAV_ITEMS.find((i) => i.key === activeSection);

  const initials = lab.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const handleNavClick = (key: ProfileSection) => {
    setActiveSection(key);
    setSidebarOpen(false);
  };

  return (
    <div
      className="lpm-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lpm-title"
      onClick={onClose}
    >
      <div className="lpm-modal" onClick={(e) => e.stopPropagation()}>
        {/* ── Top bar ─────────────────────────────────────────────── */}
        <div className="lpm-topbar">
          <div className="lpm-topbar-left">
            {/* Mobile sidebar toggle */}
            <button
              type="button"
              className="lpm-mobile-toggle"
              onClick={() => setSidebarOpen((p) => !p)}
              aria-label="Toggle navigation"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            <div className="lpm-topbar-title">
              <span className="lpm-lab-title" id="lpm-title">{lab.name}</span>
              <div className="lpm-breadcrumb">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {activeItem?.label}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="pm-close-btn"
            onClick={onClose}
            aria-label="Close profile"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* ── Body: sidebar + content ──────────────────────────────── */}
        <div className="lpm-body">
          {/* Mobile overlay */}
          <div
            className={`lpm-sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
            onClick={() => setSidebarOpen(false)}
          />

          {/* ── Sidebar ────────────────────────────────────────────── */}
          <aside className={`lpm-sidebar ${sidebarOpen ? 'open' : ''}`}>
            {/* Lab mini card */}
            <div className="lpm-lab-mini">
              <div className="lpm-mini-avatar">{initials}</div>
              <div className="lpm-mini-info">
                <span className="lpm-mini-code">{lab.shortCode}</span>
                <span className={`lpm-mini-status ${lab.status.toLowerCase() !== 'active' ? 'inactive' : ''}`} />
              </div>
            </div>

            {/* Nav items */}
            <nav className="lpm-nav" role="navigation" aria-label="Lab profile sections">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`lpm-nav-item ${activeSection === item.key ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.key)}
                  aria-current={activeSection === item.key ? 'page' : undefined}
                >
                  <span className="lpm-nav-icon">{item.icon}</span>
                  <span className="lpm-nav-label">{item.label}</span>
                  {activeSection === item.key && <span className="lpm-nav-indicator" />}
                </button>
              ))}
            </nav>
          </aside>

          {/* ── Page content ────────────────────────────────────────── */}
          <main className="lpm-content">
            {renderPage(activeSection, lab)}
          </main>
        </div>
      </div>
    </div>
  );
};

export default LabProfileModal;
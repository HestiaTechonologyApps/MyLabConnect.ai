/**
 * LabProfilePages.tsx
 * ─────────────────────────────────────────────────────────────────
 * All 8 profile section pages:
 *   1. OverviewPage
 *   2. OperationalMetricsPage
 *   3. QualityMetricsPage
 *   4. TechnologyPage
 *   5. TurnaroundPage
 *   6. PricingPage
 *   7. SupportPage
 *   8. PartnershipPage
 */

import React from 'react';
import type { Lab } from '../../../Types/MarketPlace/Marketplace';

// ── Shared inner components ─────────────────────────────────────

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`lp-card ${className}`}>{children}</div>
);

const CardTitle: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
  <div className="lp-card-title">
    {icon}
    <h3>{title}</h3>
  </div>
);

const MetricCard: React.FC<{
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  value: string | number;
  valueSuffix?: string;
  sub?: string;
  valClass?: string;
}> = ({ icon, iconBg, iconColor, title, value, valueSuffix = '', sub, valClass = '' }) => (
  <div className="lp-metric-card">
    <div className="lp-metric-icon" style={{ background: iconBg, color: iconColor }}>
      {icon}
    </div>
    <div className="lp-metric-title">{title}</div>
    <div className={`lp-metric-value ${valClass}`}>
      {value}{valueSuffix}
    </div>
    {sub && <div className="lp-metric-sub">{sub}</div>}
  </div>
);

const ChipList: React.FC<{ items: string[]; variant: 'blue' | 'green' | 'orange' | 'purple' | 'red' }> = ({ items, variant }) => (
  <div className="lp-chips">
    {items.map((item) => (
      <span key={item} className={`lp-chip lp-chip-${variant}`}>{item}</span>
    ))}
  </div>
);

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="lp-info-row">
    <div className="lp-info-icon">{icon}</div>
    <div>
      <span className="lp-info-label">{label}</span>
      <span className="lp-info-value">{value}</span>
    </div>
  </div>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="lp-empty">
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" opacity="0.4">
      <rect x="4" y="8" width="24" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 16h8M16 12v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
    <p>{message}</p>
  </div>
);

// ══════════════════════════════════════════════════════════════════
// 1. OVERVIEW
// ══════════════════════════════════════════════════════════════════
export const OverviewPage: React.FC<{ lab: Lab }> = ({ lab }) => {
  const initials = lab.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

  return (
    <div className="lp-page">
      {/* Hero */}
      <div className="lp-hero">
        <div className="lp-hero-logo">
          {lab.logoUrl ? <img src={lab.logoUrl} alt={lab.name} /> : <span>{initials}</span>}
        </div>
        <div>
          <h2 className="lp-hero-name">{lab.name} ({lab.shortCode})</h2>
          <div className="lp-hero-meta">
            {lab.city && (
              <span className="lp-hero-meta-item">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1C4.07 1 2.5 2.57 2.5 4.5c0 2.78 3.5 6.5 3.5 6.5s3.5-3.72 3.5-6.5C9.5 2.57 7.93 1 6 1zm0 4.75A1.25 1.25 0 116 3.25a1.25 1.25 0 010 2.5z" fill="currentColor" />
                </svg>
                {lab.city}, {lab.country}
              </span>
            )}
            <span className="lp-hero-meta-item">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="1.5" y="2" width="9" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
                <path d="M4 1v2M8 1v2M1.5 5h9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              Est. {lab.establishedYear}
            </span>
          </div>
        </div>
        <span className={`lp-hero-status`}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
          {lab.status}
        </span>
      </div>

      {/* Contact */}
      <Card>
        <CardTitle
          icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4a1 1 0 011-1h10a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="1.3" /><path d="M2 4l6 5 6-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>}
          title="Contact Information"
        />
        <div className="lp-contact-grid">
          <InfoRow
            icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1C5.07 1 3.5 2.57 3.5 4.5c0 2.78 3.5 6.5 3.5 6.5s3.5-3.72 3.5-6.5C10.5 2.57 8.93 1 7 1zm0 4.75A1.25 1.25 0 117 3.25a1.25 1.25 0 010 2.5z" fill="currentColor" /></svg>}
            label="Address"
            value={lab.location}
          />
          <InfoRow
            icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3a1 1 0 011-1h8a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V3z" stroke="currentColor" strokeWidth="1.2" /><path d="M2 3l5 4.5L12 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>}
            label="Email"
            value={lab.email}
          />
          <InfoRow
            icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" /><path d="M7 4v3l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>}
            label="Website"
            value={lab.website ?? 'Not provided'}
          />
          {lab.phone && (
            <InfoRow
              icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 2h2l1 3L5.5 6.5a8 8 0 003 3L10 8l3 1v2a1 1 0 01-1 1C5.4 12 2 8.6 2 4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>}
              label="Phone"
              value={lab.phone}
            />
          )}
        </div>
      </Card>

      {/* Tags & Specialities */}
      <Card>
        <CardTitle
          icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4a2 2 0 012-2h4l6 6-6 6-6-6V4z" stroke="currentColor" strokeWidth="1.3" /></svg>}
          title="Specialities & Tags"
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <ChipList items={lab.tags} variant="blue" />
          <ChipList items={lab.restorationTypes} variant="purple" />
        </div>
      </Card>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
// 2. OPERATIONAL METRICS
// ══════════════════════════════════════════════════════════════════
export const OperationalMetricsPage: React.FC<{ lab: Lab }> = ({ lab }) => {
  const m = lab.operationalMetrics;

  return (
    <div className="lp-page">
      <div className="lp-metrics-3">
        <MetricCard
          icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3" /><path d="M5 8h6M5 5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>}
          iconBg="rgba(124,58,237,0.12)" iconColor="#7c3aed"
          title="Monthly Capacity"
          value={m.monthlyCapacity}
          sub="cases per month"
          valClass="" 
        />
        <MetricCard
          icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" /><path d="M5 8.5l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          iconBg="rgba(16,185,129,0.12)" iconColor="#10b981"
          title="On-Time Delivery"
          value={m.onTimeDelivery}
          valueSuffix="%"
          sub="delivery rate"
        />
        <MetricCard
          icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 12L6 8l3 2 4-6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          iconBg="rgba(59,130,246,0.12)" iconColor="#3b82f6"
          title="Remake Rate"
          value={m.remakeRate}
          valueSuffix="%"
          sub="industry avg: 3–5%"
        />
      </div>

      <Card>
        <CardTitle
          icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.3" /><path d="M2 13c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>}
          title="Team Information"
        />
        <div className="lp-team-grid">
          <div className="lp-team-item">
            <span className="lp-team-label">Total Technicians</span>
            <span className="lp-team-value">{m.totalTechnicians}</span>
          </div>
          <div className="lp-team-item">
            <span className="lp-team-label">Avg Experience</span>
            <span className="lp-team-value">{m.avgExperience} yrs</span>
          </div>
          <div className="lp-team-item">
            <span className="lp-team-label">CDT Certified</span>
            <span className="lp-team-value">{m.cdtCertified}%</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
// 3. QUALITY METRICS
// ══════════════════════════════════════════════════════════════════
export const QualityMetricsPage: React.FC<{ lab: Lab }> = ({ lab }) => {
  const q = lab.qualityMetrics;

  return (
    <div className="lp-page">
      <div className="lp-metrics-2">
        <div className="lp-card lp-quality-card q-green">
          <div className="lp-metric-icon" style={{ background: 'rgba(16,185,129,0.14)', color: '#10b981' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.4" /><path d="M5.5 9.5l2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div className="lp-metric-title">Remake Rate</div>
          <div className="lp-quality-val green">{q.remakeRate}%</div>
          <div className="lp-quality-sub green-text">Industry avg: 3–5%</div>
        </div>
        <div className="lp-card lp-quality-card q-blue">
          <div className="lp-metric-icon" style={{ background: 'rgba(59,130,246,0.14)', color: '#3b82f6' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.4" /><path d="M5.5 9.5l2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div className="lp-metric-title">Fit Accuracy</div>
          <div className="lp-quality-val blue">{q.fitAccuracy}%</div>
          <div className="lp-quality-sub">First-time fit accuracy</div>
        </div>
        <div className="lp-card lp-quality-card q-purple">
          <div className="lp-metric-icon" style={{ background: 'rgba(124,58,237,0.14)', color: '#7c3aed' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2l2.2 4.5 5 .72-3.6 3.5.85 4.9L9 13.25l-4.45 2.37.85-4.9L1.8 7.22l5-.72L9 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>
          </div>
          <div className="lp-metric-title">Shade Matching</div>
          <div className="lp-quality-val purple">{q.shadeMatching}%</div>
          <div className="lp-quality-sub">Digital spectrophotometers</div>
        </div>
        <div className="lp-card lp-quality-card q-orange">
          <div className="lp-metric-icon" style={{ background: 'rgba(245,158,11,0.14)', color: '#f59e0b' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2l2.2 4.5 5 .72-3.6 3.5.85 4.9L9 13.25l-4.45 2.37.85-4.9L1.8 7.22l5-.72L9 2z" fill="currentColor" /></svg>
          </div>
          <div className="lp-metric-title">Satisfaction</div>
          <div className="lp-quality-val orange">{q.satisfaction}/5.0</div>
          <div className="lp-quality-sub">{q.surveyResponses} survey responses</div>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
// 4. TECHNOLOGY
// ══════════════════════════════════════════════════════════════════
export const TechnologyPage: React.FC<{ lab: Lab }> = ({ lab }) => {
  const t = lab.technology;

  return (
    <div className="lp-page">
      <Card>
        <CardTitle
          icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="4" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" /><path d="M6 8h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>}
          title="Compatible Scanners"
        />
        {t.compatibleScanners.length > 0
          ? <ChipList items={t.compatibleScanners} variant="blue" />
          : <EmptyState message="No scanner information available" />}
      </Card>

      <Card>
        <CardTitle
          icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" /><path d="M6 7h4M5 10h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>}
          title="CAD/CAM Design Software"
        />
        {t.cadCamSoftware.length > 0
          ? <ChipList items={t.cadCamSoftware} variant="purple" />
          : <EmptyState message="No CAD/CAM software information available" />}
      </Card>

      <Card>
        <CardTitle
          icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2l1.8 3.7 4.1.6-2.95 2.87.7 4.05L8 11.25l-3.65 1.97.7-4.05L2.1 5.3l4.1-.6L8 2z" stroke="currentColor" strokeWidth="1.2" /></svg>}
          title="Premium Materials"
        />
        {t.premiumMaterials.length > 0
          ? <ChipList items={t.premiumMaterials} variant="green" />
          : <EmptyState message="No material information available" />}
      </Card>

      <Card>
        <CardTitle
          icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2L3 4.5V8c0 3 2.2 5 5 5.5 2.8-.5 5-2.5 5-5.5V4.5L8 2z" stroke="currentColor" strokeWidth="1.3" /></svg>}
          title="Compliance & Certifications"
        />
        {t.certifications.length > 0 ? (
          <div className="lp-cert-list">
            {t.certifications.map((cert) => (
              <div key={cert} className="lp-cert-item">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M4 7.5l2 2 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {cert}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No certification information available" />
        )}
      </Card>

      <Card>
        <CardTitle
          icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 3h10v10H3V3z" stroke="currentColor" strokeWidth="1.3" /><path d="M6 6l4 4M10 6l-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>}
          title="File Format Support"
        />
        {t.fileFormats.length > 0
          ? <ChipList items={t.fileFormats} variant="orange" />
          : <EmptyState message="No file format information available" />}
      </Card>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
// 5. TURNAROUND TIMES
// ══════════════════════════════════════════════════════════════════
export const TurnaroundPage: React.FC<{ lab: Lab }> = ({ lab }) => {
  const t = lab.turnaround;

  return (
    <div className="lp-page">
      {t.note && (
        <div className="lp-info-banner">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <p><strong>Note:</strong> {t.note}</p>
        </div>
      )}
      <Card>
        <div className="lp-tat-grid">
          <div className="lp-tat-card tat-blue">
            <span className="lp-tat-label">Standard TAT</span>
            <span className="lp-tat-value">{t.standardTat}</span>
            <span className="lp-tat-unit">days</span>
          </div>
          <div className="lp-tat-card tat-orange">
            <span className="lp-tat-label">Rush TAT</span>
            <span className="lp-tat-value">{t.rushTat}</span>
            <span className="lp-tat-unit">days</span>
          </div>
          <div className="lp-tat-card tat-green">
            <span className="lp-tat-label">On-Time Rate</span>
            <span className="lp-tat-value">{t.onTimeRate}%</span>
            <span className="lp-tat-unit">delivery</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
// 6. PRICING
// ══════════════════════════════════════════════════════════════════
export const PricingPage: React.FC<{ lab: Lab }> = ({ lab }) => {
  const p = lab.pricing;

  return (
    <div className="lp-page">
      <Card>
        <div className="lp-pricing-tiers">
          <div className="lp-tier">
            <span className="lp-tier-badge">Base Price</span>
            <span className="lp-tier-amount">
              <span className="lp-tier-currency">£</span>
              {p.basePrice ?? '—'}
            </span>
            <span className="lp-tier-unit">per unit</span>
          </div>
          <div className="lp-tier tier-mid">
            <span className="lp-tier-badge">50+ Monthly</span>
            <span className="lp-tier-amount">
              <span className="lp-tier-currency">£</span>
              {p.price50Plus ?? '—'}
            </span>
            <span className="lp-tier-unit">per unit</span>
          </div>
          <div className="lp-tier tier-high">
            <span className="lp-tier-badge">200+ Monthly</span>
            <span className="lp-tier-amount">
              <span className="lp-tier-currency">£</span>
              {p.price200Plus ?? '—'}
            </span>
            <span className="lp-tier-unit">per unit</span>
          </div>
        </div>
      </Card>

      <Card>
        <CardTitle
          icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2a6 6 0 100 12A6 6 0 008 2zM8 5v3l2 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>}
          title="Pricing Benefits"
        />
        <div className="lp-benefit-grid">
          <div className={`lp-benefit-card ${p.freeRemakes ? 'yes-benefit' : ''}`}>
            <svg className="lp-benefit-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
              {p.freeRemakes
                ? <path d="M6 10.5l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                : <path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />}
            </svg>
            <div>
              <div className="lp-benefit-title">Free Remakes</div>
              <div className="lp-benefit-sub">{p.remakeWindow ?? 'Not available'}</div>
            </div>
          </div>
          <div className={`lp-benefit-card ${p.shippingIncluded ? 'yes-benefit' : ''}`}>
            <svg className="lp-benefit-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="6" width="12" height="9" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <path d="M14 9h2l2 3v3h-4V9z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <circle cx="6" cy="17" r="1.5" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="15" cy="17" r="1.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <div>
              <div className="lp-benefit-title">Shipping Included</div>
              <div className="lp-benefit-sub">{p.shippingMethod ?? 'Not included'}</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
// 7. SUPPORT
// ══════════════════════════════════════════════════════════════════
export const SupportPage: React.FC<{ lab: Lab }> = ({ lab }) => {
  const s = lab.support;

  const features = [
    {
      key: 'portal', active: s.portal24x7, color: 's-blue',
      iconBg: 'rgba(59,130,246,0.12)', iconColor: '#3b82f6',
      title: '24/7 Online Portal',
      desc: 'Case status tracking, chat, and annotations available anytime',
    },
    {
      key: 'manager', active: s.accountManager, color: 's-purple',
      iconBg: 'rgba(124,58,237,0.12)', iconColor: '#7c3aed',
      title: 'Account Manager',
      desc: 'Dedicated personal support contact for your practice',
    },
    {
      key: 'consult', active: s.freeConsultations, color: 's-green',
      iconBg: 'rgba(16,185,129,0.12)', iconColor: '#10b981',
      title: 'Free Consultations',
      desc: 'Case consultations and Rx reviews included at no charge',
    },
    {
      key: 'chairside', active: s.chairsideSupport, color: 's-orange',
      iconBg: 'rgba(245,158,11,0.12)', iconColor: '#f59e0b',
      title: 'Chairside Support',
      desc: 'Available nationwide for complex cases',
    },
  ];

  return (
    <div className="lp-page">
      <div className="lp-support-grid">
        {features.map((f) => (
          <div key={f.key} className={`lp-support-card ${f.active ? f.color : 'inactive'}`}>
            <div className="lp-support-icon-wrap" style={{ background: f.iconBg, color: f.iconColor }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.4" />
                {f.active
                  ? <path d="M5.5 9.5l2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  : <path d="M6.5 6.5l5 5M11.5 6.5l-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />}
              </svg>
            </div>
            <div className="lp-support-title">{f.title}</div>
            <div className="lp-support-desc">{f.active ? f.desc : 'Not available'}</div>
          </div>
        ))}
      </div>

      <Card>
        <CardTitle
          icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" /><path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>}
          title="Response Time"
        />
        <div className="lp-response-wrap">
          <span className="lp-response-val">{s.responseTimeHours}</span>
          <span className="lp-response-unit">hours average</span>
        </div>
      </Card>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
// 8. PARTNERSHIP
// ══════════════════════════════════════════════════════════════════
export const PartnershipPage: React.FC<{ lab: Lab }> = ({ lab }) => {
  const p = lab.partnership;

  return (
    <div className="lp-page">
      <div className="lp-partner-grid">
        {/* Free sample */}
        <div className={`lp-card lp-partner-card ${p.freeSampleAvailable ? 'yes-green' : ''}`}>
          <div className="lp-support-icon-wrap"
            style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', width: 38, height: 38, borderRadius: 9 }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.4" />
              {p.freeSampleAvailable
                ? <path d="M5.5 9.5l2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                : <path d="M6.5 6.5l5 5M11.5 6.5l-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />}
            </svg>
          </div>
          <h4>Free Sample Available</h4>
          <p>{p.freeSampleAvailable ? 'Try our quality with a complimentary sample restoration' : 'Not currently available'}</p>
        </div>

        {/* First order discount */}
        <div className="lp-card lp-discount-card">
          <div className="lp-support-icon-wrap"
            style={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6', width: 38, height: 38, borderRadius: 9 }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.4" />
              <path d="M7 9h4M9 7v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>
          <h4>First Order Discount</h4>
          <div className="lp-coupon">
            <div>
              <span className="lp-coupon-label">Discount Code</span>
              <span className="lp-coupon-code">{p.discountCode ?? 'N/A'}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="lp-coupon-pct">{p.firstOrderDiscount}%</span>
              <br />
              <span className="lp-coupon-off">OFF</span>
            </div>
          </div>
        </div>
      </div>

      {/* Partnership benefits */}
      <Card>
        <CardTitle
          icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1l2 5h5l-4 3 1.5 5L8 11l-4.5 3L5 9 1 6h5L8 1z" stroke="currentColor" strokeWidth="1.2" /></svg>}
          title="Partnership Benefits"
        />
        {p.partnershipBenefits.length > 0 ? (
          <ul className="lp-benefits-list">
            {p.partnershipBenefits.map((b, i) => (
              <li key={i}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M4 7.5l2 2 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {b}
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState message="No partnership benefits listed" />
        )}
      </Card>
    </div>
  );
};
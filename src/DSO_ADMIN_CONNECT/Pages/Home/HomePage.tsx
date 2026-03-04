// src/DSO_ADMIN_CONNECT/Pages/Home/HomePage.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Demonstrates KiduAnalyticsCard with:
//   • Static props (years, labs)
//   • Async fetchOptions (practices fetched from API)
//   • Line chart and Bar chart variants
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { Container } from 'react-bootstrap';
import { FileText, TrendingUp, Users, Building2 } from 'lucide-react';
import KiduStatsCardsGrid from '../../../KIDU_COMPONENTS/KiduStatsCardsGrid';
import type { StatCardProps } from '../../../Types/KiduTypes/StatCard.types';
import AuthService from '../../../Services/AuthServices/Auth.services';
import KiduAnalyticsCard from '../../../KIDU_COMPONENTS/Analytics/KiduAnalyticscard';

// ─── Mock API — replace with real service calls ───────────────────
const fetchPractices = (): Promise<string[]> =>
  new Promise((res) =>
    setTimeout(() => res(['All', 'Practice A', 'Practice B', 'Practice C']), 800)
  );

// ─── Static chart data ────────────────────────────────────────────
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const caseVolumeData = MONTHS.map((month) => ({
  month,
  ALSD: Math.round(Math.random() * 40 + 10),
  DIL:  Math.round(Math.random() * 30 + 5),
  MYL:  Math.round(Math.random() * 25 + 5),
  SDL:  Math.round(Math.random() * 20 + 3),
}));

const labSpendTrendData = MONTHS.map((month, i) => ({
  month,
  '2026': i < 2 ? Math.round(Math.random() * 400 + 300) : undefined,
  '2025': Math.round(Math.random() * 200 + 50),
  '2024': Math.round(Math.random() * 150 + 30),
}));

const labSpendBarData = MONTHS.map((month) => ({
  month,
  Spend: Math.round(Math.random() * 500 + 50),
}));

// ─── Chart series ─────────────────────────────────────────────────
const caseVolumeSeries = [
  { dataKey: 'ALSD', label: 'ALSD', color: '#ef0d50' },
  { dataKey: 'DIL',  label: 'DIL',  color: '#3b82f6' },
  { dataKey: 'MYL',  label: 'MYL',  color: '#10b981' },
  { dataKey: 'SDL',  label: 'SDL',  color: '#f59e0b' },
];

const labSpendTrendSeries = [
  { dataKey: '2026', label: '2026', color: '#ef0d50' },
  { dataKey: '2025', label: '2025', color: '#10b981' },
  { dataKey: '2024', label: '2024', color: '#f59e0b' },
];

const labSpendBarSeries = [
  { dataKey: 'Spend', label: 'Lab Spend', color: '#10b981' },
];

// ─── HomePage ─────────────────────────────────────────────────────
const HomePage: React.FC = () => {
  const user = AuthService.getUser();

  const statsCards: StatCardProps[] = [
    { title: 'Total Cases',    value: '156',    change: '+12% from last month',  changeType: 'positive', icon: FileText   },
    { title: 'Active Doctors', value: '24',     change: '+2 new this week',      changeType: 'positive', icon: Users,      variant: 'info'    },
    { title: 'Partner Labs',   value: '8',      change: 'Same as last month',    changeType: 'neutral',  icon: Building2,  variant: 'primary' },
    { title: 'Revenue',        value: '$45.2K', change: '+8.5% from last month', changeType: 'positive', icon: TrendingUp, variant: 'success' },
  ];

  return (
    <Container fluid className="dashboard-page py-4">

      {/* Page Header */}
      <div className="page-header mb-4">
        <h3 className="page-title">Analytics</h3>
        <p className="page-description">
          Welcome back, <strong>{user?.userName ?? 'DSO Admin'}</strong>! Here's an overview of your dental cases.
        </p>
      </div>

      {/* Stats */}
      <KiduStatsCardsGrid cards={statsCards} columns={4} />

      {/* ── Case Volume ─────────────────────────────────────────── */}
      {/*
        filterGroups accepts any combination of:
          options: [...]                         — static list
          fetchOptions: () => Promise<string[]>  — async API fetch
        The card resolves both automatically.
      */}
      <div className="mt-4">
        <KiduAnalyticsCard
          title="Case Volume"
          filterGroups={[
            {
              label: 'Select Year',
              options: ['2024', '2025', '2026'],
              defaultSelected: '2025',
            },
            {
              label: 'Select Labs',
              options: ['All', 'ALSD', 'DIL', 'MYL', 'SDL'],
              defaultSelected: ['All'],
              multi: true,
            },
          ]}
          chartData={caseVolumeData}
          chartSeries={caseVolumeSeries}
          chartType="line"
          chartHeight={240}
          onFilterChange={(groupLabel, value) => {
            console.log('[CaseVolume] filter changed:', groupLabel, value);
            // TODO: call your API with new filters and update chartData via state
          }}
        />
      </div>

      {/* ── Case Volume Trend ────────────────────────────────────── */}
      <div className="mt-4">
        <KiduAnalyticsCard
          title="Case Volume Trend"
          filterGroups={[
            {
              label: 'Select Years',
              options: ['All', '2024', '2025', '2026'],
              defaultSelected: ['All'],
              multi: true,
            },
            {
              label: 'Select Lab',
              options: ['ALSD', 'DIL', 'MYL', 'SDL'],
              defaultSelected: 'ALSD',
            },
          ]}
          chartData={caseVolumeData}
          chartSeries={caseVolumeSeries}
          chartType="line"
          chartHeight={240}
          dimensionOptions={['Lab Wise', 'Practice Wise']}
          onFilterChange={(g, v) => console.log('[VolumeTrend]', g, v)}
          onDimensionChange={(dim) => console.log('[VolumeTrend] dimension:', dim)}
        />
      </div>

      {/* ── Lab Spend Trend  (practices loaded async from API) ───── */}
      <div className="mt-4">
        <KiduAnalyticsCard
          title="Lab Spend Trend"
          filterGroups={[
            {
              label: 'Select Years',
              options: ['All', '2026', '2025', '2024'],
              defaultSelected: ['All'],
              multi: true,
            },
            {
              label: 'Select Lab',
              options: ['ALSD', 'CDL', 'DIL', 'MYL', 'SDL', 'SNDL'],
              defaultSelected: 'MYL',
            },
            {
              // Async example: options fetched from API on mount
              label: 'Select Practice',
              fetchOptions: fetchPractices,
              defaultSelected: 'All',
            },
          ]}
          chartData={labSpendTrendData}
          chartSeries={labSpendTrendSeries}
          chartType="line"
          yPrefix="£"
          chartHeight={240}
          dimensionOptions={['Lab Wise', 'Practice Wise']}
          onFilterChange={(g, v) => console.log('[SpendTrend]', g, v)}
        />
      </div>

      {/* ── Lab Spend Bar ────────────────────────────────────────── */}
      <div className="mt-4 mb-4">
        <KiduAnalyticsCard
          title="Lab Spend"
          filterGroups={[
            {
              label: 'Select Year',
              options: ['2026', '2025', '2024'],
              defaultSelected: '2026',
            },
            {
              label: 'Select Labs',
              options: ['All', 'ALSD', 'CDL', 'DIL', 'MYL', 'SDL', 'SNDL'],
              defaultSelected: ['All'],
              multi: true,
            },
          ]}
          chartData={labSpendBarData}
          chartSeries={labSpendBarSeries}
          chartType="bar"
          yPrefix="£"
          chartHeight={240}
          onFilterChange={(g, v) => console.log('[LabSpend]', g, v)}
        />
      </div>

    </Container>
  );
};

export default HomePage;
/* ============================================================
   pages/AdminIndexPage.tsx
   Index page for ADMIN login.

   Tabs visible: Scan Rejected | Case on Hold | In Transit |
                 In Production | Submitted | Recent (all 6)
   Card mode: admin → View-only (no action buttons)
              Full visibility across all practices / labs
   ============================================================ */

import React, { useEffect, useState } from 'react';
import CaseDashboard from '../../KIDU_COMPONENTS/KiduCaseDashboard';
import { fetchDashboardData } from '../../Configs/Dummydata';
import type { DashboardPageData } from '../../Types/IndexPage.types';


const AdminIndexPage: React.FC = () => {
  const [data, setData]       = useState<DashboardPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // ── Replace with real API call:
    // fetch('/api/v1/dashboard?role=admin').then(r => r.json()).then(setData)
    fetchDashboardData('admin')
      .then(setData)
      .catch(() => setError('Failed to load dashboard. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#ef4444', fontFamily: 'Outfit,sans-serif' }}>
        {error}
      </div>
    );
  }

  return (
    <CaseDashboard
      role="admin"
      data={data ?? {
        role: 'admin',
        tabCounts: { rejected: 0, hold: 0, transit: 0, production: 0, submitted: 0, recent: 0 },
        cases:     { rejected: [], hold: [], transit: [], production: [], submitted: [], recent: [] },
      }}
      loading={loading}
    />
  );
};

export default AdminIndexPage;
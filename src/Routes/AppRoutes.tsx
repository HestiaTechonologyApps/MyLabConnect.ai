// src/Routes/AppRoutes.tsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../Auth/ProtectedRoute';
import LoginPage from '../Auth/LoginPage';
import ForceChangePassword from '../Auth/ForceChangePassword';

import { dsoadminConnectRoutes }   from '../DSO_ADMIN_CONNECT/Routes/Route';
import { labConnectRoutes }        from '../LAB_CONNECT/Routes/Route';
import { practiceConnectRoutes }   from '../PRACTICE_CONNECT/Routes/Route';
import { adminConnectRoutes }      from '../ADMIN/Routes/Route';
import { doctorConnectRoutes }     from '../DOCTOR_CONNECT/Routes/Route';
import { integratorConnectRoutes } from '../INTEGRATOR_CONNECT/Routes/Route';

const Unauthorized: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
    <h2>Access Denied</h2>
    <p>You don't have permission to view this page.</p>
    <a href="/">Go to Login</a>
  </div>
);

const AppRoutes: React.FC = () => (
  <Routes>

    {/* ── Public: Login (also handles 2FA modal inline) ───────────── */}
    <Route path="/" element={<LoginPage />} />

    {/* ── AC2: Forced password change ─────────────────────────────── */}
    {/* Not wrapped in ProtectedRoute — only has a temp token here.   */}
    {/* Guarded internally by hasTempToken() check in the component.  */}
    <Route path="/force-change-password" element={<ForceChangePassword />} />

    {/* ── AppAdmin Portal ─────────────────────────────────────────── */}
    <Route
      path="/appadmin-connect/*"
      element={
        <ProtectedRoute allowedUserTypes={['AppAdmin']}>
          <Routes>{adminConnectRoutes}</Routes>
        </ProtectedRoute>
      }
    />

    {/* ── DSO Portal ──────────────────────────────────────────────── */}
    <Route
      path="/dsoadmin-connect/*"
      element={
        <ProtectedRoute allowedUserTypes={['DSO']}>
          <Routes>{dsoadminConnectRoutes}</Routes>
        </ProtectedRoute>
      }
    />

    {/* ── Lab Portal ──────────────────────────────────────────────── */}
    <Route
      path="/lab-connect/*"
      element={
        <ProtectedRoute allowedUserTypes={['Lab']}>
          <Routes>{labConnectRoutes}</Routes>
        </ProtectedRoute>
      }
    />

    {/* ── Practice Portal ─────────────────────────────────────────── */}
    <Route
      path="/practice-connect/*"
      element={
        <ProtectedRoute allowedUserTypes={['Practice']}>
          <Routes>{practiceConnectRoutes}</Routes>
        </ProtectedRoute>
      }
    />

    {/* ── Doctor Portal ───────────────────────────────────────────── */}
    <Route
      path="/doctor-connect/*"
      element={
        <ProtectedRoute allowedUserTypes={['Doctor']}>
          <Routes>{doctorConnectRoutes}</Routes>
        </ProtectedRoute>
      }
    />

    {/* ── Integrator Portal ───────────────────────────────────────── */}
    <Route
      path="/integrator-connect/*"
      element={
        <ProtectedRoute allowedUserTypes={['Integrator']}>
          <Routes>{integratorConnectRoutes}</Routes>
        </ProtectedRoute>
      }
    />

    <Route path="/unauthorized" element={<Unauthorized />} />
    <Route path="*"             element={<Navigate to="/" replace />} />

  </Routes>
);

export default AppRoutes;
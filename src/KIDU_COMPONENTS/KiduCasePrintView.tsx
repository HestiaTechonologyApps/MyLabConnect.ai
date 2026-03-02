import React from 'react';
import '../Styles/KiduStyles/CasePrintView.css';
import type { CaseDetailData, LoginRole } from './KiduCaseDetailModal';

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────

export interface PrintViewProps {
  data: CaseDetailData;
  role: LoginRole;
  /**
   * When true, renders the compact "Prescription" layout (for practice role).
   * When false (default), renders the full case detail print layout.
   */
  isPrescription?: boolean;
  /** Optional clinic/lab logo URL */
  logoUrl?: string;
}

// ─────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────

const PrintRow: React.FC<{ label: string; value?: string; mono?: boolean }> = ({
  label, value, mono,
}) => (
  <tr className="pv-row">
    <td className="pv-label">{label}</td>
    <td className={`pv-value${mono ? ' pv-value--mono' : ''}`}>{value || '—'}</td>
  </tr>
);

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

const CasePrintView: React.FC<PrintViewProps> = ({
  data,
  role,
  isPrescription = false,
  logoUrl,
}) => {
  const printDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  return (
    <div className="pv-root">
      {/* ── Header ── */}
      <header className="pv-header">
        <div className="pv-header__left">
          {logoUrl ? (
            <img src={logoUrl} alt="Lab logo" className="pv-logo" />
          ) : (
            <div className="pv-logo-placeholder">ML</div>
          )}
          <div>
            <div className="pv-brand">{'{my}'}labconnect</div>
            <div className="pv-brand-sub">Dental Lab Management System</div>
          </div>
        </div>
        <div className="pv-header__right">
          <div className="pv-doc-type">
            {isPrescription ? 'LAB PRESCRIPTION' : 'CASE DETAIL REPORT'}
          </div>
          <div className="pv-print-date">Printed: {printDate}</div>
          <div className="pv-case-id">{data.id}</div>
        </div>
      </header>

      <div className="pv-divider" />

      {/* ── Patient / Case Info ── */}
      <section className="pv-section">
        <h2 className="pv-section__title">Patient &amp; Case Information</h2>
        <table className="pv-table">
          <tbody>
            <PrintRow label="Case ID"       value={data.id}          mono />
            <PrintRow label="Patient Name"  value={data.patientName} />
            <PrintRow label="Patient ID"    value={data.patientId}   mono />
            <PrintRow label="Lab"           value={data.lab} />
          </tbody>
        </table>
      </section>

      {/* ── Doctor Information ── */}
      <section className="pv-section">
        <h2 className="pv-section__title">Doctor Information</h2>
        <table className="pv-table">
          <tbody>
            <PrintRow label="Doctor ID"     value={data.doctorId}     mono />
            <PrintRow label="Doctor Name"   value={data.doctorName} />
            <PrintRow label="Practice Name" value={data.practiceName} />
            <PrintRow label="Address"       value={data.address} />
            {data.statusNote && (
              <PrintRow label="Status" value={data.statusNote} />
            )}
          </tbody>
        </table>
      </section>

      {/* ── Progress ── */}
      {!isPrescription && (
        <section className="pv-section">
          <h2 className="pv-section__title">Case Progress</h2>
          <div className="pv-steps">
            {data.steps.map((step, idx) => (
              <div key={`${step.label}-${idx}`} className={`pv-step pv-step--${step.status}`}>
                <div className="pv-step__dot">
                  {step.status === 'done' && '✓'}
                  {step.status === 'hold' && '!'}
                  {(step.status === 'active' || step.status === 'pending') && idx + 1}
                </div>
                <div className="pv-step__label">{step.label}</div>
                {step.date && <div className="pv-step__date">{step.date}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Restoration Details ── */}
      {data.restoration && (
        <section className="pv-section">
          <h2 className="pv-section__title">Restoration Details</h2>
          <table className="pv-table">
            <tbody>
              <PrintRow label="Prosthesis Type"    value={data.restoration.prosthesisType} />
              <PrintRow label="Restoration Details" value={data.restoration.restorationDetails} />
              <PrintRow label="Product"            value={data.restoration.product} />
              <PrintRow label="Tooth"              value={data.restoration.tooth} mono />
              <PrintRow label="Shade"              value={data.restoration.shade} mono />
            </tbody>
          </table>
        </section>
      )}

      {/* ── Additional Info (non-prescription) ── */}
      {!isPrescription && data.additionalInfo && (
        <section className="pv-section">
          <h2 className="pv-section__title">Additional Information</h2>
          <p className="pv-text">{data.additionalInfo}</p>
        </section>
      )}

      {/* ── Case Notes ── */}
      {data.caseNotes !== undefined && (
        <section className="pv-section">
          <h2 className="pv-section__title">Case Notes</h2>
          <p className="pv-text">{data.caseNotes || 'N/A'}</p>
        </section>
      )}

      {/* ── IOS Remarks ── */}
      {!isPrescription && data.iosRemarks !== undefined && (
        <section className="pv-section">
          <h2 className="pv-section__title">IOS Remarks</h2>
          <p className="pv-text">{data.iosRemarks || 'N/A'}</p>
        </section>
      )}

      {/* ── Files ── */}
      {!isPrescription && data.files && data.files.length > 0 && (
        <section className="pv-section">
          <h2 className="pv-section__title">Attached Files</h2>
          <table className="pv-table">
            <thead>
              <tr>
                <th className="pv-th">File Name</th>
                <th className="pv-th">Details</th>
              </tr>
            </thead>
            <tbody>
              {data.files.map(f => (
                <tr key={f.id} className="pv-row">
                  <td className="pv-value pv-value--mono" style={{ fontSize: '0.7rem' }}>{f.name}</td>
                  <td className="pv-label">{f.meta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* ── Signature Area ── */}
      <div className="pv-signatures">
        <div className="pv-sig">
          <div className="pv-sig__line" />
          <div className="pv-sig__label">Doctor Signature</div>
        </div>
        <div className="pv-sig">
          <div className="pv-sig__line" />
          <div className="pv-sig__label">Lab Technician</div>
        </div>
        <div className="pv-sig">
          <div className="pv-sig__line" />
          <div className="pv-sig__label">Date</div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="pv-footer">
        <span>Generated by {'{my}'}labconnect · {printDate}</span>
        <span>Case: {data.id} · Patient: {data.patientName}</span>
      </footer>
    </div>
  );
};

// ─────────────────────────────────────────────
// Print trigger helper
// ─────────────────────────────────────────────

/**
 * Opens a print-specific window with the PrintView rendered inside.
 * Call this from your onClick handler.
 *
 * Usage:
 *   import { triggerPrint } from './PrintView';
 *   triggerPrint(data, role, false);
 */
export const triggerPrint = (
  data: CaseDetailData,
  role: LoginRole,
  isPrescription = false
): void => {
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) return;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isPrescription ? 'Prescription' : 'Case Report'} — ${data.id}</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    ${PRINT_CSS}
  </style>
</head>
<body>
  ${generatePrintHTML(data, isPrescription)}
  <script>
    window.onload = function() { window.print(); }
  </script>
</body>
</html>`;

  printWindow.document.write(html);
  printWindow.document.close();
};

const PRINT_CSS = `
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:'Outfit',sans-serif; color:#0f172a; background:#fff; padding:20px; font-size:13px; }
  .pv-root { max-width:800px; margin:0 auto; }
  .pv-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px; }
  .pv-header__left { display:flex; align-items:center; gap:12px; }
  .pv-logo-placeholder { width:42px; height:42px; border-radius:10px; background:linear-gradient(135deg,#ef0d50,#eb3a70); display:flex; align-items:center; justify-content:center; color:#fff; font-weight:800; font-size:0.8rem; }
  .pv-brand { font-size:1rem; font-weight:800; color:#0f172a; }
  .pv-brand-sub { font-size:0.64rem; color:#94a3b8; }
  .pv-header__right { text-align:right; }
  .pv-doc-type { font-size:0.8rem; font-weight:800; color:#ef0d50; text-transform:uppercase; letter-spacing:0.08em; }
  .pv-print-date { font-size:0.62rem; color:#94a3b8; margin-top:3px; font-family:'DM Mono',monospace; }
  .pv-case-id { font-size:0.72rem; font-weight:700; color:#0f172a; margin-top:3px; font-family:'DM Mono',monospace; }
  .pv-divider { height:2px; background:linear-gradient(90deg,#ef0d50,#eb3a70,transparent); border-radius:1px; margin-bottom:18px; }
  .pv-section { margin-bottom:16px; border:1px solid #e2e8f0; border-radius:10px; overflow:hidden; }
  .pv-section__title { font-size:0.68rem; font-weight:800; text-transform:uppercase; letter-spacing:0.07em; color:#475569; padding:8px 14px; background:#f8fafc; border-bottom:1px solid #e2e8f0; }
  .pv-table { width:100%; border-collapse:collapse; }
  .pv-row td { padding:7px 14px; border-bottom:1px solid #f1f5f9; vertical-align:top; }
  .pv-row:last-child td { border-bottom:none; }
  .pv-label { font-size:0.65rem; color:#64748b; width:160px; font-weight:600; }
  .pv-value { font-size:0.74rem; color:#0f172a; font-weight:500; }
  .pv-value--mono { font-family:'DM Mono',monospace; font-size:0.68rem; }
  .pv-th { font-size:0.62rem; font-weight:700; color:#475569; padding:7px 14px; background:#f8fafc; text-align:left; }
  .pv-text { font-size:0.74rem; color:#334155; line-height:1.6; padding:10px 14px; }
  .pv-steps { display:flex; align-items:center; padding:12px 14px; gap:0; }
  .pv-step { display:flex; flex-direction:column; align-items:center; gap:4px; flex:1; }
  .pv-step__dot { width:26px; height:26px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.6rem; font-weight:800; }
  .pv-step--done .pv-step__dot   { background:#10b981; color:#fff; }
  .pv-step--hold .pv-step__dot   { background:#ef4444; color:#fff; }
  .pv-step--active .pv-step__dot { background:#ef0d50; color:#fff; }
  .pv-step--pending .pv-step__dot { background:#e2e8f0; color:#94a3b8; }
  .pv-step__label { font-size:0.56rem; color:#64748b; text-align:center; }
  .pv-step__date  { font-size:0.5rem; color:#94a3b8; font-family:'DM Mono',monospace; }
  .pv-signatures { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; margin:24px 0 18px; }
  .pv-sig__line { height:1px; background:#cbd5e1; margin-bottom:6px; }
  .pv-sig__label { font-size:0.62rem; color:#64748b; }
  .pv-footer { display:flex; justify-content:space-between; font-size:0.58rem; color:#94a3b8; border-top:1px solid #e2e8f0; padding-top:10px; font-family:'DM Mono',monospace; }
  @media print { body { padding:10mm 15mm; } }
`;

const generatePrintHTML = (data: CaseDetailData, isPrescription: boolean): string => {
  const printDate = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'long', year:'numeric' });
  const steps = data.steps.map((s, i) =>
    `<div class="pv-step pv-step--${s.status}">
       <div class="pv-step__dot">${s.status==='done'?'✓':s.status==='hold'?'!':i+1}</div>
       <div class="pv-step__label">${s.label}</div>
       ${s.date?`<div class="pv-step__date">${s.date}</div>`:''}
     </div>`
  ).join('');

  const files = (data.files || []).map(f =>
    `<tr class="pv-row"><td class="pv-value pv-value--mono">${f.name}</td><td class="pv-label">${f.meta}</td></tr>`
  ).join('');

  return `
<div class="pv-root">
  <header class="pv-header">
    <div class="pv-header__left">
      <div class="pv-logo-placeholder">ML</div>
      <div><div class="pv-brand">{my}labconnect</div><div class="pv-brand-sub">Dental Lab Management System</div></div>
    </div>
    <div class="pv-header__right">
      <div class="pv-doc-type">${isPrescription?'LAB PRESCRIPTION':'CASE DETAIL REPORT'}</div>
      <div class="pv-print-date">Printed: ${printDate}</div>
      <div class="pv-case-id">${data.id}</div>
    </div>
  </header>
  <div class="pv-divider"></div>

  <section class="pv-section">
    <h2 class="pv-section__title">Patient &amp; Case Information</h2>
    <table class="pv-table"><tbody>
      <tr class="pv-row"><td class="pv-label">Case ID</td><td class="pv-value pv-value--mono">${data.id}</td></tr>
      <tr class="pv-row"><td class="pv-label">Patient Name</td><td class="pv-value">${data.patientName}</td></tr>
      <tr class="pv-row"><td class="pv-label">Patient ID</td><td class="pv-value pv-value--mono">${data.patientId||'—'}</td></tr>
      <tr class="pv-row"><td class="pv-label">Lab</td><td class="pv-value">${data.lab}</td></tr>
    </tbody></table>
  </section>

  <section class="pv-section">
    <h2 class="pv-section__title">Doctor Information</h2>
    <table class="pv-table"><tbody>
      <tr class="pv-row"><td class="pv-label">Doctor ID</td><td class="pv-value pv-value--mono">${data.doctorId||'—'}</td></tr>
      <tr class="pv-row"><td class="pv-label">Doctor Name</td><td class="pv-value">${data.doctorName||'—'}</td></tr>
      <tr class="pv-row"><td class="pv-label">Practice Name</td><td class="pv-value">${data.practiceName||'—'}</td></tr>
      <tr class="pv-row"><td class="pv-label">Address</td><td class="pv-value">${data.address||'—'}</td></tr>
      ${data.statusNote?`<tr class="pv-row"><td class="pv-label">Status</td><td class="pv-value">${data.statusNote}</td></tr>`:''}
    </tbody></table>
  </section>

  ${!isPrescription ? `
  <section class="pv-section">
    <h2 class="pv-section__title">Case Progress</h2>
    <div class="pv-steps">${steps}</div>
  </section>` : ''}

  ${data.restoration ? `
  <section class="pv-section">
    <h2 class="pv-section__title">Restoration Details</h2>
    <table class="pv-table"><tbody>
      <tr class="pv-row"><td class="pv-label">Prosthesis Type</td><td class="pv-value">${data.restoration.prosthesisType}</td></tr>
      <tr class="pv-row"><td class="pv-label">Restoration Details</td><td class="pv-value">${data.restoration.restorationDetails}</td></tr>
      <tr class="pv-row"><td class="pv-label">Product</td><td class="pv-value">${data.restoration.product}</td></tr>
      <tr class="pv-row"><td class="pv-label">Tooth</td><td class="pv-value pv-value--mono">${data.restoration.tooth}</td></tr>
      <tr class="pv-row"><td class="pv-label">Shade</td><td class="pv-value pv-value--mono">${data.restoration.shade}</td></tr>
    </tbody></table>
  </section>` : ''}

  ${data.caseNotes !== undefined ? `
  <section class="pv-section">
    <h2 class="pv-section__title">Case Notes</h2>
    <p class="pv-text">${data.caseNotes || 'N/A'}</p>
  </section>` : ''}

  ${!isPrescription && data.iosRemarks !== undefined ? `
  <section class="pv-section">
    <h2 class="pv-section__title">IOS Remarks</h2>
    <p class="pv-text">${data.iosRemarks || 'N/A'}</p>
  </section>` : ''}

  ${!isPrescription && files ? `
  <section class="pv-section">
    <h2 class="pv-section__title">Attached Files</h2>
    <table class="pv-table">
      <thead><tr><th class="pv-th">File Name</th><th class="pv-th">Details</th></tr></thead>
      <tbody>${files}</tbody>
    </table>
  </section>` : ''}

  <div class="pv-signatures">
    <div class="pv-sig"><div class="pv-sig__line"></div><div class="pv-sig__label">Doctor Signature</div></div>
    <div class="pv-sig"><div class="pv-sig__line"></div><div class="pv-sig__label">Lab Technician</div></div>
    <div class="pv-sig"><div class="pv-sig__line"></div><div class="pv-sig__label">Date</div></div>
  </div>
  <footer class="pv-footer">
    <span>Generated by {my}labconnect · ${printDate}</span>
    <span>Case: ${data.id} · Patient: ${data.patientName}</span>
  </footer>
</div>`;
};

export default CasePrintView;
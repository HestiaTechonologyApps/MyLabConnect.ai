// src/KIDU_COMPONENTS/KiduChartPanel.tsx
// ─────────────────────────────────────────────────────────────────────────────
// A thin wrapper that renders a Recharts chart from a generic data prop.
// Supports 'line', 'bar', and 'area' chart types.
//
// Props:
//   data         — array of data objects, each keyed by dataKey + 'month'/'date'
//   series       — which keys to draw lines/bars for (with label + color)
//   chartType    — 'line' | 'bar' | 'area'
//   xKey         — key used for x-axis (default: 'month')
//   yLabel       — optional Y-axis label prefix (e.g. '£', '$')
//   height       — chart height in px (default: 240)
//   emptyMessage — shown when data is empty
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  AreaChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { BarChart2 } from 'lucide-react';
import '../../Styles/KiduStyles/Filterseelctor.css';

export interface ChartSeries {
  /** Key in the data object */
  dataKey: string;
  /** Display label for legend/tooltip */
  label: string;
  /** Hex / CSS color */
  color: string;
}

export interface KiduChartPanelProps {
  data: Record<string, unknown>[];
  series: ChartSeries[];
  chartType?: 'line' | 'bar' | 'area';
  xKey?: string;
  /** Currency / unit prefix rendered in tooltip & y-axis ticks */
  yPrefix?: string;
  height?: number;
  emptyMessage?: string;
}

// ─── Custom tooltip ──────────────────────────────────────────────
const CustomTooltip = ({
  active,
  payload,
  label,
  yPrefix = '',
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
  yPrefix?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: 'var(--theme-bg-paper)',
        border: '1px solid var(--theme-border)',
        borderRadius: '0.5rem',
        padding: '0.5rem 0.75rem',
        fontSize: '0.8rem',
        boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
        minWidth: 120,
      }}
    >
      <p style={{ margin: '0 0 4px', fontWeight: 600, color: 'var(--theme-text-primary)' }}>
        {label}
      </p>
      {payload.map((p) => (
        <p key={p.name} style={{ margin: '2px 0', color: p.color }}>
          {p.name}: <strong>{yPrefix}{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

// ─── Component ───────────────────────────────────────────────────
const KiduChartPanel: React.FC<KiduChartPanelProps> = ({
  data,
  series,
  chartType = 'line',
  xKey = 'month',
  yPrefix = '',
  height = 240,
  emptyMessage = 'No data available',
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="kidu-chart-panel">
        <div
          className="kidu-chart-panel--empty"
          style={{ height }}
        >
          <BarChart2 size={18} />
          <span>{emptyMessage}</span>
        </div>
      </div>
    );
  }

  const tickStyle = {
    fill: 'var(--theme-text-secondary)',
    fontSize: 11,
  };

  const commonProps = {
    data,
    margin: { top: 8, right: 8, left: 0, bottom: 0 },
  };

  const renderXAxis = () => (
    <XAxis
      dataKey={xKey}
      tick={tickStyle}
      axisLine={false}
      tickLine={false}
      interval="preserveStartEnd"
    />
  );

  const renderYAxis = () => (
    <YAxis
      tick={tickStyle}
      axisLine={false}
      tickLine={false}
      tickFormatter={(v) => `${yPrefix}${v}`}
      width={yPrefix ? 48 : 32}
    />
  );

  const renderGrid = () => (
    <CartesianGrid stroke="var(--theme-border)" strokeDasharray="4 4" vertical={false} />
  );

  const renderTooltip = () => (
    <Tooltip
      content={<CustomTooltip yPrefix={yPrefix} />}
      cursor={{ stroke: 'var(--theme-border)', strokeWidth: 1 }}
    />
  );

  const renderLegend = () =>
    series.length > 1 ? (
      <Legend
        wrapperStyle={{ fontSize: '0.75rem', color: 'var(--theme-text-secondary)', paddingTop: 8 }}
      />
    ) : null;

  return (
    <div className="kidu-chart-panel">
      {/*
        Key fix: ResponsiveContainer with height="100%" requires its direct parent
        to have a concrete pixel height. We set that here via inline style so it
        works in both row (desktop) and column (mobile) flex layouts.
      */}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
        {chartType === 'bar' ? (
          <BarChart {...commonProps}>
            {renderGrid()}
            {renderXAxis()}
            {renderYAxis()}
            {renderTooltip()}
            {renderLegend()}
            {series.map((s) => (
              <Bar
                key={s.dataKey}
                dataKey={s.dataKey}
                name={s.label}
                fill={s.color}
                radius={[4, 4, 0, 0]}
                maxBarSize={48}
              />
            ))}
          </BarChart>
        ) : chartType === 'area' ? (
          <AreaChart {...commonProps}>
            {renderGrid()}
            {renderXAxis()}
            {renderYAxis()}
            {renderTooltip()}
            {renderLegend()}
            {series.map((s) => (
              <Area
                key={s.dataKey}
                type="monotone"
                dataKey={s.dataKey}
                name={s.label}
                stroke={s.color}
                fill={`${s.color}22`}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </AreaChart>
        ) : (
          /* default: line */
          <LineChart {...commonProps}>
            {renderGrid()}
            {renderXAxis()}
            {renderYAxis()}
            {renderTooltip()}
            {renderLegend()}
            {series.map((s) => (
              <Line
                key={s.dataKey}
                type="monotone"
                dataKey={s.dataKey}
                name={s.label}
                stroke={s.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default KiduChartPanel;
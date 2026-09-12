'use client';

import React, { useState } from 'react';

interface RtpDataPoint {
  day: string;
  rtp: number;
}

interface RtpChartProps {
  data: RtpDataPoint[];
  currentRtp: number;
  gameName: string;
}

export function RtpChart({ data, currentRtp, gameName }: RtpChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  // Chart dimensions
  const width = 600;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;

  // Min and Max calculation for dynamic Y-axis scaling
  const rtpValues = data.map((d) => d.rtp);
  const minVal = Math.floor(Math.min(...rtpValues, 92) - 0.5);
  const maxVal = Math.ceil(Math.max(...rtpValues, 99) + 0.5);

  const getX = (index: number) => {
    return paddingX + (index * (width - 2 * paddingX)) / (data.length - 1);
  };

  const getY = (val: number) => {
    return height - paddingY - ((val - minVal) / (maxVal - minVal)) * (height - 2 * paddingY);
  };

  // Build SVG path
  const points = data.map((d, i) => `${getX(i)},${getY(d.rtp)}`);
  
  // Bezier curve smoothing
  let pathD = `M ${getX(0)},${getY(data[0].rtp)}`;
  for (let i = 0; i < data.length - 1; i++) {
    const x0 = getX(i);
    const y0 = getY(data[i].rtp);
    const x1 = getX(i + 1);
    const y1 = getY(data[i + 1].rtp);
    const xc = (x0 + x1) / 2;
    pathD += ` C ${xc},${y0} ${xc},${y1} ${x1},${y1}`;
  }

  const areaD = `${pathD} L ${getX(data.length - 1)},${height - paddingY} L ${getX(0)},${height - paddingY} Z`;

  // Grid lines
  const gridSteps = 4;
  const yTicks = Array.from({ length: gridSteps + 1 }, (_, i) => {
    const val = minVal + (i * (maxVal - minVal)) / gridSteps;
    return { val: val.toFixed(1), y: getY(val) };
  });

  return (
    <div className="w-full bg-[#0a0f1d] border border-slate-800/90 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute -right-10 -top-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-white font-bold text-base sm:text-lg">
              Grafik Fluktuasi RTP 7 Hari
            </h4>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Live Verified
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Tren persentase pengembalian harian untuk {gameName}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="text-slate-300 font-medium">RTP Hari Ini: </span>
            <span className="text-emerald-400 font-bold font-mono text-sm">{currentRtp}%</span>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full aspect-[600/220] sm:aspect-[600/200]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="neonEmeraldArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="neonEmeraldLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>

            <filter id="neonGlowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#10b981" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Grid lines */}
          {yTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={paddingX}
                y1={tick.y}
                x2={width - paddingX}
                y2={tick.y}
                stroke="#1e293b"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={paddingX - 8}
                y={tick.y + 4}
                fill="#64748b"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="end"
              >
                {tick.val}%
              </text>
            </g>
          ))}

          {/* Fill area */}
          <path d={areaD} fill="url(#neonEmeraldArea)" />

          {/* Line curve */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#neonEmeraldLine)"
            strokeWidth="3"
            filter="url(#neonGlowEffect)"
            strokeLinecap="round"
          />

          {/* Data Points & Interactive hover */}
          {data.map((point, idx) => {
            const cx = getX(idx);
            const cy = getY(point.rtp);
            const isHovered = hoveredIdx === idx;
            const isLast = idx === data.length - 1;

            return (
              <g
                key={point.day}
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Vertical helper on hover */}
                {isHovered && (
                  <line
                    x1={cx}
                    y1={paddingY}
                    x2={cx}
                    y2={height - paddingY}
                    stroke="#10b981"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    opacity="0.8"
                  />
                )}

                {/* Outer halo */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 8 : isLast ? 6 : 4}
                  fill={isHovered ? '#10b981' : isLast ? '#34d399' : '#080c14'}
                  stroke="#10b981"
                  strokeWidth="2.5"
                  className="transition-all duration-150"
                />

                {/* X Axis Day Label */}
                <text
                  x={cx}
                  y={height - 8}
                  fill={isHovered || isLast ? '#10b981' : '#94a3b8'}
                  fontWeight={isHovered || isLast ? 'bold' : 'normal'}
                  fontSize="11"
                  textAnchor="middle"
                >
                  {point.day}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {hoveredIdx !== null && (
          <div
            className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-full px-3 py-1.5 rounded-lg bg-slate-900 border border-emerald-500/50 shadow-lg text-xs font-mono"
            style={{
              left: `${(getX(hoveredIdx) / width) * 100}%`,
              top: `${(getY(data[hoveredIdx].rtp) / height) * 100 - 8}%`,
            }}
          >
            <div className="text-slate-400 font-sans text-[10px]">{data[hoveredIdx].day}</div>
            <div className="text-emerald-400 font-bold text-sm">
              {data[hoveredIdx].rtp}%
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
        <span>*Data fluktuasi dihitung berdasarkan rasio hit winrate putaran pemain harian.</span>
        <span className="text-emerald-400/90 font-medium">Status Akurasi: 99.4% Terverifikasi</span>
      </div>
    </div>
  );
}

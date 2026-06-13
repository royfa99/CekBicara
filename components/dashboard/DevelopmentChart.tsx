"use client";

import React, { useEffect, useState } from 'react';

interface ChartPoint {
  month: string;
  score: number;
}

export default function DevelopmentChart() {
  const [chartData, setChartData] = useState<ChartPoint[]>([]);

  useEffect(() => {
    fetch('/api/dashboard/chart')
      .then(res => res.json())
      .then(json => {
        if (json.success) setChartData(json.data);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="dash-card col-span-8">
      <div className="dash-card-header">
        <h3 className="dash-card-title">Grafik Perkembangan (Skor Skrining)</h3>
      </div>
      
      <div className="chart-container">
        {chartData.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>Belum ada data grafik.</p>
        ) : (
          chartData.map((point, i) => (
            <div className="chart-bar" style={{ height: `${point.score}%` }} data-label={point.month} key={i}></div>
          ))
        )}
      </div>
    </div>
  );
}

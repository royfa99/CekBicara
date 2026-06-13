"use client";

import React, { useEffect, useState } from 'react';

interface Stats {
  totalSkrining: number;
  latestRiskLevel: string;
  evaluasiBerikutnya: string;
}

function getRiskColor(riskLevel: string) {
  if (riskLevel.includes('Rendah')) return '#10b981';
  if (riskLevel.includes('Sedang')) return '#d97706';
  if (riskLevel.includes('Tinggi')) return '#ef4444';
  return 'var(--text-dark)';
}

function getRiskLabel(riskLevel: string) {
  if (riskLevel.includes('Rendah')) return 'Rendah';
  if (riskLevel.includes('Sedang')) return 'Sedang';
  if (riskLevel.includes('Tinggi')) return 'Tinggi';
  return '-';
}

function getRiskDesc(riskLevel: string) {
  if (riskLevel.includes('Rendah')) return 'Sesuai usia';
  if (riskLevel.includes('Sedang')) return 'Perlu stimulasi & pantau';
  if (riskLevel.includes('Tinggi')) return 'Evaluasi profesional';
  return '-';
}

export default function StatCards() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(json => {
        if (json.success) setStats(json.data);
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <div className="dash-card col-span-4">
        <div className="dash-card-header">
          <h3 className="dash-card-title">Total Skrining</h3>
          <span className="nav-icon">📊</span>
        </div>
        <div className="stat-value-large">{stats?.totalSkrining ?? '-'}</div>
        <p className="stat-desc">Evaluasi berikut: {stats?.evaluasiBerikutnya ?? '-'}</p>
      </div>
      
      <div className="dash-card col-span-4">
        <div className="dash-card-header">
          <h3 className="dash-card-title">Status Risiko Terakhir</h3>
          <span className="nav-icon">⚠️</span>
        </div>
        <div className="stat-value-large" style={{ color: getRiskColor(stats?.latestRiskLevel || ''), fontSize: '2rem' }}>
          {getRiskLabel(stats?.latestRiskLevel || '-')}
        </div>
        <p className="stat-desc">{getRiskDesc(stats?.latestRiskLevel || '')}</p>
      </div>
      
      <div className="dash-card col-span-4">
        <div className="dash-card-header">
          <h3 className="dash-card-title">Evaluasi Berikutnya</h3>
          <span className="nav-icon">📅</span>
        </div>
        <div className="stat-value-large" style={{ fontSize: '1.5rem' }}>{stats?.evaluasiBerikutnya ?? '-'}</div>
        <p className="stat-desc">Jadwal otomatis</p>
      </div>
    </>
  );
}

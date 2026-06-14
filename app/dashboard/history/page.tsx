"use client";

import React from 'react';
import HistoryTable from '../../../components/dashboard/HistoryTable';

export default function HistoryPage() {
  return (
    <>
      <header className="dashboard-header fade-in">
        <div>
          <h1 className="dashboard-title">Riwayat Skrining</h1>
          <p className="subtitle" style={{ margin: '0', textAlign: 'left' }}>Melihat riwayat lengkap skrining anak Anda.</p>
        </div>
      </header>

      <div className="dashboard-grid fade-in" style={{ animationDelay: '0.1s' }}>
        <HistoryTable />
      </div>
    </>
  );
}

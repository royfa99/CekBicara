"use client";

import React from 'react';

export default function SettingsPage() {
  return (
    <>
      <header className="dashboard-header fade-in">
        <div>
          <h1 className="dashboard-title">Pengaturan</h1>
          <p className="subtitle" style={{ margin: '0', textAlign: 'left' }}>Atur preferensi akun dan aplikasi Anda.</p>
        </div>
      </header>

      <div className="dashboard-grid fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="dash-card col-span-12">
          <p>Fitur pengaturan akun belum tersedia di versi saat ini. Nantikan pembaruan selanjutnya!</p>
        </div>
      </div>
    </>
  );
}

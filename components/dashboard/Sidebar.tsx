import React from 'react';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">✨</span>
        Cek Bicara
      </div>
      
      <nav className="sidebar-nav">
        <Link href="/dashboard" className="nav-item active">
          <span className="nav-icon">📊</span>
          <span>Overview</span>
        </Link>
        <Link href="/dashboard/history" className="nav-item">
          <span className="nav-icon">📝</span>
          <span>Riwayat Skrining</span>
        </Link>
        <Link href="/dashboard/children" className="nav-item">
          <span className="nav-icon">👶</span>
          <span>Profil Anak</span>
        </Link>
        <Link href="/dashboard/settings" className="nav-item">
          <span className="nav-icon">⚙️</span>
          <span>Pengaturan</span>
        </Link>
      </nav>
      
      <div className="sidebar-footer">
        <Link href="/" className="nav-item">
          <span className="nav-icon">🚪</span>
          <span>Keluar</span>
        </Link>
      </div>
    </aside>
  );
}

"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import './admin.css';

interface Transaction {
  id: number;
  invoiceId: string;
  amount: number;
  date: string;
  status: string;
  screeningId: number;
  childName: string;
}

interface AdminStats {
  totalUsers: number;
  totalScreenings: number;
  totalPremium: number;
  premiumList: Transaction[];
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDenied, setIsDenied] = useState(false);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(json => {
        if (json.isDenied) {
          setIsDenied(true);
        } else if (json.success) {
          setStats(json.data);
        } else {
          alert('Gagal memuat data admin: ' + (json.error || 'Unknown error'));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="admin-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h2 style={{ color: 'var(--text-muted)' }}>Memuat Panel Admin...</h2>
      </div>
    );
  }

  if (isDenied) {
    return (
      <div className="admin-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fef2f2' }}>
        <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '20px', boxShadow: '0 10px 25px rgba(239, 68, 68, 0.2)', maxWidth: '400px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🛑</div>
          <h1 style={{ color: '#ef4444', marginBottom: '12px', fontSize: '1.5rem', fontWeight: 800 }}>Akses Ditolak</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Halaman ini sangat rahasia dan hanya dapat diakses oleh Pemilik Aplikasi (Admin).</p>
          <Link href="/dashboard" className="btn btn-primary" style={{ backgroundColor: '#ef4444', width: '100%' }}>Kembali ke Zona Aman</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        
        <header className="admin-header fade-in">
          <div>
            <h1 className="admin-title">Dashboard Admin 🚀</h1>
            <p className="admin-subtitle">Pantau pertumbuhan aplikasi Cek Bicara secara *real-time*.</p>
          </div>
          <div>
            <Link href="/admin/editor" className="btn btn-primary" style={{ marginRight: '10px' }}>📝 Editor</Link>
            <Link href="/dashboard" className="btn btn-secondary">Kembali ke App</Link>
          </div>
        </header>

        <div className="admin-grid fade-in" style={{ animationDelay: '0.1s' }}>
          
          <div className="admin-card col-span-4">
            <div className="admin-card-header">
              <h3 className="admin-card-title">Total Pengguna</h3>
              <div className="admin-icon icon-users">👥</div>
            </div>
            <div className="admin-value">{stats?.totalUsers || 0}</div>
            <p className="admin-subtitle" style={{ marginTop: '8px', fontSize: '0.85rem' }}>Orang tua terdaftar</p>
          </div>

          <div className="admin-card col-span-4">
            <div className="admin-card-header">
              <h3 className="admin-card-title">Total Skrining</h3>
              <div className="admin-icon icon-screenings">📝</div>
            </div>
            <div className="admin-value">{stats?.totalScreenings || 0}</div>
            <p className="admin-subtitle" style={{ marginTop: '8px', fontSize: '0.85rem' }}>Kuesioner dijawab</p>
          </div>

          <div className="admin-card col-span-4">
            <div className="admin-card-header">
              <h3 className="admin-card-title">Anggota Premium</h3>
              <div className="admin-icon icon-premium">⭐️</div>
            </div>
            <div className="admin-value">{stats?.totalPremium || 0}</div>
            <p className="admin-subtitle" style={{ marginTop: '8px', fontSize: '0.85rem' }}>Pendapatan berjalan</p>
          </div>

        </div>

        <div className="admin-table-container fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="admin-table-title">Daftar Transaksi Premium Terbaru</h2>
          
          {stats?.premiumList && stats.premiumList.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Nama Anak</th>
                    <th>Nominal</th>
                    <th>Status</th>
                    <th>ID Invoice (Xendit)</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.premiumList.map((trx) => (
                    <tr key={trx.id}>
                      <td>{trx.date}</td>
                      <td style={{ fontWeight: 600 }}>{trx.childName}</td>
                      <td>Rp {trx.amount.toLocaleString('id-ID')}</td>
                      <td><span className="badge-paid">LUNAS</span></td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{trx.invoiceId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <p>Belum ada transaksi premium yang lunas.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

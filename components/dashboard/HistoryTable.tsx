"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface HistoryItem {
  id: string;
  date: string;
  childName: string;
  age: string;
  riskLevel: string;
  statusClass: string;
}

export default function HistoryTable() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = () => {
    fetch('/api/dashboard/history')
      .then(res => res.json())
      .then(json => {
        if (json.success) setHistory(json.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus hasil skrining ini?')) return;

    try {
      const res = await fetch(`/api/screenings/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        fetchHistory(); // Refresh the list
      } else {
        alert('Gagal menghapus: ' + json.error);
      }
    } catch {
      alert('Terjadi kesalahan jaringan.');
    }
  };

  return (
    <div className="dash-card col-span-12">
      <div className="dash-card-header">
        <h3 className="dash-card-title">Riwayat Hasil Skrining</h3>
        <Link href="/skrining" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
          + Skrining Baru
        </Link>
      </div>
      
      <div className="dash-table-wrapper">
        {loading ? (
          <p style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Memuat data...</p>
        ) : history.length === 0 ? (
          <p style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Belum ada riwayat skrining.</p>
        ) : (
          <table className="dash-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Nama Anak</th>
                <th>Usia</th>
                <th>Hasil / Risiko</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id}>
                  <td>{item.date}</td>
                  <td>{item.childName}</td>
                  <td>{item.age}</td>
                  <td><span className={`badge-status ${item.statusClass}`}>{item.riskLevel}</span></td>
                  <td>
                    <Link
                      href={`/skrining/result?screeningId=${item.id}`}
                      className="btn btn-secondary"
                      style={{ padding: '4px 12px', fontSize: '0.75rem', marginRight: '8px' }}
                    >
                      Detail
                    </Link>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '4px 12px', fontSize: '0.75rem', border: '1px solid #fecaca', color: '#ef4444' }}
                      onClick={() => handleDelete(item.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

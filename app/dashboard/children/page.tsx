"use client";

import React, { useEffect, useState } from 'react';

interface Child {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: string;
}

export default function ChildrenPage() {
  const [childrenData, setChildrenData] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/children')
      .then(res => res.json())
      .then(json => {
        if (json.success) setChildrenData(json.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <header className="dashboard-header fade-in">
        <div>
          <h1 className="dashboard-title">Profil Anak</h1>
          <p className="subtitle" style={{ margin: '0', textAlign: 'left' }}>Daftar profil anak yang Anda pantau perkembangannya.</p>
        </div>
      </header>

      <div className="dashboard-grid fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="dash-card col-span-12">
          {loading ? (
            <p>Memuat data anak...</p>
          ) : childrenData.length === 0 ? (
            <p>Belum ada profil anak yang ditambahkan.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {childrenData.map(child => (
                <div key={child.id} className="dash-card" style={{ background: 'var(--bg-light)', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>👶</div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '5px' }}>{child.name}</h3>
                  <p style={{ margin: '0', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                    Tanggal Lahir: {new Date(child.dateOfBirth).toLocaleDateString('id-ID')}
                  </p>
                  <p style={{ margin: '0', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                    Kelamin: {child.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

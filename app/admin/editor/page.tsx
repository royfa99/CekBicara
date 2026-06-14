'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import '../admin.css';

type AppContent = {
  questions: {
    "0_12": string[];
    "13_24": string[];
    "25_36": string[];
    "36_plus": string[];
  };
  baseTasks: {
    "0_12": string[];
    "13_24": string[];
    "25_36": string[];
    "36_plus": string[];
  };
};

type AgeBracket = "0_12" | "13_24" | "25_36" | "36_plus";

export default function ContentEditorPage() {
  const [content, setContent] = useState<AppContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<AgeBracket>("0_12");
  const [isDenied, setIsDenied] = useState(false);

  useEffect(() => {
    fetch('/api/admin/content')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setContent(json.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      const json = await res.json();
      
      if (json.isDenied || res.status === 403) {
        setIsDenied(true);
      } else if (json.success) {
        alert('Berhasil menyimpan perubahan konten ke Database!');
      } else {
        alert('Gagal menyimpan: ' + json.error);
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan jaringan.');
    }
    setSaving(false);
  };

  const updateQuestion = (index: number, value: string) => {
    if (!content) return;
    const newContent = { ...content };
    newContent.questions[activeTab][index] = value;
    setContent(newContent);
  };

  const updateTask = (index: number, value: string) => {
    if (!content) return;
    const newContent = { ...content };
    newContent.baseTasks[activeTab][index] = value;
    setContent(newContent);
  };

  if (loading) {
    return <div className="admin-page"><h2 style={{textAlign: 'center', marginTop: '100px'}}>Memuat Editor...</h2></div>;
  }

  if (isDenied) {
    return (
      <div className="admin-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fef2f2' }}>
        <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '20px', boxShadow: '0 10px 25px rgba(239, 68, 68, 0.2)', maxWidth: '400px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🛑</div>
          <h1 style={{ color: '#ef4444', marginBottom: '12px', fontSize: '1.5rem', fontWeight: 800 }}>Akses Ditolak</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Anda tidak diizinkan mengubah konten database.</p>
          <Link href="/dashboard" className="btn btn-primary" style={{ backgroundColor: '#ef4444', width: '100%' }}>Kembali</Link>
        </div>
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className="admin-page">
      <div className="container">
        <header className="admin-header">
          <div className="header-left">
            <Link href="/admin" className="back-link">← Kembali ke Admin Panel</Link>
            <h1>Content Management System (CMS)</h1>
            <p>Ubah pertanyaan skrining dan tugas stimulasi secara langsung.</p>
          </div>
          <div className="header-right">
            <button 
              className="btn btn-primary" 
              onClick={handleSave}
              disabled={saving}
              style={{ backgroundColor: 'var(--accent-color)' }}
            >
              {saving ? 'Menyimpan...' : '💾 Simpan ke Database'}
            </button>
          </div>
        </header>

        <div className="tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {[
            { id: '0_12', label: '0 - 12 Bulan' },
            { id: '13_24', label: '13 - 24 Bulan' },
            { id: '25_36', label: '25 - 36 Bulan' },
            { id: '36_plus', label: '36+ Bulan' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AgeBracket)}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeTab === tab.id ? 'var(--primary-color)' : 'white',
                color: activeTab === tab.id ? 'white' : 'var(--text-color)',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="editor-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* QUESTIONS COLUMN */}
          <div className="editor-card" style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginBottom: '16px', color: 'var(--primary-color)' }}>Pertanyaan Skrining</h2>
            {content.questions[activeTab].map((q, idx) => (
              <div key={`q-${idx}`} style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  Soal {idx + 1}
                </label>
                <textarea
                  value={q}
                  onChange={(e) => updateQuestion(idx, e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '80px', fontFamily: 'inherit' }}
                />
              </div>
            ))}
          </div>

          {/* TASKS COLUMN */}
          <div className="editor-card" style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginBottom: '16px', color: 'var(--primary-color)' }}>Tugas Stimulasi Dasar (30 Hari)</h2>
            {content.baseTasks[activeTab].map((t, idx) => (
              <div key={`t-${idx}`} style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  Tugas {idx + 1}
                </label>
                <input
                  type="text"
                  value={t}
                  onChange={(e) => updateTask(idx, e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'inherit' }}
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

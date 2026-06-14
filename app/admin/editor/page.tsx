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
  targetedTasks: {
    "0_12": string[][];
    "13_24": string[][];
    "25_36": string[][];
    "36_plus": string[][];
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
          // Fallback empty array if targetedTasks missing
          if (!json.data.targetedTasks) {
             json.data.targetedTasks = {
               "0_12": [], "13_24": [], "25_36": [], "36_plus": []
             };
          }
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

  // --- QUESTIONS ---
  const updateQuestion = (index: number, value: string) => {
    if (!content) return;
    const newContent = { ...content };
    newContent.questions[activeTab][index] = value;
    setContent(newContent);
  };

  const addQuestion = () => {
    if (!content) return;
    const newContent = { ...content };
    newContent.questions[activeTab].push("Pertanyaan Baru");
    
    // Auto-create matching targetedTasks array for the new question
    if (!newContent.targetedTasks[activeTab]) newContent.targetedTasks[activeTab] = [];
    newContent.targetedTasks[activeTab].push(["Tugas Terapi Khusus Baru"]);
    
    setContent(newContent);
  };

  const deleteQuestion = (index: number) => {
    if (!content) return;
    if (!confirm('Yakin ingin menghapus pertanyaan ini beserta daftar tugas spesifiknya?')) return;
    
    const newContent = { ...content };
    newContent.questions[activeTab].splice(index, 1);
    
    // Ensure we also delete the matching targetedTasks array
    if (newContent.targetedTasks[activeTab] && newContent.targetedTasks[activeTab].length > index) {
      newContent.targetedTasks[activeTab].splice(index, 1);
    }
    
    setContent(newContent);
  };

  // --- TARGETED TASKS (RED FLAGS) ---
  const updateTargetedTask = (qIndex: number, tIndex: number, value: string) => {
    if (!content) return;
    const newContent = { ...content };
    newContent.targetedTasks[activeTab][qIndex][tIndex] = value;
    setContent(newContent);
  };

  const addTargetedTask = (qIndex: number) => {
    if (!content) return;
    const newContent = { ...content };
    if (!newContent.targetedTasks[activeTab][qIndex]) {
      newContent.targetedTasks[activeTab][qIndex] = [];
    }
    newContent.targetedTasks[activeTab][qIndex].push("Tugas Terapi Khusus Baru");
    setContent(newContent);
  };

  const deleteTargetedTask = (qIndex: number, tIndex: number) => {
    if (!content) return;
    const newContent = { ...content };
    newContent.targetedTasks[activeTab][qIndex].splice(tIndex, 1);
    setContent(newContent);
  };

  // --- BASE TASKS ---
  const updateBaseTask = (index: number, value: string) => {
    if (!content) return;
    const newContent = { ...content };
    newContent.baseTasks[activeTab][index] = value;
    setContent(newContent);
  };

  const addBaseTask = () => {
    if (!content) return;
    const newContent = { ...content };
    newContent.baseTasks[activeTab].push("Tugas Stimulasi Baru");
    setContent(newContent);
  };

  const deleteBaseTask = (index: number) => {
    if (!content) return;
    const newContent = { ...content };
    newContent.baseTasks[activeTab].splice(index, 1);
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
              style={{ backgroundColor: 'var(--accent-color)', fontSize: '1.1rem', padding: '12px 24px' }}
            >
              {saving ? 'Menyimpan...' : '💾 Simpan Perubahan'}
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

        <div className="editor-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', alignItems: 'start' }}>
          
          {/* QUESTIONS & TARGETED TASKS COLUMN */}
          <div className="editor-card" style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginBottom: '16px', color: 'var(--primary-color)' }}>Pertanyaan Skrining & Terapi Khusus</h2>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '24px' }}>
              Setiap pertanyaan memiliki daftar Terapi Khusus (Red Flags) di bawahnya yang akan diberikan jika anak gagal menjawab "Ya".
            </p>

            {content.questions[activeTab].map((q, qIndex) => (
              <div key={`q-${qIndex}`} style={{ marginBottom: '32px', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label style={{ fontWeight: 'bold', fontSize: '1rem', color: '#334155' }}>
                    Soal {qIndex + 1}
                  </label>
                  <button onClick={() => deleteQuestion(qIndex)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}>
                    🗑️ Hapus Soal
                  </button>
                </div>
                
                <textarea
                  value={q}
                  onChange={(e) => updateQuestion(qIndex, e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', minHeight: '60px', fontFamily: 'inherit', marginBottom: '16px' }}
                />

                {/* TARGETED TASKS FOR THIS QUESTION */}
                <div style={{ marginLeft: '20px', paddingLeft: '16px', borderLeft: '3px solid var(--accent-color)' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--accent-color)' }}>
                    🎯 Terapi Khusus Jika Gagal di Soal {qIndex + 1}
                  </label>
                  
                  {content.targetedTasks[activeTab] && content.targetedTasks[activeTab][qIndex] && content.targetedTasks[activeTab][qIndex].map((task, tIndex) => (
                    <div key={`tt-${qIndex}-${tIndex}`} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <input
                        type="text"
                        value={task}
                        onChange={(e) => updateTargetedTask(qIndex, tIndex, e.target.value)}
                        style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontFamily: 'inherit', fontSize: '0.9rem' }}
                      />
                      <button onClick={() => deleteTargetedTask(qIndex, tIndex)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', padding: '0 12px', cursor: 'pointer' }}>
                        ✕
                      </button>
                    </div>
                  ))}
                  <button onClick={() => addTargetedTask(qIndex)} style={{ background: 'none', border: '1px dashed var(--accent-color)', color: 'var(--accent-color)', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '0.85rem', marginTop: '4px' }}>
                    + Tambah Terapi Khusus
                  </button>
                </div>
              </div>
            ))}
            
            <button 
              onClick={addQuestion} 
              style={{ width: '100%', padding: '16px', background: 'var(--primary-light)', color: 'var(--primary-color)', border: '2px dashed var(--primary-color)', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
            >
              ➕ Tambah Pertanyaan Baru
            </button>
          </div>

          {/* BASE TASKS COLUMN */}
          <div className="editor-card" style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginBottom: '16px', color: 'var(--primary-color)' }}>Tugas Stimulasi Dasar</h2>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '24px' }}>
              Daftar kegiatan umum yang akan dibagikan ke dalam program 30 hari.
            </p>

            {content.baseTasks[activeTab].map((t, idx) => (
              <div key={`t-${idx}`} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input
                  type="text"
                  value={t}
                  onChange={(e) => updateBaseTask(idx, e.target.value)}
                  style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'inherit' }}
                />
                <button onClick={() => deleteBaseTask(idx)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '8px', padding: '0 16px', cursor: 'pointer' }}>
                  🗑️
                </button>
              </div>
            ))}
            
            <button 
              onClick={addBaseTask} 
              style={{ width: '100%', padding: '12px', background: 'white', color: '#64748b', border: '2px dashed #cbd5e1', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}
            >
              + Tambah Tugas Dasar
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

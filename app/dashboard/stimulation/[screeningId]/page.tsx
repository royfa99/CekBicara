"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Task {
  id: number;
  day_number: number;
  task_text: string;
  is_completed: boolean;
  completed_at: string | null;
}

export default function StimulationTrackerPage() {
  const params = useParams();
  const router = useRouter();
  const screeningId = params.screeningId as string;
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/stimulation/${screeningId}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setTasks(json.data);
        } else {
          setError(json.error || 'Gagal memuat data');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Terjadi kesalahan jaringan');
        setLoading(false);
      });
  }, [screeningId]);

  const toggleTask = async (dayNumber: number, currentStatus: boolean) => {
    // Optimistic update
    const updatedStatus = !currentStatus;
    setTasks(prev => prev.map(t => t.day_number === dayNumber ? { ...t, is_completed: updatedStatus } : t));

    try {
      const res = await fetch(`/api/stimulation/${screeningId}/${dayNumber}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: updatedStatus })
      });
      const json = await res.json();
      if (!json.success) {
        // Revert on error
        alert('Gagal menyimpan perubahan: ' + json.error);
        setTasks(prev => prev.map(t => t.day_number === dayNumber ? { ...t, is_completed: currentStatus } : t));
      }
    } catch (e) {
      alert('Terjadi kesalahan jaringan');
      setTasks(prev => prev.map(t => t.day_number === dayNumber ? { ...t, is_completed: currentStatus } : t));
    }
  };

  if (loading) return <div className="container" style={{ padding: '40px' }}><p>Memuat kalender stimulasi...</p></div>;

  if (error) {
    return (
      <div className="container" style={{ padding: '40px' }}>
        <h2 style={{ color: 'var(--risk-high)' }}>Akses Ditolak</h2>
        <p>{error}</p>
        <button onClick={() => router.back()} className="btn btn-secondary" style={{ marginTop: '20px' }}>Kembali</button>
      </div>
    );
  }

  const completedCount = tasks.filter(t => t.is_completed).length;
  const progressPercent = Math.round((completedCount / 30) * 100);

  return (
    <>
      <header className="dashboard-header fade-in">
        <div>
          <Link href={`/skrining/result?screeningId=${screeningId}`} style={{ color: 'var(--primary-color)', textDecoration: 'none', marginBottom: '10px', display: 'inline-block' }}>
            &larr; Kembali ke Hasil Skrining
          </Link>
          <h1 className="dashboard-title">Program Stimulasi 30 Hari</h1>
          <p className="subtitle" style={{ margin: '0', textAlign: 'left' }}>Lacak dan centang tugas stimulasi harian anak Anda.</p>
        </div>
      </header>

      <div className="dashboard-grid fade-in" style={{ animationDelay: '0.1s' }}>
        
        {/* Progress Bar Section */}
        <div className="dash-card col-span-12">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontWeight: '600' }}>Progres Anda</span>
            <span style={{ fontWeight: '600', color: 'var(--primary-color)' }}>{completedCount} dari 30 Hari Selesai</span>
          </div>
          <div style={{ background: '#e2e8f0', borderRadius: '10px', height: '12px', overflow: 'hidden' }}>
            <div 
              style={{ 
                background: 'var(--primary-color)', 
                height: '100%', 
                width: `${progressPercent}%`,
                transition: 'width 0.5s ease'
              }} 
            />
          </div>
        </div>

        {/* 30 Days Grid */}
        <div className="col-span-12" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {tasks.map(task => (
            <div 
              key={task.day_number}
              onClick={() => toggleTask(task.day_number, task.is_completed)}
              style={{
                background: task.is_completed ? 'var(--bg-light)' : 'white',
                border: task.is_completed ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start',
                boxShadow: task.is_completed ? 'none' : '0 4px 6px -1px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ flexShrink: 0, marginTop: '2px' }}>
                {task.is_completed ? (
                  <div style={{ width: '28px', height: '28px', background: 'var(--primary-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px' }}>✓</div>
                ) : (
                  <div style={{ width: '28px', height: '28px', border: '2px solid #cbd5e1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '12px', fontWeight: 'bold' }}>{task.day_number}</div>
                )}
              </div>
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: task.is_completed ? 'var(--primary-color)' : 'var(--text-dark)' }}>Hari {task.day_number}</h4>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-light)', lineHeight: '1.4' }}>
                  {task.task_text}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}

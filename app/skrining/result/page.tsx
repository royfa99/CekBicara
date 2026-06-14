"use client";

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import './result.css';

interface ScreeningData {
  riskLevel: string;
  summary: string;
  result: {
    redFlags: string[];
    strengths: string[];
    recommendations: string[];
    stimulationPlan: { task: string; icon: string }[];
  } | null;
  isPaid?: boolean;
}

function getRiskClass(riskLevel: string) {
  if (riskLevel.includes('Rendah')) return 'risk-low';
  if (riskLevel.includes('Sedang')) return 'risk-medium';
  return 'risk-high';
}

function getRiskIcon(riskLevel: string) {
  if (riskLevel.includes('Rendah')) return '✅';
  if (riskLevel.includes('Sedang')) return '⚠️';
  return '🚨';
}

function getRiskDescription(riskLevel: string) {
  if (riskLevel.includes('Rendah')) return 'Perkembangan sesuai usia. Lanjutkan stimulasi rutin.';
  if (riskLevel.includes('Sedang')) return 'Perlu stimulasi intensif dan pemantauan ulang dalam 1 bulan.';
  return 'Disarankan evaluasi profesional segera.';
}

function ResultContent() {
  const searchParams = useSearchParams();
  const screeningId = searchParams.get('screeningId');
  const [data, setData] = useState<ScreeningData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!screeningId) {
      setLoading(false);
      return;
    }

    fetch(`/api/screenings/${screeningId}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setData(json.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [screeningId]);

  if (loading) {
    return (
      <div className="container text-center" style={{ paddingTop: '200px' }}>
        <p>Memuat hasil...</p>
      </div>
    );
  }

  if (!data || !data.result) {
    return (
      <div className="container text-center" style={{ paddingTop: '200px' }}>
        <h2>Hasil tidak ditemukan</h2>
        <Link href="/skrining" className="btn btn-primary" style={{ marginTop: '24px', display: 'inline-block' }}>
          Mulai Skrining Baru
        </Link>
      </div>
    );
  }

  const { riskLevel, summary, result } = data;

  return (
    <div className="container">
      
      <div className="result-header text-center fade-in">
        <h1 className="title">Hasil Skrining AI</h1>
        <p className="subtitle">Berdasarkan data dan jawaban yang Anda berikan</p>
      </div>

      <div className="result-card glass-panel fade-in">
        
        {/* Risk Level Banner */}
        <div className={`risk-banner ${getRiskClass(riskLevel)}`}>
          <div className="risk-icon">{getRiskIcon(riskLevel)}</div>
          <div className="risk-content">
            <h3>{riskLevel}</h3>
            <p>{getRiskDescription(riskLevel)}</p>
          </div>
        </div>

        <div className="result-grid">
          {/* Left Column: Analysis */}
          <div className="result-col">
            <div className="info-section">
              <h4>Ringkasan Perkembangan</h4>
              <p>{summary}</p>
            </div>

            <div className="info-section">
              <h4>Red Flags Ditemukan</h4>
              {result.redFlags.length > 0 ? (
                <ul className="red-flags-list">
                  {result.redFlags.map((flag, i) => (
                    <li key={i}>{flag}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: '#10b981' }}>Tidak ada red flag yang ditemukan ✓</p>
              )}
            </div>

            <div className="info-section">
              <h4>Kekuatan Anak</h4>
              {result.strengths.length > 0 ? (
                <ul className="strengths-list">
                  {result.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>-</p>
              )}
            </div>
          </div>

          {/* Right Column: Recommendations */}
          <div className="result-col" style={{ position: 'relative' }}>
            <div className={`premium-content ${!data.isPaid ? 'blurred' : ''}`}>
              <div className="recommendation-box">
                <h4>Rekomendasi Tindakan</h4>
                {result.recommendations.length > 0 ? (
                  <ul className="action-list">
                    {result.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                ) : (
                  <ul className="action-list">
                    <li>(Akses Premium Diperlukan)</li>
                    <li>(Akses Premium Diperlukan)</li>
                    <li>(Akses Premium Diperlukan)</li>
                  </ul>
                )}
              </div>

              <div className="stimulation-preview">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h4 style={{ margin: 0 }}>Program Stimulasi 30 Hari</h4>
                  {data.isPaid && (
                    <Link href={`/dashboard/stimulation/${screeningId}`} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                      Buka Tracker &rarr;
                    </Link>
                  )}
                </div>
                {result.stimulationPlan.length > 0 ? (
                  result.stimulationPlan.map((item, i) => (
                    <div className="task-item" key={i}>
                      <span className="task-icon">{item.icon}</span>
                      <span>{item.task}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="task-item"><span className="task-icon">🔒</span><span>Akses Terkunci</span></div>
                    <div className="task-item"><span className="task-icon">🔒</span><span>Akses Terkunci</span></div>
                    <div className="task-item"><span className="task-icon">🔒</span><span>Akses Terkunci</span></div>
                  </>
                )}
              </div>
            </div>

            {!data.isPaid && (
              <div className="paywall-overlay">
                <div className="paywall-box text-center">
                  <span style={{ fontSize: '3rem', marginBottom: '10px', display: 'block' }}>🔒</span>
                  <h4 style={{ marginBottom: '10px' }}>Laporan Lengkap & Program Stimulasi</h4>
                  <p style={{ fontSize: '0.9rem', marginBottom: '20px', color: 'var(--text-light)' }}>
                    Buka akses ke rekomendasi detail dan program stimulasi 30 hari yang dirancang khusus untuk anak Anda.
                  </p>
                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%', marginBottom: '10px' }}
                    onClick={async (e) => {
                      const btn = e.currentTarget;
                      btn.disabled = true;
                      btn.innerText = 'Memproses...';
                      try {
                        const res = await fetch('/api/payments/checkout', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ screeningId })
                        });
                        const json = await res.json();
                        if (json.success && json.data.paymentUrl) {
                          window.location.href = json.data.paymentUrl;
                        } else {
                          alert('Gagal membuat pesanan: ' + json.error);
                          btn.disabled = false;
                          btn.innerText = 'Buka Akses Premium - Rp 49.000';
                        }
                      } catch (err) {
                        alert('Terjadi kesalahan jaringan.');
                        btn.disabled = false;
                        btn.innerText = 'Buka Akses Premium - Rp 49.000';
                      }
                    }}
                  >
                    Buka Akses Premium - Rp 49.000
                  </button>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pembayaran aman melalui Xendit</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="result-actions" style={{ marginTop: '40px' }}>
          <Link href="/dashboard" className="btn btn-secondary">
            Buka Dashboard Pengguna
          </Link>
          <Link href="/skrining" className="btn btn-primary" style={{ background: 'var(--bg-light)', color: 'var(--primary-color)', border: '1px solid var(--primary-color)' }}>
            Skrining Baru
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <div className="result-page">
      <Suspense fallback={<div className="container text-center" style={{ paddingTop: '200px' }}>Loading...</div>}>
        <ResultContent />
      </Suspense>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from 'react';
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

export default function ResultPage() {
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
      <div className="result-page">
        <div className="container text-center" style={{ paddingTop: '200px' }}>
          <p>Memuat hasil...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.result) {
    return (
      <div className="result-page">
        <div className="container text-center" style={{ paddingTop: '200px' }}>
          <h2>Hasil tidak ditemukan</h2>
          <Link href="/skrining" className="btn btn-primary" style={{ marginTop: '24px', display: 'inline-block' }}>
            Mulai Skrining Baru
          </Link>
        </div>
      </div>
    );
  }

  const { riskLevel, summary, result } = data;

  return (
    <div className="result-page">
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
            <div className="result-col">
              <div className="recommendation-box">
                <h4>Rekomendasi Tindakan</h4>
                <ul className="action-list">
                  {result.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>

              <div className="stimulation-preview">
                <h4>Program Stimulasi Hari Ini</h4>
                {result.stimulationPlan.map((item, i) => (
                  <div className="task-item" key={i}>
                    <span className="task-icon">{item.icon}</span>
                    <span>{item.task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="result-actions">
            <Link href="/dashboard" className="btn btn-primary">
              Buka Dashboard Pengguna
            </Link>
            <Link href="/skrining" className="btn btn-secondary">
              Skrining Baru
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

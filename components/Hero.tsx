import React from 'react';
import Link from 'next/link';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero section">
      <div className="container">
        <div className="hero-content fade-in">
          <div className="badge">Cek Bicara versi 1.0</div>
          <h1 className="hero-title">
            Apakah Anak Anda Mengalami <span className="highlight">Speech Delay?</span>
          </h1>
          <p className="hero-subtitle">
            Skrining risiko speech delay dalam 3 menit berdasarkan milestone perkembangan anak. Ketahui lebih dini, tangani lebih cepat.
          </p>
          <div className="hero-actions">
            <Link href="/skrining" className="btn btn-primary btn-large animate-pulse" style={{ display: 'inline-block' }}>
              Mulai Skrining Gratis
            </Link>
            <p className="hero-note">Sudah digunakan oleh 10,000+ orang tua</p>
          </div>
        </div>
        
        <div className="hero-visual fade-in animate-float">
          <div className="glass-panel stat-card card-1">
            <div className="stat-value">98%</div>
            <div className="stat-label">Akurasi Skrining</div>
          </div>
          <div className="glass-panel stat-card card-2">
            <div className="stat-value">3 Min</div>
            <div className="stat-label">Waktu Pengerjaan</div>
          </div>
          <div className="glass-panel stat-card card-3">
            <div className="stat-icon">🧠</div>
            <div className="stat-label">Analisis AI</div>
          </div>
          <div className="hero-blob"></div>
        </div>
      </div>
    </section>
  );
}

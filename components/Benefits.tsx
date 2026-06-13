import React from 'react';
import './Benefits.css';

export default function Benefits() {
  return (
    <section className="benefits section">
      <div className="container">
        <div className="text-center">
          <h2 className="title fade-in">Yang Akan Anda Dapatkan</h2>
          <p className="subtitle fade-in">
            Laporan lengkap untuk membantu Anda mengambil langkah terbaik bagi buah hati.
          </p>
        </div>

        <div className="benefits-grid">
          <div className="benefit-card glass-panel fade-in">
            <div className="check-icon">✓</div>
            <div className="benefit-content">
              <h3>Analisis Perkembangan</h3>
              <p>Mengetahui posisi kemampuan anak dibandingkan milestone bahasa dan bicara seusianya.</p>
            </div>
          </div>
          
          <div className="benefit-card glass-panel fade-in">
            <div className="check-icon">✓</div>
            <div className="benefit-content">
              <h3>Identifikasi Red Flags</h3>
              <p>Mendeteksi tanda bahaya (red flags) yang memerlukan perhatian khusus secara instan.</p>
            </div>
          </div>
          
          <div className="benefit-card glass-panel fade-in">
            <div className="check-icon">✓</div>
            <div className="benefit-content">
              <h3>Program Stimulasi 30 Hari</h3>
              <p>Rekomendasi aktivitas harian praktis untuk menstimulasi bicara anak di rumah.</p>
            </div>
          </div>
          
          <div className="benefit-card glass-panel fade-in">
            <div className="check-icon">✓</div>
            <div className="benefit-content">
              <h3>Rekomendasi Tindak Lanjut</h3>
              <p>Arahan jelas apakah cukup stimulasi di rumah atau perlu konsultasi dengan dokter / terapis wicara.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

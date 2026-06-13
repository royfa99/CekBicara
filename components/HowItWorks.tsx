import React from 'react';
import './HowItWorks.css';

export default function HowItWorks() {
  return (
    <section className="how-it-works section">
      <div className="container">
        <div className="text-center">
          <h2 className="title fade-in">Cara Kerja Cek Bicara</h2>
          <p className="subtitle fade-in">Hanya 3 langkah mudah untuk mengetahui perkembangan bicara anak Anda.</p>
        </div>

        <div className="steps-container">
          <div className="step-item fade-in">
            <div className="step-number">1</div>
            <div className="step-content glass-panel">
              <h3>Isi Data Anak</h3>
              <p>Masukkan usia, jenis kelamin, dan riwayat kelahiran untuk penyesuaian milestone otomatis (termasuk usia koreksi prematur).</p>
            </div>
          </div>
          
          <div className="step-item fade-in">
            <div className="step-number">2</div>
            <div className="step-content glass-panel">
              <h3>Jawab Pertanyaan</h3>
              <p>Jawab pertanyaan ya/tidak seputar kemampuan komunikasi dan perilaku anak sesuai usia saat ini.</p>
            </div>
          </div>
          
          <div className="step-item fade-in">
            <div className="step-number">3</div>
            <div className="step-content glass-panel">
              <h3>Dapatkan Hasil</h3>
              <p>Sistem AI kami akan menganalisis jawaban Anda dan memberikan tingkat risiko, red flags, dan rekomendasi stimulasi.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

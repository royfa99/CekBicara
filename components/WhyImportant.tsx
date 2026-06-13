import React from 'react';
import './WhyImportant.css';

export default function WhyImportant() {
  return (
    <section className="why-important section">
      <div className="container text-center">
        <h2 className="title fade-in">Mengapa Deteksi Dini Penting?</h2>
        <p className="subtitle fade-in">
          Jangan tunggu sampai terlambat. Perkembangan anak tidak bisa diulang.
        </p>
        
        <div className="features-grid">
          <div className="feature-card glass-panel fade-in">
            <div className="feature-icon">🧠</div>
            <h3>80% Perkembangan Otak</h3>
            <p>Terjadi pada tahun-tahun awal kehidupan. Ini adalah masa emas yang menentukan kemampuan komunikasi di masa depan.</p>
          </div>
          <div className="feature-card glass-panel fade-in">
            <div className="feature-icon">⏱️</div>
            <h3>Semakin Cepat, Semakin Baik</h3>
            <p>Intervensi dini terbukti memberikan hasil yang jauh lebih optimal dibandingkan terapi yang dimulai setelah usia 3 tahun.</p>
          </div>
          <div className="feature-card glass-panel fade-in">
            <div className="feature-icon">🛡️</div>
            <h3>Mencegah Frustrasi</h3>
            <p>Anak dengan speech delay sering tantrum karena kesulitan menyampaikan keinginannya. Deteksi dini membantu anak lebih bahagia.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

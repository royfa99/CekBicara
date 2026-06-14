import React from 'react';
import Link from 'next/link';
import './FinalCTA.css';

export default function FinalCTA() {
  return (
    <section className="final-cta section">
      <div className="container">
        <div className="cta-box glass-panel fade-in">
          <h2>Jangan Tunda Lagi</h2>
          <p>
            Mengetahui lebih dini adalah kunci keberhasilan intervensi. Lakukan skrining sekarang dan dapatkan laporan lengkap untuk anak Anda.
          </p>
          <Link href="/skrining" className="btn btn-primary btn-large animate-pulse" style={{ display: 'inline-block' }}>
            Mulai Skrining Gratis
          </Link>
          <p className="cta-note">✓ 100% Gratis ✓ Hasil Instan ✓ Privasi Terjamin</p>
        </div>
      </div>
    </section>
  );
}

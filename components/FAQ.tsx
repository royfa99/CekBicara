import React from 'react';
import './FAQ.css';

export default function FAQ() {
  const faqs = [
    {
      q: "Apakah hasil skrining ini sama dengan diagnosa dokter?",
      a: "Tidak. Cek Bicara adalah alat skrining awal untuk mengetahui tingkat risiko. Diagnosa medis hanya bisa diberikan oleh dokter spesialis anak atau psikolog klinis setelah evaluasi langsung."
    },
    {
      q: "Berapa lama waktu yang dibutuhkan untuk mengisi skrining?",
      a: "Hanya sekitar 3 menit. Anda cukup menjawab beberapa pertanyaan ya/tidak seputar kemampuan anak."
    },
    {
      q: "Apakah data anak saya aman?",
      a: "Sangat aman. Kami menggunakan sistem enkripsi dan tidak membagikan data personal anak Anda kepada pihak ketiga."
    },
    {
      q: "Apakah layanan ini gratis?",
      a: "Ya, fitur skrining dasar dan ringkasan hasil sepenuhnya gratis. Tersedia juga paket premium untuk laporan lengkap dan program stimulasi 30 hari."
    }
  ];

  return (
    <section className="faq section">
      <div className="container">
        <div className="text-center">
          <h2 className="title fade-in">Pertanyaan yang Sering Diajukan</h2>
        </div>
        
        <div className="faq-list">
          {faqs.map((faq, idx) => (
            <div key={idx} className="faq-item fade-in glass-panel">
              <details>
                <summary className="faq-question">
                  {faq.q}
                  <span className="faq-icon">+</span>
                </summary>
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              </details>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

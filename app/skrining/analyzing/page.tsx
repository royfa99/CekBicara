"use client";

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import './analyzing.css';

export default function AnalyzingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const screeningId = searchParams.get('screeningId');

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`/skrining/result?screeningId=${screeningId}`);
    }, 4000);

    return () => clearTimeout(timer);
  }, [router, screeningId]);

  return (
    <div className="analyzing-page">
      <div className="container">
        <div className="analyzing-content">
          <div className="ai-brain-container fade-in">
            <div className="pulse-circle pulse-1"></div>
            <div className="pulse-circle pulse-2"></div>
            <div className="pulse-circle pulse-3"></div>
            <div className="ai-icon-wrapper animate-float">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="ai-icon">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
          </div>
          
          <h2 className="analyzing-title fade-in">AI Sedang Menganalisis...</h2>
          <p className="analyzing-subtitle fade-in">Mencocokkan jawaban dengan standar milestone Kemenkes dan mengidentifikasi potensi red flags.</p>
          
          <div className="loading-steps fade-in">
            <div className="loading-step active">Memproses data anak...</div>
            <div className="loading-step delay-1">Mengevaluasi perkembangan...</div>
            <div className="loading-step delay-2">Menyiapkan rekomendasi...</div>
          </div>
        </div>
      </div>
    </div>
  );
}

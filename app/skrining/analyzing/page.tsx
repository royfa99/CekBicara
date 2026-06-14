"use client";

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import './analyzing.css';

function AnalyzingContent() {
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
    <div className="analyzing-content">
      <div className="ai-brain-container fade-in">
        <div className="pulse-circle pulse-1"></div>
        <div className="pulse-circle pulse-2"></div>
        <div className="pulse-circle pulse-3"></div>
        <div className="ai-icon-wrapper animate-float">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="ai-icon">
            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
            <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
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
  );
}

export default function AnalyzingPage() {
  return (
    <div className="analyzing-page">
      <div className="container">
        <Suspense fallback={<div>Loading...</div>}>
          <AnalyzingContent />
        </Suspense>
      </div>
    </div>
  );
}

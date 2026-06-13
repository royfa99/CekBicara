"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import './questions.css';

const QUESTIONS = [
  "Apakah anak Anda sudah bisa memanggil 'Mama' atau 'Papa' dengan makna?",
  "Apakah anak Anda menunjuk dengan jari telunjuk untuk meminta sesuatu?",
  "Apakah anak Anda merespons ketika namanya dipanggil?",
  "Apakah anak Anda memiliki minimal 10 kosakata yang dapat diucapkan dengan jelas?",
  "Apakah anak Anda dapat mengikuti instruksi sederhana tanpa bantuan isyarat tangan?"
];

export default function SkriningQuestions() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const childId = searchParams.get('childId');

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswer = async (answer: boolean) => {
    const newAnswers = { ...answers, [currentQuestion]: answer };
    setAnswers(newAnswers);
    
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // All questions answered — submit to API
      setIsSubmitting(true);
      const orderedAnswers = QUESTIONS.map((_, i) => newAnswers[i] ?? false);

      try {
        const res = await fetch('/api/screenings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            childId: parseInt(childId || '0'),
            answers: orderedAnswers,
          }),
        });

        const data = await res.json();

        if (data.success) {
          router.push(`/skrining/analyzing?screeningId=${data.data.screening.id}`);
        } else {
          alert('Gagal menyimpan skrining: ' + (data.error || 'Unknown error'));
          setIsSubmitting(false);
        }
      } catch (error) {
        alert('Terjadi kesalahan jaringan.');
        setIsSubmitting(false);
      }
    }
  };

  const progress = ((currentQuestion) / QUESTIONS.length) * 100;

  if (!childId) {
    return (
      <div className="questions-page">
        <div className="container">
          <div className="question-card glass-panel fade-in" style={{ textAlign: 'center', padding: '60px' }}>
            <h2>Data anak belum tersedia</h2>
            <p style={{ marginTop: '16px', color: 'var(--text-light)' }}>Silakan isi data anak terlebih dahulu.</p>
            <button className="btn btn-primary" style={{ marginTop: '24px' }} onClick={() => router.push('/skrining')}>
              Kembali ke Form
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="questions-page">
      <div className="container">
        
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="progress-text">Pertanyaan {currentQuestion + 1} dari {QUESTIONS.length}</p>
        </div>

        <div className="question-card glass-panel fade-in" key={currentQuestion}>
          <h2 className="question-text">{QUESTIONS[currentQuestion]}</h2>
          
          <div className="answer-options">
            <button 
              className="btn btn-answer yes-btn" 
              onClick={() => handleAnswer(true)}
              disabled={isSubmitting}
            >
              {isSubmitting && currentQuestion === QUESTIONS.length - 1 ? 'Mengirim...' : 'Ya'}
            </button>
            <button 
              className="btn btn-answer no-btn" 
              onClick={() => handleAnswer(false)}
              disabled={isSubmitting}
            >
              {isSubmitting && currentQuestion === QUESTIONS.length - 1 ? 'Mengirim...' : 'Tidak'}
            </button>
          </div>
        </div>

        {currentQuestion > 0 && !isSubmitting && (
          <button 
            className="btn btn-secondary back-btn"
            onClick={() => setCurrentQuestion(currentQuestion - 1)}
          >
            ← Kembali
          </button>
        )}
      </div>
    </div>
  );
}

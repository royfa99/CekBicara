"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { calculateAgeInMonths, getQuestionsForAge } from '../../../utils/questions';
import './questions.css';

function QuestionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const childId = searchParams.get('childId');

  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!childId) {
      setLoading(false);
      return;
    }

    // Fetch child info and questions in parallel
    Promise.all([
      fetch(`/api/children/${childId}`).then(res => res.json()),
      fetch('/api/admin/content').then(res => res.json())
    ])
      .then(([childJson, contentJson]) => {
        if (childJson.success && contentJson.success) {
          const child = childJson.data;
          const ageInMonths = calculateAgeInMonths(child.dateOfBirth, child.isPremature, child.gestationalAge);
          
          let fetchedQuestions = [];
          const contentQuestions = contentJson.data.questions;
          if (ageInMonths <= 12) fetchedQuestions = contentQuestions["0_12"];
          else if (ageInMonths <= 24) fetchedQuestions = contentQuestions["13_24"];
          else if (ageInMonths <= 36) fetchedQuestions = contentQuestions["25_36"];
          else fetchedQuestions = contentQuestions["36_plus"];

          setQuestions(fetchedQuestions || []);
        } else {
          alert('Gagal memuat data skrining');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [childId]);

  const handleAnswer = async (answer: boolean) => {
    const newAnswers = { ...answers, [currentQuestion]: answer };
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // All questions answered — submit to API
      setIsSubmitting(true);
      const orderedAnswers = questions.map((_, i) => newAnswers[i] ?? false);

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

  if (loading) {
    return <div className="question-card glass-panel fade-in" style={{ textAlign: 'center', padding: '60px' }}>Memuat pertanyaan yang sesuai untuk usia anak Anda...</div>;
  }

  if (!childId || questions.length === 0) {
    return (
      <div className="question-card glass-panel fade-in" style={{ textAlign: 'center', padding: '60px' }}>
        <h2>Data anak belum tersedia</h2>
        <p style={{ marginTop: '16px', color: 'var(--text-light)' }}>Silakan isi data anak terlebih dahulu.</p>
        <button className="btn btn-primary" style={{ marginTop: '24px' }} onClick={() => router.push('/skrining')}>
          Kembali ke Form
        </button>
      </div>
    );
  }

  const progress = ((currentQuestion) / questions.length) * 100;

  return (
    <>
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="progress-text">Pertanyaan {currentQuestion + 1} dari {questions.length}</p>
      </div>

      <div className="question-card glass-panel fade-in" key={currentQuestion}>
        <h2 className="question-text">{questions[currentQuestion]}</h2>
        
        <div className="answer-options">
          <button 
            className="btn btn-answer yes-btn" 
            onClick={() => handleAnswer(true)}
            disabled={isSubmitting}
          >
            {isSubmitting && currentQuestion === questions.length - 1 ? 'Mengirim...' : 'Ya'}
          </button>
          <button 
            className="btn btn-answer no-btn" 
            onClick={() => handleAnswer(false)}
            disabled={isSubmitting}
          >
            {isSubmitting && currentQuestion === questions.length - 1 ? 'Mengirim...' : 'Tidak'}
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
    </>
  );
}

export default function SkriningQuestions() {
  return (
    <div className="questions-page">
      <div className="container">
        <Suspense fallback={<div className="question-card glass-panel fade-in" style={{ textAlign: 'center', padding: '60px' }}>Loading...</div>}>
          <QuestionsContent />
        </Suspense>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './skrining.css';

export default function SkriningDataAnak() {
  const router = useRouter();
  const [isPremature, setIsPremature] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/children', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('nama'),
          dateOfBirth: formData.get('tanggal_lahir'),
          gender: formData.get('jenis_kelamin'),
          isPremature,
          gestationalAge: isPremature ? parseInt(formData.get('usia_kandungan') as string) || null : null,
          familyHistory: formData.get('riwayat_keluarga'),
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/skrining/questions?childId=${data.data.id}`);
      } else {
        alert('Gagal menyimpan data anak: ' + (data.error || 'Unknown error'));
        setIsSubmitting(false);
      }
    } catch (error) {
      alert('Terjadi kesalahan jaringan.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="skrining-page">
      <div className="container">
        <div className="skrining-card glass-panel fade-in">
          <div className="text-center">
            <h1 className="title">Data Anak</h1>
            <p className="subtitle">Isi data berikut untuk penyesuaian skrining</p>
          </div>
          
          <form onSubmit={handleSubmit} className="skrining-form">
            <div className="form-group">
              <label htmlFor="nama">Nama Anak</label>
              <input type="text" id="nama" name="nama" placeholder="Contoh: Budi" required />
            </div>

            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="tanggal_lahir">Tanggal Lahir</label>
                <input type="date" id="tanggal_lahir" name="tanggal_lahir" required />
              </div>

              <div className="form-group half">
                <label htmlFor="jenis_kelamin">Jenis Kelamin</label>
                <select id="jenis_kelamin" name="jenis_kelamin" required defaultValue="">
                  <option value="" disabled>Pilih...</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={isPremature}
                  onChange={(e) => setIsPremature(e.target.checked)}
                />
                Lahir Prematur?
              </label>
            </div>

            {isPremature && (
              <div className="form-group fade-in-fast">
                <label htmlFor="usia_kandungan">Usia Kandungan Saat Lahir (Minggu)</label>
                <input type="number" id="usia_kandungan" name="usia_kandungan" placeholder="Contoh: 34" min="20" max="36" />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="riwayat_keluarga">Riwayat Speech Delay di Keluarga?</label>
              <select id="riwayat_keluarga" name="riwayat_keluarga">
                <option value="tidak">Tidak Ada</option>
                <option value="ada">Ada</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary full-width" disabled={isSubmitting}>
                {isSubmitting ? 'Menyimpan...' : 'Mulai Skrining'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

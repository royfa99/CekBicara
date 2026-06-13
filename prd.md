# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## CEK BICARA

### Speech Delay Early Warning System

Version: 1.0 MVP

---

# 1. PRODUCT OVERVIEW

## Product Name

Cek Bicara

## Tagline

Skrining Risiko Speech Delay Anak dalam 3 Menit

## Problem Statement

Banyak orang tua terlambat menyadari adanya keterlambatan bicara pada anak.

Sebagian besar orang tua:

* Tidak mengetahui milestone bicara sesuai usia.
* Menganggap anak laki-laki memang terlambat bicara.
* Menunggu terlalu lama sebelum mencari bantuan profesional.
* Sulit mengakses informasi yang akurat dan mudah dipahami.

Akibatnya intervensi sering terlambat dilakukan.

## Solution

Cek Bicara membantu orang tua melakukan skrining awal risiko speech delay berdasarkan:

* SDIDTK Kemenkes
* Milestone bahasa anak
* Red Flags Speech Delay
* Faktor risiko perkembangan

Dalam waktu kurang dari 3 menit, pengguna memperoleh:

* Tingkat risiko
* Analisis hasil
* Red flag yang ditemukan
* Rekomendasi stimulasi
* Saran tindak lanjut

---

# 2. TARGET USERS

## Primary User

Orang tua anak usia:
0–6 tahun

## Secondary User

* Dokter anak
* Terapis wicara
* Bidan
* Perawat
* Klinik tumbuh kembang
* Puskesmas

---

# 3. GOALS

## User Goals

* Mengetahui apakah perkembangan bicara anak sesuai usia.
* Mengetahui kapan harus ke terapis wicara.
* Mendapat stimulasi yang tepat.

## Business Goals

* Menjadi platform skrining speech delay terbesar di Indonesia.
* Mengumpulkan lead orang tua.
* Menjadi pintu masuk layanan konsultasi.
* Menjual paket premium dan B2B.

---

# 4. USER FLOW

Landing Page

↓

Klik "Mulai Skrining"

↓

Input Data Anak

↓

Perhitungan Usia

↓

Pertanyaan Skrining

↓

Analisis AI

↓

Hasil Skrining

↓

Rekomendasi

↓

Download PDF

---

# 5. INPUT DATA ANAK

Data wajib:

* Nama Anak
* Tanggal Lahir
* Jenis Kelamin

Pertanyaan tambahan:

* Prematur?
* Berapa minggu lahir?
* Riwayat NICU?
* Gangguan pendengaran?
* Pernah kejang?
* Riwayat speech delay keluarga?

---

# 6. FITUR USIA KOREKSI PREMATUR

Jika prematur:

Usia Koreksi =
Usia Kronologis - Selisih Prematur

Berlaku sampai usia 24 bulan.

Setelah 24 bulan menggunakan usia kronologis.

---

# 7. MESIN SKRINING

## Layer 1

Milestone Bahasa

## Layer 2

Red Flag Speech Delay

## Layer 3

Faktor Risiko

## Layer 4

Analisis AI

---

# 8. KELOMPOK USIA

0–6 bulan

6–12 bulan

12–18 bulan

18–24 bulan

24–36 bulan

36–48 bulan

48–60 bulan

60–72 bulan

---

# 9. CONTOH RED FLAGS

## 9 Bulan

Tidak babbling

## 12 Bulan

Tidak menunjuk

Tidak merespons nama

## 16 Bulan

Belum ada kata bermakna

## 18 Bulan

Kurang dari 10 kata

## 24 Bulan

Belum ada kombinasi 2 kata

Kosakata kurang dari 50 kata

## Semua Usia

Kehilangan kemampuan bicara

Tidak kontak mata

Tidak mengikuti instruksi sederhana

---

# 10. HASIL SKRINING

Kategori:

## Risiko Rendah

Perkembangan sesuai usia.

## Risiko Sedang

Perlu stimulasi dan pemantauan ulang.

## Risiko Tinggi

Disarankan evaluasi profesional.

---

# 11. HASIL ANALISIS AI

AI menghasilkan:

Ringkasan perkembangan

Kekuatan anak

Area yang perlu distimulasi

Red flag yang ditemukan

Rekomendasi tindakan

---

# 12. REKOMENDASI OTOMATIS

## Risiko Rendah

Stimulasi sesuai usia

Evaluasi ulang 3 bulan

## Risiko Sedang

Program stimulasi 30 hari

Evaluasi ulang 1 bulan

## Risiko Tinggi

Pemeriksaan pendengaran

Dokter anak

Terapis wicara

Skrining autisme

---

# 13. PROGRAM STIMULASI

Dibuat otomatis berdasarkan usia.

Contoh:

Usia 18 bulan

Hari 1–30

* Membaca buku gambar
* Menirukan suara hewan
* Latihan menunjuk
* Menyebut nama benda
* Bermain pura-pura

---

# 14. DASHBOARD PENGGUNA

Riwayat skrining

Grafik perkembangan

Riwayat hasil

Download PDF

Reminder evaluasi ulang

---

# 15. LANDING PAGE

Section 1

Hero

Headline:

Apakah Anak Anda Mengalami Speech Delay?

Subheadline:

Skrining risiko speech delay dalam 3 menit berdasarkan milestone perkembangan anak.

CTA:

Mulai Skrining Gratis

---

Section 2

Mengapa Penting?

80% perkembangan otak terjadi pada tahun-tahun awal kehidupan.

Semakin dini terdeteksi semakin baik hasil intervensi.

---

Section 3

Cara Kerja

1. Isi data anak

2. Jawab pertanyaan

3. Dapatkan hasil

---

Section 4

Yang Akan Anda Dapatkan

✓ Analisis perkembangan

✓ Identifikasi red flag

✓ Program stimulasi

✓ Rekomendasi tindak lanjut

---

Section 5

FAQ

---

Section 6

CTA Akhir

Mulai Skrining Gratis

---

# 16. MONETISASI

Free

* Skrining dasar

Premium

* Analisis AI lengkap
* Program stimulasi 30 hari
* PDF profesional
* Riwayat perkembangan

B2B

* Klinik
* Terapis Wicara
* Puskesmas
* Dokter Anak

Dashboard khusus tenaga kesehatan.

---

# 17. TECH STACK

Frontend:
Next.js

Backend:
Supabase

Authentication:
Supabase Auth

AI:
OpenAI API

Hosting:
Vercel

Database:
PostgreSQL (Supabase)

PDF:
React PDF

Analytics:
PostHog

---

# 18. SUCCESS METRICS

Conversion Landing → Skrining:

> 30%

Completion Rate:

> 80%

Lead Capture:

> 20%

Returning User:

> 25%

NPS:

> 50

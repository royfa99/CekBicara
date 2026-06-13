import { db } from './index';
import { users, children, screenings, screeningAnswers, screeningResults } from './schema';
import { sql } from 'drizzle-orm';

async function seed() {
  console.log("Clearing database...");

  // Clear all tables in dependency order
  await db.delete(screeningResults);
  await db.delete(screeningAnswers);
  await db.delete(screenings);
  await db.delete(children);
  await db.delete(users);

  console.log("Seeding database...");

  try {
    // 1. Insert a mock user
    console.log("Inserting user...");
    const [user] = await db.insert(users).values({
      name: "Ibu Sarah",
      email: "sarah@example.com",
      role: "parent",
      createdAt: new Date().toISOString()
    }).returning();

    // 2. Insert a mock child
    console.log("Inserting child...");
    const [child] = await db.insert(children).values({
      userId: user.id,
      name: "Budi",
      dateOfBirth: "2024-12-10",
      gender: "L",
      isPremature: false,
      familyHistory: "tidak",
      createdAt: new Date().toISOString()
    }).returning();

    // 3. Insert screening 1 — Risiko Rendah (Dec 2025, 12 months)
    console.log("Inserting screening 1...");
    const [s1] = await db.insert(screenings).values({
      childId: child.id,
      date: "2025-12-05",
      riskLevel: "Risiko Rendah",
      summary: "Perkembangan Budi sesuai dengan usianya. Kosakata dasar tercapai.",
      score: 80,
      createdAt: new Date().toISOString()
    }).returning();

    await db.insert(screeningAnswers).values([
      { screeningId: s1.id, questionIndex: 0, questionText: "Apakah anak Anda sudah bisa memanggil 'Mama' atau 'Papa' dengan makna?", answer: true },
      { screeningId: s1.id, questionIndex: 1, questionText: "Apakah anak Anda menunjuk dengan jari telunjuk untuk meminta sesuatu?", answer: true },
      { screeningId: s1.id, questionIndex: 2, questionText: "Apakah anak Anda merespons ketika namanya dipanggil?", answer: true },
      { screeningId: s1.id, questionIndex: 3, questionText: "Apakah anak Anda memiliki minimal 10 kosakata yang dapat diucapkan dengan jelas?", answer: true },
      { screeningId: s1.id, questionIndex: 4, questionText: "Apakah anak Anda dapat mengikuti instruksi sederhana tanpa bantuan isyarat tangan?", answer: false }
    ]);

    await db.insert(screeningResults).values({
      screeningId: s1.id,
      redFlags: JSON.stringify(["Belum bisa mengikuti instruksi sederhana"]),
      strengths: JSON.stringify(["Sudah bisa memanggil Mama/Papa", "Menunjuk untuk meminta", "Merespons nama", "Kosakata memadai"]),
      recommendations: JSON.stringify(["Lanjutkan stimulasi sesuai usia.", "Evaluasi ulang dalam 3 bulan."]),
      stimulationPlan: JSON.stringify([
        { task: "Membaca buku gambar interaktif", icon: "📚" },
        { task: "Latihan menirukan suara hewan", icon: "🗣️" }
      ])
    });

    // 4. Insert screening 2 — Risiko Sedang (Mar 2026, 15 months)
    console.log("Inserting screening 2...");
    const [s2] = await db.insert(screenings).values({
      childId: child.id,
      date: "2026-03-10",
      riskLevel: "Risiko Sedang",
      summary: "Terdapat sedikit keterlambatan dalam penguasaan kata baru. Perlu stimulasi rutin.",
      score: 60,
      createdAt: new Date().toISOString()
    }).returning();

    await db.insert(screeningAnswers).values([
      { screeningId: s2.id, questionIndex: 0, questionText: "Apakah anak Anda sudah bisa memanggil 'Mama' atau 'Papa' dengan makna?", answer: true },
      { screeningId: s2.id, questionIndex: 1, questionText: "Apakah anak Anda menunjuk dengan jari telunjuk untuk meminta sesuatu?", answer: true },
      { screeningId: s2.id, questionIndex: 2, questionText: "Apakah anak Anda merespons ketika namanya dipanggil?", answer: true },
      { screeningId: s2.id, questionIndex: 3, questionText: "Apakah anak Anda memiliki minimal 10 kosakata yang dapat diucapkan dengan jelas?", answer: false },
      { screeningId: s2.id, questionIndex: 4, questionText: "Apakah anak Anda dapat mengikuti instruksi sederhana tanpa bantuan isyarat tangan?", answer: false }
    ]);

    await db.insert(screeningResults).values({
      screeningId: s2.id,
      redFlags: JSON.stringify(["Kosakata kurang dari target usia", "Belum bisa mengikuti instruksi sederhana"]),
      strengths: JSON.stringify(["Sudah bisa memanggil Mama/Papa", "Menunjuk untuk meminta", "Merespons nama"]),
      recommendations: JSON.stringify(["Mulai Program Stimulasi 30 Hari.", "Kurangi screen time.", "Evaluasi ulang bulan depan."]),
      stimulationPlan: JSON.stringify([
        { task: "Membaca buku gambar interaktif", icon: "📚" },
        { task: "Bermain tunjuk-sebut benda", icon: "👆" }
      ])
    });

    // 5. Insert screening 3 — Risiko Sedang (Jun 2026, 18 months)
    console.log("Inserting screening 3...");
    const [s3] = await db.insert(screenings).values({
      childId: child.id,
      date: "2026-06-12",
      riskLevel: "Risiko Sedang",
      summary: "Kemampuan reseptif sangat baik, namun ekspresif masih tertinggal.",
      score: 60,
      createdAt: new Date().toISOString()
    }).returning();

    await db.insert(screeningAnswers).values([
      { screeningId: s3.id, questionIndex: 0, questionText: "Apakah anak Anda sudah bisa memanggil 'Mama' atau 'Papa' dengan makna?", answer: true },
      { screeningId: s3.id, questionIndex: 1, questionText: "Apakah anak Anda menunjuk dengan jari telunjuk untuk meminta sesuatu?", answer: false },
      { screeningId: s3.id, questionIndex: 2, questionText: "Apakah anak Anda merespons ketika namanya dipanggil?", answer: true },
      { screeningId: s3.id, questionIndex: 3, questionText: "Apakah anak Anda memiliki minimal 10 kosakata yang dapat diucapkan dengan jelas?", answer: false },
      { screeningId: s3.id, questionIndex: 4, questionText: "Apakah anak Anda dapat mengikuti instruksi sederhana tanpa bantuan isyarat tangan?", answer: true }
    ]);

    await db.insert(screeningResults).values({
      screeningId: s3.id,
      redFlags: JSON.stringify(["Belum menunjuk untuk meminta", "Kosakata kurang dari target usia"]),
      strengths: JSON.stringify(["Sudah bisa memanggil Mama/Papa", "Merespons nama", "Mampu mengikuti instruksi sederhana"]),
      recommendations: JSON.stringify(["Mulai Program Stimulasi 30 Hari.", "Kurangi screen time.", "Evaluasi ulang bulan depan.", "Konsultasi Terapis Wicara jika tidak ada kemajuan."]),
      stimulationPlan: JSON.stringify([
        { task: "Membaca buku gambar interaktif", icon: "📚" },
        { task: "Latihan menirukan suara hewan", icon: "🗣️" },
        { task: "Bermain tunjuk-sebut benda", icon: "👆" },
        { task: "Bernyanyi lagu anak bersama", icon: "🎵" }
      ])
    });

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();

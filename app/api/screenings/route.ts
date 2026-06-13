import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { screenings, screeningAnswers, screeningResults, children } from '../../../../db/schema';
import { eq, desc } from 'drizzle-orm';

const QUESTIONS = [
  "Apakah anak Anda sudah bisa memanggil 'Mama' atau 'Papa' dengan makna?",
  "Apakah anak Anda menunjuk dengan jari telunjuk untuk meminta sesuatu?",
  "Apakah anak Anda merespons ketika namanya dipanggil?",
  "Apakah anak Anda memiliki minimal 10 kosakata yang dapat diucapkan dengan jelas?",
  "Apakah anak Anda dapat mengikuti instruksi sederhana tanpa bantuan isyarat tangan?"
];

// Simple rule-based screening engine (replaces AI for now)
function computeScreeningResult(answers: boolean[], childName: string) {
  const yesCount = answers.filter(Boolean).length;
  const total = answers.length;
  const score = Math.round((yesCount / total) * 100);

  let riskLevel: string;
  let summary: string;

  if (score >= 80) {
    riskLevel = 'Risiko Rendah';
    summary = `Perkembangan ${childName} sesuai dengan usianya. Kemampuan komunikasi dasar tercapai dengan baik.`;
  } else if (score >= 40) {
    riskLevel = 'Risiko Sedang';
    summary = `${childName} menunjukkan kemampuan dasar komunikasi yang cukup baik, namun terdapat sedikit keterlambatan pada area ekspresif (kosakata) mengingat usianya.`;
  } else {
    riskLevel = 'Risiko Tinggi';
    summary = `${childName} menunjukkan keterlambatan signifikan pada beberapa aspek komunikasi. Disarankan evaluasi profesional segera.`;
  }

  const redFlags: string[] = [];
  const strengths: string[] = [];

  if (!answers[0]) redFlags.push("Belum bisa memanggil Mama/Papa dengan makna");
  else strengths.push("Sudah bisa memanggil Mama/Papa dengan makna");

  if (!answers[1]) redFlags.push("Belum menunjuk dengan jari untuk meminta");
  else strengths.push("Sudah menunjuk untuk meminta sesuatu");

  if (!answers[2]) redFlags.push("Tidak merespons ketika nama dipanggil");
  else strengths.push("Merespons dengan baik ketika nama dipanggil");

  if (!answers[3]) redFlags.push("Kosakata kurang dari target usia");
  else strengths.push("Kosakata memadai untuk usia");

  if (!answers[4]) redFlags.push("Belum bisa mengikuti instruksi sederhana");
  else strengths.push("Mampu mengikuti instruksi sederhana");

  let recommendations: string[];
  if (riskLevel === 'Risiko Rendah') {
    recommendations = [
      "Lanjutkan stimulasi sesuai usia.",
      "Lakukan evaluasi ulang dalam 3 bulan.",
      "Ajak anak membaca buku setiap hari."
    ];
  } else if (riskLevel === 'Risiko Sedang') {
    recommendations = [
      "Mulai Program Stimulasi 30 Hari dari kami.",
      "Kurangi screen time menjadi kurang dari 1 jam per hari.",
      "Lakukan evaluasi ulang di Cek Bicara bulan depan.",
      "Jika tidak ada kemajuan dalam 1 bulan, jadwalkan konsultasi dengan Terapis Wicara."
    ];
  } else {
    recommendations = [
      "Segera jadwalkan pemeriksaan pendengaran.",
      "Konsultasi dengan Dokter Anak spesialis tumbuh kembang.",
      "Rujuk ke Terapis Wicara untuk evaluasi menyeluruh.",
      "Pertimbangkan skrining autisme (M-CHAT).",
      "Mulai Program Stimulasi 30 Hari intensif."
    ];
  }

  const stimulationPlan = [
    { task: "Membaca buku gambar interaktif bersama", icon: "📚" },
    { task: "Latihan menirukan suara hewan", icon: "🗣️" },
    { task: "Bermain tunjuk-sebut benda di sekitar", icon: "👆" },
    { task: "Bernyanyi lagu anak bersama", icon: "🎵" }
  ];

  return { riskLevel, summary, score, redFlags, strengths, recommendations, stimulationPlan };
}

// GET /api/screenings — list all screenings (optionally ?childId=)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const childId = searchParams.get('childId');

    let query;
    if (childId) {
      query = await db.select().from(screenings)
        .where(eq(screenings.childId, parseInt(childId)))
        .orderBy(desc(screenings.date));
    } else {
      query = await db.select().from(screenings).orderBy(desc(screenings.date));
    }

    return NextResponse.json({ success: true, data: query });
  } catch (error) {
    console.error('Error fetching screenings:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch screenings' }, { status: 500 });
  }
}

// POST /api/screenings — create screening + answers + result
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { childId, answers } = body;
    // answers: boolean[] — ordered by question index

    if (!childId || !answers || !Array.isArray(answers)) {
      return NextResponse.json({ success: false, error: 'Missing required fields: childId, answers (boolean[])' }, { status: 400 });
    }

    // Get child name for summary
    const [child] = await db.select().from(children).where(eq(children.id, childId));
    if (!child) {
      return NextResponse.json({ success: false, error: 'Child not found' }, { status: 404 });
    }

    // Compute result
    const result = computeScreeningResult(answers, child.name);

    // 1. Insert screening
    const [screening] = await db.insert(screenings).values({
      childId,
      date: new Date().toISOString().split('T')[0],
      riskLevel: result.riskLevel,
      summary: result.summary,
      score: result.score,
      createdAt: new Date().toISOString()
    }).returning();

    // 2. Insert answers
    const answerRows = answers.map((answer: boolean, index: number) => ({
      screeningId: screening.id,
      questionIndex: index,
      questionText: QUESTIONS[index] || `Pertanyaan ${index + 1}`,
      answer
    }));
    await db.insert(screeningAnswers).values(answerRows);

    // 3. Insert result
    await db.insert(screeningResults).values({
      screeningId: screening.id,
      redFlags: JSON.stringify(result.redFlags),
      strengths: JSON.stringify(result.strengths),
      recommendations: JSON.stringify(result.recommendations),
      stimulationPlan: JSON.stringify(result.stimulationPlan)
    });

    return NextResponse.json({
      success: true,
      data: {
        screening,
        result: {
          riskLevel: result.riskLevel,
          summary: result.summary,
          score: result.score,
          redFlags: result.redFlags,
          strengths: result.strengths,
          recommendations: result.recommendations,
          stimulationPlan: result.stimulationPlan
        }
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating screening:', error);
    return NextResponse.json({ success: false, error: 'Failed to create screening' }, { status: 500 });
  }
}

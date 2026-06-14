import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { createClient } from '../../../utils/supabase/server';
import { calculateAgeInMonths, getQuestionsForAge } from '../../../utils/questions';

export const dynamic = 'force-dynamic';

// Simple rule-based screening engine (replaces AI for now)
function computeScreeningResult(answers: boolean[], questions: string[], childName: string) {
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

  answers.forEach((answer, i) => {
    if (!answer) redFlags.push(`Belum bisa: ${questions[i]}`);
    else strengths.push(`Sudah bisa: ${questions[i]}`);
  });

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

export async function GET(request: Request) {
  try {
    const supabaseClient = createClient();
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const childId = searchParams.get('childId');

    // First get all child IDs belonging to this user
    const { data: userChildren } = await supabase
      .from('children')
      .select('id')
      .eq('user_id', user.id);

    const validChildIds = userChildren ? userChildren.map(c => c.id) : [];

    if (validChildIds.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    let query = supabase.from('screenings').select('*').order('date', { ascending: false });

    if (childId) {
      if (!validChildIds.includes(parseInt(childId))) {
        return NextResponse.json({ success: false, error: 'Unauthorized child access' }, { status: 403 });
      }
      query = query.eq('child_id', parseInt(childId));
    } else {
      query = query.in('child_id', validChildIds);
    }

    const { data: screenings, error } = await query;

    if (error) throw error;

    const mappedScreenings = screenings.map((s: any) => ({
      id: s.id,
      childId: s.child_id,
      date: s.date,
      riskLevel: s.risk_level,
      summary: s.summary,
      score: s.score,
      createdAt: s.created_at
    }));

    return NextResponse.json({ success: true, data: mappedScreenings });
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
    const { data: child, error: childError } = await supabase
      .from('children')
      .select('*')
      .eq('id', childId)
      .single();

    if (childError || !child) {
      return NextResponse.json({ success: false, error: 'Child not found' }, { status: 404 });
    }

    const ageInMonths = calculateAgeInMonths(child.date_of_birth, child.is_premature, child.gestational_age);
    const questions = getQuestionsForAge(ageInMonths);

    // Compute result
    const result = computeScreeningResult(answers, questions, child.name);

    // 1. Insert screening
    const { data: screening, error: screeningError } = await supabase
      .from('screenings')
      .insert({
        child_id: childId,
        date: new Date().toISOString().split('T')[0],
        risk_level: result.riskLevel,
        summary: result.summary,
        score: result.score,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (screeningError) throw screeningError;

    // 2. Insert answers
    const answerRows = answers.map((answer: boolean, index: number) => ({
      screening_id: screening.id,
      question_index: index,
      question_text: questions[index] || `Pertanyaan ${index + 1}`,
      answer
    }));
    
    const { error: answersError } = await supabase.from('screening_answers').insert(answerRows);
    if (answersError) throw answersError;

    // 3. Insert result
    const { error: resultsError } = await supabase.from('screening_results').insert({
      screening_id: screening.id,
      red_flags: JSON.stringify(result.redFlags),
      strengths: JSON.stringify(result.strengths),
      recommendations: JSON.stringify(result.recommendations),
      stimulation_plan: JSON.stringify(result.stimulationPlan)
    });
    
    if (resultsError) throw resultsError;

    const mappedScreening = {
      id: screening.id,
      childId: screening.child_id,
      date: screening.date,
      riskLevel: screening.risk_level,
      summary: screening.summary,
      score: screening.score,
      createdAt: screening.created_at
    };

    return NextResponse.json({
      success: true,
      data: {
        screening: mappedScreening,
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

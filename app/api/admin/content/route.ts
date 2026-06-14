import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { createClient } from '../../../../utils/supabase/server';
import { getQuestionsForAge } from '../../../../utils/questions';

export const dynamic = 'force-dynamic';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'aburoyyan07@gmail.com';

// Format Data Bawaan (Default Seed Data)
const generateDefaultContent = () => {
  return {
    questions: {
      "0_12": getQuestionsForAge(10), // triggers 0-12 bracket
      "13_24": getQuestionsForAge(20), // triggers 13-24 bracket
      "25_36": getQuestionsForAge(30), // triggers 25-36 bracket
      "36_plus": getQuestionsForAge(40) // triggers 36+ bracket
    },
    baseTasks: {
      "0_12": [
        "Bermain 'Cilukba' sambil menatap mata anak",
        "Membacakan buku cerita bergambar yang cerah",
        "Menyanyikan lagu anak sambil bertepuk tangan",
        "Membunyikan mainan kerincingan di sisi kiri/kanan telinga",
        "Mengajak anak bercermin dan menyebutkan namanya",
        "Pijat lembut bayi sambil mengajaknya mengobrol",
        "Membiarkan anak menyentuh berbagai tekstur (kain, boneka bulu)",
        "Bermain cilukba menggunakan selimut",
        "Memberikan respon heboh/senyum saat bayi mengoceh",
        "Mengenalkan makanan pendamping dengan berbagai rasa/tekstur"
      ],
      "13_24": [
        "Menyanyikan lagu anak dengan gerakan tangan (misal: Topi Saya Bundar)",
        "Mengajak anak menirukan suara hewan (Kucing: Meow, Sapi: Moo)",
        "Membacakan buku sambil menunjuk gambarnya",
        "Bermain puzzle sederhana (2-3 keping)",
        "Mengajak anak merapikan mainan bersama-sama",
        "Menamai anggota tubuh saat mandi (Ini hidung, ini perut)",
        "Bermain bola tangkap bergantian",
        "Bermain masak-masakan atau pura-pura minum dari gelas",
        "Menggambar bebas dengan krayon besar",
        "Berjalan di luar rumah dan menunjuk burung/mobil"
      ],
      "25_36": [
        "Bermain peran profesi (dokter-dokteran, polisi)",
        "Membacakan buku cerita dan menanyakan 'Ini hewan apa?'",
        "Mengajarkan konsep berlawanan (besar-kecil, atas-bawah)",
        "Meniup gelembung sabun atau meniup lilin",
        "Mengajarkan menyebutkan nama lengkap dan umurnya",
        "Bernyanyi lagu yang sedikit panjang (Pelangi-pelangi)",
        "Bermain tebak warna dari mainan balok",
        "Menyembunyikan mainan dan memintanya mencari",
        "Mendeskripsikan apa yang sedang dikerjakan orang tua",
        "Melibatkan anak dalam pekerjaan rumah ringan (melipat baju)"
      ],
      "36_plus": [
        "Mendengarkan anak menceritakan kejadian hari ini",
        "Bermain tebak-tebakan hewan dari ciri-cirinya",
        "Mengajarkan anak bertanya 'Kenapa' dan menjawab 'Karena...'",
        "Bermain balok susun sambil membangun cerita kota/rumah",
        "Membacakan dongeng sebelum tidur dengan berbagai intonasi suara",
        "Membiarkan anak memilih pakaian dan menjelaskan alasannya",
        "Mengajarkan nama-nama hari atau konsep waktu sederhana",
        "Bernyanyi lagu favorit anak bersama-sama",
        "Melihat album foto keluarga dan menceritakan kenangan",
        "Bermain petak umpet dengan aturan yang lebih kompleks"
      ]
    }
  };
};

export async function GET() {
  try {
    // Note: GET is public/internal so the frontend can easily fetch the configuration 
    // for building the screening page.
    
    const { data, error } = await supabase.from('app_content').select('content').eq('id', 1).single();

    if (error || !data || !data.content) {
      // Jika tabel belum ada isinya, kembalikan data bawaan
      return NextResponse.json({ success: true, data: generateDefaultContent() });
    }

    return NextResponse.json({ success: true, data: data.content });
  } catch (error: any) {
    console.error('Error fetching content:', error);
    // Auto-fallback if table doesn't exist yet
    return NextResponse.json({ success: true, data: generateDefaultContent() });
  }
}

export async function POST(request: Request) {
  try {
    // SECURITY CHECK: Ensure user is logged in and is the admin
    const supabaseServer = createClient();
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();

    if (authError || !user || user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ success: false, error: 'Access Denied: Admins Only' }, { status: 403 });
    }

    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ success: false, error: 'Missing content payload' }, { status: 400 });
    }

    // Upsert the content (Update if exists, Insert if not)
    const { error: upsertError } = await supabase
      .from('app_content')
      .upsert({ id: 1, content: content }, { onConflict: 'id' });

    if (upsertError) throw upsertError;

    return NextResponse.json({ success: true, message: 'Content saved successfully' });
  } catch (error: any) {
    console.error('Error saving content:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

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
    },
    targetedTasks: {
      "0_12": [
        ["Latihan kontak mata sejajar saat menyusui/makan", "Pegang mainan di dekat mata Anda agar anak menatap wajah Anda", "Pakai topeng/kacamata lucu agar anak terpancing melihat mata Anda"],
        ["Goda anak dengan gelitik lembut di perut", "Buat suara-suara lucu dengan bibir untuk memancing senyum", "Bermain cilukba secara intens dengan variasi suara"],
        ["Panggil nama anak dari belakang tanpa menunjukkan wajah", "Ucapkan nama anak dengan nada bernyanyi/melodi", "Berikan mainan hanya saat anak menoleh setelah dipanggil namanya"],
        ["Tirukan ocehan anak agar ia merasa direspons", "Lakukan stimulasi area bibir dengan sikat gigi jari", "Pancing dengan suara vokal panjang 'Aaaa' atau 'Oooo'"],
        ["Bunyikan kerincingan di luar jangkauan pandangan", "Bermain tebak arah suara botol berisi beras", "Berikan respon kaget/heboh bersama saat ada suara keras"]
      ],
      "13_24": [
        ["Pegang tangan anak ke dada kita sambil bilang 'Ma-ma' atau 'Pa-pa'", "Main sembunyi dan muncul sambil berseru 'Paaa-paaa!'", "Gunakan cermin dan tunjuk diri sendiri sambil bilang 'Mama/Papa'"],
        ["Taruh mainan favorit di tempat tinggi yang terlihat, tunggu anak menunjuk", "Jangan langsung ambilkan barang, tuntun tangan anak untuk menunjuk", "Bermain tunjuk gambar di buku 'Mana kucing?'"],
        ["Latihan mengulangi 1-2 kata fokus hari ini secara intens (misal: 'Bola', 'Susu')", "Berikan pilihan 'Mau Susu atau Air?' agar anak bersuara", "Beri jeda/tunggu anak mencoba mengucap sebelum memberikan sesuatu"],
        ["Latihan instruksi rutinitas rutin (misal: 'Buang sampahnya')", "Latihan permainan fisik 'Tepuk tangan', 'Pegang hidung'", "Beri instruksi dengan menatap matanya secara langsung dan tegas"],
        ["Ajak bicara berhadapan sangat dekat agar anak melihat gerak bibir", "Gunakan kata tiruan bunyi yang mudah (Brum-brum, Meong)", "Berikan pujian/tepuk tangan luar biasa meski anak meniru tidak sempurna"]
      ],
      "25_36": [
        ["Perpanjang ucapan anak (Anak bilang 'Susu', balas dengan 'Mau Susu?')", "Ajarkan kombinasi sifat-benda ('Mobil merah', 'Bola besar')", "Gunakan buku bergambar berisi adegan aksi ('Kucing lari', 'Burung terbang')"],
        ["Latihan Flashcard benda sehari-hari (5 menit/hari)", "Simpan mainan dalam kotak tertutup transparan, minta anak sebutkan isinya", "Keliling rumah sambil tanya 'Ini apa?'"],
        ["Latihan game 'Bawa bola hijau ke Papa'", "Tugaskan misi kecil (Ambil remot dan letakkan di meja)", "Pecah instruksi besar dengan intonasi jeda yang jelas"],
        ["Fokus pada pelafalan huruf bibir (B, P, M) dan lidah (T, D, N)", "Ulangi kalimat anak dengan pelafalan yang benar tanpa menyalahkan", "Minta anak berbicara perlahan dengan memberi contoh tempo lambat"],
        ["Latihan membagikan kue 'Ini untuk kamu, ini untuk saya'", "Bermain peran dengan boneka menggunakan nama ganti", "Sering tekankan kata ganti saat bercerita buku"]
      ],
      "36_plus": [
        ["Ajak main boneka tangan dan buat dialog", "Bantu anak menyambung ide ceritanya dengan kata sambung (lalu, dan)", "Minta anak menjelaskan cara memainkan mainannya"],
        ["Tanya 'Apa hal paling lucu yang terjadi hari ini?'", "Minta anak menceritakan kembali cerita buku favoritnya", "Tonton video pendek bersama lalu minta anak ceritakan ulang"],
        ["Permainan 'Berita Hari Ini' pura-pura jadi reporter", "Latihan bernyanyi dengan ritme pelan dan jelas", "Konsultasi terapis untuk latihan oral-motor (senam lidah/bibir)"],
        ["Pancing rasa penasaran dengan hal aneh (pakai kaus kaki di tangan) agar ia bertanya", "Bacakan buku misteri pendek agar ia banyak bertanya", "Sengaja sembunyikan mainannya agar ia bertanya 'Di mana?'"],
        ["Main petak umpet mainan dengan petunjuk preposisi (di bawah kasur, di atas meja)", "Latihan menggambar bentuk geometri 'Gambarlah lingkaran di dalam kotak'", "Minta anak menaruh benda ke kotak sesuai instruksi yang rumit"]
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

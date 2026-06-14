export function generateDynamicTasks(ageInMonths: number, failedQuestionIndices: number[], customBaseTasks?: string[]): string[] {
  // 1. BASE TASKS (Tugas Pengayaan Umum Sesuai Usia)
  let baseTasks: string[] = [];
  
  if (customBaseTasks && customBaseTasks.length > 0) {
    baseTasks = customBaseTasks;
  } else {
    // Fallback if customBaseTasks not provided
    if (ageInMonths <= 12) {
      baseTasks = [
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
      ];
    } else if (ageInMonths <= 24) {
      baseTasks = [
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
      ];
    } else if (ageInMonths <= 36) {
      baseTasks = [
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
      ];
    } else {
      baseTasks = [
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
      ];
    }
  }

  // 2. TARGETED TASKS (Tugas Spesifik Berdasarkan Red Flags per Usia)
  const targetedTasksPool: string[] = [];
  
  if (ageInMonths <= 12) {
    // 0: Kontak mata, 1: Tersenyum, 2: Merespons nama, 3: Meraban/Oceh, 4: Merespons suara
    if (failedQuestionIndices.includes(0)) targetedTasksPool.push("Latihan kontak mata sejajar saat menyusui/makan", "Pegang mainan di dekat mata Anda agar anak menatap wajah Anda", "Pakai topeng/kacamata lucu agar anak terpancing melihat mata Anda");
    if (failedQuestionIndices.includes(1)) targetedTasksPool.push("Goda anak dengan gelitik lembut di perut", "Buat suara-suara lucu dengan bibir untuk memancing senyum", "Bermain cilukba secara intens dengan variasi suara");
    if (failedQuestionIndices.includes(2)) targetedTasksPool.push("Panggil nama anak dari belakang tanpa menunjukkan wajah", "Ucapkan nama anak dengan nada bernyanyi/melodi", "Berikan mainan hanya saat anak menoleh setelah dipanggil namanya");
    if (failedQuestionIndices.includes(3)) targetedTasksPool.push("Tirukan ocehan anak agar ia merasa direspons", "Lakukan stimulasi area bibir dengan sikat gigi jari", "Pancing dengan suara vokal panjang 'Aaaa' atau 'Oooo'");
    if (failedQuestionIndices.includes(4)) targetedTasksPool.push("Bunyikan kerincingan di luar jangkauan pandangan", "Bermain tebak arah suara botol berisi beras", "Berikan respon kaget/heboh bersama saat ada suara keras");
  } else if (ageInMonths <= 24) {
    // 0: Panggil Mama/Papa, 1: Menunjuk jari, 2: Kosakata 10-50, 3: 1 Instruksi sederhana, 4: Meniru kata
    if (failedQuestionIndices.includes(0)) targetedTasksPool.push("Pegang tangan anak ke dada kita sambil bilang 'Ma-ma' atau 'Pa-pa'", "Main sembunyi dan muncul sambil berseru 'Paaa-paaa!'", "Gunakan cermin dan tunjuk diri sendiri sambil bilang 'Mama/Papa'");
    if (failedQuestionIndices.includes(1)) targetedTasksPool.push("Taruh mainan favorit di tempat tinggi yang terlihat, tunggu anak menunjuk", "Jangan langsung ambilkan barang, tuntun tangan anak untuk menunjuk", "Bermain tunjuk gambar di buku 'Mana kucing?'");
    if (failedQuestionIndices.includes(2)) targetedTasksPool.push("Latihan mengulangi 1-2 kata fokus hari ini secara intens (misal: 'Bola', 'Susu')", "Berikan pilihan 'Mau Susu atau Air?' agar anak bersuara", "Beri jeda/tunggu anak mencoba mengucap sebelum memberikan sesuatu");
    if (failedQuestionIndices.includes(3)) targetedTasksPool.push("Latihan instruksi rutinitas rutin (misal: 'Buang sampahnya')", "Latihan permainan fisik 'Tepuk tangan', 'Pegang hidung'", "Beri instruksi dengan menatap matanya secara langsung dan tegas");
    if (failedQuestionIndices.includes(4)) targetedTasksPool.push("Ajak bicara berhadapan sangat dekat agar anak melihat gerak bibir", "Gunakan kata tiruan bunyi yang mudah (Brum-brum, Meong)", "Berikan pujian/tepuk tangan luar biasa meski anak meniru tidak sempurna");
  } else if (ageInMonths <= 36) {
    // 0: Rangkai 2 kata, 1: Nama benda, 2: 2 Instruksi, 3: Dipahami 50%, 4: Kata ganti
    if (failedQuestionIndices.includes(0)) targetedTasksPool.push("Perpanjang ucapan anak (Anak bilang 'Susu', balas dengan 'Mau Susu?')", "Ajarkan kombinasi sifat-benda ('Mobil merah', 'Bola besar')", "Gunakan buku bergambar berisi adegan aksi ('Kucing lari', 'Burung terbang')");
    if (failedQuestionIndices.includes(1)) targetedTasksPool.push("Latihan Flashcard benda sehari-hari (5 menit/hari)", "Simpan mainan dalam kotak tertutup transparan, minta anak sebutkan isinya", "Keliling rumah sambil tanya 'Ini apa?'");
    if (failedQuestionIndices.includes(2)) targetedTasksPool.push("Latihan game 'Bawa bola hijau ke Papa'", "Tugaskan misi kecil (Ambil remot dan letakkan di meja)", "Pecah instruksi besar dengan intonasi jeda yang jelas");
    if (failedQuestionIndices.includes(3)) targetedTasksPool.push("Fokus pada pelafalan huruf bibir (B, P, M) dan lidah (T, D, N)", "Ulangi kalimat anak dengan pelafalan yang benar tanpa menyalahkan", "Minta anak berbicara perlahan dengan memberi contoh tempo lambat");
    if (failedQuestionIndices.includes(4)) targetedTasksPool.push("Latihan membagikan kue 'Ini untuk kamu, ini untuk saya'", "Bermain peran dengan boneka menggunakan nama ganti", "Sering tekankan kata ganti saat bercerita buku");
  } else {
    // > 36 bulan
    if (failedQuestionIndices.includes(0)) targetedTasksPool.push("Ajak main boneka tangan dan buat dialog", "Bantu anak menyambung ide ceritanya dengan kata sambung (lalu, dan)", "Minta anak menjelaskan cara memainkan mainannya");
    if (failedQuestionIndices.includes(1)) targetedTasksPool.push("Tanya 'Apa hal paling lucu yang terjadi hari ini?'", "Minta anak menceritakan kembali cerita buku favoritnya", "Tonton video pendek bersama lalu minta anak ceritakan ulang");
    if (failedQuestionIndices.includes(2)) targetedTasksPool.push("Permainan 'Berita Hari Ini' pura-pura jadi reporter", "Latihan bernyanyi dengan ritme pelan dan jelas", "Konsultasi terapis untuk latihan oral-motor (senam lidah/bibir)");
    if (failedQuestionIndices.includes(3)) targetedTasksPool.push("Pancing rasa penasaran dengan hal aneh (pakai kaus kaki di tangan) agar ia bertanya", "Bacakan buku misteri pendek agar ia banyak bertanya", "Sengaja sembunyikan mainannya agar ia bertanya 'Di mana?'");
    if (failedQuestionIndices.includes(4)) targetedTasksPool.push("Main petak umpet mainan dengan petunjuk preposisi (di bawah kasur, di atas meja)", "Latihan menggambar bentuk geometri 'Gambarlah lingkaran di dalam kotak'", "Minta anak menaruh benda ke kotak sesuai instruksi yang rumit");
  }

  // 3. GENERATE 30 DAYS CALENDAR
  const finalTasks: string[] = [];
  
  // Jika ada targeted tasks, masukkan beberapa kali untuk repetisi (pembelajaran intensif)
  if (targetedTasksPool.length > 0) {
    // Ulangan setiap targeted task sebanyak 2-3 kali selama sebulan (tergantung banyaknya)
    const repetition = Math.max(1, Math.floor(20 / targetedTasksPool.length));
    
    for (let i = 0; i < targetedTasksPool.length; i++) {
      for (let r = 0; r < repetition; r++) {
        if (finalTasks.length < 30) {
          finalTasks.push(targetedTasksPool[i]);
        }
      }
    }
  }

  // Penuhi sisanya (hingga 30) dengan Base Tasks
  let baseTaskIndex = 0;
  while (finalTasks.length < 30) {
    // Ambil base tasks secara berulang jika perlu (modulo)
    finalTasks.push(baseTasks[baseTaskIndex % baseTasks.length]);
    baseTaskIndex++;
  }

  // 4. SHUFFLE TASKS (Mengacak array agar variasinya merata setiap hari)
  for (let i = finalTasks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [finalTasks[i], finalTasks[j]] = [finalTasks[j], finalTasks[i]];
  }

  return finalTasks;
}

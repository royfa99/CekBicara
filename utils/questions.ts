export function calculateAgeInMonths(dateOfBirth: string, isPremature: boolean, gestationalAge: number | null): number {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  
  let months = (today.getFullYear() - dob.getFullYear()) * 12;
  months -= dob.getMonth();
  months += today.getMonth();
  
  if (today.getDate() < dob.getDate()) {
    months--;
  }

  // Koreksi usia prematur (jika lahir kurang dari 37 minggu)
  // Normalnya kehamilan 40 minggu. Selisih minggu dijadikan bulan (dibagi 4)
  if (isPremature && gestationalAge && gestationalAge < 37) {
    const missingWeeks = 40 - gestationalAge;
    const correctionMonths = Math.floor(missingWeeks / 4);
    months -= correctionMonths;
  }

  return Math.max(0, months);
}

export function getQuestionsForAge(ageInMonths: number): string[] {
  if (ageInMonths <= 12) {
    return [
      "Apakah anak menatap mata Anda saat diajak berbicara?",
      "Apakah anak tersenyum saat diajak bermain (misal: cilukba)?",
      "Apakah anak merespons ketika namanya dipanggil (menoleh)?",
      "Apakah anak mulai meraban/mengoceh (seperti 'ba-ba-ba' atau 'ma-ma-ma')?",
      "Apakah anak merespons suara keras atau sumber suara baru?"
    ];
  } else if (ageInMonths <= 24) {
    return [
      "Apakah anak sudah bisa memanggil 'Mama' atau 'Papa' dengan makna?",
      "Apakah anak menunjuk dengan jari telunjuk untuk meminta sesuatu atau menunjukkan sesuatu yang menarik?",
      "Apakah anak memiliki minimal 10-50 kosakata yang dapat diucapkan dengan jelas?",
      "Apakah anak dapat mengikuti 1 instruksi sederhana tanpa bantuan isyarat tangan (misal: 'Ambil bolanya')?",
      "Apakah anak mencoba menirukan kata-kata baru yang Anda ucapkan?"
    ];
  } else if (ageInMonths <= 36) {
    return [
      "Apakah anak sudah bisa merangkai 2 kata (misal: 'Mau minum', 'Mama pergi')?",
      "Apakah anak dapat menyebutkan nama benda-benda familiar di sekitarnya?",
      "Apakah anak dapat mengikuti 2 instruksi berurutan (misal: 'Ambil sepatu dan taruh di rak')?",
      "Apakah ucapan anak dapat dipahami oleh orang tuanya minimal 50% dari waktu?",
      "Apakah anak mulai menggunakan kata ganti (saya, kamu, dia) dengan benar?"
    ];
  } else {
    // Diatas 36 bulan (3 tahun ke atas)
    return [
      "Apakah anak sudah bisa merangkai kalimat yang terdiri dari 3-4 kata?",
      "Apakah anak dapat menceritakan kejadian sederhana yang dialaminya hari ini?",
      "Apakah ucapan anak sudah cukup jelas sehingga dapat dipahami oleh orang asing?",
      "Apakah anak sering bertanya menggunakan kata tanya 'Kenapa', 'Apa', atau 'Di mana'?",
      "Apakah anak dapat memahami instruksi yang lebih kompleks atau konsep preposisi (di atas, di bawah, di dalam)?"
    ];
  }
}

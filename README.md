# Web Architecture Challenge – Pertemuan 4

Aplikasi games pembelajaran berbasis **HTML, CSS, dan Vanilla JavaScript** untuk materi:
- Fundamental arsitektur web
- Maintainability pada Web Native skala besar
- MVC (Model, View, Controller)
- Server-Side Rendering (SSR) vs Single Page Application (SPA)

## Menjalankan secara lokal
1. Unduh atau clone repository.
2. Buka `index.html` di browser modern.
3. Masukkan nama pemain.
4. Pilih salah satu kartu mini-game pada beranda atau mulai Quick Quiz melalui tombol Mulai Misi.

Tidak membutuhkan Node.js, PHP, database, build tool, atau instalasi library.

## Mini-games
1. Quick Quiz – 10 soal pilihan ganda.
2. MVC Sorting – 9 tantangan klasifikasi.
3. SSR vs SPA Battle – 8 tantangan.
4. Find the Bug – 5 studi kasus maintainability.

Setiap jawaban bernilai 10 poin. Skor dan leaderboard disimpan pada `localStorage` browser yang digunakan. Data tidak tersinkronisasi antarpengguna/perangkat.

## Publikasi ke GitHub Pages
1. Login ke GitHub dan pilih **New repository**.
2. Beri nama, misalnya `web-architecture-challenge`.
3. Pilih Public (atau sesuaikan kebijakan sekolah).
4. Unggah isi folder ini ke root repository (pastikan `index.html` berada di root).
5. Buka **Settings → Pages**.
6. Pada **Build and deployment**, pilih **Deploy from a branch**.
7. Pilih branch `main` dan folder `/ (root)`, lalu klik **Save**.
8. Tunggu proses deployment. URL umumnya:
   `https://USERNAME.github.io/web-architecture-challenge/`

Jika repository bernama `USERNAME.github.io`, URL umumnya:
`https://USERNAME.github.io/`

## Struktur
```text
web-architecture-challenge/
├── index.html
├── README.md
├── LICENSE
├── .nojekyll
└── assets/
    ├── css/style.css
    ├── js/app.js
    ├── js/quiz.js
    ├── js/mvc-game.js
    ├── js/ssr-spa-game.js
    ├── js/maintainability-game.js
    └── images/favicon.svg
```

## Catatan teknis
- Font Google digunakan sebagai peningkatan tampilan; jika offline, browser memakai fallback sans-serif.
- Semua fungsi inti berjalan tanpa koneksi internet.
- Leaderboard bersifat lokal dan dapat dihapus melalui tombol "Hapus data".
- Aplikasi ini merupakan media belajar, bukan sistem penilaian resmi.

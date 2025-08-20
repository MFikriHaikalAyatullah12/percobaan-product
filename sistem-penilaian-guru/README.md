# sistem-penilaian-guru
# cd /workspaces/percobaan-product/sistem-penilaian-guru && npm run dev
## Deskripsi Proyek
Proyek ini adalah sistem penilaian untuk guru yang memungkinkan pengelolaan data siswa, nilai, dan laporan. Sistem ini terdiri dari frontend dan backend yang terintegrasi dengan database.

## Struktur Proyek
- **frontend/**: Berisi aplikasi frontend yang dibangun dengan React.
- **backend/**: Berisi aplikasi backend yang dibangun dengan Node.js dan Express.
- **database/**: Berisi skrip untuk migrasi dan pengisian data ke database.
- **docs/**: Berisi dokumentasi terkait API, database, dan proses deployment.
- **scripts/**: Berisi skrip untuk pengaturan dan pengelolaan lingkungan pengembangan.

## Instalasi
1. Clone repositori ini:
   ```
   git clone <URL_REPOSITORI>
   cd sistem-penilaian-guru
   ```

2. Jalankan skrip setup untuk mengatur lingkungan pengembangan:
   ```
   ./scripts/setup.sh
   ```

3. Untuk menjalankan aplikasi, gunakan:
   ```
   docker-compose up
   ```

## Penggunaan
- Akses aplikasi frontend di `http://localhost:3000`.
- Akses API backend di `http://localhost:5000/api`.

## Kontribusi
Silakan buka isu atau kirim permintaan tarik jika Anda ingin berkontribusi pada proyek ini.

## Lisensi
Proyek ini dilisensikan di bawah [MIT License](LICENSE).

# cd /workspaces/percobaan-product/sistem-penilaian-guru && chmod +x start-all.sh && ./start-all.sh
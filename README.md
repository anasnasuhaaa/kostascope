<div align="center">

# 🏠 AngkasaKost

### Kostascope-AngkasaKost: Platform Informasi Kost Sekitar IPB Dramaga

<p>
  <strong>Program Kerja Biro Riset dan Teknologi</strong><br/>
  Ormawa Eksekutif PKU IPB
</p>

<p>
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/Project-AngkasaKost-BE1E2D?style=for-the-badge" alt="Project" />
  <img src="https://img.shields.io/badge/Platform-Web_App-111827?style=for-the-badge" alt="Platform" />
</p>

<p>
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=nextdotjs" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=000" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=fff" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=fff" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=fff" alt="Prisma" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38BDF8?style=flat-square&logo=tailwindcss&logoColor=fff" alt="Tailwind CSS" />
</p>

</div>

---

## 📌 Tentang Project

**AngkasaKost** adalah platform informasi kost sekitar Kampus **IPB Dramaga** yang dikembangkan sebagai program kerja **Biro Riset dan Teknologi Ormawa Eksekutif PKU IPB**.

Project ini bertujuan membantu mahasiswa, khususnya mahasiswa baru IPB, dalam menemukan informasi kost secara lebih mudah, rapi, dan terarah.

Secara internal, project ini dikembangkan dengan nama **Kostascope**, sedangkan nama publik yang digunakan adalah **AngkasaKost**.

---

## 🎯 Tujuan Project

AngkasaKost hadir untuk membantu mahasiswa dalam proses pencarian hunian dengan menyediakan informasi kost yang:

* mudah diakses;
* tersusun berdasarkan wilayah;
* dilengkapi harga, fasilitas, foto, dan detail penting;
* memiliki jalur komunikasi langsung melalui WhatsApp;
* menyediakan bantuan pencarian melalui layanan **Kost Finder**.

---

## 🗺️ Wilayah Cakupan Kost

Data kost dikelompokkan berdasarkan wilayah sekitar IPB Dramaga.

| Wilayah          | Keterangan                       |
| ---------------- | -------------------------------- |
| **Bara**         | Area sekitar Bara dan sekitarnya |
| **Bateng**       | Area Babakan Tengah              |
| **Cibanteng**    | Area Cibanteng                   |
| **Perwira**      | Area Perwira                     |
| **Belakang IPB** | Area belakang Kampus IPB Dramaga |

---

## ✨ Fitur Utama

### 🏘️ 1. Katalog Kost Publik

Pengguna dapat melihat daftar kost yang telah dipublikasikan oleh admin.

Informasi yang ditampilkan meliputi:

* nama kost;
* wilayah kost;
* foto kost;
* harga sewa;
* tipe penghuni;
* fasilitas;
* jarak ke kampus;
* informasi biaya air;
* informasi listrik;
* link Google Maps;
* detail deskripsi kost.

---

### 🔎 2. Filter dan Pencarian Kost

Halaman daftar kost dilengkapi fitur pencarian dan filter untuk memudahkan pengguna menemukan kost sesuai kebutuhan.

Filter yang tersedia:

| Filter            | Deskripsi                                    |
| ----------------- | -------------------------------------------- |
| **Nama Kost**     | Mencari kost berdasarkan nama                |
| **Wilayah**       | Menampilkan kost berdasarkan region          |
| **Tipe Penghuni** | Putra, Putri, atau Campur                    |
| **Jenis Sewa**    | Bulanan, 3 bulan, 6 bulan, tahunan           |
| **Fasilitas**     | AC, WiFi, Kasur, Lemari, dan lainnya         |
| **Biaya Air**     | Termasuk atau tidak termasuk                 |
| **Listrik**       | Termasuk, token, atau terpisah               |
| **Urutan**        | Terbaru, harga termurah, atau jarak terdekat |

Pada desktop, filter ditampilkan sebagai sidebar. Pada mobile, filter dibuat lebih ringkas agar nyaman digunakan di layar kecil.

---

### 🏠 3. Halaman Detail Kost

Setiap kost memiliki halaman detail yang memuat informasi lebih lengkap.

Detail yang ditampilkan:

* galeri foto kost;
* deskripsi kost;
* daftar harga sewa;
* informasi kamar;
* wilayah;
* jarak ke kampus;
* biaya air;
* sistem listrik;
* fasilitas;
* tombol WhatsApp;
* tombol Google Maps.

---

### 💬 4. Sistem Kontak WhatsApp

Ketika pengguna menekan tombol **Hubungi via WhatsApp**, sistem akan menampilkan dua pilihan:

| Opsi                            | Fungsi                                                                     |
| ------------------------------- | -------------------------------------------------------------------------- |
| **Hubungi Pemilik Kost**        | Pengguna diarahkan langsung ke nomor WhatsApp pemilik atau narahubung kost |
| **Gunakan Layanan Kost Finder** | Pengguna dibantu oleh Public Relation wilayah untuk mencari informasi kost |

---

### 👑 5. Layanan Kost Finder

**Kost Finder** adalah fitur bantuan pencarian kost melalui tim Public Relation wilayah.

Pengguna akan diminta mengisi:

* nama;
* program studi;
* angkatan.

Data tersebut hanya digunakan untuk menyusun pesan pembuka WhatsApp kepada Public Relation dan tidak disimpan ke database.

Contoh alur:

```text
User membuka detail kost
→ klik Hubungi via WhatsApp
→ pilih Gunakan Layanan Kost Finder
→ isi nama, program studi, dan angkatan
→ sistem memilih Public Relation aktif
→ WhatsApp terbuka ke nomor Public Relation wilayah
```

---

### 👥 6. Public Relation Wilayah

Setiap wilayah dapat memiliki satu atau beberapa Public Relation.

Fitur pengelolaan Public Relation:

* tambah Public Relation;
* edit Public Relation;
* aktifkan atau nonaktifkan Public Relation;
* hapus Public Relation;
* assignment count;
* last assigned tracking.

Sistem memilih Public Relation aktif dengan jumlah assignment paling sedikit agar pembagian pengguna lebih merata.

Jika terdapat beberapa PR dengan jumlah assignment yang sama, sistem akan memilih salah satunya secara acak.

---

### ⏰ 7. Jam Layanan WhatsApp

Admin dapat mengatur jadwal layanan WhatsApp melalui dashboard.

Pengaturan yang tersedia:

* status layanan aktif atau nonaktif;
* hari layanan;
* jam mulai layanan;
* jam selesai layanan;
* reset jadwal ke pengaturan awal.

Jika pengguna mengakses tombol WhatsApp di luar jam layanan, sistem akan menampilkan dialog bahwa layanan belum tersedia.

---

### 🧑‍💻 8. Admin Dashboard

Admin memiliki akses untuk mengelola seluruh data utama website.

Fitur admin:

* login admin;
* kelola data kost;
* kelola wilayah;
* kelola fasilitas;
* kelola foto kost;
* kelola Public Relation wilayah;
* kelola jam layanan WhatsApp;
* status publikasi kost;
* toaster notifikasi create, update, dan delete;
* tampilan dashboard responsif.

---

### 🖼️ 9. Upload Foto Kost

Admin dapat mengunggah beberapa foto untuk setiap kost.

Ketentuan upload:

| Ketentuan                | Nilai                  |
| ------------------------ | ---------------------- |
| Format                   | JPG, JPEG, PNG, WebP   |
| Maksimal per file        | 4MB                    |
| Maksimal file per upload | 5 file                 |
| Maksimal total upload    | 20MB                   |
| Penyimpanan              | Local storage pada VPS |
| Metadata                 | Disimpan ke database   |

---

### 💰 10. Multi Harga Sewa

Setiap kost dapat memiliki lebih dari satu jenis harga sewa.

Jenis harga yang didukung:

| Tipe           | Label   |
| -------------- | ------- |
| `MONTHLY`      | 1 Bulan |
| `THREE_MONTHS` | 3 Bulan |
| `SIX_MONTHS`   | 6 Bulan |
| `YEARLY`       | 1 Tahun |

---

## 🧱 Tech Stack

<div align="center">

### Frontend

<p>
  <img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind" alt="Frontend Stack" />
</p>

### Backend & Database

<p>
  <img src="https://skillicons.dev/icons?i=nodejs,postgres,prisma" alt="Backend Stack" />
</p>

### Infrastructure

<p>
  <img src="https://skillicons.dev/icons?i=nginx,cloudflare,linux" alt="Infrastructure Stack" />
</p>

</div>

---

## 🛠️ Detail Teknologi

| Kategori           | Teknologi               |
| ------------------ | ----------------------- |
| Framework          | Next.js App Router      |
| UI Library         | React                   |
| Bahasa             | TypeScript              |
| Styling            | Tailwind CSS            |
| UI Component       | shadcn/ui               |
| Icon               | Lucide React            |
| Toast Notification | Sonner                  |
| Authentication     | NextAuth                |
| ORM                | Prisma                  |
| Database           | PostgreSQL              |
| Deployment         | VPS Linux               |
| Process Manager    | PM2                     |
| Reverse Proxy      | Nginx                   |
| SSL                | Certbot / Let's Encrypt |
| DNS                | Cloudflare              |

---

## 🏗️ Infrastruktur Website

AngkasaKost dibangun dan dijalankan menggunakan infrastruktur VPS.

```text
User
  ↓
Cloudflare DNS
  ↓
Nginx Reverse Proxy
  ↓
Next.js Application
  ↓
PostgreSQL Database
```

Komponen infrastruktur:

| Komponen       | Fungsi                             |
| -------------- | ---------------------------------- |
| **Cloudflare** | Mengelola DNS subdomain            |
| **Nginx**      | Reverse proxy ke aplikasi Next.js  |
| **Certbot**    | Mengaktifkan SSL HTTPS             |
| **PM2**        | Menjalankan aplikasi di background |
| **PostgreSQL** | Database utama                     |
| **VPS Linux**  | Server utama aplikasi              |

Domain publik:

```text
angkasakost.ormawaeksekutifpku.com
```

---

## 🗃️ Struktur Data Utama

### User

Menyimpan data admin yang dapat mengakses dashboard.

| Field          | Fungsi               |
| -------------- | -------------------- |
| `email`        | Email admin          |
| `name`         | Nama admin           |
| `passwordHash` | Password terenkripsi |
| `role`         | Role admin           |
| `createdAt`    | Waktu dibuat         |
| `updatedAt`    | Waktu diperbarui     |

---

### Region

Menyimpan data wilayah kost.

| Field             | Fungsi                            |
| ----------------- | --------------------------------- |
| `name`            | Nama wilayah                      |
| `slug`            | Slug wilayah                      |
| `kosts`           | Relasi ke data kost               |
| `publicRelations` | Relasi ke Public Relation wilayah |

---

### RegionPublicRelation

Menyimpan data Public Relation untuk setiap wilayah.

| Field             | Fungsi               |
| ----------------- | -------------------- |
| `name`            | Nama Public Relation |
| `whatsapp`        | Nomor WhatsApp       |
| `isActive`        | Status aktif         |
| `assignmentCount` | Jumlah assignment    |
| `lastAssignedAt`  | Assignment terakhir  |
| `regionId`        | Relasi ke wilayah    |

---

### Kost

Menyimpan data utama kost.

| Field                      | Fungsi                          |
| -------------------------- | ------------------------------- |
| `name`                     | Nama kost                       |
| `slug`                     | Slug URL                        |
| `description`              | Deskripsi kost                  |
| `contactWhatsapp`          | Kontak pemilik atau narahubung  |
| `roomSize`                 | Ukuran kamar                    |
| `distanceToCampusInMeters` | Jarak ke kampus                 |
| `googleMapsUrl`            | Link Google Maps                |
| `genderType`               | Tipe penghuni                   |
| `waterFeeType`             | Biaya air                       |
| `electricityType`          | Sistem listrik                  |
| `status`                   | Draft, published, atau archived |
| `isFeatured`               | Status rekomendasi              |
| `regionId`                 | Relasi wilayah                  |

---

### KostPrice

Menyimpan harga sewa berdasarkan jenis sewa.

| Field    | Fungsi         |
| -------- | -------------- |
| `type`   | Jenis harga    |
| `price`  | Nominal harga  |
| `kostId` | Relasi ke kost |

---

### KostImage

Menyimpan data gambar kost.

| Field       | Fungsi          |
| ----------- | --------------- |
| `url`       | URL gambar      |
| `altText`   | Teks alternatif |
| `sortOrder` | Urutan gambar   |
| `kostId`    | Relasi ke kost  |

---

### Facility

Menyimpan daftar fasilitas.

| Field  | Fungsi         |
| ------ | -------------- |
| `name` | Nama fasilitas |
| `slug` | Slug fasilitas |

---

### ContactServiceSetting

Menyimpan pengaturan global layanan WhatsApp.

| Field      | Fungsi             |
| ---------- | ------------------ |
| `isActive` | Status layanan     |
| `timezone` | Zona waktu layanan |

---

### ContactServiceSchedule

Menyimpan jadwal layanan WhatsApp per hari.

| Field         | Fungsi                  |
| ------------- | ----------------------- |
| `day`         | Hari layanan            |
| `isActive`    | Status hari aktif       |
| `startMinute` | Jam mulai dalam menit   |
| `endMinute`   | Jam selesai dalam menit |

---

## 🔐 Role Admin

Role yang tersedia:

| Role          | Deskripsi                                                 |
| ------------- | --------------------------------------------------------- |
| `ADMIN`       | Mengelola data utama website                              |
| `SUPER_ADMIN` | Akses tertinggi untuk kebutuhan pengembangan lebih lanjut |

---

## 📲 Alur Komunikasi Pengguna

### Kontak Langsung

```text
User membuka detail kost
→ Klik Hubungi via WhatsApp
→ Pilih Hubungi Pemilik Kost
→ Sistem mengecek jam layanan
→ WhatsApp terbuka ke nomor pemilik kost
```

### Kost Finder

```text
User membuka detail kost
→ Klik Hubungi via WhatsApp
→ Pilih Gunakan Layanan Kost Finder
→ Isi nama, program studi, dan angkatan
→ Sistem memilih Public Relation aktif
→ WhatsApp terbuka ke nomor PR wilayah
```

---

## 📁 Struktur Folder Singkat

```text
kostascope/
├── app/
│   ├── admin/
│   ├── api/
│   ├── kost/
│   └── generated/
├── components/
│   └── ui/
├── features/
│   ├── contact-service/
│   ├── kost/
│   ├── region/
│   └── region-public-relation/
├── lib/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── public/
├── README.md
└── package.json
```

---

## ⚙️ Environment Variables

Buat file `.env` di root project.

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/kostascope"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

Sesuaikan nilai environment dengan konfigurasi lokal atau server.

---

## 🚀 Menjalankan Project Secara Lokal

### 1. Clone Repository

```bash
git clone https://github.com/username/kostascope.git
cd kostascope
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

### 4. Jalankan Migration

```bash
npx prisma migrate dev
```

### 5. Jalankan Development Server

```bash
npm run dev
```

Aplikasi dapat dibuka melalui:

```text
http://localhost:3000
```

---

## 📦 Perintah Penting

### Prisma

```bash
npx prisma generate
```

```bash
npx prisma migrate dev
```

```bash
npx prisma migrate deploy
```

```bash
npx prisma studio
```

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
```

```bash
npm run start
```

### PM2

```bash
pm2 start npm --name kostascope -- start
```

```bash
pm2 restart kostascope --update-env
```

```bash
pm2 logs kostascope
```

---

## 🌐 Deployment Singkat ke VPS

Contoh alur deployment:

```bash
cd /var/www/kostascope
git pull origin main
npm install
npx prisma migrate deploy
npx prisma generate
npm run build
pm2 restart kostascope --update-env
```

Pastikan Nginx sudah diarahkan ke aplikasi Next.js.

Contoh alur reverse proxy:

```nginx
server {
    listen 80;
    server_name angkasakost.ormawaeksekutifpku.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Aktifkan SSL menggunakan Certbot:

```bash
sudo certbot --nginx -d angkasakost.ormawaeksekutifpku.com
```

---

## 🧪 Checklist Pengujian

Sebelum deployment, pastikan:

* [ ] Admin dapat login
* [ ] Data wilayah dapat dibuat dan diedit
* [ ] Data fasilitas dapat dibuat dan diedit
* [ ] Data kost dapat dibuat, diedit, dan dipublikasikan
* [ ] Foto kost dapat diunggah
* [ ] Filter kost berjalan di desktop dan mobile
* [ ] Halaman detail kost tampil responsif
* [ ] Tombol WhatsApp berjalan
* [ ] Kontak langsung mengarah ke pemilik kost
* [ ] Kost Finder mengarah ke Public Relation
* [ ] Jam layanan aktif sesuai pengaturan admin
* [ ] Dialog luar jam layanan muncul dengan benar
* [ ] Website berjalan melalui HTTPS

---

## 🧭 Roadmap Pengembangan

Beberapa fitur yang dapat dikembangkan selanjutnya:

* [ ] Statistik penggunaan Kost Finder
* [ ] Dashboard insight jumlah klik WhatsApp
* [ ] Riwayat assignment Public Relation
* [ ] Pengaturan jam layanan per wilayah
* [ ] Verifikasi data kost
* [ ] Fitur rekomendasi kost otomatis
* [ ] Integrasi analytics
* [ ] Sitemap dinamis
* [ ] Optimasi performa gambar
* [ ] Sistem review atau rating kost

---

## 📝 Catatan Pengembangan

Beberapa prinsip penting dalam project ini:

* Nomor pemilik kost tetap disimpan pada data kost untuk kontak langsung.
* Public Relation wilayah digunakan untuk layanan Kost Finder.
* Jam layanan WhatsApp berlaku secara global.
* Data pengguna pada form Kost Finder hanya digunakan untuk menyusun pesan WhatsApp.
* Upload gambar disimpan secara lokal pada VPS.
* Halaman publik harus responsif karena banyak pengguna mengakses melalui perangkat mobile.
* Admin dashboard dibuat untuk memudahkan pengelolaan data oleh tim internal.

---

## 👨‍💻 Pengembang

Project ini dikembangkan oleh:

```text
Biro Riset dan Teknologi
Ormawa Eksekutif PKU IPB
```

---

## 📄 Lisensi

Project ini dikembangkan untuk kebutuhan program kerja internal **Ormawa Eksekutif PKU IPB**.

Penggunaan, pengembangan, dan distribusi mengikuti kebijakan internal organisasi.

---

<div align="center">

### AngkasaKost

**Temukan kost lebih mudah, mulai dari satu klik.**

</div>

import { createClient } from "@libsql/client";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const db = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

// Inisialisasi Tabel
const initDb = async () => {
    const queryUser = `CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            fullname TEXT NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'admin',
            aktif BOOLEAN DEFAULT 1
        )`;
    await db.execute(queryUser);

    const salt = bcrypt.genSaltSync(10);
    const pass = bcrypt.hashSync("awikfuad", salt);
    const idAdmin = uuidv4();
    await db.execute({
        sql: `INSERT OR IGNORE INTO users (id, username, fullname, password) VALUES (?, ?, ?, ?)`, 
        args: [idAdmin, 'admin', 'administrator', pass]
    });

    const pjgtQuery = `CREATE TABLE IF NOT EXISTS pjgt (
            id TEXT PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'pjgt',
            aktif BOOLEAN DEFAULT 1,
            nama_pjgt TEXT NOT NULL,
            nik_pjgt TEXT NOT NULL  UNIQUE,
            hp_pjgt TEXT NOT NULL,
            nama_km TEXT NOT NULL,
            hp_km TEXT,
            alamat_madrasah TEXT NOT NULL,
            aktif BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`;
    await db.execute(pjgtQuery);

    const gtQuery = `CREATE TABLE IF NOT EXISTS gt (
            id TEXT PRIMARY KEY,
            nim TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'gt',
            nama TEXT NOT NULL,
            nik TEXT NOT NULL,
            tempat_lahir TEXT NOT NULL,
            tanggal_lahir DATE NOT NULL,
            alamat TEXT NOT NULL,
            hp TEXT NOT NULL,
            nama_ayah TEXT NOT NULL,
            nama_ibu TEXT NOT NULL,
            nama_wali TEXT NOT NULL,
            hp_wali TEXT NOT NULL,
            asal_kelas TEXT NOT NULL,
            wali_kelas TEXT NOT NULL,
            aktif BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`;
    await db.execute(gtQuery);

    const tahunQuery = `CREATE TABLE IF NOT EXISTS tahun_ajaran (
            id TEXT PRIMARY KEY,
            tahun_ajaran INTEGER NOT NULL,
            aktif BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            cretate_by TEXT NOT NULL,
        )`;
    await db.execute(tahunQuery);

    const tugasQuery = `CREATE TABLE IF NOT EXISTS tugas (
            id TEXT PRIMARY KEY,
            id_tahun_ajaran,
            id_pjgt TEXT NOT NULL,
            id_gt TEXT NOT NULL,
            jenis_penugasan TEXT CHECK(jenis_penugasan IN ('wajib', 'tatowu')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            created_by TEXT NOT NULL,
            updated_by TEXT NOT NULL,
            aktif BOOLEAN DEFAULT 1,
            FOREIGN KEY (id_tahun_ajaran) REFERENCES tahun_ajaran (id),
            FOREIGN KEY (id_pjgt) REFERENCES pjgt (id),
            FOREIGN KEY (id_gt) REFERENCES gt (id)
        )`;
    await db.execute(tugasQuery);

    const laporanPjgtQuery = `CREATE TABLE IF NOT EXISTS laporan_pjgt (
            id TEXT PRIMARY KEY,
            id_tugas INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (id_gt) REFERENCES gt (id)
        )`;
        /*
        Laporan Bulan Ke:
Status Kelas: Ada
Menjadi Guru Wali Kelas:
Menjadi Guru Fak Kelas:
Jenis Kelamin Murid:
GT Disiplin di Madrasah: Tidak Disiplin
Kegiatan GT:
Keadaan Rambut GT Saat Ini: Pendek
Surat Izin GT digunakan: Lembar
GT Pergi: ---
GT Pulang: ---
Pelanggaran GT:-
Tindakan Pelanggaran:-
Hubungan dengan PJGT:
Hubungan Dengan Kepala Madrasah:
Hubungan dengan Guru:
Hubungan dengan Murid di Dalam Kelas :
Hubungan dengan Murid di Luar Kelas :
Tanggapan Umum Murid Terhadap GT :
Bisyaroh: Rp 0 | Rp 0 | Rp 0Usulan-usulan dan lain-lain
        */
    await db.execute(laporanPjgtQuery);

    const laporanGtQuery = `CREATE TABLE IF NOT EXISTS laporan_gt (
            id TEXT PRIMARY KEY,
            id_tugas INTEGER NOT NULL,
            bulan INTEGER NOT NULL,
            id_gt TEXT NOT NULL,
            jenis_penugasan TEXT CHECK(jenis_penugasan IN ('wajib', 'tatowu')),
            aktif BOOLEAN DEFAULT 1
        )`;
    await db.execute(laporanGtQuery);
};

initDb();


export default db;
import { createClient } from "@libsql/client";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const db = createClient({
    // url: process.env.TURSO_DATABASE_URL,
    // authToken: process.env.TURSO_AUTH_TOKEN,
    url: "file: gtmmu.db"
});

// Inisialisasi Tabel
const initDb = async () => {
    const queryUser = `CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            nama TEXT NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'admin',
            aktif BOOLEAN DEFAULT 1
        )`;
    await db.execute(queryUser);

    const salt = bcrypt.genSaltSync(10);
    const pass = bcrypt.hashSync("awikfuad", salt);
    const idAdmin = uuidv4();
    await db.execute({
        sql: `INSERT OR IGNORE INTO users (id, username, nama, password) VALUES (?, ?, ?, ?)`,
        args: [idAdmin, 'admin', 'admin', pass]
    });

    const pjgtQuery = `CREATE TABLE IF NOT EXISTS pjgt (
            id TEXT PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'pjgt',
            nama TEXT NOT NULL,
            nik_pjgt TEXT NOT NULL UNIQUE,
            hp_pjgt TEXT NOT NULL,
            nama_km TEXT NOT NULL,
            hp_km TEXT,
            nama_madrasah TEXT NOT NULL,
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
            keterangan TEXT NOT NULL UNIQUE,
            aktif BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`;
    await db.execute(tahunQuery);

    const tugasQuery = `CREATE TABLE IF NOT EXISTS tugas (
            id TEXT PRIMARY KEY,
            id_tahun_ajaran TEXT NOT NULL,
            id_pjgt TEXT NOT NULL,
            id_gt TEXT NOT NULL,
            jenis_penugasan TEXT CHECK(jenis_penugasan IN('wajib', 'tatowuk')),
            aktif BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (id_tahun_ajaran) REFERENCES tahun_ajaran (id),
            FOREIGN KEY (id_pjgt) REFERENCES pjgt (id),
            FOREIGN KEY (id_gt) REFERENCES gt (id)
        )`;
    await db.execute(tugasQuery);

    const laporanPjgtQuery = `CREATE TABLE IF NOT EXISTS laporan_pjgt (
            id TEXT PRIMARY KEY,
            id_pjgt TEXT NOT NULL,
            id_tugas TEXT NOT NULL,
            status_kelas BOOLEAN DEFAULT false,
            wali_kelas TEXT NOT NULL,
            guru_fak TEXT NOT NULL,
            jenis_kelamin_murid TEXT NOT NULL,
            kedisiplinan_gt BOOLEAN DEFAULT true,
            keigatan_gt TEXT,
            rambut_gt TEXT,
            surat_izin_digunakan INTEGER DEFAULT 0,
            pergi_gt TEXT,
            pulang_gt TEXT,
            pelanggaran_gt TEXT,
            hubungan_pjgt TEXT,
            hubungan_km TEXT,
            hubungan_guru TEXT,
            hubungan_murid_kelas TEXT,
            hungan_murid_luar_kelas TEXT,
            tanggapan_murid TEXT,
            bisyaroh TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (id_tugas) REFERENCES tugas (id),
            FOREIGN KEY (id_pjgt) REFERENCES pjgt (id)
        )`;
    await db.execute(laporanPjgtQuery);

    const laporanGtQuery = `CREATE TABLE IF NOT EXISTS laporan_gt (
            id TEXT PRIMARY KEY,
            id_gt TEXT NOT NULL,
            id_tugas TEXT NOT NULL,
            bulan_ke INTEGER NOT NULL,
            status_kelas BOOLEAN DEFAULT false,
            wali_kelas TEXT NOT NULL,
            guru_fak TEXT NOT NULL,
            jenis_kelamin_murid TEXT NOT NULL,
            kedisiplinan_gt BOOLEAN DEFAULT true,
            keigatan_gt TEXT,
            rambut_gt TEXT,
            surat_izin_digunakan INTEGER DEFAULT 0,
            pergi_gt TEXT,
            pulang_gt TEXT,
            pelanggaran_gt TEXT,
            hubungan_pjgt TEXT,
            hubungan_km TEXT,
            hubungan_guru TEXT,
            hubungan_murid_kelas TEXT,
            hungan_murid_luar_kelas TEXT,
            tanggapan_murid TEXT,
            bisyaroh TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (id_tugas) REFERENCES tugas (id),
            FOREIGN KEY (id_gt) REFERENCES gt (id)
        )`;
    await db.execute(laporanGtQuery);
};

initDb();


export default db;
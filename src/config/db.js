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
            id_tahun_ajaran TEXT NOT NULL,
            nama TEXT NOT NULL,
            nik_pjgt TEXT NOT NULL UNIQUE,
            hp_pjgt TEXT NOT NULL,
            nama_km TEXT NOT NULL,
            hp_km TEXT,
            nama_madrasah TEXT NOT NULL,
            alamat_madrasah TEXT NOT NULL,
            aktif BOOLEAN DEFAULT 1,            
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (id_tahun_ajaran) REFERENCES tahun_ajaran (id)
            )`;
    await db.execute(pjgtQuery);

    const gtQuery = `CREATE TABLE IF NOT EXISTS gt (
            id TEXT PRIMARY KEY,
            nim TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'gt',
            id_tahun_ajaran TEXT NOT NULL,
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
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
             FOREIGN KEY (id_tahun_ajaran) REFERENCES tahun_ajaran (id)
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
            jenis_penugasan TEXT CHECK(jenis_penugasan IN('wajib', 'sunaah')),
            aktif BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,   
            FOREIGN KEY (id_tahun_ajaran) REFERENCES tahun_ajaran (id),         
            FOREIGN KEY (id_pjgt) REFERENCES pjgt (id),
            FOREIGN KEY (id_gt) REFERENCES gt (id)
        )`;
    await db.execute(tugasQuery);
//////
    const statusPJGTQuery = `CREATE TABLE IF NOT EXISTS statusPJGT (
            id TEXT PRIMARY KEY,
            id_tahun_ajaran TEXT NOT NULL,
            id_pjgt TEXT NOT NULL,            
            aktif BOOLEAN DEFAULT 1,
            alasan TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,   
            FOREIGN KEY (id_tahun_ajaran) REFERENCES tahun_ajaran (id),         
            FOREIGN KEY (id_pjgt) REFERENCES pjgt (id)
            
        )`;
    await db.execute(statusPJGTQuery);

    const laporanPjgtQuery = `CREATE TABLE IF NOT EXISTS laporan_pjgt (
            id TEXT PRIMARY KEY,
            id_pjgt TEXT NOT NULL,
            id_tugas TEXT NOT NULL,
            bulan_ke INTEGER NOT NULL,
            id_tahun_ajaran TEXT NOT NULL,
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
            FOREIGN KEY (id_tahun_ajaran) REFERENCES tahun_ajaran (id),   
            FOREIGN KEY (id_tugas) REFERENCES tugas (id),
            FOREIGN KEY (id_pjgt) REFERENCES pjgt (id)
        )`;
    await db.execute(laporanPjgtQuery);

    // const laporanGtQuery = `CREATE TABLE IF NOT EXISTS laporan_gt (
    //         id TEXT PRIMARY KEY,
    //         id_gt TEXT NOT NULL,
    //         id_tugas TEXT NOT NULL,
    //         id_tahun_ajaran TEXT NOT NULL,
    //         bulan_ke INTEGER NOT NULL,
    //         tahun TEXT NOT NULL,            
    //         status_kelas BOOLEAN DEFAULT false,
    //         wali_kelas TEXT ,
    //         guru_fak TEXT ,
    //         jenis_kelamin_murid TEXT NOT NULL,
    //         menangani_administrasi BOOLEAN DEFAULT false,
    //         administrasi TEXT,            
    //         kegiatan_gt TEXT,            
    //         izin_gt TEXT,
    //         pergi_gt TEXT,
    //         pulang_gt TEXT,
    //         hubungan_pjgt
    //         alasan_pjgt TEXT,
    //         hubungan_km TEXT,
    //         alasan_kepala TEXT,
    //         hubungan_guru TEXT,
    //         alasan_guru TEXT,
    //         masalah_penyelesaian TEXT,
    //         tugas_mendatang TEXT,
    //         tugas_belum_selesai TEXT,
    //         usulan_lain_lain TEXT,            
    //         bisyaroh TEXT NOT NULL,
    //         created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    //         FOREIGN KEY (id_tahun_ajaran) REFERENCES tahun_ajaran (id),  
    //         FOREIGN KEY (id_tugas) REFERENCES tugas (id),
    //         FOREIGN KEY (id_gt) REFERENCES gt (id)
    //     )`;
    // await db.execute(laporanGtQuery);
 const laporanGtQuery = `CREATE TABLE IF NOT EXISTS laporan_gt (
   
    id TEXT PRIMARY KEY,
    id_gt TEXT NOT NULL,           -- Relasi ke Guru Tugas
    id_tugas TEXT NOT NULL,        -- Relasi ke Tugas/Wilayah
    id_tahun_ajaran TEXT NOT NULL, -- Relasi ke Tahun Ajaran
    
    -- Info Waktu
    bulan_ke INTEGER NOT NULL,
    tahun TEXT,                    -- Key 'tahun' dari Flutter
    
    -- Status & Administrasi
    status_kelas INTEGER DEFAULT 0, -- Boolean (0/1)
    menangani_administrasi INTEGER DEFAULT 0,
    administrasi TEXT,             -- JSON String
    administrasi_lainnya TEXT,             -- JSON String
    wali_kelas TEXT,                -- JSON String
    guru_fak TEXT,                  -- JSON String
    
    -- Kegiatan
    menangani_kegiatan INTEGER DEFAULT 0,
    kegiatan_gt TEXT,              -- JSON String
    kegiatan_lainnya TEXT,              -- JSON String
    
    -- Murid
    jenis_kelamin_murid TEXT,
    
    -- Absensi/Hari
    sakit_hari TEXT,
    izin_hari TEXT,
    pulang_hari TEXT,
    jam_wajib TEXT,
    
    -- Hubungan & Alasan
    hubungan_pjgt TEXT,
    alasan_pjgt TEXT,
    hubungan_km TEXT,
    alasan_kepala TEXT,
    hubungan_guru TEXT,
    alasan_guru TEXT,
    hubungan_murid TEXT,
    alasan_murid TEXT,
    
    -- Lain-lain
    bisyaroh TEXT,
    masalah_penyelesaian TEXT,
    tugas_mendatang TEXT,
    tugas_belum_selesai TEXT,
    usulan_lain_lain TEXT,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Keys
    FOREIGN KEY (id_gt) REFERENCES gt (id),
    FOREIGN KEY (id_tugas) REFERENCES tugas (id),
    FOREIGN KEY (id_tahun_ajaran) REFERENCES tahun_ajaran (id)
)`;
  await db.execute(laporanGtQuery);


    const activity_logs =  `CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- Menggunakan Auto Increment jika bukan UUID manual
    user_id TEXT NOT NULL,                -- ID pengguna (FK)
    role TEXT NOT NULL,                   -- Admin/GT/PJGT
    action TEXT NOT NULL,                 -- LOGIN, LOGOUT, CREATE, dll
    module TEXT NOT NULL,                 -- PENUGASAN, AUTH, dll
    target_id TEXT,                       -- ID objek yang dimanipulasi (opsional)
    metadata TEXT,                        -- String JSON detail perubahan
    ip_address TEXT,                      -- Alamat IP
    user_agent TEXT,                      -- Info perangkat/browser
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP -- Waktu kejadian otomatis
);
 

-- Indexing untuk mempercepat pencarian log di masa depan
CREATE INDEX idx_user_id ON activity_logs (user_id);
CREATE INDEX idx_action ON activity_logs (action);
CREATE INDEX idx_created_at ON activity_logs (created_at);
        )`;
    await db.execute(activity_logs);
};

initDb();


export default db;
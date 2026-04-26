import db from "./db.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

const seed = async () => {
    try {
        console.log("--- Memulai Seeding Data ---");

        // 1. Hash Password (Gunakan password yang sama untuk semua testing agar mudah)
        const salt = bcrypt.genSaltSync(10);
        const defaultPass = bcrypt.hashSync("awikfuad123", salt);

        // 2. Seed Tahun Ajaran
        const idTahun = uuidv4();
        await db.execute({
            sql: `INSERT OR IGNORE INTO tahun_ajaran (id, keterangan, aktif) VALUES (?, ?, ?)`,
            args: [idTahun, "2023/2024 Ganjil", 1]
        });
        console.log("✅ Tahun Ajaran seeded");

        // 3. Seed PJGT (Penanggung Jawab GT)
        const idPjgt = uuidv4();
        await db.execute({
            sql: `INSERT OR IGNORE INTO pjgt (id, username, password, nama, nama_madrasah, hp_pjgt, nama_km, alamat_madrasah) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                idPjgt, 
                "14471001", 
                defaultPass, 
                "H. Ahmad Afandi", 
                "mmu-alhidayah", 
                "08123456789", 
                "Kyai Khoiron", 
                "Jl. Pesantren No. 10, Pasuruan"
            ]
        });
        console.log("✅ PJGT seeded");

        // 4. Seed GT (Guru Tugas)
        const idGt = uuidv4();
        await db.execute({
            sql: `INSERT OR IGNORE INTO gt (id, nim, password, nama, nik, tempat_lahir, tanggal_lahir, alamat, hp, nama_ayah, nama_ibu, nama_wali, hp_wali, asal_kelas, wali_kelas) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                idGt,
                "1447001",
                defaultPass,
                "Zaidan Al-Fatih",
                "350987654321",
                "Surabaya",
                "2002-05-20",
                "Asrama Sunan Ampel",
                "085777888999",
                "Abdullah",
                "Siti Aminah",
                "Abdullah",
                "085777888999",
                "3 Aliyah",
                "Ust. Mansur"
            ]
        });
        console.log("✅ Guru Tugas (GT) seeded");

        // 5. Seed Penugasan (Tugas)
        // const idTugas = uuidv4();
        // await db.execute({
        //     sql: `INSERT OR IGNORE INTO tugas (id, id_tahun_ajaran, id_pjgt, id_gt, jenis_penugasan) 
        //           VALUES (?, ?, ?, ?, ?)`,
        //     args: [idTugas, idTahun, idPjgt, idGt, "wajib"]
        // });
        // console.log("✅ Penugasan seeded");

        console.log("--- Seeding Selesai Berhasil ---");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding Gagal:", error);
        process.exit(1);
    }
};

seed();
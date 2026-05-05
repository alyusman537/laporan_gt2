import db from "./db.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

const seed = async () => {
    try {
        console.log("--- Memulai Seeding Data ---");

        // 1. Hash Password (Gunakan password yang sama untuk semua testing agar mudah)
        const salt = bcrypt.genSaltSync(10);
        const defaultPass = bcrypt.hashSync("1234", salt);

        // 2. Seed Tahun Ajaran
        const idTahun = uuidv4();
        // await db.execute({
        //     sql: `INSERT OR IGNORE INTO tahun_ajaran (id, keterangan, aktif) VALUES (?, ?, ?)`,
        //     args: [idTahun, "1446-1447", 1]
        // });
        // console.log("✅ Tahun Ajaran seeded");//

        // 3. Seed PJGT (Penanggung Jawab GT)
        // const idPjgt = uuidv4();
        // await db.execute({
        //     sql: `INSERT OR IGNORE INTO pjgt (id, username, password,id_tahun_ajaran, nama, nik_pjgt, nama_madrasah, hp_pjgt, nama_km, alamat_madrasah) 
        //           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        //     args: [
        //         idPjgt,
        //         "14471002",
        //         defaultPass,
        //         idTahun,
        //         "H. Ahmad Fauzi",
        //         "350123456789",
        //         "MTS Al-Falah",
        //         "08123456789",
        //         "Kyai Khoiron",
        //         "Jl. Pesantren No. 10, Malamg"
        //     ]
        // });
        // console.log("✅ PJGT seeded");

        // 4. Seed GT (Guru Tugas)
        const idGt = uuidv4();
        await db.execute({
            sql: `INSERT OR IGNORE INTO gt (id, nim, password,id_tahun_ajaran, nama, nik, tempat_lahir, tanggal_lahir, alamat, hp, nama_ayah, nama_ibu, nama_wali, hp_wali, asal_kelas, wali_kelas) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?)`,
            args: [
                "761b8f13-c3ca-46ac-9ec0-ff332ef843a3",
                "1447003",
                defaultPass,
                "7ff6f544-3ec2-4999-abad-63c97212392c",               
                "Imam Syuhadak",
                "350987654001",
                "Surabaya",
                "2002-05-20",
                "Warungdowo",
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
        

        // // 5. Seed Penugasan (Tugas)
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
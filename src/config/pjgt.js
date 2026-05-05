import db from "./db.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

async function seedPjgt() {
  const hashedPassword = await bcrypt.hash('1234', 10);
 const idPjgt = uuidv4();
  const dataSeed = [
    {
      id: idPjgt,
      username: '1447006',
      password: hashedPassword,
      id_tahun_ajaran: '1447-1448',
      nik_pjgt: '3510123456789',
      nama: 'H. Ahmad Syauqi',
      nama_madrasah: 'MTS Al-Falah',
      hp_pjgt: '081234567890',
      nama_km: 'Drs. Mukhlis',
      alamat_madrasah: 'Jl. Raya Kediri No. 10'
    },
    // {
    //   id: uuidv4(10),
    //   username: '1447004',
    //   password: hashedPassword,
    //   nama: 'Ustadz Mansur',
    //   nama_madrasah: 'MA Darul Ulum',
    //   hp_pjgt: '085777888999',
    //   nama_km: 'Hj. Siti Aminah',
    //   alamat_madrasah: 'Kec. Baron, Nganjuk'
    // }
  ];

  const stmt = db.execute(`
    INSERT INTO pjgt (id, username, password,id_tahun_ajaran, nik_pjgt, nama, nama_madrasah, hp_pjgt, nama_km, alamat_madrasah) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  dataSeed.forEach((item) => {
    stmt.run([
      item.id,
      item.username,
      item.password,
      item.id_tahun_ajaran,
      item.nik_pjgt,
      item.nama,
      item.nama_madrasah,
      item.hp_pjgt,
      item.nama_km,
      item.alamat_madrasah
    ], (err) => {
      if (err) console.error("Gagal insert:", err.message);
      else console.log(`Data ${item.username} berhasil ditambahkan.`);
    });
  });

  stmt.finalize();
}

seedPjgt();
import { v4 as uuidv4 } from "uuid";
import db from "../config/db.js"
import { tanggal } from "../utils/tanggal.js";

const ymdhis = tanggal.getYmdhis();
export const pjgtService = {
    autoId: async () => {
        const hijriDate = tanggal.hijri();
        const result = await db.execute("SELECT COUNT(*) as count FROM pjgt");
        const count = (result.rows[0].count + 1).toString().padStart(4, '0');
        return `${(hijriDate.year).split(' ')[0]}${count}`;
    },
    all: async () => {
        const result = await db.execute("SELECT * FROM pjgt ORDER BY nama ASC");
        return result.rows
    },
    byId: async (id) => {
        const result = await db.execute({
            sql: "SELECT * FROM pjgt WHERE id=?",
            args: [id]
        });
        return result.rows[0]
    },
    byTahun: async (tahun) => {
        const result = await db.execute({
            sql: "SELECT * FROM pjgt WHERE id_tahun_ajaran=?",
            args: [tahun]
        });
        return result.rows
    },
    listGt: async (id) => {
        const result = await db.execute({
            sql: `SELECT t.*,t.id as id_tugas, a.keterangan, pjgt.nama_madrasah, pjgt.nama as nama_pjgt, gt.nama as nama_gt, gt.nim, gt.hp,gt.alamat, gt.tempat_lahir, gt.tanggal_lahir
            FROM tugas t
            LEFT JOIN tahun_ajaran a ON t.id_tahun_ajaran=a.id
            LEFT JOIN pjgt ON t.id_pjgt=pjgt.id
            LEFT JOIN gt ON t.id_gt=gt.id
            WHERE t.id_pjgt=? and t.aktif=1`,

            args: [id]
        });
        return result.rows
    },
   create: async (username, password, tahunAjaran, data) => {
    const id = uuidv4();
    
    const sql = `
        INSERT INTO pjgt (
            id, username, password, id_tahun_ajaran, nama, nik_pjgt,
            hp_pjgt, nama_km, hp_km, nama_madrasah,
            alamat_madrasah, alamat_pjgt, dusun_madrasah, dusun_pjgt,
            id_desa_madrasah, id_desa_pjgt, nama_ponpes
        ) VALUES (
            :id, :username, :password, :tahunAjaran, :nama, :nikPjgt,
            :hpPjgt, :namaKm, :hpKm, :namaMadrasah,
            :alamatMadrasah, :alamatPjgt, :dusunMadrasah, :dusunPjgt,
            :idDesaMadrasah, :idDesaPjgt, :namaPonpes
        )
    `;

    // Kita masukkan argumen dalam bentuk Objek, bukan Array
    const args = {
        id: id,
        username: username,
        password: password,
        tahunAjaran: tahunAjaran,
        nama: data.nama,
        nikPjgt: data.nikPjgt,
        hpPjgt: data.hpPjgt,
        namaKm: data.namaKm,
        hpKm: data.hpKm,
        namaMadrasah: data.namaMadrasah,
        alamatMadrasah: data.alamatMadrasah,
        alamatPjgt: data.alamatPjgt,
        dusunMadrasah: data.dusunMadrasah,
        dusunPjgt: data.dusunPjgt,
        idDesaMadrasah: data.idDesaMadrasah,
        idDesaPjgt: data.idDesaPjgt,
        namaPonpes: data.namaPonpes
    };
console.log(args);
    try {
        // Driver database seperti Turso/LibSQL mendukung format objek ini
        await db.execute({ sql, args });
        return { id, username, ...data };
    } catch (error) {
        console.error("Error saat insert PJGT:", error);
        throw error;
    }
},

   update: async (id, data) => {
    const sql = `
        UPDATE pjgt SET 
            username = :username,            
            id_tahun_ajaran = :tahunAjaran, 
            nama = :nama, 
            nik_pjgt = :nikPjgt,
            hp_pjgt = :hpPjgt, 
            nama_km = :namaKm, 
            hp_km = :hpKm, 
            nama_madrasah = :namaMadrasah,
            alamat_madrasah = :alamatMadrasah, 
            alamat_pjgt = :alamatPjgt, 
            dusun_madrasah = :dusunMadrasah, 
            dusun_pjgt = :dusunPjgt,
            id_desa_madrasah = :idDesaMadrasah, 
            id_desa_pjgt = :idDesaPjgt, 
            nama_ponpes = :namaPonpes
        WHERE id = :id
    `;

    const args = {
        id: id, 
        // Mengambil data dari objek 'data' agar tidak undefined
        username: data.username ?? "",        
        tahunAjaran: data.idTahunAjaran ?? data.tahunAjaran ?? null,
        nama: data.nama ?? "",
        nikPjgt: data.nikPjgt ?? "",
        hpPjgt: data.hpPjgt ?? "",
        namaKm: data.namaKm ?? "",
        hpKm: data.hpKm ?? "",
        namaMadrasah: data.namaMadrasah ?? "",
        alamatMadrasah: data.alamatMadrasah ?? "",
        alamatPjgt: data.alamatPjgt ?? "",
        dusunMadrasah: data.dusunMadrasah ?? "",
        dusunPjgt: data.dusunPjgt ?? "",
        idDesaMadrasah: data.idDesaMadrasah ?? null,
        idDesaPjgt: data.idDesaPjgt ?? null,
        namaPonpes: data.namaPonpes ?? ""
    };
console.log(args);
    try {
        await db.execute({ sql, args });
        return { 
            success: true,
            message: `Berhasil update data PJGT id ${id}`, 
            id: id,
            ...data 
        };
    } catch (error) {
        console.error("Error saat update PJGT:", error);
        throw error;
    }
},
    delete: async (id) => {
        await db.execute({
            sql: `UPDATE pjgt SET aktif=0, updated_at=? WHERE id=?`,
            args: [ymdhis, id]
        })
        return { pesan: `Berhasil menonaktifkan PJGT id ${id}` }
    },
    resetPassword: async (id, newPassword) => {
        await db.execute({
            sql: `UPDATE pjgt SET password=?, updated_at=? WHERE id=?`,
            args: [newPassword, ymdhis, id]
        })
        return { pesan: `Berhasil reset password PJGT id ${id}` }
    },
}
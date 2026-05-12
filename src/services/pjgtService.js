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
    create: async (username, password, data) => {
        const id = uuidv4();
        await db.execute({
            sql: `INSERT INTO pjgt (id, username, password, nama, nik_pjgt,
            hp_pjgt, nama_km, hp_km,nama_madrasah, alamat_madrasah) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [id, username, password, data.nama, data.nikPjgt, data.hpPjgt, data.namaKm, data.hpKm, data.namaMadrasah, data.alamatMadrasah]
        })
        return { id: id, username: username, ...data }
    },
    update: async (id, data) => {
        await db.execute({
            sql: `UPDATE pjgt SET nama=?, nik_pjgt=?, hp_pjgt=?,
            nama_km=?, hp_km=?, nama_madrasah=?, alamat_madrasah=?, updated_at=? WHERE id=?`,
            args: [data.nama, data.nikPjgt, data.hpPjgt, data.namaKm, data.hpKm, data.namaMadrasah, data.alamatMadrasah, ymdhis, id]
        })
        return { pesan: `Berhasil update data PJGT id ${id}`, ...data }
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
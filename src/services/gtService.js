import { v4 as uuidv4 } from "uuid";
import db from "../config/db.js"
import { tanggal } from "../utils/tanggal.js";

const tanggalJam = tanggal.getYmdhis();
export const gtService = {
    all: async () => {
        const result = await db.execute("SELECT * FROM gt ORDER BY nama ASC");
        return result.rows
    },
    byId: async (id) => {
        const result = await db.execute({
            sql: "SELECT * FROM gt WHERE id=?",
            args: [id]
        });
        return result.rows[0]
    },
    create: async (nim, password, data) => {
        const id = uuidv4();
        await db.execute({
            sql: `INSERT INTO gt (id, nim, password, nama, nik,
            tempat_lahir, tanggal_lahir, alamat, hp, nama_ayah,
            nama_ibu, nama_wali, hp_wali, asal_kelas, wali_kelas) VALUES (?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?)`,
            args: [id, nim, password, data.nama, data.nik, data.tempatLahir, data.tanggalLahir, data.alamat, data.hp, data.namaAyah, data.namaIbu, data.namaWali, data.hpWali, data.asalKelas, data.waliKelas]
        })
        return { id: id, ...data }
    },
    update: async (id, data) => {
        await db.execute({
            sql: `UPDATE gt SET nama=?, nik=?,
            tempat_lahir=?, tanggal_lahir=?, alamat=?, hp=?, nama_ayah=?,
            nama_ibu=?, nama_wali=?, hp_wali=?, asal_kelas=?, wali_kelas=?,
            updated_at=? WHERE id=?`,
            args: [data.nama, data.nik, data.tempatLahir, data.tanggalLahir, data.alamat, data.hp, data.namaAyah, data.namaIbu, data.namaWali, data.hpWali, data.asalKelas, data.waliKelas, tanggalJam, id]
        })
        return { pesan: `Berhasil update data PJGT id ${id}`, ...data }
    },
    delete: async (id) => {
        await db.execute({
            sql: `UPDATE gt SET aktif=0, updated_at=? WHERE id=?`,
            args: [tanggalJam, id]
        })
        return { pesan: `Berhasil menonaktifkan GT id ${id}` }
    },
    resetPassword: async (id, newPassword) => {
        await db.execute({
            sql: `UPDATE gt SET password=?, updated_at=? WHERE id=?`,
            args: [newPassword, tanggalJam, id]
        })
        return { pesan: `Berhasil reset password GT id ${id}` }
    },
}
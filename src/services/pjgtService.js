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
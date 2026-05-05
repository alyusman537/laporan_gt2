import { v4 as uuidv4 } from "uuid";
import db from "../config/db.js"
import { tanggal } from "../utils/tanggal.js";

export const StatusPjgtService = {

    // 1. Ambil SEMUA data status tanpa filter (DIBEDAKAN NAMANYA)
    getAllDataStatus: async () => {
        const result = await db.execute("SELECT * FROM statusPJGT ORDER BY created_at DESC");
        return result.rows;
    },

    // 2. Tambah status baru
    create: async (data) => {
        const { id_tahun_ajaran, id_pjgt, aktif, alasan } = data;
        const id = uuidv4();
        await db.execute({
            sql: `INSERT INTO statusPJGT (id, id_tahun_ajaran, id_pjgt, aktif, alasan) 
            VALUES (?, ?, ?, ?, ?)`,
            args: [id, id_tahun_ajaran, id_pjgt, aktif ?? 1, alasan]
        });

        return { id, ...data };
    },

    // 3. Ambil status TERAKHIR berdasarkan ID PJGT (Limit 1)
    getLatestStatusById: async (idPjgt) => {
        const result = await db.execute({
            sql: "SELECT * FROM statusPJGT WHERE id_pjgt = ? ORDER BY created_at DESC LIMIT 1",
            args: [idPjgt]
        });
        // Mengembalikan object tunggal atau null agar lebih mudah dihandle di controller
        return result.rows.length > 0 ? result.rows[0] : null;
    },

    // 4. Ambil RIWAYAT status berdasarkan ID PJGT
    getHistoryStatusById: async (idPjgt) => {
        const result = await db.execute({
            sql: "SELECT * FROM statusPJGT WHERE id_pjgt = ? ORDER BY created_at DESC",
            args: [idPjgt]
        });
        return result.rows;
    },

    // 5. Update status
    update: async (id, data) => {
        const { aktif, alasan } = data;
        await db.execute({
            sql: `UPDATE statusPJGT SET aktif = ?, alasan = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            args: [aktif, alasan, id]
        });
        return { id, ...data };
    }
}
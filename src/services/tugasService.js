import { v4 as uuidv4 } from "uuid";
import db from "../config/db.js"
import { tanggal } from "../utils/tanggal.js"

export const tugasService = {
    all: async () => {
        const result = await db.execute(`SELECT t.*, a.keterangan, pjgt.nama_madrasah, pjgt.nama as nama_pjgt, gt.nama as nama_gt
            FROM tugas t
            LEFT JOIN tahun_ajaran a ON t.id_tahun_ajaran=a.id
            LEFT JOIN pjgt ON t.id_pjgt=pjgt.id
            LEFT JOIN gt ON t.id_gt=gt.id
            ORDER BY a.keterangan DESC, t.created_at ASC`)
        return result.rows
    },
    byId: async (id) => {
        const result = await db.execute({
            sql: `SELECT t.*, a.keterangan, pjgt.nama_madrasah, pjgt.nama as nama_pjgt, gt.nama as nama_gt
            FROM tugas t
            LEFT JOIN tahun_ajaran a ON t.id_tahun_ajaran=a.id
            LEFT JOIN pjgt ON t.id_pjgt=pjgt.id
            LEFT JOIN gt ON t.id_gt=gt.id
            WHERE t.id=?`,
            args: [id]
        })
        return result.rows[0]
    },
    byGt: async (idGt) => {
        const result = await db.execute({
            sql: `SELECT t.*, a.keterangan, pjgt.nama_madrasah, pjgt.nama as nama_pjgt, gt.nama as nama_gt
            FROM tugas t
            LEFT JOIN tahun_ajaran a ON t.id_tahun_ajaran=a.id
            LEFT JOIN pjgt ON t.id_pjgt=pjgt.id
            LEFT JOIN gt ON t.id_gt=gt.id
            WHERE t.id_gt=? and t.aktif=1`,
            args: [idGt]
        })
        return result.rows[0]
    },
        byPjgt: async (idPjgt) => {
        const result = await db.execute({
            sql: `SELECT t.*, a.keterangan, pjgt.nama_madrasah, pjgt.nama as nama_pjgt, gt.nama as nama_gt
            FROM tugas t
            LEFT JOIN tahun_ajaran a ON t.id_tahun_ajaran=a.id
            LEFT JOIN pjgt ON t.id_pjgt=pjgt.id
            LEFT JOIN gt ON t.id_gt=gt.id
            WHERE t.id_pjgt=? and t.aktif=1`,
            args: [idPjgt]
        })
        return result.rows[0]
    },
    cek: async(data) => {
        const result = await db.execute({
            sql: `SELECT * FROM tugas WHERE id_tahun_ajaran=? AND id_pjgt=? AND id_gt=?`,
            args: [data.idTahunAjaran, data.idPjgt, data.idGt]
        })
        return result[0]
    },
    create: async (data) => {
        const id = uuidv4();
        await db.execute({
            sql: `INSERT INTO tugas
            (id, id_tahun_ajaran, id_pjgt, id_gt, jenis_penugasan)
            VALUES (?, ?, ?, ?, ?)`,
            args: [id, data.idTahunAjaran, data.idPjgt, data.idGt, data.jenisPenugasan]
        })
        return { id: id, ...data }
    },
    update: async (data, id) => {
        const tanggalJam = tanggal.getYmdhis();
        await db.execute({
            sql: `UPDATE tugas SET id_tahun_ajaran=?, id_pjgt=?, id_gt=?, jenis_penugasan=?, updated_at=? WHERE id=?`,
            args: [data.idTahunAjaran, data.idPjgt, data.idGt, data.jenisPenugasan, tanggalJam, id]
        })
        return { id: id, ...data }
    },
    delete: async (id) => {
        const tanggalJam = tanggal.getYmdhis();
        await db.execute({
            sql: `UPDATE tugas SET aktif=0, updated_at=? WHERE id=?`,
            args: [tanggalJam, id]
        })
        return { pesan: `id penugasan ${id} telah dihapus` }
    },
}